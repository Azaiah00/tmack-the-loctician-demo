"use client";

import { useState } from "react";
import { Camera, CheckCircle2, Clock, LogIn, Mail, MessageCircle, Music2, Phone, RefreshCcw, UserX, XCircle } from "lucide-react";
import { ADD_ONS, SERVICE_BY_ID, fmtDuration } from "@/lib/services";
import { WORK } from "@/lib/gallery";
import { addJourney, clientName, setStatus, toast, useDB, type Appointment, type PayMethod } from "@/lib/portal/db";
import { bookingFee } from "@/lib/portal/pricing";
import { Drawer, StatusBadge, fmtDate, fmtTime, money } from "./ui";
import { RescheduleDrawer } from "./ClientPortal";

export function ApptDrawer({ appt, onClose }: { appt: Appointment | null; onClose: () => void }) {
  const clients = useDB((s) => s.clients);
  const appts = useDB((s) => s.appts);
  const live = appt ? appts.find((a) => a.id === appt.id) ?? appt : null;
  const c = live ? clients.find((x) => x.id === live.clientId) : undefined;
  const [method, setMethod] = useState<PayMethod>("Apple Pay");
  const [resch, setResch] = useState<Appointment | null>(null);
  const [photo, setPhoto] = useState(false);
  if (!live)
    return (
      <Drawer open={false} onClose={onClose} title="">
        {null}
      </Drawer>
    );
  const svc = SERVICE_BY_ID[live.serviceId];
  const credit = live.deposit - bookingFee(live.deposit);
  const balance = svc.id === "81381263" ? 0 : Math.max(0, live.price - credit);
  const visits = appts.filter((a) => a.clientId === live.clientId && a.status === "completed").length;

  return (
    <>
      <Drawer open={!!appt && !resch} onClose={onClose} title={clientName(c)}>
        <div className="space-y-5 text-sm">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge s={live.status} />
            {c?.tags.map((t) => (
              <span key={t} className="rounded-full bg-rose/15 px-2.5 py-1 text-[11px] font-semibold text-rose">
                {t}
              </span>
            ))}
            <span className="text-xs text-champagne/50">
              {visits} completed visit{visits === 1 ? "" : "s"} · {c?.locType}
            </span>
          </div>

          <div className="rounded-2xl border border-rose/15 bg-ink/40 p-4">
            <p className="display text-2xl text-pearl">{svc.name}</p>
            <p className="mt-1 flex items-center gap-2 text-champagne/75">
              <Clock className="size-4 text-pink" aria-hidden /> {fmtDate(live.start, { weekday: "long", month: "long", day: "numeric" })} · {fmtTime(live.start)} · {fmtDuration(live.minutes)}
            </p>
            {live.addOnIds.length > 0 && (
              <ul className="mt-3 space-y-1 text-champagne/70">
                {live.addOnIds.map((id) => (
                  <li key={id} className="flex justify-between">
                    <span>+ {ADD_ONS[id].name}</span>
                    <span>{money(ADD_ONS[id].price)}</span>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-3 grid grid-cols-3 gap-2 border-t border-rose/15 pt-3 text-center">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-champagne/50">Total</p>
                <p className="font-semibold text-pearl">{money(live.price)}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-champagne/50">Deposit</p>
                <p className="font-semibold text-ok">{money(live.deposit)}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-champagne/50">Balance</p>
                <p className="font-semibold text-pearl">{live.status === "completed" ? "Paid" : money(balance)}</p>
              </div>
            </div>
          </div>

          {c && (
            <div className="grid gap-2">
              <a href={`tel:${c.phone}`} className="flex items-center gap-2 text-champagne/80 hover:text-pearl">
                <Phone className="size-4 text-rose" aria-hidden /> {c.phone}
              </a>
              <a href={`mailto:${c.email}`} className="flex items-center gap-2 text-champagne/80 hover:text-pearl">
                <Mail className="size-4 text-rose" aria-hidden /> {c.email}
              </a>
              <p className="flex items-center gap-2 text-champagne/80">
                <Music2 className="size-4 text-rose" aria-hidden /> {live.music || c.music || "No preference"}
              </p>
              <p className="flex items-center gap-2 text-champagne/80">
                <Camera className="size-4 text-rose" aria-hidden /> Photo/video consent: {live.photoConsent ?? c.photoConsent ? "Yes" : "No"}
              </p>
              {(live.note || c.notes) && <p className="rounded-xl bg-wine/30 p-3 text-champagne/85">{live.note || c.notes}</p>}
            </div>
          )}

          {!["completed", "canceled", "no-show"].includes(live.status) && (
            <div className="space-y-3 border-t border-rose/15 pt-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-champagne/50">Actions</p>
              <div className="grid grid-cols-2 gap-2">
                {live.status === "booked" && (
                  <button onClick={() => setStatus(live.id, "confirmed")} className="btn btn-ghost !min-h-11 text-sm">
                    <CheckCircle2 className="size-4" aria-hidden /> Confirm
                  </button>
                )}
                {live.status !== "checked-in" && (
                  <button onClick={() => setStatus(live.id, "checked-in")} className="btn btn-ghost !min-h-11 text-sm">
                    <LogIn className="size-4" aria-hidden /> Check in
                  </button>
                )}
                <button onClick={() => setResch(live)} className="btn btn-ghost !min-h-11 text-sm">
                  <RefreshCcw className="size-4" aria-hidden /> Reschedule
                </button>
                <button onClick={() => toast(`Reminder text sent to ${c?.first ?? "client"} (demo)`)} className="btn btn-ghost !min-h-11 text-sm">
                  <MessageCircle className="size-4" aria-hidden /> Send reminder
                </button>
                <button onClick={() => setStatus(live.id, "no-show")} className="btn btn-ghost !min-h-11 text-sm text-warn">
                  <UserX className="size-4" aria-hidden /> No-show
                </button>
                <button onClick={() => setStatus(live.id, "canceled")} className="btn btn-ghost !min-h-11 text-sm text-bad">
                  <XCircle className="size-4" aria-hidden /> Cancel
                </button>
              </div>
              <div className="rounded-2xl border border-ok/30 bg-ok/5 p-4">
                <p className="font-semibold text-pearl">Check out · collect {money(balance)}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(["Apple Pay", "Cash App", "PayPal", "Klarna", "Affirm"] as PayMethod[]).map((m) => (
                    <button key={m} onClick={() => setMethod(m)} aria-pressed={method === m} className={`min-h-9 rounded-full border px-3 text-xs ${method === m ? "border-ok bg-ok/15 text-ok" : "border-rose/25 text-champagne/75"}`}>
                      {m}
                    </button>
                  ))}
                </div>
                <button onClick={() => setStatus(live.id, "completed", method)} className="btn mt-3 w-full bg-ok text-ink hover:brightness-110">
                  <CheckCircle2 className="size-4" aria-hidden /> Complete & mark paid
                </button>
              </div>
            </div>
          )}

          {live.status === "completed" && c && (
            <div className="border-t border-rose/15 pt-5">
              <button onClick={() => setPhoto((x) => !x)} className="btn btn-ghost w-full">
                <Camera className="size-4" aria-hidden /> Add to {c.first}’s loc journey
              </button>
              {photo && (
                <div className="mt-3 grid grid-cols-4 gap-2">
                  {WORK.slice(0, 8).map((w) => (
                    <button
                      key={w.src}
                      onClick={() => {
                        addJourney(c.id, w.src, svc.name, "Fresh and healthy. Keep sealing with the chebe oil and sleep in satin.");
                        setPhoto(false);
                      }}
                      className="relative aspect-square overflow-hidden rounded-lg border border-rose/20 hover:border-pink"
                      aria-label={`Use photo: ${w.alt}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={w.src} alt="" className="size-full object-cover" />
                    </button>
                  ))}
                  <p className="col-span-4 text-xs text-champagne/50">Demo: pick a photo. At launch this opens your phone camera.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </Drawer>
      <RescheduleDrawer appt={resch} onClose={() => setResch(null)} by="owner" />
    </>
  );
}
