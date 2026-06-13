"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Loader2, Plus, Trash } from "lucide-react";

const quotationItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  unitCost: z.coerce.number().min(0, "Unit cost must be positive"),
});

const formSchema = z.object({
  schoolName: z.string().min(2, "School name is required"),
  districtArea: z.string().min(2, "District/Area is required"),
  contactPerson: z.string().min(2, "Contact person is required"),
  telephone: z.string().min(6, "Telephone is required"),
  subject: z.string().min(2, "Subject is required"),
  notes: z.string().optional(),
  items: z.array(quotationItemSchema).min(1, "At least one item is required"),
});

type QuotationFormProps = {
  initialData?: z.infer<typeof formSchema> & { id: string };
};

export function QuotationForm({ initialData }: QuotationFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: initialData || {
      schoolName: "",
      districtArea: "",
      contactPerson: "",
      telephone: "",
      subject: "",
      notes: "",
      items: [{ description: "School Winter Promo Package", quantity: 60, unitCost: 12 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      if (initialData?.id) {
        await api.patch(`/quotations/${initialData.id}`, data);
        toast.success("Quotation updated successfully");
      } else {
        await api.post("/quotations", data);
        toast.success("Quotation created successfully");
      }
      router.push("/quotations");
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
        </div>

        <FormField
          control={form.control as any}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <FormControl>
                <Input placeholder="Quotation subject" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Quotation Items</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ description: "", quantity: 1, unitCost: 0 })}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </div>
          
          {fields.map((item, index) => (
            <div key={item.id} className="flex gap-4 items-start bg-gray-50 p-4 rounded-md">
              <FormField
                control={form.control as any}
                name={`items.${index}.description`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Package details..." className="h-10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control as any}
                name={`items.${index}.quantity`}
                render={({ field }) => (
                  <FormItem className="w-24">
                    <FormLabel>Qty</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control as any}
                name={`items.${index}.unitCost`}
                render={({ field }) => (
                  <FormItem className="w-32">
                    <FormLabel>Unit Cost ($)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="mt-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={() => remove(index)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {form.formState.errors.items && (
            <p className="text-sm text-destructive">{form.formState.errors.items.message as string}</p>
          )}
        </div>

        <FormField
          control={form.control as any}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Terms / Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="e.g. $50 Deposit on confirmation and balance on arrival date." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4 pt-4 border-t">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" className="bg-[#2D9B4E] hover:bg-[#2D9B4E]/90" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Update Quotation" : "Create Quotation"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
