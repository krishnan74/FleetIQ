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
import Link from "next/link";
import { TripStatus } from "@prisma/client";
import TripBillDialogComponent from "@/app/trips/components/TripBillDialogComponent";
import PODReceivedDialogComponent from "@/app/trips/components/PODReceivedDialogComponent";
import PODSubmittedDialogComponent from "@/app/trips/components/PODSubmittedDialogComponent";
import SettleTripDialogComponent from "@/app/trips/components/SettleTripDialogComponent";
import CompleteTripDialogComponent from "@/app/trips/components/CompleteTripDialogComponent";
import { useSession } from "next-auth/react";
import { PartyDetails, Trip } from "@/lib/interface";
import SettleOpeningBalance from "../../components/SettleOpeningBalance";

const Page = () => {
  const { data: session } = useSession();
  const [party, setParty] = useState<PartyDetails | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refresh, setRefresh] = useState(false);

  const [totalTrips, setTotalTrips] = useState(0);

  const router = useRouter();
  const pathname = usePathname();
  const currentTab = pathname.split("/")[2];

  const id = pathname.split("/")[3];

  const fetchPartyAndTrips = async () => {
    try {
      const partyResponse = await axios.get(
        `/api/party/${id}/?userId=${session?.user.id ? session?.user.id : ""}`
      );
      setParty(partyResponse.data.data);

      // Fetch all trips concurrently
      const tripRequests = partyResponse.data.data.trips.map((trip: Trip) =>
        axios.get(
          `/api/trip/${trip.id}/?userId=${
            session?.user.id ? session?.user.id : ""
          }`
        )
      );
      const tripResponses = await Promise.all(tripRequests);

      // Extract trip data
      const fetchedTrips = tripResponses.map((response) => response.data.data);
      setTrips(fetchedTrips);

      const activeTrips = partyResponse.data.data.trips.filter(
        (trip: Trip) => trip.status !== TripStatus.SETTLED
      ).length;

      setTotalTrips(activeTrips);
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
  }, [refresh]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <div className="flex gap-5 mb-5">
        <Link
          href={`/parties/trips/${id}`}
          className={`px-4 py-2 ${currentTab == "trips" ? "border-b" : " "}`}
        >
          Trips
        </Link>
        <Link
          href={`/parties/passbook/${id}`}
          className={`px-4 py-2 ${currentTab == "passbook" ? "border-b" : " "}`}
        >
          Passbook
        </Link>

        <Link
          href={`/parties/partyDetails/${id}`}
          className={`px-4 py-2 ${
            currentTab == "partyDetails" ? "border-b" : " "
          }`}
        >
          Party Details
        </Link>
      </div>

      <div className=" flex gap-5 mb-5">
        <div className="border rounded-md p-5">
          <p>
            Total Party Balance:{" "}
            <span className="text-blue-500 font-bold ml-3 ">
              ₹ {party?.totalBalance}
            </span>
          </p>
        </div>

        <div className="border rounded-md p-5">
          <p>
            Total Active Trips:{" "}
            <span className="text-blue-500 font-bold ml-3 ">{totalTrips}</span>
          </p>
        </div>
      </div>
      <Table className="min-w-full bg-white shadow-sm rounded-lg overflow-hidden">
        <TableCaption>A list of recent trips.</TableCaption>
        <TableHeader>
          <TableRow className="bg-blue-500 border-b border-blue-300 hover:bg-blue-500 ">
            <TableHead className="py-3 px-4 text-white  text-left">
              Start Date
            </TableHead>
            <TableHead className="py-3 px-4 text-white  text-left">
              Truck No
            </TableHead>
            <TableHead className="py-3 px-4 text-white  text-left">
              Route
            </TableHead>
            <TableHead className="py-3 px-4 text-white  text-left">
              Status
            </TableHead>
            <TableHead className="py-3 px-4 text-white  text-left">
              Party Balance
            </TableHead>
            <TableHead className="py-3 px-4 text-white  text-left">
              {" "}
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trips.map((trip) => (
            <TableRow
              key={trip.id}
              //onClick={redirectToDetails(trip.id)}
              className=" cursor-pointer"
            >
              <TableCell className="font-medium">
                {new Date(trip.createdAt).toDateString()}
              </TableCell>
              <TableCell className="font-medium">
                {trip.truck?.registrationNumber || "N/A"}
              </TableCell>
              <TableCell>{`${trip.from} To ${trip.to}`}</TableCell>
              <TableCell>{trip.status}</TableCell>
              <TableCell>₹ {trip.partyBalance}</TableCell>
              <TableCell>
                {(() => {
                  switch (trip.status) {
                    case TripStatus.PLANNED:
                      return (
                        <CompleteTripDialogComponent
                          refresh={refresh}
                          setRefresh={setRefresh}
                          tripId={trip.id}
                        />
                      );

                    case TripStatus.COMPLETED:
                      return (
                        <PODReceivedDialogComponent
                          refresh={refresh}
                          setRefresh={setRefresh}
                          tripId={trip.id}
                        />
                      );

                    case TripStatus.POD_RECEIVED:
                      return (
                        <PODSubmittedDialogComponent
                          refresh={refresh}
                          setRefresh={setRefresh}
                          tripId={trip.id}
                        />
                      );

                    case TripStatus.POD_SUBMITTED:
                      return (
                        <SettleTripDialogComponent
                          refresh={refresh}
                          setRefresh={setRefresh}
                          tripId={trip.id}
                        />
                      );

                    case TripStatus.SETTLED:
                      return (
                        <Button
                          disabled={true}
                          variant={"secondary"}
                          className="w-full border"
                        >
                          Amount Settled
                        </Button>
                      );
                  }
                })()}
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

          <TableRow>
            <TableCell className="font-medium">
              {party?.openingBalanceDate
                ? new Date(party.openingBalanceDate).toDateString()
                : ""}
            </TableCell>
            <TableCell className="font-medium">Opening Balance</TableCell>
            <TableCell>{"-"}</TableCell>
            <TableCell>{"-"}</TableCell>
            <TableCell>₹ {party?.openingBalance}</TableCell>
            <TableCell>
              {party?.openingBalance == 0 ? (
                <Button
                  disabled={true}
                  variant={"secondary"}
                  className="w-full border"
                >
                  Opening Balance Settled
                </Button>
              ) : (
                <SettleOpeningBalance
                  refresh={refresh}
                  setRefresh={setRefresh}
                  partyId={party?.id}
                />
              )}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default Page;
