"use client";
import React, { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import { PiLineVerticalThin } from "react-icons/pi";
import axios from "axios";
import { AvatarComponent } from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import AppPartyDialogComponent from "./components/AddPartyDialogComponent";
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

interface PartyDetails {
  id: string;
  name: string;
  phone: string;
  openingBalance: number;
  openingBalanceDate: string;
}

const Page = () => {
  const [parties, setParties] = useState<PartyDetails[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const fetchParties = async () => {
    try {
      const response = await axios.get("/api/party");
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

  const redirectToDetails = (id: string) => () => {
    router.push(`/parties/trips/${id}`);
  };

  useEffect(() => {
    fetchParties();
  }, []);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div>
      <Table className="min-w-full bg-white shadow-sm rounded-lg overflow-hidden">
        <TableCaption className="text-gray-600">
          A list of your recent parties.
        </TableCaption>
        <TableHeader>
          <TableRow className="bg-gray-100 text-gray-600 border-b border-gray-300">
            <TableHead className="py-3 px-4 text-left">Name</TableHead>
            <TableHead className="py-3 px-4 text-left">Phone</TableHead>
            <TableHead className="py-3 px-4 text-left">
              Opening Balance Date
            </TableHead>
            <TableHead className="py-3 px-4 text-right">
              Opening Balance
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {parties?.map((party) => (
            <TableRow
              key={party.id}
              onClick={redirectToDetails(party.id)}
              className="cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <TableCell className="py-3 px-4 font-medium">
                {party.name}
              </TableCell>
              <TableCell className="py-3 px-4">{party.phone}</TableCell>
              <TableCell className="py-3 px-4">
                {new Date(party.openingBalanceDate).toDateString()}
              </TableCell>
              <TableCell className="py-3 px-4 text-right font-medium">
                {party.openingBalance.toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Page;
