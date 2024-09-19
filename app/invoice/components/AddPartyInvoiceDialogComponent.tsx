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

import { CiSearch } from "react-icons/ci";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHeader,
  TableRow,
  TableHead,
} from "@/components/ui/table";

import axios from "axios";

import { Button } from "@/components/ui/button";
import { PartyDetails } from "@/lib/interface";
import InvoiceTripDialogComponent from "./InvoiceTripDialogComponent";

const AddPartyInvoiceDialogComponent = () => {
  const [open, setOpen] = useState(false);
  const [parties, setParties] = useState<PartyDetails[]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const searchParties = async (search: string) => {
    //console.log("Searching parties with", search);
    try {
      if (search.trim() === "") {
        await fetchParties(); // Fetch all parties if search is empty
      } else {
        const filteredParties = parties?.filter((party) =>
          party.name.toLowerCase().includes(search.toLowerCase())
        );
        setParties(filteredParties);
      }
    } catch (error) {
      setError("An error occurred while fetching parties");
    } finally {
      setLoading(false);
    }
  };

  const fetchParties = async () => {
    try {
      const response = await axios.get(`/api/party/`);
      if (response.data.message === "success") {
        setParties(response.data.data);
      } else {
        setError("Failed to fetch parties");
      }
    } catch (error) {
      setError("An error occurred while fetching parties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParties();
  }, []);

  useEffect(() => {
    searchParties(search);
  }, [search]);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="w-full">
          <Button
            className={` bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700`}
          >
            Add Party Invoice
          </Button>
        </DialogTrigger>
        <DialogContent className="w-full max-w-3xl bg-gray-50 p-8 rounded-lg shadow-xl ">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold pb-5 border-b mb-5 text-center text-gray-700">
              Select Party
            </DialogTitle>
            <DialogDescription
              className="w-full h-[80vh] overflow-y-auto space-y-6"
              id="report-content"
            >
              <div>
                <div className="relative">
                  <CiSearch className="absolute top-3 left-3" />
                  <input
                    type="text"
                    placeholder="Search party by name"
                    className="border py-2 pl-9 rounded-md w-full mb-5"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                    }}
                  />
                </div>
                <Table className="min-w-full bg-white shadow-sm rounded-lg overflow-hidden">
                  <TableHeader>
                    <TableRow className="bg-blue-500 border-b border-blue-300 hover:bg-blue-500">
                      <TableHead className="py-3 px-4 text-left  text-white">
                        Name
                      </TableHead>

                      <TableHead className="py-3 px-4 text-right  text-white">
                        Party Balance
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parties?.map((party) => (
                      <InvoiceTripDialogComponent
                        key={party.id}
                        trips={party.trips}
                        name={party.name}
                        totalBalance={party.totalBalance}
                        partyId={party.id}
                      />
                    ))}
                  </TableBody>
                </Table>
              </div>

              <DialogFooter className="flex justify-end border-t pt-10 space-x-4">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      //console.log("Dialog closed");
                      setOpen(false);
                    }}
                  >
                    Close
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddPartyInvoiceDialogComponent;
