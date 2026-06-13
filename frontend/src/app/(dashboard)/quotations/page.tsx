"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuotationTable } from "@/components/quotations/QuotationTable";

export default function QuotationsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quotations</h1>
          <p className="text-muted-foreground mt-1">
            Manage and send quotations to customers.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/quotations/new">
            <Button className="bg-[#2D9B4E] hover:bg-[#2D9B4E]/90">
              <Plus className="mr-2 h-4 w-4" />
              New Quotation
            </Button>
          </Link>
        </div>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <QuotationTable />
      </div>
    </div>
  );
}
