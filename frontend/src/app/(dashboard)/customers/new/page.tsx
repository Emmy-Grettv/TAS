import { CustomerForm } from "@/components/customers/CustomerForm";

export default function NewCustomerPage() {
  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add Customer</h1>
        <p className="text-muted-foreground mt-1">
          Register a new school and contact person. A WhatsApp message will be sent automatically.
        </p>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
        <CustomerForm />
      </div>
    </div>
  );
}
