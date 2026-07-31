import { NextResponse } from "next/server";

/**
 * Contact form -> Bitrix24 CRM lead.
 *
 * The webhook URL grants write access to the company CRM, so it lives only in
 * the BITRIX_WEBHOOK_URL environment variable and is never logged, never sent
 * to the client and never committed. Shape:
 *   https://<portal>.bitrix24.kz/rest/<user_id>/<token>/
 *
 * Two Bitrix quirks drive the error handling. It answers HTTP 200 even when the
 * call failed, putting an `error` key in the JSON body, so the body has to be
 * inspected rather than the status. And a lead that silently disappears is
 * worse than a visible failure, so every failure path logs the full submission
 * (so the lead is recoverable from the server log) and returns a real error to
 * the form.
 */

const TIMEOUT_MS = 10_000;

interface Lead {
  name?: string;
  phone?: string;
  company?: string;
  comment?: string;
  product?: string;
}

interface BitrixResponse {
  result?: number;
  error?: string;
  error_description?: string;
}

// crm.duplicate.findbycomm answers with the matching ids grouped by entity type.
interface BitrixDuplicateResponse {
  result?: { CONTACT?: number[] };
  error?: string;
  error_description?: string;
}

const clean = (v: unknown): string => (typeof v === "string" ? v.trim() : "");

/**
 * One Bitrix REST call. Returns the parsed body, or null when the call could not
 * be completed at all (network error, timeout, non-JSON answer). Bitrix answers
 * HTTP 200 even on failure with an `error` key in the body, so callers must
 * still inspect what they get back. `method` is only ever appended to the base
 * URL, and neither the base nor the full endpoint is ever logged.
 */
