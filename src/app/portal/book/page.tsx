import { Suspense } from "react";
import { Booker } from "@/components/portal/Booker";

export const metadata = { title: "Book an appointment" };

export default function BookPage() {
  return (
    <Suspense fallback={<div className="min-h-svh bg-ink" />}>
      <Booker />
    </Suspense>
  );
}
