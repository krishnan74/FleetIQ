"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { PartyInvoiceDetails, UserDetails } from "@/lib/interface";
import { Trip } from "@/lib/interface";
import axios from "axios";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";

const Page = () => {
  const pathname = usePathname();
  const id = pathname.split("/")[4];

  const [invoiceDetails, setInvoiceDetails] =
    useState<PartyInvoiceDetails | null>(null);

  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [tripDetails, setTripDetails] = useState<Trip | null>(null);

  const fetchInvoiceDetails = async () => {
    try {
      const response = await axios.get(`/api/invoice/party/${id}`);

      if (response.data.message === "success") {
        setInvoiceDetails(response.data.data);
        const invoiceResponse = await axios.get(
          `/api/trip/${response.data.data?.tripId}`
        );

        if (invoiceResponse.data.message === "success") {
          setTripDetails(invoiceResponse.data.data);
        }
      }
    } catch (error) {
      console.error("An error occurred while fetching invoice details", error);
    }
  };

  const fetchTripDetails = async () => {
    try {
    } catch (error) {
      console.error("An error occurred while fetching trip details", error);
    }
  };

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get("/api/user/1");

      if (response.data.message === "success") {
        console.log(response.data.data);
        setUserDetails(response.data.data);
      }
    } catch (error) {
      console.error("An error occurred while fetching user details", error);
    }
  };

  useEffect(() => {
    fetchInvoiceDetails();
    fetchUserDetails();
  }, []);

  return (
    <div className="p-4">
      {invoiceDetails ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border">
            <div className="col-span-2 flex flex-col border p-3">
              <p>{userDetails?.companyName}</p>
              <p>{userDetails?.doorNumber}</p>
              <p>{userDetails?.street}</p>
              <p>{userDetails?.city}</p>
              <p>{userDetails?.state}</p>
              <p>{userDetails?.zipCode}</p>
            </div>

            <div className="col-span-1 flex-col ">
              <div className="border p-3">
                <p>Invoice Number</p>
                <p>{invoiceDetails.invoiceNumber}</p>
              </div>
              <div className="border p-3">
                <p>Delivery Note</p>
                <p>{"Notes"}</p>
              </div>
              <div className="border p-3">
                <p>Reference No & Date</p>
                <p>{"Refer"}</p>
              </div>
            </div>

            <div className="col-span-1 flex-col">
              <div className="border p-3">
                <p>Date</p>
                <p>{invoiceDetails.invoiceDate}</p>
              </div>
              <div></div>
              <div className="border p-3">
                <p>Other References</p>
                <p>{""}</p>
              </div>
            </div>

            <div className="col-span-2 flex flex-col p-3 border">
              <h2>Party Details</h2>
              <p>
                <strong>Name:</strong> {invoiceDetails.party.name}
              </p>
              <p>
                <strong>Phone:</strong> {invoiceDetails.party.phone}
              </p>
              <p>
                <strong>Company Name:</strong>{" "}
                {invoiceDetails.party.companyName}
              </p>
              <p>
                <strong>GST Number:</strong> {invoiceDetails.party.gstNumber}
              </p>
              <p>
                <strong>PAN Number:</strong> {invoiceDetails.party.PANNumber}
              </p>
              <p>
                <strong>Opening Balance:</strong> $
                {invoiceDetails.party.openingBalance.toFixed(2)}
              </p>
              <p>
                <strong>Total Balance:</strong> $
                {invoiceDetails.party.totalBalance.toFixed(2)}
              </p>
              <p>
                <strong>Opening Balance Date:</strong>{" "}
                {invoiceDetails.party.openingBalanceDate}
              </p>
            </div>

            <div className="col-span-1 flex-col  border">
              <div className="border p-3">
                <p>Invoice Number</p>
                <p>{invoiceDetails.invoiceNumber}</p>
              </div>
              <div className="border p-3">
                <p>Delivery Note</p>
                <p>{"Notes"}</p>
              </div>
              <div className="border p-3">
                <p>Reference No & Date</p>
                <p>{"Refer"}</p>
              </div>
            </div>

            <div className="col-span-1 flex-col ">
              <div className="border p-3">
                <p>Date</p>
                <p>{invoiceDetails.invoiceDate}</p>
              </div>
              <div></div>
              <div className="border p-3">
                <p>Other References</p>
                <p>{""}</p>
              </div>
            </div>

            <div className="col-span-2 flex flex-col p-3 border">
              <h2>Party Details</h2>
              <p>
                <strong>Name:</strong> {invoiceDetails.party.name}
              </p>
              <p>
                <strong>Phone:</strong> {invoiceDetails.party.phone}
              </p>
              <p>
                <strong>Company Name:</strong>{" "}
                {invoiceDetails.party.companyName}
              </p>
              <p>
                <strong>GST Number:</strong> {invoiceDetails.party.gstNumber}
              </p>
              <p>
                <strong>PAN Number:</strong> {invoiceDetails.party.PANNumber}
              </p>
              <p>
                <strong>Opening Balance:</strong> $
                {invoiceDetails.party.openingBalance.toFixed(2)}
              </p>
              <p>
                <strong>Total Balance:</strong> $
                {invoiceDetails.party.totalBalance.toFixed(2)}
              </p>
              <p>
                <strong>Opening Balance Date:</strong>{" "}
                {invoiceDetails.party.openingBalanceDate}
              </p>
            </div>
          </div>

          <Table className="min-w-full bg-white shadow-sm text-black overflow-hidden mt-5">
            <TableHeader className="border">
              <TableRow className="">
                <TableHead className="py-3 px-4 text-left ">SI.No</TableHead>
                <TableHead className="py-3 px-4 text-left ">
                  Description of Goods
                </TableHead>
                <TableHead className="py-3 px-4 text-left ">Quantity</TableHead>
                <TableHead className="py-3 px-4 text-left ">Rate</TableHead>
                <TableHead className="py-3 px-4 text-left ">Per</TableHead>

                <TableHead className="py-3 px-4 text-left ">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="">
                <TableCell className="py-3 px-4">1</TableCell>
                <TableCell className="py-3 px-4">
                  {tripDetails?.material}
                </TableCell>
                <TableCell className="py-3 px-4">{1}</TableCell>
                <TableCell className="py-3 px-4">
                  {tripDetails?.partyFreightAmount}
                </TableCell>

                <TableCell className="py-3 px-4">
                  {tripDetails?.partyFreightAmount}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <div className="flex flex-col">
            <h2>Invoice Details</h2>
            <p>
              <strong>Invoice Number:</strong> {invoiceDetails.invoiceNumber}
            </p>
            <p>
              <strong>Invoice Date:</strong> {invoiceDetails.invoiceDate}
            </p>
            <p>
              <strong>Due Date:</strong> {invoiceDetails.dueDate}
            </p>
            <p>
              <strong>Amount:</strong> ${invoiceDetails.amount.toFixed(2)}
            </p>
            <p>
              <strong>Balance:</strong> ${invoiceDetails.balance.toFixed(2)}
            </p>
          </div>

          <Link
            href={`/api/invoice-pdf/party/${invoiceDetails.id}`}
            target="_blank"
          >
            <Button>Download</Button>
          </Link>
        </>
      ) : (
        <p>Loading invoice details...</p>
      )}
    </div>
  );
};

export default Page;
