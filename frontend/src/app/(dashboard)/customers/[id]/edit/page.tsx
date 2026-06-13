"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CustomerForm } from "@/components/customers/CustomerForm";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function EditCustomerPage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCustomer() {
      try {
        const res = await api.get(`/customers/${params.id}`);
        setData(res.data);
      } catch (error) {
        toast.error("Failed to load customer");
        router.push("/customers");
      } finally {
        setLoading(false);
      }
    }
    
    if (params.id) {
      fetchCustomer();
    }
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Customer</h1>
        <p className="text-muted-foreground mt-1">
          Update school and contact information.
        </p>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
        <CustomerForm initialData={data} />
      </div>
    </div>
  );
}
