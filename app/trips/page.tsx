"use client";
import React, { use, useEffect, useState } from "react";
import axios from "axios";

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
import { CiSearch } from "react-icons/ci";
import { Button } from "@/components/ui/button";

interface Truck {
  id: string;
  registrationNumber: string;
  truckType: string;
  truckOwnerShip: string;
  driverId: string;
  vendorId: string;
  status: string;
}

interface PartyDetails {
  id: string;
  name: string;
  phone: string;
  openingBalance: number;
  openingBalanceDate: string;
}

interface Trip {
  id: string;
  status: string;
  vendorId: string;
  partyId: string;
  driverId: string;
  truckId: string;
  createdAt: string;
  from: string;
  to: string;
  updatedAt: string;
  party: PartyDetails;
  truck: Truck; // Ensure truck can be null or undefined
}

const Page = () => {
  const [trips, setTrips] = useState<Trip[]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const router = useRouter();

  const searchTrips = async (search: string) => {
    //console.log("Searching parties with", search);
    try {
      if (search.trim() === "") {
        await fetchTrips(); // Fetch all parties if search is empty
      } else {
        const filteredTrips = trips?.filter(
          (trip) =>
            trip.from.toLowerCase().includes(search.toLowerCase()) ||
            trip.to.toLowerCase().includes(search.toLowerCase()) ||
            trip.party.name.toLowerCase().includes(search.toLowerCase())
        );
        setTrips(filteredTrips);
      }
    } catch (error) {
      setError("An error occurred while fetching parties");
    } finally {
      setLoading(false);
    }
  };

  const fetchTrips = async () => {
    try {
      const response = await axios.get("/api/trip");
      if (response.data.message === "success") {
        setTrips(response.data.data);
      } else {
        setError("Failed to fetch trips");
      }
    } catch (error) {
      setError("An error occurred while fetching trips");
    } finally {
      setLoading(false);
    }
  };

  const redirectToDetails = (id: string) => () => {
    router.push(`/trips/${id}`);
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  useEffect(() => {
    searchTrips(search);
  }, [search]);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <>
      <div>
        <div className="relative">
          <CiSearch className="absolute top-3 left-3" />
          <input
            type="text"
            placeholder="Search trip"
            className="border py-2 pl-9 rounded-md w-full mb-5"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
        </div>
        <Table className="min-w-full bg-white shadow-sm rounded-lg overflow-hidden">
          <TableCaption className="">A list of your recent trips.</TableCaption>
          <TableHeader>
            <TableRow className="bg-blue-500 border-b border-blue-300 hover:bg-blue-500">
              <TableHead className="py-3 px-4 text-white  text-left">
                Start Date
              </TableHead>
              <TableHead className="py-3 px-4 text-left text-white ">
                Party Name
              </TableHead>
              <TableHead className="py-3 px-4 text-left text-white ">
                Truck No
              </TableHead>
              <TableHead className="py-3 px-4 text-left text-white ">
                Route
              </TableHead>
              <TableHead className="py-3 px-4 text-left text-white ">
                Trip Status
              </TableHead>
              <TableHead className="py-3 px-4 text-right text-white ">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trips?.map((trip) => (
              <TableRow
                key={trip.id}
                onClick={redirectToDetails(trip.id)}
                className="cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <TableCell className="py-3 px-4 font-medium">
                  {new Date(trip.createdAt).toDateString()}
                </TableCell>
                <TableCell className="py-3 px-4">{trip.party.name}</TableCell>
                <TableCell className="py-3 px-4">
                  {trip.truck.registrationNumber}
                </TableCell>
                <TableCell className="py-3 px-4 font-medium">
                  {`${trip.from} To ${trip.to}`}
                </TableCell>
                <TableCell className="py-3 px-4 font-medium">
                  {trip.status}
                </TableCell>
                <TableCell className="py-3 px-4 text-right">
                  <Button
                    onClick={redirectToDetails(trip.id)}
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
    </>
  );
};

export default Page;
