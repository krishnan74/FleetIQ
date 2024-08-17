"use client";
import React, { use, useEffect, useState } from "react";

import axios from "axios";

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
import { useRouter } from "next/navigation";
import { VendorDetails } from "@/lib/interface";
import { TripStatus } from "@prisma/client";

const Page = () => {
  const [vendors, setVendors] = useState<VendorDetails[]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalVendorBalance, setTotalVendorBalance] = useState(0);
  const [totalTrips, setTotalTrips] = useState(0);
  const [search, setSearch] = useState("");

  const router = useRouter();

  const searchVendors = async (search: string) => {
    //console.log("Searching vendors with", search);
    try {
      if (search.trim() === "") {
        await fetchVendors(); // Fetch all vendors if search is empty
      } else {
        const filteredVendors = vendors?.filter((vendor) =>
          vendor.name.toLowerCase().includes(search.toLowerCase())
        );
        setVendors(filteredVendors);
      }
    } catch (error) {
      setError("An error occurred while fetching vendors");
    } finally {
      setLoading(false);
    }
  };

  const fetchVendors = async () => {
    try {
      const response = await axios.get("/api/vendor");
      if (response.data.message === "success") {
        setVendors(response.data.data);

        const totalBalance = response.data.data.reduce(
          (acc: number, vendor: VendorDetails) => acc + vendor.totalBalance,
          0
        );

        setTotalVendorBalance(totalBalance);

        const totalTrips = response.data.data.reduce(
          (acc: number, vendor: VendorDetails) => {
            const activeTrips = vendor.trips.filter(
              (trip) => trip.status !== TripStatus.SETTLED
            ).length;
            return acc + activeTrips;
          },
          0
        );

        setTotalTrips(totalTrips);
      } else {
        setError("Failed to fetch vendors");
      }
    } catch (error) {
      setError("An error occurred while fetching vendors");
    } finally {
      setLoading(false);
    }
  };

  const redirectToDetails = (id: string) => () => {
    router.push(`/vendors/trips/${id}`);
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  useEffect(() => {
    searchVendors(search);
  }, [search]);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div>
      <div className="flex gap-x-5 mb-5">
        <p className="border p-5 rounded-md">
          Total Vendor Balance :{" "}
          <span className="text-blue-500 font-bold ml-3">
            ₹ {totalVendorBalance}
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
          placeholder="Search vendor by name"
          className="border py-2 pl-9 rounded-md w-full mb-5"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
      </div>
      <Table className="min-w-full bg-white shadow-sm rounded-lg overflow-hidden">
        <TableCaption className="text-gray-600">
          A list of your recent vendors.
        </TableCaption>
        <TableHeader>
          <TableRow className="bg-gray-100 text-gray-600 border-b border-gray-300">
            <TableHead className="py-3 px-4 text-left">Name</TableHead>
            <TableHead className="py-3 px-4 text-left">Phone</TableHead>

            <TableHead className="py-3 px-4 text-left">
              Active Trip Count
            </TableHead>
            <TableHead className="py-3 px-4 text-right">
              Vendor Balance
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vendors?.map((vendor) => (
            <TableRow
              key={vendor.id}
              onClick={redirectToDetails(vendor.id)}
              className="cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <TableCell className="py-3 px-4 font-medium">
                {vendor.name}
              </TableCell>
              <TableCell className="py-3 px-4">{vendor.phone}</TableCell>

              <TableCell className="py-3 px-4 ">
                {
                  vendor.trips.filter(
                    (trip) => trip.status !== TripStatus.COMPLETED
                  ).length
                }
              </TableCell>
              <TableCell className="py-3 px-4 text-right font-medium">
                ₹ {vendor.totalBalance}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Page;
