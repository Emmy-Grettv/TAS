"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Edit, ArrowLeft, Loader2, CalendarIcon, MessageCircle } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCustomer() {
      try {
        const res = await api.get(`/customers/${params.id}`);
        setData(res.data);
      } catch (error) {
        toast.error("Failed to load customer details");
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
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{data.schoolName}</h1>
            <p className="text-muted-foreground flex items-center gap-2 mt-1">
              <Badge variant="outline">{data.category}</Badge>
              <span>{data.districtArea}</span>
            </p>
          </div>
        </div>
        <Link href={`/customers/${data.id}/edit`}>
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit Customer
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
            <div className="grid grid-cols-2 gap-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Contact Person</p>
                <p className="font-medium">{data.title} {data.contactPerson}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Telephone</p>
                <p className="font-medium">{data.telephone}</p>
              </div>
              <div className="col-span-2 mt-2">
                <p className="text-sm font-medium text-muted-foreground">Observations</p>
                <p className="whitespace-pre-wrap">{data.observations || "No observations recorded."}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Message History</h2>
            {data.messageLogs?.length > 0 ? (
              <div className="space-y-4">
                {data.messageLogs.map((log: any) => (
                  <div key={log.id} className="flex flex-col gap-2 p-4 rounded-lg border bg-zinc-50 dark:bg-zinc-900">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {format(new Date(log.sentAt), "PPP p")}
                        </span>
                      </div>
                      <Badge variant={log.status === 'sent' ? 'default' : 'destructive'}>
                        {log.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap pl-6 line-clamp-3">
                      {log.message}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No messages have been sent yet.</p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">System Information</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Created By</p>
                <p className="font-medium">{data.createdBy?.name || "System"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Created At</p>
                <p className="font-medium flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  {format(new Date(data.createdAt), "PPP")}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last Updated By</p>
                <p className="font-medium">{data.updatedBy?.name || "System"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last Updated At</p>
                <p className="font-medium flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  {format(new Date(data.updatedAt), "PPP")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
