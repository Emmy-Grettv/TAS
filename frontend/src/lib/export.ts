import * as XLSX from "xlsx";
import { Customer } from "@/components/customers/columns";

export function exportToExcel(customers: Customer[], filename: string = "Customers.xlsx") {
  // We only want specific fields
  const dataToExport = customers.map((c) => ({
    "School Name": c.schoolName,
    "Category": c.category,
    "Telephone": c.telephone,
    "Title": c.title,
    "Contact Person": c.contactPerson,
    "District/Area": c.districtArea,
    "Observations": c.observations || "",
  }));

  const worksheet = XLSX.utils.json_to_sheet(dataToExport);
  const workbook = XLSX.utils.book_new();
  
  // Set column widths
  const colWidths = [
    { wch: 30 }, // School Name
    { wch: 15 }, // Category
    { wch: 20 }, // Telephone
    { wch: 10 }, // Title
    { wch: 25 }, // Contact Person
    { wch: 25 }, // District/Area
    { wch: 40 }, // Observations
  ];
  worksheet["!cols"] = colWidths;

  XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");
  XLSX.writeFile(workbook, filename);
}
