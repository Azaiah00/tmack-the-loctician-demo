"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CalendarHeart, Crown, KeyRound, LayoutDashboard, Loader2, Mail, ShieldCheck, Smartphone, UserRound } from "lucide-react";
import { signIn } from "@/lib/portal/db";
import { PortalLogo } from "./ui";
import { Sparkle } from "@/components/site/BrandIcons";

type Step = "choose" | "auth" | "role";

export function PortalSignIn() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("choose");
  const [provider, setProvider] = useState("");

  const start = (p: string) => {
    setProvider(p);
    setStep("auth");
    setTimeout(() => setStep("role"), 1500);
  };

  return (
    <div className="grid min-h-[calc(100svh-28px)] lg:grid-cols-[1.1fr_1fr]">
      <aside className="relative hidden overflow-hidden lg:block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/media/hero/hand.webp" alt="" className="absolute inset-0 size-full object-cover object-[45%_center]" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-12">
          <p className="eyebrow flex items-center gap-2 text-rose">
            <Sparkle className="size-3 text-pink" /> TMack Booking Portal
          </p>
          <h1 className="display mt-4 text-6xl text-pearl">
            Your crown, booked in <em className="text-rosegold">seconds.</em>
          </h1>
          <ul className="mt-6 grid gap-2 text-champagne/80">
            <li>· Live availability that knows her real hours and first-Saturday rule</li>
            <li>· Price and time update as you add services — no surprises</li>
            <li>· Your loc journey photos, reminders and rewards in one place</li>
          </ul>
        </div>
      </aside>

      <div className="flex flex-col px-5 py-8 sm:px-10">
        <div className="flex items-center justify-between">
          <PortalLogo href="/" />
          <Link href="/" className="inline-flex min-h-11 items-center gap-1 text-sm text-champagne/70 hover:text-pearl">
            <ArrowLeft className="size-4" aria-hidden /> Website
          </Link>
        </div>

        <div className="mx-auto my-auto w-full max-w-md py-10">
          <AnimatePresence mode="wait">
            {step === "choose" && (
              <motion.div key="choose" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                <h2 className="display text-5xl text-pearl">Welcome, queen.</h2>
                <p className="mt-2 text-champagne/75">Sign in to book, manage your appointments and track your loc journey.</p>
                <div className="mt-8 grid gap-3">
                  <button onClick={() => start("Google")} className="flex min-h-14 items-center gap-3 rounded-2xl border border-rose/25 bg-garnet px-5 text-left text-pearl transition hover:border-pink">
                    <span className="grid size-8 place-items-center rounded-full bg-pearl text-sm font-bold text-cocoa">G</span>
                    Continue with Google
                    <span className="ml-auto text-[10px] font-bold uppercase tracking-widest text-rose">Demo</span>
                  </button>
                  <button onClick={() => start("Apple")} className="flex min-h-14 items-center gap-3 rounded-2xl border border-rose/25 bg-garnet px-5 text-left text-pearl transition hover:border-pink">
                    <Smartphone className="size-6 text-champagne" aria-hidden />
                    Continue with Apple
                    <span className="ml-auto text-[10px] font-bold uppercase tracking-widest text-rose">Demo</span>
                  </button>
                  <button onClick={() => start("email link")} className="flex min-h-14 items-center gap-3 rounded-2xl border border-rose/25 bg-garnet px-5 text-left text-pearl transition hover:border-pink">
                    <Mail className="size-6 text-champagne" aria-hidden />
                    Email me a sign-in link
                    <span className="ml-auto text-[10px] font-bold uppercase tracking-widest text-rose">Demo</span>
                  </button>
                </div>
                <div className="my-6 flex items-center gap-3 text-xs text-champagne/50">
                  <span className="h-px flex-1 bg-rose/15" /> or <span className="h-px flex-1 bg-rose/15" />
                </div>
                <Link href="/portal/book" className="btn btn-primary w-full">
                  <CalendarHeart className="size-4" aria-hidden /> Book as a guest
                </Link>
                <p className="mt-6 flex items-start gap-2 text-xs leading-relaxed text-champagne/50">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0" aria-hidden /> Demo sign-in: no password is asked for and nothing leaves your browser. At launch this connects to secure Google/Apple sign-in.
                </p>
              </motion.div>
            )}

            {step === "auth" && (
              <motion.div key="auth" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid place-items-center py-16 text-center" role="status">
                <div className="relative grid size-20 place-items-center rounded-full border border-rose/30">
                  <Loader2 className="size-8 animate-spin text-pink" aria-hidden />
                  <KeyRound className="absolute size-4 text-rose" aria-hidden />
                </div>
                <p className="display mt-6 text-3xl text-pearl">Signing you in…</p>
                <p className="mt-1 text-sm text-champagne/60">Securely verifying with {provider} (demo)</p>
              </motion.div>
            )}

            {step === "role" && (
              <motion.div key="role" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                <p className="eyebrow text-rose">Signed in with {provider}</p>
                <h2 className="display mt-2 text-5xl text-pearl">Where to?</h2>
                <p className="mt-2 text-sm text-champagne/70">For the demo you can open both sides. At launch, your account decides which one you see.</p>
                <div className="mt-8 grid gap-4">
                  <button
                    onClick={() => {
                      signIn("client", provider);
                      router.push("/portal/client");
                    }}
                    className="group rounded-3xl border border-rose/25 bg-gradient-to-br from-wine/60 to-garnet p-6 text-left transition hover:border-pink"
                  >
                    <div className="flex items-center gap-3">
                      <span className="grid size-12 place-items-center rounded-2xl bg-pink/15 text-pink">
                        <UserRound className="size-6" aria-hidden />
                      </span>
                      <div>
                        <p className="display text-3xl text-pearl">Client portal</p>
                        <p className="text-sm text-champagne/70">Book, reschedule, loc journey & rewards</p>
                      </div>
                      <ArrowRight className="ml-auto size-5 text-pink transition group-hover:translate-x-1" aria-hidden />
                    </div>
                    <p className="mt-4 text-xs text-champagne/50">Signed in as demo client “Aaliyah B.”</p>
                  </button>
                  <button
                    onClick={() => {
                      signIn("owner", provider);
                      router.push("/portal/owner");
                    }}
                    className="group rounded-3xl border border-rose/25 bg-gradient-to-br from-rose-deep/30 to-garnet p-6 text-left transition hover:border-pink"
                  >
                    <div className="flex items-center gap-3">
                      <span className="grid size-12 place-items-center rounded-2xl bg-rose/15 text-rose">
                        <Crown className="size-6" aria-hidden />
                      </span>
                      <div>
                        <p className="display text-3xl text-pearl">Owner portal</p>
                        <p className="text-sm text-champagne/70">Calendar, bookings, clients & finances</p>
                      </div>
                      <LayoutDashboard className="ml-auto size-5 text-rose transition group-hover:scale-110" aria-hidden />
                    </div>
                    <p className="mt-4 text-xs text-champagne/50">For TMack only</p>
                  </button>
                  <Link href="/portal/book" className="btn btn-primary w-full">
                    <CalendarHeart className="size-4" aria-hidden /> Just book an appointment
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
