"use client";
import React, { useState, useEffect } from "react";

import { usePathname } from "next/navigation";
import axios from "axios";
import { DriverDetails } from "@/lib/interface";
import DriverBillDialogComponent from "../components/DriverBillDialogComponent";
import DriverGaveTransactionDialogComponent from "../components/DriverGaveTransactionDialogComponent";
import DriverGotTransactionDialogComponent from "../components/DriverGotTransactionDialogComponent";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHeader,
  TableRow,
  TableHead,
} from "@/components/ui/table";

const Page = () => {
  const [driverDetails, setDriverDetails] = useState<DriverDetails>();
  const pathname = usePathname();
  const id = pathname.split("/")[2];

  const fetchDriver = async () => {
    try {
      const response = await axios.get(`/api/driver/${id}`);
      if (response.data.message === "success") {
        console.log(response.data.data);
        setDriverDetails(response.data.data);
      }
    } catch (error) {
      console.error("An error occurred while fetching data", error);
    }
  };

  useEffect(() => {
    fetchDriver();
  }, []);

  return driverDetails ? (
    <div>
      <div className="flex justify-between items-center mb-5">
        <div className="flex gap-5 items-center">
          <div className="p-5 border rounded-md">
            <p>
              Driver Name:
              <span className="text-blue-500 font-bold ml-5">
                {driverDetails.name}
              </span>
            </p>
          </div>

          <div className="p-5 border rounded-md">
            <p>
              Total Balance:
              <span className="text-blue-500 font-bold ml-5">
                ₹ {driverDetails.balance}
              </span>
            </p>
          </div>
          <DriverBillDialogComponent />
        </div>
        <div className="flex gap-x-5">
          <DriverGaveTransactionDialogComponent />
          <DriverGotTransactionDialogComponent />
        </div>
      </div>

      <Table className="min-w-full bg-white shadow-sm rounded-lg overflow-hidden">
        <TableCaption className="text-gray-600">
          A list of recent driver transactions.
        </TableCaption>
        <TableHeader>
          <TableRow className="bg-blue-500 border-b border-blue-300 hover:bg-blue-500">
            <TableHead className="py-3 px-4 text-left text-white">
              Date
            </TableHead>
            <TableHead className="py-3 px-4 text-left text-white">
              Reason
            </TableHead>
            <TableHead className="py-3 px-4 text-left text-white">
              Driver Gave
            </TableHead>
            <TableHead className="py-3 px-4 text-left text-white">
              Driver Got
            </TableHead>
            <TableHead className="py-3 px-4 text-left text-white">
              Driver Balance
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {driverDetails?.transactions.map((transaction) => (
            <TableRow
              key={transaction.id}
              className="cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <TableCell className="py-3 px-4">
                {new Date(transaction.transactionDate)
                  .toDateString()
                  .substring(4)}
              </TableCell>

              <TableCell className="py-3 px-4 font-medium">
                {transaction.transactionDescription}
              </TableCell>

              {transaction.transactionType === "DEBIT" ? (
                <>
                  <TableCell className="py-3 px-4 font-medium text-red-500">
                    - ₹ {transaction.amount}
                  </TableCell>

                  <TableCell className="py-3 px-4 font-medium text-green-500">
                    0
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell className="py-3 px-4 font-medium text-red-500">
                    0
                  </TableCell>

                  <TableCell className="py-3 px-4 font-medium text-green-500">
                    + ₹ {transaction.amount}
                  </TableCell>
                </>
              )}

              <TableCell className="py-3 px-4 font-medium">
                ₹ {transaction.driverBalance}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ) : (
    <div>Loading....</div>
  );
};

export default Page;
