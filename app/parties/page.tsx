"use client";
import React, { use, useEffect, useState } from "react";

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
import { PartyDetails } from "@/lib/interface";
import { TripStatus } from "@prisma/client";
import { useSession } from "next-auth/react";

const Page = () => {
  const { data: session } = useSession();
  const [parties, setParties] = useState<PartyDetails[]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPartiesBalance, setTotalPartiesBalance] = useState(0);
  const [totalTrips, setTotalTrips] = useState(0);
  const [search, setSearch] = useState("");

  const router = useRouter();

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
      const response = await axios.get(
        `/api/party/?userId=${session?.user.id ? session?.user.id : ""}`
      );
      if (response.data.message === "success") {
        setParties(response.data.data);
        const totalBalance = response.data.data.reduce(
          (acc: number, party: PartyDetails) => acc + party.totalBalance,
          0
        );

        const totalTrips = response.data.data.reduce(
          (acc: number, party: PartyDetails) => {
            const activeTrips = party.trips.filter(
              (trip) => trip.status !== TripStatus.SETTLED
            ).length;
            return acc + activeTrips;
          },
          0
        );

        setTotalTrips(totalTrips);

        setTotalPartiesBalance(totalBalance);
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

  useEffect(() => {
    searchParties(search);
  }, [search]);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div>
      <div className="flex gap-x-5 mb-5">
        <p className="border p-5 rounded-md">
          Total Party Balance :{" "}
          <span className="text-blue-500 font-bold ml-3">
            ₹ {totalPartiesBalance}
          </span>
        </p>
        <p className="border p-5 rounded-md">
          Total Active Trips:{" "}
          <span className="text-blue-500 font-bold ml-3">{totalTrips}</span>
        </p>
      </div>

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
        <TableCaption className="text-gray-600">
          A list of your recent parties.
        </TableCaption>
        <TableHeader>
          <TableRow className="bg-blue-500 border-b border-blue-300 hover:bg-blue-500">
            <TableHead className="py-3 px-4 text-left  text-white">
              Name
            </TableHead>
            <TableHead className="py-3 px-4 text-left  text-white">
              Phone
            </TableHead>
            <TableHead className="py-3 px-4 text-left text-white">
              Opening Balance Date
            </TableHead>
            <TableHead className="py-3 px-4 text-left  text-white">
              Active Trip Count
            </TableHead>
            <TableHead className="py-3 px-4 text-left  text-white">
              Party Balance
            </TableHead>
            <TableHead className="py-3 px-4 text-right  text-white">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {parties?.map((party) => (
            <TableRow
              key={party.id}
              className="cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <TableCell className="py-3 px-4 font-medium">
                {party.name}
              </TableCell>
              <TableCell className="py-3 px-4">{party.phone}</TableCell>
              <TableCell className="py-3 px-4">
                {new Date(party.openingBalanceDate).toDateString().substring(3)}
              </TableCell>
              <TableCell className="py-3 px-4 ">
                {
                  party.trips.filter(
                    (trip) => trip.status !== TripStatus.COMPLETED
                  ).length
                }
              </TableCell>
              <TableCell className="py-3 px-4 text-right font-medium">
                {party.totalBalance.toFixed(2)}
              </TableCell>
              <TableCell className="py-3 px-4 text-right">
                <Button
                  onClick={redirectToDetails(party.id)}
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