async function bitrix<T>(base: string, method: string, body: unknown): Promise<T | null> {
  try {
    const res = await fetch(`${base.replace(/\/+$/, "")}/${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    const raw = await res.text();
    try {
      return JSON.parse(raw) as T;
    } catch {
      // eslint-disable-next-line no-console
      console.error(`[contact] ${method}: non-JSON answer (HTTP ${res.status}):`, raw.slice(0, 300));
      return null;
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(`[contact] ${method}: request failed:`, e instanceof Error ? `${e.name}: ${e.message}` : "unknown");
    return null;
  }
}

/**
 * Resolve the CRM contact for this enquiry: reuse an existing one matched on
 * phone, otherwise create one. Returns undefined if anything at all goes wrong,
 * and the caller then creates the lead exactly as before, without CONTACT_ID.
 * An enquiry is never lost because a contact call failed.
 *
 * Why this exists: lead person fields are not a Contact record. Bitrix only
 * materialises a Contact when a lead is converted, which was not happening
 * reliably, so the deal showed a Company and no person. A lead that already
 * carries CONTACT_ID takes that contact through to the deal.
 */
async function resolveContactId(base: string, name: string, phone: string): Promise<number | undefined> {
  // 1a. Existing contact with this phone? Stops a duplicate contact being made
  // for every repeat enquiry from the same person.
  const dup = await bitrix<BitrixDuplicateResponse>(base, "crm.duplicate.findbycomm.json", {
    type: "PHONE",
    values: [phone],
    entity_type: "CONTACT",
  });
  if (dup?.error) {
    // eslint-disable-next-line no-console
    console.error("[contact] crm.duplicate.findbycomm:", dup.error, dup.error_description ?? "");
  } else {
    const found = dup?.result?.CONTACT;
    if (Array.isArray(found) && found.length > 0 && typeof found[0] === "number") return found[0];
  }

  // 1b. No match, so create one. Single "Имя" input, so the whole value goes in
  // NAME: never split on whitespace to invent a LAST_NAME, and never put a
  // company on the contact.
  const created = await bitrix<BitrixResponse>(base, "crm.contact.add.json", {
    fields: {
      NAME: name,
      PHONE: [{ VALUE: phone, VALUE_TYPE: "WORK" }],
      SOURCE_ID: "WEB",
      OPENED: "Y",
      TYPE_ID: "CLIENT",
    },
  });
  if (created?.error) {
    // eslint-disable-next-line no-console
    console.error("[contact] crm.contact.add:", created.error, created.error_description ?? "");
    return undefined;
  }
  return typeof created?.result === "number" ? created.result : undefined;
}

export async function POST(request: Request) {
  let data: Lead;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  const name = clean(data.name);
  const phone = clean(data.phone);
  const company = clean(data.company);
  const comment = clean(data.comment);
  const product = clean(data.product);

  if (!name || !phone) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }

  const base = clean(process.env.BITRIX_WEBHOOK_URL);
  if (!base) {
    // Fail loudly. Accepting the submission and dropping it would show the
    // visitor a success screen for a lead that never reached anyone.
    // eslint-disable-next-line no-console
    console.error(
      "[contact] BITRIX_WEBHOOK_URL is not set, the lead was NOT created. Submission:",
      JSON.stringify({ name, phone, company, comment, product })
    );
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 500 });
  }

  // The stored URL may or may not carry a trailing slash.
  const endpoint = `${base.replace(/\/+$/, "")}/crm.lead.add.json`;

  // Resolve the CRM contact first so the lead can carry CONTACT_ID. Any failure
  // in here returns undefined and the lead is created exactly as before.
  const contactId = await resolveContactId(base, name, phone);

  // The price-request modal sends the product it was opened from. Keep it with
  // the lead: a price request that does not say what it is about is useless.
  // The person always leads the comment, so they stay readable on the deal card
  // after conversion even if the contact link were ever to break.
  const comments = [`Контактное лицо: ${name}, ${phone}`, product ? `Продукт: ${product}` : "", comment]
    .filter(Boolean)
    .join("\n\n");

  // The lead list reads better with the enquiry itself in the title than with
  // the name, which is already on the lead and on the linked contact. Bitrix
  // rejects long titles, so collapse whitespace and cap the length. The name is
  // kept as a fallback so the title can never end up as a bare prefix, even for
  // a stale cached client or a direct POST that omits the comment.
  const commentForTitle = comment.replace(/\s+/g, " ").trim().slice(0, 200) || name;

  const fields: Record<string, unknown> = {
    TITLE: `Заявка с сайта: ${commentForTitle}`,
    NAME: name,
    PHONE: [{ VALUE: phone, VALUE_TYPE: "WORK" }],
    SOURCE_ID: "WEB",
    COMMENTS: comments,
  };
  // Omit optional fields rather than sending blanks.
  if (company) fields.COMPANY_TITLE = company;
  if (contactId !== undefined) fields.CONTACT_ID = contactId;

  const failed = (reason: string, detail: unknown) => {
    // eslint-disable-next-line no-console
    console.error(
      `[contact] Bitrix lead was NOT created (${reason}). Submission:`,
      JSON.stringify({ name, phone, company, comment, product }),
      "Bitrix:",
      typeof detail === "string" ? detail : JSON.stringify(detail)
    );
    return NextResponse.json({ ok: false, error: reason }, { status: 502 });
  };

  let res: Response;
  try {
    res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fields }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (e) {
    // Network error or the timeout above. The URL is never included.
    return failed("request_failed", e instanceof Error ? `${e.name}: ${e.message}` : "unknown");
  }

  const raw = await res.text();
  let body: BitrixResponse;
  try {
    body = JSON.parse(raw) as BitrixResponse;
  } catch {
    return failed("bad_response", raw.slice(0, 500));
  }

  // Bitrix answers 200 with an `error` key, so check the body, not the status.
  if (!res.ok || body.error) {
    return failed("bitrix_error", {
      status: res.status,
      error: body.error,
      description: body.error_description,
    });
  }
  if (typeof body.result !== "number") {
    return failed("no_lead_id", body);
  }

  return NextResponse.json({ ok: true, leadId: body.result });
}
