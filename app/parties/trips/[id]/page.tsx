"use client";
import React, { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import { PiLineVerticalThin } from "react-icons/pi";
import axios from "axios";
import { AvatarComponent } from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import AppPartyDialogComponent from "../../components/AddPartyDialogComponent";
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
import { usePathname } from "next/navigation";

interface Truck {
  id: string;
  registrationNumber: string;
  truckType: string;
  truckOwnerShip: string;
  driverId: string;
  vendorId: string;
  status: string;
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
  truck: Truck | null; // Ensure truck can be null or undefined
}

interface PartyDetails {
  id: string;
  name: string;
  phone: string;
  openingBalance: number;
  openingBalanceDate: string;
  gstNumber: string;
  PANNumber: string;
  companyName: string;
  trips: Trip[];
}

const Page = () => {
  const [party, setParty] = useState<PartyDetails | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const pathname = usePathname();

  const id = pathname.split("/")[3];

  const fetchPartyAndTrips = async () => {
    try {
      const partyResponse = await axios.get(`/api/party/${id}`);
      setParty(partyResponse.data.data);

      // Fetch all trips concurrently
      const tripRequests = partyResponse.data.data.trips.map((trip: Trip) =>
        axios.get(`/api/trip/${trip.id}`)
      );
      const tripResponses = await Promise.all(tripRequests);

      // Extract trip data
      const fetchedTrips = tripResponses.map((response) => response.data.data);
      setTrips(fetchedTrips);
    } catch (error) {
      setError("An error occurred while fetching data");
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const redirectToDetails = (id: string) => () => {
    router.push(`/trips/${id}`);
  };

  useEffect(() => {
    fetchPartyAndTrips();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="flex flex-col p-8 bg-white w-full rounded-3xl">
      <div className="flex justify-between items-center mb-8">
        <p className="text-2xl font-bold">
          Parties <br />
          <span className="text-base font-normal text-[#666]">
            10th July 2024
          </span>
        </p>
        <div className="flex items-center">
          <AppPartyDialogComponent />
          <FaBell className="text-2xl ml-8" />
          <PiLineVerticalThin className="text-2xl ml-4 mr-3" />
          <AvatarComponent />
          <p className="font-bold text-lg ml-4">Rajesh Kumar</p>
        </div>
      </div>

      <div>
        <Table>
          <TableCaption>A list of recent trips.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Start Date</TableHead>
              <TableHead>Truck No</TableHead>
              <TableHead>Route</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trips.map((trip) => (
              <TableRow key={trip.id} onClick={redirectToDetails(trip.id)}>
                <TableCell className="font-medium">
                  {new Date(trip.createdAt).toDateString()}
                </TableCell>
                <TableCell className="font-medium">
                  {trip.truck?.registrationNumber || "N/A"}
                </TableCell>
                <TableCell>{`${trip.from} ==> ${trip.to}`}</TableCell>
                <TableCell>{trip.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Page;
