import { ADD_ONS } from "@/lib/services";

export const CONSULT_ID = "81381263";

/** Booking fee inside each deposit, per her Acuity forms. */
export function bookingFee(deposit: number) {
  return deposit === 104 ? 4 : 2;
}

export function quote(svc: { id: string; price: number; minutes: number; deposit: number; bufferAfter: number; from?: boolean }, addOnIds: string[], saturdayFee = 0) {
  const addOns = addOnIds.map((id) => ADD_ONS[id]).filter(Boolean);
  const minutes = svc.minutes + addOns.reduce((n, a) => n + a.minutes, 0);
  const subtotal = svc.price + addOns.reduce((n, a) => n + a.price, 0) + saturdayFee;
  const fee = bookingFee(svc.deposit);
  const dueToday = svc.deposit;
  const credit = dueToday - fee;
  const balance = svc.id === CONSULT_ID ? 0 : Math.max(0, subtotal - credit);
  const from = addOns.some((a) => a.from) || !!svc.from;
  return { minutes, subtotal, fee, dueToday, credit, balance, from, buffer: svc.bufferAfter };
}

/** Build an .ics calendar file for the confirmed appointment. */
export function icsFor(title: string, start: Date, minutes: number, location: string, details: string) {
  const f = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const end = new Date(start.getTime() + minutes * 60000);
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//TMack The Loctician//Booking Portal//EN",
    "BEGIN:VEVENT",
    `UID:${start.getTime()}@tmacktheloctician.com`,
    `DTSTAMP:${f(new Date())}`,
    `DTSTART:${f(start)}`,
    `DTEND:${f(end)}`,
    `SUMMARY:${title}`,
    `LOCATION:${location.replace(/,/g, "\\,")}`,
    `DESCRIPTION:${details.replace(/\n/g, "\\n").replace(/,/g, "\\,")}`,
    "BEGIN:VALARM",
    "TRIGGER:-PT24H",
    "ACTION:DISPLAY",
    "DESCRIPTION:Your loc appointment is tomorrow",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return new Blob([lines.join("\r\n")], { type: "text/calendar" });
}
