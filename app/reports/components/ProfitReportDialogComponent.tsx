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
import { Trip, TripTransaction } from "@/lib/interface";

const TripBillDialogComponent = () => {
  const pathname = usePathname();
  const id = pathname.split("/")[2];
  const [open, setOpen] = useState(false);
  const [trip, setTrip] = useState<Trip | undefined>(undefined);
  const [advances, setAdvances] = useState<TripTransaction[]>([]);
  const [charges, setCharges] = useState<TripTransaction[]>([]);
  const [payments, setPayments] = useState<TripTransaction[]>([]);

  const fileName = "Profit & Loss Bill";

  const fetchData = async () => {
    try {
      const response = await axios.get(`/api/trip/${id}`);
      if (response.data.message === "success") {
        setTrip(response.data.data);
        const advances = response.data.data.transactions.filter(
          (transaction: TripTransaction) =>
            transaction.tripTransactionType === "ADVANCE"
        );

        setAdvances(advances);
        const charges = response.data.data.transactions.filter(
          (transaction: TripTransaction) =>
            transaction.tripTransactionType === "CHARGE"
        );

        setCharges(charges);

        const payments = response.data.data.transactions.filter(
          (transaction: TripTransaction) =>
            transaction.tripTransactionType === "PAYMENT"
        );

        setPayments(payments);
      }
    } catch (error) {
      console.error("An error occurred while fetching data", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [open]);

  const data = [
    [
      {
        value: "Overall Profit for August",
      },
      {
        value: "",
      },
      {
        value:
      }
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
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="w-full">
          <Button
            onClick={() => setOpen(true)}
            variant={"default"}
            className="w-full border"
          >
            View Bill
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-full w-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold pb-5 border-b mb-5">
              Trip Bill
            </DialogTitle>
            <DialogDescription className="w-full overflow-auto">
              <div className="w-full overflow-x-auto">
                <Spreadsheet data={data} />
              </div>
              <DialogFooter className="flex justify-end border-t pt-10 space-x-4">
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

export default TripBillDialogComponent;
