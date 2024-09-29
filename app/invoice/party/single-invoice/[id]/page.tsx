"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { PartyInvoiceDetails, UserDetails } from "@/lib/interface";
import axios from "axios";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

const Page = () => {
  const pathname = usePathname();
  const id = pathname.split("/")[4];

  const [invoiceDetails, setInvoiceDetails] =
    useState<PartyInvoiceDetails | null>(null);

  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

  const fetchInvoiceDetails = async () => {
    try {
      const response = await axios.get(`/api/invoice/party/${id}`);

      if (response.data.message === "success") {
        setInvoiceDetails(response.data.data);
      }
    } catch (error) {
      console.error("An error occurred while fetching invoice details", error);
    }
  };

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get("/api/user/1");

      if (response.data.message === "success") {
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
      {invoiceDetails ? (
        <>
          <div className="grid grid-cols-4">
            <div className="col-span-2 flex flex-col">
              <p>{userDetails?.companyName}</p>
              <p>{userDetails?.doorNumber}</p>
              <p>{userDetails?.street}</p>
              <p>{userDetails?.city}</p>
              <p>{userDetails?.state}</p>
              <p>{userDetails?.zipCode}</p>
            </div>

            <div className="col-span-1 flex-col">
              <div>
                <p>Invoice Number</p>
                <p>{invoiceDetails.invoiceNumber}</p>
              </div>
              <div>
                <p>Delivery Note</p>
                <p>{"Notes"}</p>
              </div>
              <div>
                <p>Reference No & Date</p>
                <p>{"Refer"}</p>
              </div>
            </div>

            <div className="col-span-1 flex-col">
              <div>
                <p>Date</p>
                <p>{invoiceDetails.invoiceDate}</p>
              </div>
              <div></div>
              <div>
                <p>Other References</p>
                <p>{""}</p>
              </div>
            </div>

            <div className="col-span-2 flex flex-col">
              <p>{invoiceDetails?.party.companyName}</p>
              <p>GSTIN/UIN{invoiceDetails?.party.gstNumber}</p>
              <p>PAN{invoiceDetails?.party.PANNumber}</p>
            </div>

            <div className="col-span-1 flex-col">
              <div>
                <p>Invoice Number</p>
                <p>{invoiceDetails.invoiceNumber}</p>
              </div>
              <div>
                <p>Delivery Note</p>
                <p>{"Notes"}</p>
              </div>
              <div>
                <p>Reference No & Date</p>
                <p>{"Refer"}</p>
              </div>
            </div>

            <div className="col-span-1 flex-col">
              <div>
                <p>Date</p>
                <p>{invoiceDetails.invoiceDate}</p>
              </div>
              <div></div>
              <div>
                <p>Other References</p>
                <p>{""}</p>
              </div>
            </div>
          </div>

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
          <div className="flex flex-col">
            <h2>Party Details</h2>
            <p>
              <strong>Name:</strong> {invoiceDetails.party.name}
            </p>
            <p>
              <strong>Phone:</strong> {invoiceDetails.party.phone}
            </p>
            <p>
              <strong>Company Name:</strong> {invoiceDetails.party.companyName}
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
