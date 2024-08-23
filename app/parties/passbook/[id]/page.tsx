"use client";
import React, { useEffect, useState } from "react";

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
import { usePathname } from "next/navigation";
import Link from "next/link";
import { PartyDetails, Trip, TripTransaction } from "@/lib/interface";

const Page = () => {
  const [party, setParty] = useState<PartyDetails | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [totalRevenue, setTotalRevenue] = useState(0);
  const [tripPayments, setTripPayments] = useState(0);

  const router = useRouter();
  const pathname = usePathname();
  const currentTab = pathname.split("/")[2];

  const id = pathname.split("/")[3];

  const fetchPartyAndTrips = async () => {
    try {
      const partyResponse = await axios.get(`/api/party/${id}/`);
      setParty(partyResponse.data.data);

      // Fetch all trips concurrently
      const tripRequests = partyResponse.data.data.trips.map((trip: Trip) =>
        axios.get(`/api/trip/${trip.id}/`)
      );
      const tripResponses = await Promise.all(tripRequests);

      // Extract trip data
      const fetchedTrips = tripResponses.map((response) => response.data.data);
      setTrips(fetchedTrips);

      // Fetch all transactions concurrently
      const partyTransactions = fetchedTrips.map(
        (trip: Trip) => trip.transactions
      );

      const tripPayments = partyTransactions.reduce(
        (acc: number, transactions: TripTransaction[]) =>
          acc +
          transactions.reduce(
            (acc: number, transaction: TripTransaction) =>
              transaction.tripTransactionType == "PAYMENT" || "ADVANCE"
                ? acc + transaction.amount
                : acc,
            0
          ),
        0
      );

      setTripPayments(tripPayments);

      console.log("Party transactions:", partyTransactions);

      const totalRevenue = fetchedTrips.reduce(
        (acc: number, trip: Trip) => acc + trip.partyFreightAmount,
        0
      );

      setTotalRevenue(totalRevenue);
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
  }, []);

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
            Total Revenue:{" "}
            <span className="text-blue-500 font-bold ml-3 ">
              ₹ {totalRevenue}
            </span>
          </p>
        </div>

        <div className="border rounded-md p-5">
          <p>
            Trip Payments:{" "}
            <span className="text-blue-500 font-bold ml-3 ">
              ₹ {tripPayments}
            </span>
          </p>
        </div>
      </div>
      <Table className="min-w-full bg-white shadow-sm rounded-lg overflow-hidden">
        <TableCaption>A list of recent transactions.</TableCaption>
        <TableHeader>
          <TableRow className="bg-blue-500 border-b border-blue-300 hover:bg-blue-500">
            <TableHead className="py-3 px-4 text-white  text-left">
              Date
            </TableHead>
            <TableHead className="py-3 px-4 text-white  text-left">
              Trip Details
            </TableHead>
            <TableHead className="py-3 px-4 text-white  text-left">
              Payment
            </TableHead>
            <TableHead className="py-3 px-4 text-white  text-left">
              Revenue
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trips.map((trip) => (
            <>
              {trip.transactions
                .slice() // Create a copy to avoid mutating the original array
                .sort(
                  (a, b) =>
                    Number(new Date(b.transactionDate)) -
                    Number(new Date(a.transactionDate))
                )
                .map((transaction) => (
                  <TableRow
                    key={transaction.id}
                    className="cursor-pointer"
                    // onClick={redirectToDetails(transaction.id)}
                  >
                    <TableCell className="font-medium">
                      {new Date(transaction.transactionDate)
                        .toDateString()
                        .substring(4)}
                    </TableCell>

                    <TableCell className="font-medium">
                      {(() => {
                        let transactionTypeLabel;

                        switch (transaction.tripTransactionType) {
                          case "ADVANCE":
                            transactionTypeLabel = <span>Trip Advance</span>;
                            break;
                          case "PAYMENT":
                            transactionTypeLabel = <span>Trip Payment</span>;
                            break;
                          case "SETTLEMENT":
                            transactionTypeLabel = (
                              <span>Opening Balance Settlement</span>
                            );
                            break;
                          default:
                            transactionTypeLabel = (
                              <span>Unknown Transaction</span>
                            );
                        }

                        return transactionTypeLabel;
                      })()}
                    </TableCell>

                    <TableCell>₹ {transaction.amount}</TableCell>
                    <TableCell>{"-"}</TableCell>
                  </TableRow>
                ))}

              <TableRow
                key={trip.id}
                className="cursor-pointer"
                // onClick={redirectToDetails(trip.id)}
              >
                <TableCell className="font-medium">
                  {new Date(trip.createdAt).toDateString().substring(4)}
                </TableCell>
                <TableCell className="font-medium">
                  <p>
                    {trip.truck?.registrationNumber || "N/A"}
                    <span className="ml-5">{`${trip.from} To ${trip.to}`}</span>
                  </p>
                </TableCell>
                <TableCell>{"-"}</TableCell>
                <TableCell>₹ {trip.partyFreightAmount}</TableCell>
              </TableRow>
            </>
          ))}

          <TableRow
            className="cursor-pointer"
            // onClick={redirectToDetails(trip.id)}
          >
            <TableCell className="font-medium">
              {new Date(party?.openingBalanceDate ?? "")
                .toDateString()
                .substring(4)}
            </TableCell>
            <TableCell className="font-medium">
              {
                <span>
                  Opening Balance
                  <span className="ml-5">₹ {party?.openingBalance}</span>
                </span>
              }
            </TableCell>
            <TableCell>{"-"}</TableCell>
            <TableCell>{"-"}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default Page;
