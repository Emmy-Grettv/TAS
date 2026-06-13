"use client";

import { QuotationForm } from "@/components/quotations/QuotationForm";

export default function NewQuotationPage() {
  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Quotation</h1>
        <p className="text-muted-foreground mt-1">
          Upload and create a new quotation.
        </p>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
        <QuotationForm />
      </div>
    </div>
  );
}
