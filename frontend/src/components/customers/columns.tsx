"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Edit, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export type Customer = {
  id: string;
  schoolName: string;
  category: "Infant" | "ECD" | "Primary";
  telephone: string;
  title: string;
  contactPerson: string;
  districtArea: string;
  observations?: string;
  createdAt: string;
};

export const columns = (onDelete: (id: string) => void): ColumnDef<Customer>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "schoolName",
    header: "School Name",
    cell: ({ row }) => <div className="font-medium">{row.getValue("schoolName")}</div>,
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const category = row.getValue("category") as string;
      const variants: Record<string, string> = {
        Infant: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
        ECD: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
        Primary: "bg-[#2D9B4E]/10 text-[#2D9B4E] dark:bg-[#2D9B4E]/20 dark:text-[#2D9B4E]",
      };
      return (
        <Badge className={variants[category] || ""} variant="outline">
          {category}
        </Badge>
      );
    },
  },
  {
    accessorKey: "telephone",
    header: "Telephone",
  },
  {
    accessorKey: "contactPerson",
    header: "Contact Person",
    cell: ({ row }) => (
      <div>
        {row.original.title} {row.getValue("contactPerson")}
      </div>
    ),
  },
  {
    accessorKey: "districtArea",
    header: "District/Area",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const customer = row.original;

      return (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
            asChild
            title="View Details"
          >
            <Link href={`/customers/${customer.id}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
            asChild
            title="Edit"
          >
            <Link href={`/customers/${customer.id}/edit`}>
              <Edit className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
            onClick={() => onDelete(customer.id)}
            title="Delete"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
