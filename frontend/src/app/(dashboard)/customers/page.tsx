import { CustomerTable } from "@/components/customers/CustomerTable";
import { Button } from "@/components/ui/button";
import { UserPlus, Download } from "lucide-react";
import Link from "next/link";

export default function CustomersPage() {
  // NOTE: In a full implementation we'd trigger export from here via store or ref.
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground mt-1">
            Manage your school registrations and contacts.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/customers/new">
            <Button className="bg-[#2D9B4E] hover:bg-[#2D9B4E]/90">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Customer
            </Button>
          </Link>
        </div>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
        <CustomerTable limit={20} />
      </div>
    </div>
  );
}
