"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { FileText } from "lucide-react";
import Link from "next/link";


export type Quotation = {
  id: string;
  schoolName: string;
  contactPerson: string;
  telephone: string;
  districtArea: string;
  subject: string;
  documentPath: string | null;
  createdAt: string;
  createdBy: {
    id: string;
    name: string;
  };
};

// We don't have a configured env file, but we can assume the API is at NEXT_PUBLIC_API_URL
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
const uploadBaseUrl = apiUrl.replace("/api", "") + "/uploads/quotations";

export const columns: ColumnDef<Quotation>[] = [
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
    accessorKey: "subject",
    header: "Subject",
  },
  {
    accessorKey: "documentPath",
    header: "Document",
    cell: ({ row }) => {
      const path = row.getValue("documentPath") as string | null;
      if (!path) return <span className="text-muted-foreground text-sm">No file</span>;
      
      return (
        <a 
          href={`${uploadBaseUrl}/${path}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center text-blue-600 hover:underline"
        >
          <FileText className="h-4 w-4 mr-1" />
          View
        </a>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      return format(new Date(row.getValue("createdAt")), "PP");
    },
  },
];
