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

const clean = (v: unknown): string => (typeof v === "string" ? v.trim() : "");

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

  // The price-request modal sends the product it was opened from. Keep it with
  // the lead: a price request that does not say what it is about is useless.
  const comments = [product ? `Продукт: ${product}` : "", comment].filter(Boolean).join("\n\n");

  const fields: Record<string, unknown> = {
    TITLE: `Заявка с сайта: ${name}`,
    NAME: name,
    PHONE: [{ VALUE: phone, VALUE_TYPE: "WORK" }],
    SOURCE_ID: "WEB",
  };
  // Omit optional fields rather than sending blanks.
  if (company) fields.COMPANY_TITLE = company;
  if (comments) fields.COMMENTS = comments;

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
