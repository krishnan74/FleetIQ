"use client";

import React from "react";
import Spreadsheet from "react-spreadsheet";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Button } from "@/components/ui/button";

const Page = () => {
  const fileName = "Invoice";

  const data = [
    [
      { value: "Company/Seller Name:" },
      { value: "" },
      { value: "" },
      { value: "" },
      { value: "" },
      { value: "" },
      { value: "" },
      { value: "" },
      { value: "" },
    ],
    [{ value: "Address:" }],
    [{ value: "" }],
    [{ value: "Phone No.:" }, { value: "" }],
    [{ value: "Email ID:" }, { value: "" }],
    [{ value: "GSTIN:" }, { value: "" }],
    [{ value: "State:" }, { value: "" }],
    [{ value: "" }, { value: "" }, { value: "" }, { value: "TAX INVOICE" }],
    [],
    [
      { value: "Bill To:" },
      { value: "" },
      { value: "" },
      { value: "Shipping To:" },
      { value: "" },
    ],
    [
      { value: "Name:" },
      { value: "" },
      { value: "" },
      { value: "Name:" },
      { value: "" },
    ],
    [
      { value: "Address:" },
      { value: "" },
      { value: "" },
      { value: "Address:" },
      { value: "" },
    ],
    [],
    [
      { value: "" },
      { value: "" },
      { value: "" },

      { value: "Transportation Details:" },
      { value: "" },
      { value: "" },
    ],
    [
      { value: "" },
      { value: "" },
      { value: "" },
      { value: "Driver Name:" },
      { value: "" },
    ],
    [
      { value: "" },
      { value: "" },
      { value: "" },
      { value: "Driver Mobile No.:" },

      { value: "" },
    ],
    [
      { value: "Contact No: " },
      { value: "" },
      { value: "" },
      { value: "Vehicle Number:" },

      { value: "" },
    ],
    [
      { value: "GSTIN No.:" },
      { value: "" },
      { value: "" },
      { value: "Invoice No.:" },
      { value: "" },
    ],
    [
      { value: "State:" },
      { value: "" },
      { value: "" },
      { value: "Date:" },
      { value: "" },
    ],
    [],
    [
      { value: "#" },
      { value: "Item name" },
      { value: "HSN" },
      { value: "QTY" },
      { value: "Unit" },
      { value: "Price/Unit" },
      { value: "Disc" },
      { value: "GST" },
      { value: "Amount" },
    ],
    // Item rows go here
    Array(9).fill({ value: "" }),
    Array(9).fill({ value: "" }),
    Array(9).fill({ value: "" }),
    [
      { value: "Total" },
      { value: "" },
      { value: "" },
      { value: "" },
      { value: "" },
      { value: "" },
      { value: "" },
      { value: "" },
      { value: "" },
    ],
    [],
    [
      { value: "Amount in words:" },
      { value: "" },
      { value: "" },
      { value: "" },
      { value: "Sub Total:" },
      { value: "" },
    ],
    [
      { value: "" },
      { value: "" },
      { value: "" },
      { value: "" },
      { value: "Packaging Fee" },
      { value: "" },
    ],
    [
      { value: "" },
      { value: "" },
      { value: "" },
      { value: "" },
      { value: "Delivery Fee" },
      { value: "" },
    ],
    [
      { value: "" },
      { value: "" },
      { value: "" },
      { value: "" },
      { value: "Discount:" },
      { value: "" },
    ],
    [
      { value: "" },
      { value: "" },
      { value: "" },
      { value: "" },
      { value: "SGST:" },
      { value: "" },
    ],
    [
      { value: "" },
      { value: "" },
      { value: "" },
      { value: "" },
      { value: "CGST:" },
      { value: "" },
    ],
    [
      { value: "" },
      { value: "" },
      { value: "" },
      { value: "" },
      { value: "Total:" },
      { value: "" },
    ],
    [
      { value: "" },
      { value: "" },
      { value: "" },
      { value: "" },
      { value: "Received" },
      { value: "" },
    ],
    [
      { value: "" },
      { value: "" },
      { value: "" },
      { value: "" },
      { value: "Balance" },
      { value: "" },
    ],
    [
      { value: "Terms & Conditions:" },
      { value: "" },
      { value: "" },
      { value: "" },
      { value: "Company seal and Sign" },
      { value: "" },
    ],
  ];

  const exportToExcel = () => {
    const aoaData = data.map((row) => row.map((cell) => cell.value));
    const worksheet = XLSX.utils.aoa_to_sheet(aoaData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `${fileName}.xlsx`);
  };

  return (
    <div className="">
      <Spreadsheet data={data} />
      <Button onClick={exportToExcel}>Export to Excel</Button>
    </div>
  );
};

export default Page;
