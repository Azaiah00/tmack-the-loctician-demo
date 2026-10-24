"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CalendarCheck2,
  CalendarPlus,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  CreditCard,
  Loader2,
  Lock,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { ADD_ONS, SERVICES, fmtDuration, fmtMoney } from "@/lib/services";
import { PRODUCT_BY_HANDLE } from "@/lib/products";
import { POLICIES, SITE } from "@/lib/site";
import { addDays, createBooking, dayStatus, demoCharge, liveService, slotsFor, startOfDay, useDB, ymd, type Appointment, type Slot } from "@/lib/portal/db";
import { CONSULT_ID, icsFor, quote } from "@/lib/portal/pricing";
import { useCart } from "@/components/shop/cart";
import { PortalLogo, money } from "./ui";
import { cn } from "@/lib/cn";

const STEPS = ["Service", "Add-ons", "Date & time", "Your details", "Deposit"] as const;
const CATS = ["Maintenance", "Microlocs", "Interlocking", "Restoration", "New Locs"] as const;

export function Booker() {
  const params = useSearchParams();
  const router = useRouter();
  const session = useDB((s) => s.session);
  const clients = useDB((s) => s.clients);
  const settings = useDB((s) => s.settings);
  useDB((s) => s.appts); // re-render availability when the calendar changes
  const me = session.role === "client" ? clients.find((c) => c.id === session.clientId) : undefined;

  const deepLink = params.get("service");
  const validDeepLink = deepLink && SERVICES.some((s) => s.id === deepLink) ? deepLink : null;
  const [step, setStep] = useState(validDeepLink ? 1 : 0);
  const [serviceId, setServiceId] = useState<string | null>(validDeepLink);
  const [addOnIds, setAddOnIds] = useState<string[]>([]);
  const [day, setDay] = useState<Date | null>(null);
  const [slot, setSlot] = useState<Slot | null>(null);
  const [month, setMonth] = useState(() => startOfDay(new Date()));
  const [form, setForm] = useState({ first: "", last: "", phone: "", email: "", music: "", note: "", photo: "" as "" | "yes" | "no", agree: false, ack: false });
  const [paying, setPaying] = useState(false);
  const [done, setDone] = useState<Appointment | null>(null);
  const [payMethod, setPayMethod] = useState<"card" | "apple" | "cashapp">("card");

  // Prefill once the signed-in client's record is available from the demo store.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (me) setForm((f) => ({ ...f, first: me.first, last: me.last, phone: me.phone, email: me.email, music: me.music ?? "", photo: me.photoConsent ? "yes" : "no" }));
  }, [me]);

  const svc = serviceId ? liveService(SERVICES.find((s) => s.id === serviceId)!, settings) : null;
  const satFee = slot?.saturdayFee ? settings.saturdayFee : 0;
  const q = svc ? quote(svc, addOnIds, satFee) : null;

  const needsAck = svc && ["81568611", "99212719"].includes(svc.id);
  const valid = {
    0: !!svc,
    1: true,
    2: !!slot,
    3: form.first.trim() && form.last.trim() && /^[\d\s()+-]{10,}$/.test(form.phone) && /\S+@\S+\.\S+/.test(form.email) && form.photo && form.agree && (!needsAck || form.ack),
    4: true,
  } as Record<number, boolean | string>;

  const go = (n: number) => {
    setStep(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const next = () => valid[step] && go(step + 1);

  async function pay() {
    if (!svc || !slot || !q) return;
    setPaying(true);
    await demoCharge(q.dueToday); // TODO: Stripe
    const a = createBooking({
      serviceId: svc.id,
      addOnIds,
      start: slot.start,
      client: { first: form.first.trim(), last: form.last.trim(), phone: form.phone.trim(), email: form.email.trim() },
      photoConsent: form.photo === "yes",
      music: form.music,
      note: form.note,
      saturdayFee: !!slot.saturdayFee,
    });
    setPaying(false);
    setDone(a);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (done && svc && q) return <Confirmation appt={done} svcName={svc.name} q={q} signedIn={session.role === "client"} onAgain={() => router.refresh()} />;

  return (
    <div className="min-h-[calc(100svh-28px)]">
      <header className="sticky top-0 z-40 border-b border-rose/15 bg-ink/90 backdrop-blur-xl">
        <div className="wrap flex items-center gap-4 py-3">
          <PortalLogo href={session.role === "client" ? "/portal/client" : "/portal"} sub="Book an appointment" />
          <ol className="ml-auto hidden items-center gap-1 md:flex" aria-label="Booking steps">
            {STEPS.map((s, i) => (
              <li key={s} className="flex items-center gap-1">
                <button
                  onClick={() => i < step && go(i)}
                  disabled={i > step}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition",
                    i === step ? "bg-pink/15 text-pink" : i < step ? "text-champagne/80 hover:text-pearl" : "text-champagne/35",
                  )}
                  aria-current={i === step ? "step" : undefined}
                >
                  <span className={cn("grid size-5 place-items-center rounded-full text-[10px]", i < step ? "bg-ok text-ink" : i === step ? "bg-pink text-ink" : "border border-champagne/25")}>{i < step ? <Check className="size-3" /> : i + 1}</span>
                  {s}
                </button>
                {i < STEPS.length - 1 && <span className="h-px w-3 bg-rose/20" aria-hidden />}
              </li>
            ))}
          </ol>
          <p className="ml-auto text-xs text-champagne/70 md:hidden">
            Step {step + 1} of 5 · <span className="text-pearl">{STEPS[step]}</span>
          </p>
        </div>
        <div className="h-0.5 bg-rose/10">
          <div className="h-full bg-gradient-to-r from-magenta to-rose transition-all duration-500" style={{ width: `${((step + 1) / 5) * 100}%` }} />
        </div>
      </header>

      <div className="wrap grid gap-8 py-8 pb-40 lg:grid-cols-[1fr_360px] lg:pb-16">
        <div>
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.3 }}>
              {step === 0 && (
                <StepWrap title="Choose your service" sub="Prices and times are TMack’s published menu. You’ll see your total update as you go.">
                  {CATS.map((c) => {
                    const list = SERVICES.filter((s) => s.category === c).map((s) => liveService(s, settings)).filter((s) => s.active);
                    if (!list.length) return null;
                    return (
                      <div key={c} className="mb-6">
                        <p className="eyebrow mb-3 text-rose">{c}</p>
                        <div className="grid gap-3">
                          {list.map((s) => (
                            <button
                              key={s.id}
                              onClick={() => {
                                setServiceId(s.id);
                                setAddOnIds([]);
                                setSlot(null);
                                go(1);
                              }}
                              className={cn(
                                "group flex items-start gap-4 rounded-2xl border p-4 text-left transition sm:p-5",
                                serviceId === s.id ? "border-pink bg-pink/10" : "border-rose/20 bg-garnet hover:border-rose/60",
                              )}
                            >
                              <div className="min-w-0 flex-1">
                                <p className="font-semibold text-pearl">{s.name}</p>
                                <p className="mt-1 text-sm text-champagne/70">{s.short}</p>
                                <p className="mt-2 flex items-center gap-3 text-xs text-champagne/60">
                                  <span className="flex items-center gap-1">
                                    <Clock className="size-3.5" aria-hidden /> {fmtDuration(s.minutes)}
                                  </span>
                                  <span>Deposit {fmtMoney(s.deposit)}</span>
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="display text-3xl text-rosegold">{fmtMoney(s.price, s.from)}</p>
                                <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-pink opacity-0 transition group-hover:opacity-100">
                                  Select <ArrowRight className="size-3" aria-hidden />
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </StepWrap>
              )}

              {step === 1 && svc && (
                <StepWrap title="Make it yours" sub={svc.addOnIds.length ? "Add treatments, length or a finishing style. Time is added for you automatically." : "This service has no add-ons — continue to pick your time."}>
                  <div className="mb-5 rounded-2xl border border-rose/20 bg-garnet p-5">
                    <p className="text-sm font-semibold text-pearl">{svc.name}</p>
                    <p className="mt-1 text-sm leading-relaxed text-champagne/70">{svc.description}</p>
                    {svc.notFor && <p className="mt-2 text-sm font-semibold text-pink">{svc.notFor}</p>}
                  </div>
                  <div className="grid gap-3">
                    {svc.addOnIds.map((id) => {
                      const a = ADD_ONS[id];
                      const on = addOnIds.includes(id);
                      if (a.contactFirst)
                        return (
                          <div key={id} className="flex items-start gap-4 rounded-2xl border border-warn/30 bg-warn/5 p-4">
                            <AlertCircle className="mt-0.5 size-5 shrink-0 text-warn" aria-hidden />
                            <div>
                              <p className="font-semibold text-pearl">{a.name}</p>
                              <p className="mt-1 text-sm text-champagne/70">{a.detail}</p>
                              <a href="sms:+18044648208" className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-pink">
                                <MessageCircle className="size-4" aria-hidden /> Text TMack first
                              </a>
                            </div>
                          </div>
                        );
                      return (
                        <label key={id} className={cn("flex cursor-pointer items-start gap-4 rounded-2xl border p-4 transition", on ? "border-pink bg-pink/10" : "border-rose/20 bg-garnet hover:border-rose/60")}>
                          <input type="checkbox" checked={on} onChange={() => setAddOnIds((x) => (on ? x.filter((y) => y !== id) : [...x, id]))} className="mt-1 size-5 accent-[#ff5aa8]" />
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-pearl">{a.name}</p>
                            {a.detail && <p className="mt-0.5 text-sm text-champagne/65">{a.detail}</p>}
                            <p className="mt-1 text-xs text-champagne/55">+{fmtDuration(a.minutes)}</p>
                          </div>
                          <p className="font-semibold text-pearl">+{fmtMoney(a.price, a.from)}</p>
                        </label>
                      );
                    })}
                  </div>
                </StepWrap>
              )}

              {step === 2 && svc && q && (
                <StepWrap title="Pick your date & time" sub={`Showing times that fit your ${fmtDuration(q.minutes)} appointment. Eastern Time.`}>
                  <CalendarPicker month={month} setMonth={setMonth} day={day} setDay={(d) => { setDay(d); setSlot(null); }} minutes={q.minutes} buffer={q.buffer} windowWeeks={settings.windowWeeks} />
                  {day && <Slots day={day} minutes={q.minutes} buffer={q.buffer} slot={slot} setSlot={setSlot} fee={settings.saturdayFee} />}
                </StepWrap>
              )}

              {step === 3 && svc && (
                <StepWrap title="Your details" sub={me ? "Signed in — we filled this in for you." : "So TMack can confirm and remind you. Have an account? Sign in from the portal to skip this."}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="First name" value={form.first} onChange={(v) => setForm({ ...form, first: v })} auto="given-name" />
                    <Field label="Last name" value={form.last} onChange={(v) => setForm({ ...form, last: v })} auto="family-name" />
                    <Field label="Mobile phone" type="tel" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} auto="tel" hint="For text reminders" />
                    <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} auto="email" />
                  </div>
                  <fieldset className="mt-6">
                    <legend className="text-sm font-semibold text-pearl">Do you consent to pictures/videos during your appointment?</legend>
                    <div className="mt-2 flex gap-2">
                      {(["yes", "no"] as const).map((v) => (
                        <label key={v} className={cn("flex min-h-11 cursor-pointer items-center rounded-full border px-6 text-sm capitalize", form.photo === v ? "border-pink bg-pink/15 text-pink" : "border-rose/25 text-champagne/80")}>
                          <input type="radio" name="photo" className="sr-only" checked={form.photo === v} onChange={() => setForm({ ...form, photo: v })} />
                          {v}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  <div className="mt-6 grid gap-4">
                    <Field label="Music or show you’d like during your appointment (optional)" value={form.music} onChange={(v) => setForm({ ...form, music: v })} placeholder="R&B, gospel, a reality show…" />
                    <label className="text-sm text-champagne/80">
                      Anything TMack should know? (optional)
                      <textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} rows={3} className="mt-1 w-full rounded-xl border border-rose/25 bg-ink/60 px-4 py-3 text-pearl focus:border-pink focus:outline-none" placeholder="Last retwist date, loc count, length…" />
                    </label>
                  </div>
                  <div className="mt-6 rounded-2xl border border-rose/20 bg-garnet p-5">
                    <p className="font-semibold text-pearl">{svc.id === CONSULT_ID ? "Consultation policy" : svc.id === "99212719" ? "Loc reconstruction deposit policy" : "Appointment policy"}</p>
                    <ul className="mt-3 space-y-2 text-sm text-champagne/75">
                      {(svc.id === CONSULT_ID ? POLICIES.filter((p) => p.title.startsWith("Microlocs")) : svc.id === "99212719" ? POLICIES.filter((p) => ["Loc reconstruction", "Rescheduling", "Running late"].includes(p.title)) : POLICIES.slice(0, 6)).map((p) => (
                        <li key={p.title}>
                          <strong className="text-champagne">{p.title}.</strong> {p.body}
                        </li>
                      ))}
                    </ul>
                    <label className="mt-4 flex cursor-pointer items-start gap-3 text-sm text-pearl">
                      <input type="checkbox" checked={form.agree} onChange={(e) => setForm({ ...form, agree: e.target.checked })} className="mt-0.5 size-5 accent-[#ff5aa8]" />
                      By booking, I agree to all policies above.
                    </label>
                    {needsAck && (
                      <label className="mt-3 flex cursor-pointer items-start gap-3 text-sm text-pearl">
                        <input type="checkbox" checked={form.ack} onChange={(e) => setForm({ ...form, ack: e.target.checked })} className="mt-0.5 size-5 accent-[#ff5aa8]" />
                        I understand that if my appointment exceeds the allotted time, $50/hour may apply — always discussed and approved by me before work continues.
                      </label>
                    )}
                  </div>
                </StepWrap>
              )}

              {step === 4 && svc && q && slot && (
                <StepWrap title="Secure your spot" sub="Your deposit holds this time just for you and applies to your service.">
                  <div className="grid gap-2 sm:grid-cols-3" role="radiogroup" aria-label="Payment method">
                    {(
                      [
                        ["card", "Card"],
                        ["apple", "Apple Pay"],
                        ["cashapp", "Cash App Pay"],
                      ] as const
                    ).map(([k, l]) => (
                      <button key={k} role="radio" aria-checked={payMethod === k} onClick={() => setPayMethod(k)} className={cn("min-h-12 rounded-xl border text-sm font-semibold", payMethod === k ? "border-pink bg-pink/15 text-pink" : "border-rose/25 text-champagne/80")}>
                        {l}
                      </button>
                    ))}
                  </div>
                  {payMethod === "card" ? (
                    <div className="mt-4 rounded-2xl border border-rose/20 bg-garnet p-5">
                      <div className="flex items-center justify-between">
                        <p className="flex items-center gap-2 text-sm font-semibold text-pearl">
                          <CreditCard className="size-4 text-pink" aria-hidden /> Card details
                        </p>
                        <span className="demo-badge">Demo · no charge</span>
                      </div>
                      <div className="mt-4 grid gap-3">
                        <div className="rounded-xl border border-rose/20 bg-ink/60 px-4 py-3 font-mono text-sm tracking-widest text-champagne/60" aria-label="Demo card number">
                          4242 4242 4242 4242
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="rounded-xl border border-rose/20 bg-ink/60 px-4 py-3 font-mono text-sm text-champagne/60">12 / 29</div>
                          <div className="rounded-xl border border-rose/20 bg-ink/60 px-4 py-3 font-mono text-sm text-champagne/60">•••</div>
                        </div>
                      </div>
                      <p className="mt-3 text-xs text-champagne/50">Demo card shown. At launch, card entry is handled by Stripe’s secure form — card numbers never touch this site.</p>
                    </div>
                  ) : (
                    <p className="mt-4 rounded-2xl border border-rose/20 bg-garnet p-5 text-sm text-champagne/75">{payMethod === "apple" ? "Apple Pay" : "Cash App Pay"} opens a secure sheet at launch. In the demo, tap Pay to simulate it.</p>
                  )}
                  <div className="mt-5 rounded-2xl border border-rose/20 bg-garnet p-5 text-sm">
                    <Row l="Deposit (applied to your service)" r={money(q.credit)} />
                    <Row l="Booking fee" r={money(q.fee)} />
                    <div className="my-2 h-px bg-rose/15" />
                    <Row l={<strong className="text-pearl">Due today</strong>} r={<strong className="display text-2xl text-pearl">{money(q.dueToday)}</strong>} />
                    <Row l="Balance at your appointment" r={`${money(q.balance)}${q.from ? "+" : ""}`} />
                    <p className="mt-2 text-xs text-champagne/50">Balance is paid at the studio by Apple Pay, Cash App or PayPal. Klarna & Affirm available.</p>
                  </div>
                  {slot.saturdayFee && (
                    <p className="mt-4 flex items-start gap-2 rounded-2xl bg-warn/10 p-4 text-sm text-champagne">
                      <AlertCircle className="mt-0.5 size-4 shrink-0 text-warn" aria-hidden /> Saturday request: TMack will confirm within 24–48 hours. The ${settings.saturdayFee} availability fee is included in your balance.
                    </p>
                  )}
                  <button onClick={pay} disabled={paying} className="btn btn-primary mt-6 w-full !min-h-14 text-base disabled:opacity-70">
                    {paying ? <Loader2 className="size-5 animate-spin" aria-hidden /> : <Lock className="size-4" aria-hidden />}
                    {paying ? "Securing your spot…" : `Pay ${money(q.dueToday)} & book`}
                  </button>
                </StepWrap>
              )}
            </motion.div>
          </AnimatePresence>

          {step > 0 && (
            <div className="mt-8 hidden items-center justify-between lg:flex">
              <button onClick={() => go(step - 1)} className="btn btn-ghost">
                <ArrowLeft className="size-4" aria-hidden /> Back
              </button>
              {step < 4 && (
                <button onClick={next} disabled={!valid[step]} className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-40">
                  Continue <ArrowRight className="size-4" aria-hidden />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Running total */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <Summary svcName={svc?.name} addOnIds={addOnIds} q={q} slot={slot} satFee={satFee} />
          </div>
        </aside>
      </div>

      {/* Mobile summary bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-rose/20 bg-ink/95 p-3 backdrop-blur-xl lg:hidden">
        <div className="flex items-center gap-3">
          {step > 0 && (
            <button onClick={() => go(step - 1)} className="grid size-12 shrink-0 place-items-center rounded-full border border-rose/30 text-champagne" aria-label="Back">
              <ArrowLeft className="size-5" />
            </button>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-champagne/60">{svc ? svc.name : "No service selected"}</p>
            <p className="text-sm text-pearl">
              {q ? (
                <>
                  <strong className="display text-xl">{money(q.subtotal)}{q.from ? "+" : ""}</strong> · {fmtDuration(q.minutes)}
                </>
              ) : (
                "Choose a service"
              )}
            </p>
          </div>
          {step > 0 && step < 4 && (
            <button onClick={next} disabled={!valid[step]} className="btn btn-primary !min-h-12 disabled:opacity-40">
              Next <ArrowRight className="size-4" aria-hidden />
            </button>
          )}
          {step === 4 && q && (
            <button onClick={pay} disabled={paying} className="btn btn-primary !min-h-12 disabled:opacity-60">
              {paying ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Lock className="size-4" aria-hidden />} Pay {money(q.dueToday)}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function StepWrap({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <section aria-label={title}>
      <h1 className="display text-4xl text-pearl sm:text-5xl">{title}</h1>
      {sub && <p className="mt-2 max-w-xl text-champagne/70">{sub}</p>}
      <div className="mt-8">{children}</div>
    </section>
  );
}

function Field({ label, value, onChange, type = "text", auto, hint, placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; auto?: string; hint?: string; placeholder?: string }) {
  return (
    <label className="text-sm text-champagne/80">
      {label}
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} autoComplete={auto} placeholder={placeholder} className="mt-1 w-full rounded-xl border border-rose/25 bg-ink/60 px-4 py-3 text-pearl placeholder:text-champagne/35 focus:border-pink focus:outline-none" />
      {hint && <span className="mt-1 block text-xs text-champagne/45">{hint}</span>}
    </label>
  );
}

function Row({ l, r }: { l: React.ReactNode; r: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-1 text-champagne/75">
      <span>{l}</span>
      <span className="tabular-nums text-pearl">{r}</span>
    </div>
  );
}

function Summary({ svcName, addOnIds, q, slot, satFee }: { svcName?: string; addOnIds: string[]; q: ReturnType<typeof quote> | null; slot: Slot | null; satFee: number }) {
  return (
    <div className="card-night overflow-hidden">
      <div className="border-b border-rose/15 bg-wine/30 px-5 py-4">
        <p className="eyebrow text-rose">Your appointment</p>
      </div>
      <div className="space-y-4 p-5 text-sm">
        {!svcName ? (
          <p className="text-champagne/60">Pick a service to see your total.</p>
        ) : (
          <>
            <div>
              <p className="font-semibold text-pearl">{svcName}</p>
              {addOnIds.map((id) => (
                <p key={id} className="mt-1 flex justify-between gap-3 text-champagne/70">
                  <span>+ {ADD_ONS[id].name}</span>
                  <span>{fmtMoney(ADD_ONS[id].price, ADD_ONS[id].from)}</span>
                </p>
              ))}
            </div>
            {satFee > 0 && (
              <p className="flex justify-between gap-3 text-champagne/70">
                <span>+ Saturday availability fee</span>
                <span>{fmtMoney(satFee)}</span>
              </p>
            )}
            {slot && (
              <p className="flex items-center gap-2 text-champagne/85">
                <CalendarCheck2 className="size-4 text-pink" aria-hidden />
                {slot.start.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })} · {slot.label}
              </p>
            )}
            {q && (
              <div className="space-y-1.5 border-t border-rose/15 pt-4">
                <Row l="Time" r={fmtDuration(q.minutes)} />
                <Row l="Service total" r={`${money(q.subtotal)}${q.from ? "+" : ""}`} />
                <Row l="Due today" r={money(q.dueToday)} />
                <Row l="At appointment" r={`${money(q.balance)}${q.from ? "+" : ""}`} />
              </div>
            )}
          </>
        )}
        <p className="flex items-start gap-2 border-t border-rose/15 pt-4 text-xs text-champagne/50">
          <Sparkles className="mt-0.5 size-3.5 shrink-0 text-rose" aria-hidden /> {SITE.address.street}, {SITE.address.city}. Free snacks & drinks while you sit.
        </p>
      </div>
    </div>
  );
}

function CalendarPicker({ month, setMonth, day, setDay, minutes, buffer, windowWeeks }: { month: Date; setMonth: (d: Date) => void; day: Date | null; setDay: (d: Date) => void; minutes: number; buffer: number; windowWeeks: number }) {
  const today = startOfDay(new Date());
  const last = addDays(today, windowWeeks * 7);
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const gridStart = addDays(first, -first.getDay());
  const cells = Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
  const canPrev = first > new Date(today.getFullYear(), today.getMonth(), 1);
  const canNext = new Date(month.getFullYear(), month.getMonth() + 1, 1) <= last;

  return (
    <div className="rounded-2xl border border-rose/20 bg-garnet p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <button onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} disabled={!canPrev} className="grid size-10 place-items-center rounded-full text-champagne hover:bg-white/5 disabled:opacity-25" aria-label="Previous month">
          <ChevronLeft className="size-5" />
        </button>
        <p className="display text-2xl text-pearl">{first.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>
        <button onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} disabled={!canNext} className="grid size-10 place-items-center rounded-full text-champagne hover:bg-white/5 disabled:opacity-25" aria-label="Next month">
          <ChevronRight className="size-5" />
        </button>
      </div>
      <div className="mt-3 grid grid-cols-7 text-center text-[11px] font-semibold uppercase tracking-wider text-champagne/45">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <span key={i} className="py-2">
            {d}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d) => {
          const inMonth = d.getMonth() === first.getMonth();
          const inRange = d >= today && d <= last;
          const st = dayStatus(d);
          const count = inRange && inMonth ? slotsFor(d, minutes, buffer, undefined, true).length : 0;
          const selectable = inMonth && inRange && count > 0;
          const sel = day && ymd(day) === ymd(d);
          return (
            <button
              key={d.toISOString()}
              disabled={!selectable}
              onClick={() => setDay(d)}
              aria-pressed={!!sel}
              aria-label={`${d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}${selectable ? `, ${count} times available${st.saturdayRequest ? ", Saturday request" : ""}` : ", unavailable"}`}
              className={cn(
                "relative grid aspect-square place-items-center rounded-xl text-sm transition",
                !inMonth && "invisible",
                sel ? "bg-gradient-to-br from-magenta to-pink font-bold text-pearl" : selectable ? (st.saturdayRequest ? "border border-dashed border-warn/50 text-pearl hover:bg-warn/10" : "bg-ink/50 text-pearl hover:bg-pink/15") : "text-champagne/25",
              )}
            >
              {d.getDate()}
              {selectable && !sel && <span className={cn("absolute bottom-1.5 size-1 rounded-full", st.saturdayRequest ? "bg-warn" : "bg-pink")} aria-hidden />}
            </button>
          );
        })}
      </div>
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-champagne/55">
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-pink" /> Open
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-warn" /> Saturday request (+$25)
        </span>
        <span>Retwists the first Saturday of each month · Closed Mon, Tue, Fri & holidays</span>
      </div>
    </div>
  );
}

function Slots({ day, minutes, buffer, slot, setSlot, fee }: { day: Date; minutes: number; buffer: number; slot: Slot | null; setSlot: (s: Slot) => void; fee: number }) {
  const slots = slotsFor(day, minutes, buffer, undefined, true);
  const groups = [
    { l: "Morning", f: (h: number) => h < 12 },
    { l: "Afternoon", f: (h: number) => h >= 12 && h < 16 },
    { l: "Evening", f: (h: number) => h >= 16 },
  ];
  return (
    <div className="mt-6">
      <p className="display text-2xl text-pearl">{day.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
      {slots[0]?.saturdayFee && <p className="mt-1 text-sm text-warn">Saturday request: TMack confirms within 24–48 hours. +${fee} availability fee.</p>}
      {groups.map((g) => {
        const list = slots.filter((s) => g.f(s.start.getHours()));
        if (!list.length) return null;
        return (
          <div key={g.l} className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-champagne/50">{g.l}</p>
            <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-5">
              {list.map((s) => {
                const on = slot?.start.getTime() === s.start.getTime();
                return (
                  <button key={s.label} onClick={() => setSlot(s)} aria-pressed={on} className={cn("min-h-11 rounded-xl border text-sm font-semibold transition", on ? "border-pink bg-pink text-ink" : "border-rose/25 text-pearl hover:border-pink")}>
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Confirmation({ appt, svcName, q, signedIn, onAgain }: { appt: Appointment; svcName: string; q: ReturnType<typeof quote>; signedIn: boolean; onAgain: () => void }) {
  const { add } = useCart();
  const start = new Date(appt.start);
  const spritz = PRODUCT_BY_HANDLE["loc-moisturizer-spritz"];
  const download = () => {
    const blob = icsFor(`Loc appointment with TMack — ${svcName}`, start, appt.minutes, `${SITE.address.street}, ${SITE.address.city}, VA ${SITE.address.zip}`, `Arrive with clean, product-free hair. Questions: ${SITE.phone}`);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tmack-appointment.ics";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  void onAgain;
  return (
    <div className="wrap grid min-h-[calc(100svh-28px)] place-items-center py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-xl text-center">
        <div className="mx-auto grid size-20 place-items-center rounded-full bg-gradient-to-br from-magenta to-rose text-pearl shadow-[0_0_60px_-10px_rgba(255,90,168,.8)]">
          <Check className="size-10" aria-hidden />
        </div>
        <p className="eyebrow mt-6 text-rose">{appt.status === "booked" ? "Request received" : "You’re booked, queen"}</p>
        <h1 className="display mt-2 text-5xl text-pearl">{start.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</h1>
        <p className="mt-2 text-lg text-champagne/80">
          {start.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })} · {svcName} · {fmtDuration(appt.minutes)}
        </p>
        <div className="card-night mx-auto mt-8 max-w-md p-5 text-left text-sm">
          <Row l="Deposit paid (demo)" r={money(q.dueToday)} />
          <Row l="Balance at appointment" r={`${money(q.balance)}${q.from ? "+" : ""}`} />
          <Row l="Where" r="11057 Hull Street Rd, Ste 13" />
          <p className="mt-3 text-xs text-champagne/55">A text and email reminder goes out 24 hours before. Arrive with clean, product-free hair. Need to change it? One reschedule is free with 24 hours’ notice.</p>
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button onClick={download} className="btn btn-ghost">
            <CalendarPlus className="size-4" aria-hidden /> Add to calendar
          </button>
          <Link href={signedIn ? "/portal/client" : "/portal"} className="btn btn-primary">
            {signedIn ? "View in my portal" : "Create my client account"}
          </Link>
        </div>
        <div className="mx-auto mt-10 flex max-w-md items-center gap-4 rounded-2xl border border-rose/20 bg-garnet p-4 text-left">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={spritz.image} alt="" className="size-16 rounded-xl object-cover" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-pearl">Keep it fresh between visits</p>
            <p className="text-xs text-champagne/65">
              {spritz.name} · {fmtMoney(spritz.price)}
            </p>
          </div>
          <button onClick={() => add(spritz.handle, spritz.variants[0].id)} className="btn btn-primary !min-h-10 !px-4 text-xs">
            Add
          </button>
        </div>
      </motion.div>
    </div>
  );
}
