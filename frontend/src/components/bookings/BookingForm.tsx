"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  schoolName: z.string().min(2, "School name is required"),
  poBox: z.string().optional(),
  districtArea: z.string().min(2, "District/Area is required"),
  contactPerson: z.string().min(2, "Contact person is required"),
  telephone: z.string().min(6, "Telephone is required"),
  dateOfVisit: z.string().min(1, "Date of visit is required"),
  entrance: z.string().min(1, "Entrance details required"),
  studentsCount: z.coerce.number().min(1, "At least 1 student is required"),
  reservationsCount: z.coerce.number().min(1, "At least 1 reservation is required"),
  teachersCount: z.string().optional(),
  arrivalTime: z.string().optional(),
  departureTime: z.string().optional(),
});

type BookingFormProps = {
  initialData?: z.infer<typeof formSchema> & { id: string };
};

export function BookingForm({ initialData }: BookingFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: initialData || {
      schoolName: "",
      poBox: "",
      districtArea: "",
      contactPerson: "",
      telephone: "",
      dateOfVisit: "",
      entrance: "",
      studentsCount: 1,
      reservationsCount: 1,
      teachersCount: "N/S",
      arrivalTime: "09:00 AM",
      departureTime: "15:00 PM",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      if (initialData?.id) {
        await api.patch(`/bookings/${initialData.id}`, data);
        toast.success("Booking updated successfully");
      } else {
        await api.post("/bookings", data);
        toast.success("Booking created successfully");
      }
      router.push("/bookings");
      router.refresh();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...(form as any)}>
      <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control as any}
            name="schoolName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>School Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter school name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control as any}
            name="districtArea"
            render={({ field }) => (
              <FormItem>
                <FormLabel>District / Area</FormLabel>
                <FormControl>
                  <Input placeholder="Enter district or area" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control as any}
            name="poBox"
            render={({ field }) => (
              <FormItem>
                <FormLabel>PO Box (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter PO Box" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control as any}
            name="telephone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter contact number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control as any}
            name="contactPerson"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Person</FormLabel>
                <FormControl>
                  <Input placeholder="Enter full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control as any}
            name="dateOfVisit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Visit</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control as any}
            name="entrance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Entrance Details (e.g. $12 per kid Package)</FormLabel>
                <FormControl>
                  <Input placeholder="Package details" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control as any}
            name="studentsCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Students</FormLabel>
                <FormControl>
                  <Input type="number" min="1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control as any}
            name="reservationsCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Reservations</FormLabel>
                <FormControl>
                  <Input type="number" min="1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control as any}
            name="teachersCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teachers/Chaperones Count</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. N/S or 5" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control as any}
            name="arrivalTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Arrival Time</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 09:00 AM" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control as any}
            name="departureTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Departure Time</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 15:00 PM" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" className="bg-[#2D9B4E] hover:bg-[#2D9B4E]/90" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Update Booking" : "Create Booking"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
