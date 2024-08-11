"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import Spreadsheet from "react-spreadsheet";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Button } from "@/components/ui/button";

import { useToast } from "@/components/ui/use-toast";
import { usePathname } from "next/navigation";
import axios from "axios";

import { DriverDetails, DriverTransaction } from "@/lib/interface";

const DriverBillDialogComponent = () => {
  const pathname = usePathname();
  const id = pathname.split("/")[2];

  const [open, setOpen] = useState(false);
  const [driver, setDriver] = useState<DriverDetails | undefined>(undefined);

  const fileName = "Driver Bill";

  const fetchData = async () => {
    try {
      const response = await axios.get(`/api/driver/${id}`);
      if (response.data.message === "success") {
        setDriver(response.data.data);
      }
    } catch (error) {
      console.error("An error occurred while fetching data", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const data = [
    [
      { value: "Driver: " },
      { value: driver?.name || "" },
      { value: "" },
      { value: "Generated on: " },
      { value: new Date().toDateString().substring(4) },
    ],
    [
      { value: "Mobile: " },
      { value: driver?.phone || "" },
      { value: "" },
      { value: "" },
      { value: "" },
    ],
    [
      { value: "Balance: " },
      { value: driver?.balance || "" },
      { value: "" },
      { value: "" },
      { value: "" },
    ],
    [],
    [
      { value: "Date" },
      { value: "Reason" },
      { value: "Driver Gave (-)" },
      { value: "Driver Got (+)" },
      { value: "Balance" },
    ],
    ...((driver?.transactions || []).map((transaction: DriverTransaction) => [
      {
        value:
          new Date(transaction.transactionDate).toDateString().substring(4) ||
          "",
      },
      { value: transaction.transactionDescription || "" },
      {
        value:
          transaction.transactionType === "DEBIT" ? transaction.amount : "0",
      },
      {
        value:
          transaction.transactionType === "CREDIT" ? transaction.amount : "0",
      },
      { value: transaction.driverBalance || "" },
    ]) || []),
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
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <Button className="bg-blue-600 text-white p-5 rounded-md shadow-md hover:bg-blue-700">
            View Bill
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-full w-auto">
          <DialogHeader>
            <DialogTitle className="font-bold text-2xl pb-5 border-b mb-5">
              Driver Bill
            </DialogTitle>
            <DialogDescription className="w-full overflow-auto">
              <div className="w-full overflow-x-auto">
                <Spreadsheet data={data} />
              </div>
              <DialogFooter className="justify-end border-t pt-10">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setOpen(false)}
                  >
                    Close
                  </Button>
                </DialogClose>
                <Button onClick={exportToExcel}>Download</Button>
              </DialogFooter>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DriverBillDialogComponent;
