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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Spreadsheet from "react-spreadsheet";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Trip, TripTransaction } from "@/lib/interface";

const months = [
  { value: "0", label: "January" },
  { value: "1", label: "February" },
  { value: "2", label: "March" },
  { value: "3", label: "April" },
  { value: "4", label: "May" },
  { value: "5", label: "June" },
  { value: "6", label: "July" },
  { value: "7", label: "August" },
  { value: "8", label: "September" },
  { value: "9", label: "October" },
  { value: "10", label: "November" },
  { value: "11", label: "December" },
];

const ProfitReportDialogComponent = () => {
  const [open, setOpen] = useState(false);
  const [trip, setTrip] = useState<Trip[] | undefined>(undefined);
  const [currentMonth, setCurrentMonth] = useState("");
  const [overAllProfit, setOverAllProfit] = useState(0);
  const [noOfTrips, setNoOfTrips] = useState(0);
  const [advances, setAdvances] = useState<TripTransaction[]>([]);
  const [charges, setCharges] = useState<TripTransaction[]>([]);
  const [payments, setPayments] = useState<TripTransaction[]>([]);

  const fileName = "Profit & Loss Bill";

  const fetchData = async () => {
    try {
      const response = await axios.get("/api/trip");

      if (response.data.message === "success") {
        console.log(response.data.data);

        const currentMonthTrips = response.data.data.filter(
          (trip: Trip) =>
            new Date(trip.startedAt).getMonth().toString() === currentMonth
        );

        const profit = currentMonthTrips.reduce((acc: number, curr: Trip) => {
          acc += curr.profit;
          return acc;
        }, 0);

        setOverAllProfit(profit);

        const noOfTrips = currentMonthTrips.length;

        setNoOfTrips(noOfTrips);
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
    if (open) fetchData();
  }, [open, currentMonth]);

  const data = [
    [
      {
        value: `Overall Profit for ${
          months.find((month) => month.value === currentMonth)?.label
        }`,
      },
      {
        value: "",
      },
      {
        value: overAllProfit,
      },
    ],
    [
      {
        value: `No of Trips started in ${
          months.find((month) => month.value === currentMonth)?.label
        }`,
      },
      {
        value: "",
      },
      {
        value: noOfTrips,
      },
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
          <div onClick={() => setOpen(true)} className="flex gap-5 p-5 border">
            <img src={"/"} height={50} width={50} alt="" />
            <p>Profit & Loss Report </p>
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-full w-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold pb-5 border-b mb-5">
              Profit & Loss Report
            </DialogTitle>
            <DialogDescription className="w-full overflow-auto">
              <Select
                value={currentMonth}
                onValueChange={(value) => setCurrentMonth(value)}
              >
                <SelectTrigger className="w-full mt-2 bg-gray-100 border border-gray-300 rounded-md px-3 py-2">
                  <SelectValue placeholder="Select a month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {months.map((month) => (
                      <SelectItem key={month.value} value={month.value}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

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

export default ProfitReportDialogComponent;
