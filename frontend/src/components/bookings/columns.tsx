"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export type Booking = {
  id: string;
  schoolName: string;
  contactPerson: string;
  telephone: string;
  dateOfVisit: string;
  studentsCount: number;
  status: "Pending" | "Approved" | "Rejected";
  createdAt: string;
  createdBy: {
    id: string;
    name: string;
  };
};

export const columns: ColumnDef<Booking>[] = [
  {
    accessorKey: "schoolName",
    header: "School Name",
  },
  {
    accessorKey: "contactPerson",
    header: "Contact Person",
  },
  {
    accessorKey: "telephone",
    header: "Contact Number",
  },
  {
    accessorKey: "dateOfVisit",
    header: "Date of Visit",
    cell: ({ row }) => {
      return format(new Date(row.getValue("dateOfVisit")), "PP");
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          variant={
            status === "Approved"
              ? "default"
              : status === "Rejected"
              ? "destructive"
              : "secondary"
          }
          className={
            status === "Approved"
              ? "bg-green-600 hover:bg-green-700"
              : status === "Pending"
              ? "bg-yellow-500 hover:bg-yellow-600 text-white"
              : ""
          }
        >
          {status}
        </Badge>
      );
    },
  },
];
