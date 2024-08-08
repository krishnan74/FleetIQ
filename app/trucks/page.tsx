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
import { Truck } from "@/lib/interface";

const Page = () => {
  const [trucks, settrucks] = useState<Truck[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const fetchtrucks = async () => {
    try {
      const response = await axios.get("/api/truck");
      if (response.data.message === "success") {
        settrucks(response.data.data);
      } else {
        setError("Failed to fetch trucks");
      }
    } catch (error) {
      setError("An error occurred while fetching trucks");
    } finally {
      setLoading(false);
    }
  };

  const redirectToDetails = (id: string) => () => {
    router.push(`/trucks/${id}`);
  };

  useEffect(() => {
    fetchtrucks();
  }, []);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div>
      <Table className="min-w-full bg-white shadow-sm rounded-lg overflow-hidden">
        <TableCaption className="text-gray-600">
          A list of your recent trucks.
        </TableCaption>
        <TableHeader>
          <TableRow className="bg-gray-100 text-gray-600 border-b border-gray-300">
            <TableHead className="py-3 px-4 text-left">
              Registration Number
            </TableHead>
            <TableHead className="py-3 px-4 text-left">Truck Type</TableHead>
            <TableHead className="py-3 px-4 text-left">
              Truck OwnerShip
            </TableHead>
            <TableHead className="py-3 px-4 text-left">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trucks?.map((truck) => (
            <TableRow
              key={truck.id}
              onClick={redirectToDetails(truck.id)}
              className="cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <TableCell className="py-3 px-4">
                {truck.registrationNumber}
              </TableCell>

              <TableCell className="py-3 px-4 font-medium">
                {truck.truckType}
              </TableCell>
              <TableCell className="py-3 px-4 font-medium">
                {truck.truckOwnerShip}
              </TableCell>

              <TableCell className="py-3 px-4 font-medium">
                {truck.status}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Page;
