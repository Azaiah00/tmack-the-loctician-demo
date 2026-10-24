"use client";

import { useMemo, useState } from "react";
import { Ban, ChevronLeft, ChevronRight, Lock, Trash2 } from "lucide-react";
import { SERVICE_BY_ID } from "@/lib/services";
import { addBlock, addDays, atTime, clientName, dayStatus, removeBlock, startOfDay, useDB, ymd, type Appointment } from "@/lib/portal/db";
import { Drawer, fmtTime } from "../ui";
import { ApptDrawer } from "../ApptDrawer";
import { cn } from "@/lib/cn";

const START_H = 8;
const END_H = 20;
const PX = 56; // px per hour

const CAT_COLOR: Record<string, string> = {
  Maintenance: "from-pink/35 to-pink/15 border-pink/60",
  Microlocs: "from-orchid/40 to-orchid/15 border-orchid/60",
  Interlocking: "from-rose/40 to-rose/15 border-rose/70",
  Restoration: "from-magenta/45 to-magenta/20 border-magenta/70",
  "New Locs": "from-champagne/30 to-champagne/10 border-champagne/50",
};

export function OwnerCalendar() {
  const appts = useDB((s) => s.appts);
  const clients = useDB((s) => s.clients);
  const blocks = useDB((s) => s.blocks);
  useDB((s) => s.settings);
  const [anchor, setAnchor] = useState(() => startOfDay(new Date()));
  const [mobileDay, setMobileDay] = useState(() => startOfDay(new Date()));
  const [open, setOpen] = useState<Appointment | null>(null);
  const [blockOpen, setBlockOpen] = useState(false);

  const weekStart = addDays(anchor, -anchor.getDay());
  const wk = weekStart.getTime();
  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(new Date(wk), i)), [wk]);
  const name = (id: string) => clientName(clients.find((c) => c.id === id));
  const hours = Array.from({ length: END_H - START_H }, (_, i) => START_H + i);
  const nowLine = (() => {
    const n = new Date();
    return ((n.getHours() + n.getMinutes() / 60 - START_H) * PX);
  })();

  const column = (d: Date, compact = false) => {
    const list = appts.filter((a) => ymd(new Date(a.start)) === ymd(d) && a.status !== "canceled");
    const bl = blocks.filter((b) => ymd(new Date(b.start)) === ymd(d));
    const st = dayStatus(d);
    const isToday = ymd(d) === ymd(new Date());
    return (
      <div className={cn("relative border-l border-rose/10", !st.open && "bg-[repeating-linear-gradient(135deg,transparent_0_8px,rgba(231,169,140,.05)_8px_16px)]")} style={{ height: (END_H - START_H) * PX }}>
        {hours.map((h) => (
          <div key={h} className="absolute inset-x-0 border-t border-rose/[0.07]" style={{ top: (h - START_H) * PX }} />
        ))}
        {!st.open && <p className="absolute inset-x-0 top-3 text-center text-[10px] uppercase tracking-widest text-champagne/35">{st.reason}</p>}
        {isToday && nowLine > 0 && nowLine < (END_H - START_H) * PX && (
          <div className="absolute inset-x-0 z-20 h-px bg-pink" style={{ top: nowLine }}>
            <span className="absolute -left-1 -top-1 size-2 rounded-full bg-pink" />
          </div>
        )}
        {bl.map((b) => {
          const s = new Date(b.start);
          const top = (s.getHours() + s.getMinutes() / 60 - START_H) * PX;
          return (
            <div key={b.id} className="absolute inset-x-1 z-10 flex items-start justify-between gap-1 overflow-hidden rounded-lg border border-champagne/20 bg-champagne/10 p-1.5 text-[11px] text-champagne/70" style={{ top, height: (b.minutes / 60) * PX - 2 }}>
              <span className="flex items-center gap-1">
                <Lock className="size-3" aria-hidden /> {b.label}
              </span>
              <button onClick={() => removeBlock(b.id)} aria-label="Remove blocked time" className="-m-1 p-1 text-champagne/50 hover:text-bad">
                <Trash2 className="size-3" />
              </button>
            </div>
          );
        })}
        {list.map((a) => {
          const s = new Date(a.start);
          const top = (s.getHours() + s.getMinutes() / 60 - START_H) * PX;
          const h = (a.minutes / 60) * PX - 2;
          const svc = SERVICE_BY_ID[a.serviceId];
          return (
            <button
              key={a.id}
              onClick={() => setOpen(a)}
              className={cn(
                "absolute inset-x-1 z-10 overflow-hidden rounded-lg border-l-[3px] bg-gradient-to-b p-1.5 text-left text-[11px] leading-tight transition hover:brightness-125",
                CAT_COLOR[svc.category],
                a.status === "no-show" && "opacity-40",
                a.status === "completed" && "saturate-50",
              )}
              style={{ top, height: h }}
            >
              <span className="block font-semibold text-pearl">{fmtTime(a.start)}</span>
              <span className="block truncate text-pearl/90">{name(a.clientId)}</span>
              {!compact && h > 56 && <span className="block truncate text-champagne/70">{svc.name}</span>}
              {a.status === "booked" && <span className="mt-0.5 inline-block rounded bg-warn/30 px-1 text-[10px] font-bold uppercase text-warn">Pending</span>}
            </button>
          );
        })}
        {a11yList(list, name)}
      </div>
    );
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow text-rose">Calendar</p>
          <h1 className="display mt-1 text-4xl text-pearl sm:text-5xl">
            {days[0].toLocaleDateString("en-US", { month: "long", day: "numeric" })} – {days[6].toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => setAnchor(addDays(anchor, -7))} className="grid size-11 place-items-center rounded-full border border-rose/25 text-champagne" aria-label="Previous week">
            <ChevronLeft className="size-5" />
          </button>
          <button onClick={() => { setAnchor(startOfDay(new Date())); setMobileDay(startOfDay(new Date())); }} className="btn btn-ghost !min-h-11 text-sm">
            Today
          </button>
          <button onClick={() => setAnchor(addDays(anchor, 7))} className="grid size-11 place-items-center rounded-full border border-rose/25 text-champagne" aria-label="Next week">
            <ChevronRight className="size-5" />
          </button>
          <button onClick={() => setBlockOpen(true)} className="btn btn-primary !min-h-11 text-sm">
            <Ban className="size-4" aria-hidden /> Block time
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-3 text-xs text-champagne/60">
        {Object.entries(CAT_COLOR).map(([k, v]) => (
          <span key={k} className="flex items-center gap-1.5">
            <span className={cn("size-2.5 rounded-sm border-l-2 bg-gradient-to-b", v)} /> {k}
          </span>
        ))}
      </div>

      {/* Desktop week */}
      <div className="card-night mt-5 hidden overflow-hidden md:block">
        <div className="grid grid-cols-[56px_repeat(7,1fr)] border-b border-rose/15 bg-wine/20">
          <span />
          {days.map((d) => (
            <div key={d.toISOString()} className={cn("py-3 text-center", ymd(d) === ymd(new Date()) && "text-pink")}>
              <p className="text-[10px] uppercase tracking-widest text-champagne/55">{d.toLocaleDateString("en-US", { weekday: "short" })}</p>
              <p className="display text-2xl text-pearl">{d.getDate()}</p>
            </div>
          ))}
        </div>
        <div className="max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-[56px_repeat(7,1fr)]">
            <div className="relative" style={{ height: (END_H - START_H) * PX }}>
              {hours.map((h) => (
                <span key={h} className="absolute right-2 -translate-y-1/2 text-[10px] text-champagne/45" style={{ top: (h - START_H) * PX }}>
                  {h % 12 || 12}
                  {h < 12 ? "a" : "p"}
                </span>
              ))}
            </div>
            {days.map((d) => (
              <div key={d.toISOString()}>{column(d)}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile day */}
      <div className="mt-5 md:hidden">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {days.map((d) => (
            <button key={d.toISOString()} onClick={() => setMobileDay(d)} className={cn("flex min-w-14 flex-col items-center rounded-xl border px-2 py-2", ymd(d) === ymd(mobileDay) ? "border-pink bg-pink/15 text-pink" : "border-rose/20 text-pearl")}>
              <span className="text-[10px] uppercase">{d.toLocaleDateString("en-US", { weekday: "short" })}</span>
              <span className="display text-2xl">{d.getDate()}</span>
            </button>
          ))}
        </div>
        <div className="card-night mt-3 overflow-hidden">
          <div className="grid grid-cols-[44px_1fr]">
            <div className="relative" style={{ height: (END_H - START_H) * PX }}>
              {hours.map((h) => (
                <span key={h} className="absolute right-1.5 -translate-y-1/2 text-[10px] text-champagne/45" style={{ top: (h - START_H) * PX }}>
                  {h % 12 || 12}
                  {h < 12 ? "a" : "p"}
                </span>
              ))}
            </div>
            {column(mobileDay, true)}
          </div>
        </div>
      </div>

      <ApptDrawer appt={open} onClose={() => setOpen(null)} />
      <BlockDrawer open={blockOpen} onClose={() => setBlockOpen(false)} />
    </div>
  );
}

function a11yList(list: Appointment[], name: (id: string) => string) {
  return (
    <ul className="sr-only">
      {list.map((a) => (
        <li key={a.id}>
          {fmtTime(a.start)} {name(a.clientId)} {SERVICE_BY_ID[a.serviceId].name}
        </li>
      ))}
    </ul>
  );
}

function BlockDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [date, setDate] = useState(() => ymd(new Date()));
  const [time, setTime] = useState("12:00");
  const [mins, setMins] = useState(60);
  const [label, setLabel] = useState("Personal time");
  const field = "mt-1 w-full rounded-xl border border-rose/25 bg-ink/60 px-4 py-3 text-pearl focus:border-pink focus:outline-none";
  return (
    <Drawer open={open} onClose={onClose} title="Block time">
      <form
        className="grid gap-4 text-sm"
        onSubmit={(e) => {
          e.preventDefault();
          const [y, m, d] = date.split("-").map(Number);
          addBlock(atTime(new Date(y, m - 1, d), time), mins, label || "Blocked");
          onClose();
        }}
      >
        <label className="text-champagne/80">
          Date
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={field} required />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="text-champagne/80">
            Start
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} step={1800} className={field} required />
          </label>
          <label className="text-champagne/80">
            Length
            <select value={mins} onChange={(e) => setMins(Number(e.target.value))} className={field}>
              {[30, 60, 90, 120, 180, 240, 600].map((m) => (
                <option key={m} value={m}>
                  {m >= 600 ? "All day" : `${m / 60} hr`}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="text-champagne/80">
          Label
          <input value={label} onChange={(e) => setLabel(e.target.value)} className={field} />
        </label>
        <button className="btn btn-primary">Block it off</button>
        <p className="text-xs text-champagne/50">Blocked time disappears from online booking immediately.</p>
      </form>
    </Drawer>
  );
}
