"use client";

import { useState } from "react";
import { CalendarOff, Plus, Trash2 } from "lucide-react";
import { SERVICES, fmtDuration } from "@/lib/services";
import { liveService, overrideService, toast, updateSettings, useDB } from "@/lib/portal/db";
import { Panel, fmtDate } from "../ui";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function OwnerSettings() {
  const settings = useDB((s) => s.settings);
  const [holiday, setHoliday] = useState("");
  const input = "rounded-lg border border-rose/25 bg-ink/60 min-h-11 px-2 py-2 text-sm text-pearl focus:border-pink focus:outline-none";

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow text-rose">Settings</p>
        <h1 className="display mt-1 text-5xl text-pearl">Services & hours</h1>
        <p className="mt-1 text-sm text-champagne/60">Changes show on the booking page instantly. Your website menu reads from the same data at launch.</p>
      </div>

      <Panel title="Service menu">
        <div className="md:overflow-x-auto">
          <table className="block w-full text-left text-sm md:table md:min-w-[640px]">
            <thead className="hidden text-xs uppercase tracking-[0.14em] text-champagne/50 md:table-header-group">
              <tr>
                <th scope="col" className="py-2 font-semibold">Service</th>
                <th scope="col" className="py-2 font-semibold">Price ($)</th>
                <th scope="col" className="py-2 font-semibold">Minutes</th>
                <th scope="col" className="py-2 font-semibold">Online</th>
              </tr>
            </thead>
            <tbody className="block divide-y divide-rose/10 md:table-row-group">
              {SERVICES.map((s) => {
                const l = liveService(s, settings);
                return (
                  <tr key={s.id} className="grid grid-cols-2 gap-x-3 gap-y-2 py-4 md:table-row md:py-0">
                    <td className="col-span-2 md:py-3 md:pr-3">
                      <p className="text-pearl">{s.name}</p>
                      <p className="text-xs text-champagne/50">
                        {s.category} · now {fmtDuration(l.minutes)}
                      </p>
                    </td>
                    <td className="md:py-3 md:pr-3">
                      <span className="mb-1 block text-xs text-champagne/50 md:hidden">Price ($)</span>
                      <input type="number" min={0} defaultValue={l.price} onBlur={(e) => { overrideService(s.id, { price: Number(e.target.value) }); toast(`${s.name}: price saved`); }} className={`${input} w-full md:w-24`} aria-label={`${s.name} price`} />
                    </td>
                    <td className="md:py-3 md:pr-3">
                      <span className="mb-1 block text-xs text-champagne/50 md:hidden">Minutes</span>
                      <input type="number" min={15} step={15} defaultValue={l.minutes} onBlur={(e) => { overrideService(s.id, { minutes: Number(e.target.value) }); toast(`${s.name}: time saved`); }} className={`${input} w-full md:w-24`} aria-label={`${s.name} minutes`} />
                    </td>
                    <td className="col-span-2 md:py-3">
                      <label className="inline-flex min-h-11 cursor-pointer items-center gap-2">
                        <input type="checkbox" checked={l.active} onChange={(e) => overrideService(s.id, { active: e.target.checked })} className="size-5 accent-[#ff5aa8]" />
                        <span className="text-xs text-champagne/60">{l.active ? "Bookable" : "Hidden"}</span>
                      </label>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      <div className="grid [&>*]:min-w-0 gap-6 xl:grid-cols-2">
        <Panel title="Weekly hours">
          <ul className="space-y-2">
            {DAYS.map((d, i) => {
              const h = settings.hours[i];
              const on = !!h?.open;
              return (
                <li key={d} className="flex flex-wrap items-center gap-3 rounded-xl bg-ink/40 px-3 py-2.5 text-sm">
                  <label className="flex w-32 cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={on}
                      onChange={(e) => {
                        const hours = settings.hours.slice();
                        hours[i] = e.target.checked ? { open: "09:00", close: "19:00" } : { open: null, close: null };
                        updateSettings({ hours });
                      }}
                      className="size-5 accent-[#ff5aa8]"
                    />
                    <span className="text-pearl">{d}</span>
                  </label>
                  {on ? (
                    <span className="flex items-center gap-2">
                      <input
                        type="time"
                        value={h.open!}
                        step={1800}
                        onChange={(e) => {
                          const hours = settings.hours.slice();
                          hours[i] = { ...hours[i], open: e.target.value };
                          updateSettings({ hours });
                        }}
                        className={input}
                        aria-label={`${d} opens`}
                      />
                      –
                      <input
                        type="time"
                        value={h.close!}
                        step={1800}
                        onChange={(e) => {
                          const hours = settings.hours.slice();
                          hours[i] = { ...hours[i], close: e.target.value };
                          updateSettings({ hours });
                        }}
                        className={input}
                        aria-label={`${d} closes`}
                      />
                    </span>
                  ) : (
                    <span className="text-champagne/45">Closed</span>
                  )}
                </li>
              );
            })}
          </ul>
        </Panel>

        <div className="space-y-6">
          <Panel title="Saturday rule">
            <label className="flex cursor-pointer items-start gap-3 text-sm">
              <input type="checkbox" checked={settings.firstSaturdayOnly} onChange={(e) => updateSettings({ firstSaturdayOnly: e.target.checked })} className="mt-0.5 size-5 accent-[#ff5aa8]" />
              <span className="text-champagne/85">Open online only the first Saturday of each month. Other Saturdays show as “request” with an availability fee.</span>
            </label>
            <label className="mt-4 flex items-center gap-3 text-sm text-champagne/80">
              Saturday request fee $
              <input type="number" min={0} value={settings.saturdayFee} onChange={(e) => updateSettings({ saturdayFee: Number(e.target.value) })} className={`${input} w-20`} />
            </label>
            <label className="mt-4 flex items-center gap-3 text-sm text-champagne/80">
              Minimum notice (hours)
              <input type="number" min={0} value={settings.leadHours} onChange={(e) => updateSettings({ leadHours: Number(e.target.value) })} className={`${input} w-20`} />
            </label>
          </Panel>

          <Panel title="Closed dates" action={<CalendarOff className="size-5 text-rose" aria-hidden />}>
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (holiday && !settings.holidays.includes(holiday)) updateSettings({ holidays: [...settings.holidays, holiday].sort() });
                setHoliday("");
              }}
            >
              <input type="date" value={holiday} onChange={(e) => setHoliday(e.target.value)} className={`${input} flex-1`} aria-label="Closed date" />
              <button className="btn btn-primary !min-h-10 !px-4 text-sm">
                <Plus className="size-4" aria-hidden /> Add
              </button>
            </form>
            <ul className="mt-4 flex flex-wrap gap-2">
              {settings.holidays.map((h) => (
                <li key={h} className="flex items-center gap-2 rounded-full bg-ink/50 px-3 py-1.5 text-xs text-champagne/85">
                  {fmtDate(h + "T12:00:00", { month: "short", day: "numeric", year: "numeric" })}
                  <button onClick={() => updateSettings({ holidays: settings.holidays.filter((x) => x !== h) })} aria-label={`Remove ${h}`} className="-my-2 -mr-2 grid size-10 place-items-center text-champagne/50 hover:text-bad">
                    <Trash2 className="size-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}
