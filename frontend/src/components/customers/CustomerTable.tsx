"use client";

import { useState, useEffect, useCallback } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { columns, Customer } from "./columns";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Search, Loader2, Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuthStore } from "@/store/authStore";
import * as XLSX from "xlsx";

interface CustomerTableProps {
  limit?: number;
  rowSelection?: Record<string, boolean>;
  onRowSelectionChange?: React.Dispatch<React.SetStateAction<any>>;
  showActions?: boolean;
  externalFilters?: { category?: string; districtArea?: string };
}

export function CustomerTable({
  limit = 10,
  rowSelection,
  onRowSelectionChange,
  showActions = true,
  externalFilters,
}: CustomerTableProps) {
  const [data, setData] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [localRowSelection, setLocalRowSelection] = useState<Record<string, boolean>>({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  const [pageIndex, setPageIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedCreatedBy, setSelectedCreatedBy] = useState<string>("");
  const [users, setUsers] = useState<any[]>([]);

  const currentUser = useAuthStore((state) => state.user);

  const activeRowSelection = rowSelection !== undefined ? rowSelection : localRowSelection;
  const activeOnRowSelectionChange = onRowSelectionChange !== undefined ? onRowSelectionChange : setLocalRowSelection;

  const isAdmin = currentUser?.role === "admin";

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // externalFilters (from messaging page) take priority over internal filter state
      const effectiveCategory = externalFilters?.category ?? selectedCategory;
      const effectiveDistrict = externalFilters?.districtArea ?? selectedDistrict;
      const res = await api.get("/customers", {
        params: {
          page: pageIndex + 1,
          limit,
          search: globalFilter,
          category: effectiveCategory || undefined,
          districtArea: effectiveDistrict || undefined,
          // Admins can pick any creator; regular users are always scoped to themselves
          createdById: isAdmin
            ? selectedCreatedBy || undefined
            : currentUser?.id,
        },
      });
      setData(res.data.data);
      setTotalPages(res.data.meta.totalPages);
    } catch (error) {
      toast.error("Failed to load customers");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [pageIndex, limit, globalFilter, selectedCategory, selectedDistrict, selectedCreatedBy, isAdmin, currentUser?.id, externalFilters?.category, externalFilters?.districtArea]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    // Always fetch the user list so the admin "Created By" dropdown is populated.
    // Non-admins never see the dropdown (gated in JSX), but fetching doesn't hurt.
    async function fetchUsers() {
      try {
        const res = await api.get("/users");
        setUsers(res.data);
      } catch (error) {
        // non-admins might get 403 if the backend still has strict role guard — silently ignore
        console.error("Failed to load users for filter", error);
      }
    }
    fetchUsers();
  }, [isAdmin]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/customers/${deleteId}`);
      toast.success("Customer deleted successfully");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete customer");
    } finally {
      setDeleteId(null);
    }
  };

  const handleExport = async () => {
    try {
      const selectedIds = Object.keys(activeRowSelection).filter((id) => activeRowSelection[id]);
      
      const res = await api.get("/customers/export", {
        params: selectedIds.length > 0
          ? { ids: selectedIds.join(",") }
          : {
              search: globalFilter || undefined,
              category: selectedCategory || undefined,
              districtArea: selectedDistrict || undefined,
              createdById: selectedCreatedBy || undefined,
            },
      });
      const customers = res.data;

      if (!customers || customers.length === 0) {
        toast.error("No customers to export");
        return;
      }

      // Convert to SheetJS structure
      const wsData = customers.map((c: any) => ({
        "School Name": c.schoolName || "",
        "Category": c.category || "",
        "Telephone": c.telephone || "",
        "Contact Person": `${c.title || ""} ${c.contactPerson || ""}`.trim(),
        "District/Area": c.districtArea || "",
        "Observations": c.observations || "",
        "Created By": c.createdBy?.name || "System",
        "Created At": c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "",
      }));

      const worksheet = XLSX.utils.json_to_sheet(wsData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");

      // Auto-fit columns
      const maxLens: Record<string, number> = wsData.reduce((acc: Record<string, number>, row: any) => {
        Object.keys(row).forEach((key) => {
          const valLen = String(row[key] || "").length;
          acc[key] = Math.max(acc[key] || key.length, valLen);
        });
        return acc;
      }, {});
      worksheet["!cols"] = Object.keys(maxLens).map((key) => ({
        wch: maxLens[key] + 3,
      }));

      XLSX.writeFile(workbook, `customers_export_${new Date().toISOString().slice(0, 10)}.xlsx`);
      
      toast.success("Customers exported to Excel successfully");
    } catch (error) {
      toast.error("Failed to export customers");
      console.error(error);
    }
  };

  const allColumns = columns((id) => setDeleteId(id));
  const activeColumns = showActions ? allColumns : allColumns.filter((c) => c.id !== "actions");

  const table = useReactTable({
    data,
    columns: activeColumns,
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: activeOnRowSelectionChange,
    manualPagination: true,
    pageCount: totalPages,
    state: {
      sorting,
      columnFilters,
      rowSelection: activeRowSelection,
      pagination: {
        pageIndex,
        pageSize: limit,
      },
    },
  });

  // Debounce search effect
  useEffect(() => {
    const timeout = setTimeout(() => {
      setPageIndex(0); // reset to page 1 on new search
      fetchData();
    }, 500);
    return () => clearTimeout(timeout);
  }, [globalFilter, fetchData]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="relative w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex gap-2 items-center">
          {Object.keys(activeRowSelection).length > 0 && (
            <span className="text-sm text-muted-foreground self-center mr-2">
              {Object.keys(activeRowSelection).length} selected
            </span>
          )}
          <Button variant="outline" size="sm" onClick={handleExport} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Excel
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 items-center bg-zinc-50 dark:bg-zinc-900/30 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800">
        <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mr-2">Filters:</div>
        
        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => {
            setPageIndex(0);
            setSelectedCategory(e.target.value);
          }}
          className="h-9 rounded-md border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-300"
        >
          <option value="">All Categories</option>
          <option value="Infant">Infant</option>
          <option value="ECD">ECD</option>
          <option value="Primary">Primary</option>
        </select>

        {/* District Filter */}
        <div className="relative w-48">
          <Input
            placeholder="Filter by District..."
            value={selectedDistrict}
            onChange={(e) => {
              setPageIndex(0);
              setSelectedDistrict(e.target.value);
            }}
            className="h-9 text-sm"
          />
        </div>

        {/* Created By Filter — Admin only */}
        {isAdmin && users.length > 0 && (
          <select
            value={selectedCreatedBy}
            onChange={(e) => {
              setPageIndex(0);
              setSelectedCreatedBy(e.target.value);
            }}
            className="h-9 rounded-md border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-300"
          >
            <option value="">All Creators</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        )}

        {/* Clear Filters Button */}
        {(selectedCategory || selectedDistrict || selectedCreatedBy) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setPageIndex(0);
              setSelectedCategory("");
              setSelectedDistrict("");
              setSelectedCreatedBy("");
            }}
            className="h-9 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 ml-auto"
          >
            Clear Filters
          </Button>
        )}
      </div>

      <div className="rounded-md border bg-white dark:bg-zinc-950">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={activeColumns.length} className="h-24 text-center">
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={activeColumns.length} className="h-24 text-center">
                  No customers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Showing page {pageIndex + 1} of {totalPages || 1}
        </div>
        <div className="space-x-2 flex items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageIndex((old) => Math.max(old - 1, 0))}
            disabled={pageIndex === 0 || loading}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageIndex((old) => (old + 1 < totalPages ? old + 1 : old))}
            disabled={pageIndex >= totalPages - 1 || loading}
          >
            Next
          </Button>
        </div>
      </div>

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the customer record
              and remove their data from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
