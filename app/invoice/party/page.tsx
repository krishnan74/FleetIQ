"use client";
import React, { useEffect, useState } from "react";

import axios from "axios";

import { CiSearch } from "react-icons/ci";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHeader,
  TableRow,
  TableHead,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { PartyInvoiceDetails } from "@/lib/interface";
import AddPartyInvoiceDialogComponent from "../components/AddPartyInvoiceDialogComponent";

const Page = () => {
  const [invoices, setInvoices] = useState<PartyInvoiceDetails[]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalInvoices, setTotalInvoices] = useState(0);
  const [paidInvoices, setPaidInvoices] = useState(0);

  const [unpaidInvoices, setUnpaidInvoices] = useState(0);

  const [search, setSearch] = useState("");

  const router = useRouter();

  const searchInvoices = async (search: string) => {
    //console.log("Searching invoices with", search);
    try {
      if (search.trim() === "") {
        await fetchInvoices(); // Fetch all invoices if search is empty
      } else {
        const filteredInvoices = invoices?.filter((invoice) =>
          invoice.invoiceNumber.toLowerCase().includes(search.toLowerCase())
        );
        setInvoices(filteredInvoices);
      }
    } catch (error) {
      setError("An error occurred while fetching invoices");
    } finally {
      setLoading(false);
    }
  };

  const fetchInvoices = async () => {
    try {
      const response = await axios.get(`/api/invoice/party/`);
      if (response.data.message === "success") {
        setInvoices(response.data.data);
        const totalInvoice = response.data.data.length;

        setTotalInvoices(totalInvoice);
      } else {
        setError("Failed to fetch invoices");
      }
    } catch (error) {
      setError("An error occurred while fetching invoices");
    } finally {
      setLoading(false);
    }
  };

  const redirectToDetails = (id: string) => () => {
    router.push(`/invoice/party/single-invoice/${id}`);
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  useEffect(() => {
    searchInvoices(search);
  }, [search]);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div>
      <div className="flex justify-between mb-5 items-center">
        <div className="flex gap-x-5">
          <p className="border p-5 rounded-md">
            All Invoices :{" "}
            <span className="text-blue-500 font-bold ml-3">
              {totalInvoices}
            </span>
          </p>
          <p className="border p-5 rounded-md">
            Paid Invoices:{" "}
            <span className="text-blue-500 font-bold ml-3">{paidInvoices}</span>
          </p>
          <p className="border p-5 rounded-md">
            UnPaid Invoices:{" "}
            <span className="text-blue-500 font-bold ml-3">
              {unpaidInvoices}
            </span>
          </p>
        </div>
        <AddPartyInvoiceDialogComponent />
      </div>

      <div className="relative">
        <CiSearch className="absolute top-3 left-3" />
        <input
          type="text"
          placeholder="Search invoice by name"
          className="border py-2 pl-9 rounded-md w-full mb-5"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
      </div>
      <Table className="min-w-full bg-white shadow-sm rounded-lg overflow-hidden">
        <TableCaption className="text-gray-600">
          A list of your recent invoices.
        </TableCaption>
        <TableHeader>
          <TableRow className="bg-blue-500 border-b border-blue-300 hover:bg-blue-500">
            <TableHead className="py-3 px-4 text-left  text-white">
              Invoice Date{" "}
            </TableHead>
            <TableHead className="py-3 px-4 text-left  text-white">
              Invoice Number{" "}
            </TableHead>
            <TableHead className="py-3 px-4 text-left text-white">
              Party{" "}
            </TableHead>
            <TableHead className="py-3 px-4 text-left  text-white">
              Due Status{" "}
            </TableHead>
            <TableHead className="py-3 px-4 text-left  text-white">
              Invoice Amount{" "}
            </TableHead>
            <TableHead className="py-3 px-4 text-right  text-white">
              Balance{" "}
            </TableHead>
            <TableHead className="py-3 px-4 text-right  text-white">
              Actions{" "}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices?.map((invoice) => (
            <TableRow
              key={invoice.id}
              className="cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <TableCell className="py-3 px-4 font-medium">
                {new Date(invoice.invoiceDate).toDateString()}
              </TableCell>
              <TableCell className="py-3 px-4">
                INV - {invoice.invoiceNumber + 1}
              </TableCell>
              <TableCell className="py-3 px-4">
                {invoice?.party?.name}
              </TableCell>
              <TableCell className="py-3 px-4 ">
                {new Date(invoice.dueDate).toDateString()}
              </TableCell>
              <TableCell className="py-3 px-4 text-right font-medium">
                {invoice.amount.toFixed(2)}
              </TableCell>
              <TableCell className="py-3 px-4 text-right font-medium">
                {invoice.balance.toFixed(2)}
              </TableCell>
              <TableCell className="py-3 px-4 text-right">
                <Button
                  onClick={redirectToDetails(invoice.id)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700"
                >
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Page;
