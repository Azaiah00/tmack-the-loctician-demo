"use client";

import { useState } from "react";
import { Check, Send } from "lucide-react";

/**
 * Netlify Form "contact" (detected from /public/__forms.html at deploy time).
 * Turn on email notifications in Netlify → Forms after the first deploy.
 */
export function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "ok" | "preview" | "err">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    if (data.get("company")) return; // honeypot
    setState("sending");
    try {
      const res = await fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(data as unknown as Record<string, string>).toString(),
      });
      if (res.ok) {
        setState("ok");
        form.reset();
      } else setState(location.hostname === "localhost" ? "preview" : "err");
    } catch {
      setState("err");
    }
  }

  if (state === "ok")
    return (
      <p className="mt-6 flex items-center gap-2 rounded-xl bg-ok/15 px-4 py-3 text-champagne" role="status">
        <Check className="size-5 text-ok" aria-hidden /> Thank you, queen — your message is in. TMack will reply soon.
      </p>
    );

  const field = "mt-1 w-full rounded-xl border border-rose/25 bg-ink/60 px-4 py-3 text-pearl placeholder:text-champagne/40 focus:border-pink focus:outline-none";
  return (
    <form name="contact" method="POST" onSubmit={onSubmit} className="mt-5 grid gap-4">
      <input type="hidden" name="form-name" value="contact" />
      <p className="hidden">
        <label>
          Company <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm text-champagne/80">
          Name
          <input name="name" required autoComplete="name" className={field} />
        </label>
        <label className="text-sm text-champagne/80">
          Phone
          <input name="phone" type="tel" autoComplete="tel" className={field} />
        </label>
      </div>
      <label className="text-sm text-champagne/80">
        Email
        <input name="email" type="email" required autoComplete="email" className={field} />
      </label>
      <label className="text-sm text-champagne/80">
        Message
        <textarea name="message" required rows={4} className={field} placeholder="Tell TMack about your locs or your question" />
      </label>
      <button disabled={state === "sending"} className="btn btn-primary justify-self-start disabled:opacity-60">
        <Send className="size-4" aria-hidden /> {state === "sending" ? "Sending…" : "Send message"}
      </button>
      {state === "preview" && <p className="text-sm text-warn">Preview mode: the form sends once the site is deployed on Netlify.</p>}
      {state === "err" && <p className="text-sm text-bad">Something went wrong. Please call or text instead.</p>}
    </form>
  );
}
