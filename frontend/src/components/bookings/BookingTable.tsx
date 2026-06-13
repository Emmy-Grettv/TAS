"use client";

import { useEffect, useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { api } from "@/lib/api";
import { columns as baseColumns, Booking } from "./columns";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Search, MoreHorizontal, Eye, Edit, Trash, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

export function BookingTable() {
  const [data, setData] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  // Approve Modal State
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [selectedApproveId, setSelectedApproveId] = useState<string | null>(null);
  const [isApproving, setIsApproving] = useState(false);

  // Reject Modal State
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);

  // View Modal State (Simple implementation)
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewBooking, setViewBooking] = useState<any>(null);

  const isAdmin = user?.role === "admin";

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/bookings", {
        params: { search: globalFilter },
      });
      setData(res.data);
    } catch (error) {
      toast.error("Failed to fetch bookings");
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

  const handleDeleteSubmit = async () => {
    if (!selectedDeleteId) return;
    setIsDeleting(true);
    try {
      await api.delete(`/bookings/${selectedDeleteId}`);
      toast.success("Booking deleted successfully");
      setDeleteModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error("Failed to delete booking");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleApproveSubmit = async () => {
    if (!selectedApproveId) return;
    setIsApproving(true);
    try {
      await api.post(`/bookings/${selectedApproveId}/approve`);
      toast.success("Booking approved and notification sent");
      setApproveModalOpen(false);
      setViewModalOpen(false);
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to approve booking");
    } finally {
      setIsApproving(false);
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Rejection reason is required");
      return;
    }
    if (!selectedBookingId) return;

    setIsRejecting(true);
    try {
      await api.post(`/bookings/${selectedBookingId}/reject`, { rejectionReason });
      toast.success("Booking rejected and notification sent");
      setRejectModalOpen(false);
      setViewModalOpen(false);
      setRejectionReason("");
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to reject booking");
    } finally {
      setIsRejecting(false);
    }
  };

  const columns = useMemo(() => {
    return [
      ...baseColumns,
      {
        id: "actions",
        cell: ({ row }: { row: any }) => {
          const booking = row.original;

          return (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-blue-50"
                onClick={() => {
                  setViewBooking(booking);
                  setViewModalOpen(true);
                }}
                title="View Details"
              >
                <Eye className="h-4 w-4 text-blue-600" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-green-50"
                onClick={() => router.push(`/bookings/${booking.id}/edit`)}
                title="Edit Booking"
              >
                <Edit className="h-4 w-4 text-green-600" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-red-50"
                onClick={() => {
                  setSelectedDeleteId(booking.id);
                  setDeleteModalOpen(true);
                }}
                title="Delete Booking"
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
            placeholder="Search bookings..."
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
                  No bookings found.
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

      {/* Approve Modal */}
      <Dialog open={approveModalOpen} onOpenChange={setApproveModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Reservation</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this reservation? A confirmation letter will be generated and sent automatically via WhatsApp.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveModalOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={handleApproveSubmit} disabled={isApproving}>
              {isApproving ? "Processing..." : "Approve Booking"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this booking? This action cannot be undone.
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

      {/* Reject Modal */}
      <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Reservation</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this booking. This will be sent to the customer via WhatsApp.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Enter reason for rejection..."
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRejectSubmit} disabled={isRejecting}>
              {isRejecting ? "Processing..." : "Reject Booking"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          {viewBooking && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <span className="font-semibold text-muted-foreground">School Name:</span>
                <span>{viewBooking.schoolName}</span>
                
                <span className="font-semibold text-muted-foreground">Contact Person:</span>
                <span>{viewBooking.contactPerson}</span>
                
                <span className="font-semibold text-muted-foreground">Telephone:</span>
                <span>{viewBooking.telephone}</span>
                
                <span className="font-semibold text-muted-foreground">Date of Visit:</span>
                <span>{new Date(viewBooking.dateOfVisit).toLocaleDateString()}</span>
                
                <span className="font-semibold text-muted-foreground">District/Area:</span>
                <span>{viewBooking.districtArea}</span>
                
                <span className="font-semibold text-muted-foreground">Entrance:</span>
                <span>{viewBooking.entrance}</span>
                
                <span className="font-semibold text-muted-foreground">Students Count:</span>
                <span>{viewBooking.studentsCount}</span>
                
                <span className="font-semibold text-muted-foreground">Reservations Count:</span>
                <span>{viewBooking.reservationsCount}</span>
                
                <span className="font-semibold text-muted-foreground">Status:</span>
                <span>{viewBooking.status}</span>
              </div>

              {isAdmin && viewBooking.status === "Pending" && (
                <div className="flex gap-2 justify-end mt-6 border-t pt-4">
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setSelectedBookingId(viewBooking.id);
                      setRejectModalOpen(true);
                    }}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => {
                      setSelectedApproveId(viewBooking.id);
                      setApproveModalOpen(true);
                    }}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
