"use client";
import React, { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import { PiLineVerticalThin } from "react-icons/pi";
import axios from "axios";
import { AvatarComponent } from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import AppPartyDialogComponent from "./components/AddTripDialogComponent";
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
  const [trips, setTrips] = useState<Trip[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

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
    router.push(`/${id}`);
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="flex flex-col p-8 bg-gray-50 w-full max-w-7xl mx-auto rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-8">
        <p className="text-2xl font-bold text-gray-800">
          Trips <br />
          <span className="text-base font-normal text-gray-500">
            10th July 2024
          </span>
        </p>
        <div className="flex items-center space-x-4">
          <AppPartyDialogComponent />
          <FaBell className="text-2xl text-gray-700 hover:text-gray-900 transition-colors" />
          <PiLineVerticalThin className="text-2xl text-gray-700 hover:text-gray-900 transition-colors" />
          <AvatarComponent />
          <p className="font-bold text-lg text-gray-800">Rajesh Kumar</p>
        </div>
      </div>

      <div>
        <Table className="min-w-full bg-white shadow-sm rounded-lg overflow-hidden">
          <TableCaption className="text-gray-600">
            A list of your recent trips.
          </TableCaption>
          <TableHeader>
            <TableRow className="bg-gray-100 text-gray-600 border-b border-gray-300">
              <TableHead className="py-3 px-4 text-left">Start Date</TableHead>
              <TableHead className="py-3 px-4 text-left">Party Name</TableHead>
              <TableHead className="py-3 px-4 text-left">Truck No</TableHead>
              <TableHead className="py-3 px-4 text-left">Route</TableHead>
              <TableHead className="py-3 px-4 text-left">Trip Status</TableHead>
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
                  {`${trip.from} ==> ${trip.to}`}
                </TableCell>
                <TableCell className="py-3 px-4 font-medium">
                  {trip.status}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Page;
