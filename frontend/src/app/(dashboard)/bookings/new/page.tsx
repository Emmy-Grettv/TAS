"use client";

import { BookingForm } from "@/components/bookings/BookingForm";

export default function NewBookingPage() {
  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Booking</h1>
        <p className="text-muted-foreground mt-1">
          Create a new school visit reservation.
        </p>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
        <BookingForm />
      </div>
    </div>
  );
}
