"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useState, createContext, useContext, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Phone, Send, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { PhoneInput } from "@/components/ui/PhoneInput";

// ─────────────────────────────────────────────────────────────────────────────
// MASTER SWITCH for the contact form.
//   false -> the modal shows an "in development" state (brand helix + the direct
//            contact details) instead of the form. This is the current default
//            because the /api/contact Telegram backend is not confirmed live.
//   true  -> fully restores the working form below with NO other edits needed.
// Before flipping this to true, make sure the server has the TELEGRAM_BOT_TOKEN
// and TELEGRAM_CHAT_ID env vars set (that is what /api/contact posts leads to).
// ─────────────────────────────────────────────────────────────────────────────
const CONTACT_FORM_ENABLED = false;

// Direct contact channels shown in the "in development" state, mirrored from the
// contacts page and footer. Do not invent values here.
const DIRECT_CONTACTS = [
  { Icon: Phone, label: "+998 78 147 88 80", href: "tel:+998781478880", external: false },
  { Icon: Send, label: "@ahc_seminars", href: "https://t.me/ahc_seminars", external: true },
  { Icon: Mail, label: "info@albatros.uz", href: "mailto:info@albatros.uz", external: false },
] as const;

interface Ctx {
  open: (product?: string) => void;
}
const ContactCtx = createContext<Ctx>({ open: () => {} });

export function useContactModal() {
  return useContext(ContactCtx);
}

export function ContactProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [product, setProduct] = useState<string | undefined>();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const t = useTranslations("form");

  const open = useCallback((p?: string) => {
    setProduct(p);
    setSent(false);
    setError(false);
    setOpen(true);
  }, []);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setSent(true);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    }
    setLoading(false);
  };

  return (
    <ContactCtx.Provider value={{ open }}>
      {children}
      <Dialog.Root open={isOpen} onOpenChange={setOpen}>
        <AnimatePresence>
          {isOpen && (
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm"
                />
              </Dialog.Overlay>
              {/* Dialog.Content owns only the fixed, flex-centering box (this is what
                  gets the dialog role/focus-trap via asChild). Centering is done with
                  flexbox, not left/top + translate: the inner motion.div sets its own
                  `transform` for the scale/y entrance animation, and an element can only
                  have one `transform` — a translate-based centering trick on the SAME
                  node would get silently clobbered by framer-motion's inline style. */}
              <Dialog.Content asChild>
                <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-bg-border bg-bg-card p-6 shadow-2xl"
                  >
                    <div className="mb-5 flex items-start justify-between">
                      <div>
                        <Dialog.Title className="font-display text-xl font-bold text-text-primary">
                          {CONTACT_FORM_ENABLED ? t("callTitle") : t("devTitle")}
                        </Dialog.Title>
                        <Dialog.Description className="mt-1 text-sm text-text-secondary">
                          {CONTACT_FORM_ENABLED
                            ? product
                              ? t("priceFor", { product })
                              : t("callSubtitle")
                            : t("devSubtitle")}
                        </Dialog.Description>
                      </div>
                      <Dialog.Close className="rounded-md p-1 text-text-muted hover:text-text-primary">
                        <X className="h-5 w-5" />
                      </Dialog.Close>
                    </div>

                    {!CONTACT_FORM_ENABLED ? (
                      <DevState />
                    ) : sent ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center gap-4 py-8 text-center"
                      >
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#22C55E]/15">
                          <Check className="h-8 w-8 text-[#22C55E]" />
                        </div>
                        <p className="text-text-primary">{t("success")}</p>
                      </motion.div>
                    ) : (
                      <form onSubmit={submit} className="space-y-3">
                        {product && <input type="hidden" name="product" value={product} />}
                        <Field name="name" placeholder={t("name")} required />
                        <PhoneInput name="phone" required />
                        <Field name="company" placeholder={t("company")} />
                        <textarea
                          name="comment"
                          placeholder={t("comment")}
                          rows={3}
                          className="w-full rounded-lg border border-bg-border bg-bg-elevated px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
                        />
                        <label className="flex items-start gap-2 text-xs text-text-secondary">
                          <input type="checkbox" required className="mt-0.5 accent-brand-red" />
                          {t("consent")}
                        </label>
                        {error && <p className="text-sm text-brand-red">{t("error")}</p>}
                        <button
                          type="submit"
                          disabled={loading}
                          className="btn-red flex w-full items-center justify-center gap-2 rounded-lg py-3 font-medium"
                        >
                          <Phone className="h-4 w-4" /> {loading ? t("sending") : t("submit")}
                        </button>
                      </form>
                    )}
                  </motion.div>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>
    </ContactCtx.Provider>
  );
}

function Field({
  name,
  placeholder,
  type = "text",
  required,
}: {
  name: string;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      required={required}
      className="w-full rounded-lg border border-bg-border bg-bg-elevated px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
    />
  );
}

/**
 * "In development" state shown while CONTACT_FORM_ENABLED is false: the brand
 * helix mark with a calm, GPU-only breathing animation (static under reduced
 * motion, handled in globals.css), plus the direct contact channels so the
 * modal is never a dead end. The title/subtitle live in the dialog header.
 */
function DevState() {
  return (
    <div className="flex flex-col items-center gap-5 py-2 text-center">
      {/* eslint-disable-next-line @next/next/no-img-element -- decorative animated mark */}
      <img
        src="/images/albatros-helix-mark3.png"
        alt=""
        aria-hidden
        className="dev-helix pointer-events-none h-auto w-48 max-w-full select-none"
      />
      <div className="w-full space-y-2">
        {DIRECT_CONTACTS.map(({ Icon, label, href, external }) => (
          <a
            key={href}
            href={href}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="flex items-center justify-center gap-2.5 rounded-lg border border-bg-border bg-bg-elevated px-4 py-2.5 text-sm font-medium text-text-primary transition-colors hover:border-brand-red"
          >
            <Icon className="h-4 w-4 shrink-0 text-brand-red" />
            {label}
          </a>
        ))}
      </div>
    </div>
  );
}
