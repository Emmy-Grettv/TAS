"use client";

import { useEffect, useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { api } from "@/lib/api";
import { columns as baseColumns, Quotation } from "./columns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, MoreHorizontal, Edit, Trash, Send } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

export function QuotationTable() {
  const [data, setData] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  const isAdmin = user?.role === "admin";

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/quotations", {
        params: { search: globalFilter },
      });
      setData(res.data);
    } catch (error) {
      toast.error("Failed to fetch quotations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchData();
    }, 500);
    return () => clearTimeout(timeout);
  }, [globalFilter]);

  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Send Modal State
  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [selectedSendId, setSelectedSendId] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  const handleDeleteSubmit = async () => {
    if (!selectedDeleteId) return;
    setIsDeleting(true);
    try {
      await api.delete(`/quotations/${selectedDeleteId}`);
      toast.success("Quotation deleted successfully");
      setDeleteModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error("Failed to delete quotation");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSendSubmit = async () => {
    if (!selectedSendId) return;
    setIsSending(true);
    try {
      await api.post(`/quotations/${selectedSendId}/send`);
      toast.success("Quotation sent successfully");
      setSendModalOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send quotation");
    } finally {
      setIsSending(false);
    }
  };

  const columns = useMemo(() => {
    return [
      ...baseColumns,
      {
        id: "actions",
        cell: ({ row }: { row: any }) => {
          const quotation = row.original;

          return (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-green-50"
                onClick={() => router.push(`/quotations/${quotation.id}/edit`)}
                title="Edit Quotation"
              >
                <Edit className="h-4 w-4 text-green-600" />
              </Button>
              
              {isAdmin && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-blue-50"
                  onClick={() => {
                    setSelectedSendId(quotation.id);
                    setSendModalOpen(true);
                  }}
                  title="Send Quotation via WhatsApp"
                >
                  <Send className="h-4 w-4 text-blue-600" />
                </Button>
              )}

              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-red-50"
                onClick={() => {
                  setSelectedDeleteId(quotation.id);
                  setDeleteModalOpen(true);
                }}
                title="Delete Quotation"
              >
                <Trash className="h-4 w-4 text-red-600" />
              </Button>
            </div>
          );
        },
      },
    ];
  }, [isAdmin, router]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <div className="relative w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search quotations..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No quotations found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>

      {/* Send Modal */}
      <Dialog open={sendModalOpen} onOpenChange={setSendModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Quotation</DialogTitle>
            <DialogDescription>
              Are you sure you want to send this quotation via WhatsApp? A PDF will be generated and sent to the client.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSendModalOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSendSubmit} disabled={isSending}>
              {isSending ? "Sending..." : "Send Quotation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Quotation</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this quotation? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteSubmit} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
