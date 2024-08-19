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
import { DriverDetails } from "@/lib/interface";

const Page = () => {
  const [drivers, setDrivers] = useState<DriverDetails[]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const router = useRouter();

  const fetchDrivers = async () => {
    try {
      const response = await axios.get("/api/driver");
      if (response.data.message === "success") {
        setDrivers(response.data.data);
      } else {
        setError("Failed to fetch drivers");
      }
    } catch (error) {
      setError("An error occurred while fetching drivers");
    } finally {
      setLoading(false);
    }
  };

  const searchDrivers = async (search: string) => {
    //console.log("Searching drivers with", search);
    try {
      if (search.trim() === "") {
        await fetchDrivers(); // Fetch all drivers if search is empty
      } else {
        const filteredDrivers = drivers?.filter((driver) =>
          driver.name.toLowerCase().includes(search.toLowerCase())
        );
        setDrivers(filteredDrivers);
      }
    } catch (error) {
      setError("An error occurred while fetching drivers");
    } finally {
      setLoading(false);
    }
  };

  const redirectToDetails = (id: string) => () => {
    router.push(`/drivers/${id}`);
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  useEffect(() => {
    searchDrivers(search);
  }, [search]);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div>
      <div className="relative">
        <CiSearch className="absolute top-3 left-3" />
        <input
          type="text"
          placeholder="Search driver by name"
          className="border py-2 pl-9 rounded-md w-full mb-5"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
      </div>

      <Table className="min-w-full bg-white shadow-sm rounded-lg overflow-hidden">
        <TableCaption className="text-gray-600">
          A list of your recent drivers.
        </TableCaption>
        <TableHeader>
          <TableRow className="bg-blue-500 border-b border-blue-300 hover:bg-blue-500">
            <TableHead className="py-3 px-4 text-left text-white ">
              Driver Name
            </TableHead>
            <TableHead className="py-3 px-4 text-left text-white ">
              Phone
            </TableHead>
            <TableHead className="py-3 px-4 text-left text-white ">
              Status
            </TableHead>
            <TableHead className="py-3 px-4 text-left text-white ">
              Balance
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {drivers?.map((driver) => (
            <TableRow
              key={driver.id}
              onClick={redirectToDetails(driver.id)}
              className="cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <TableCell className="py-3 px-4">{driver.name}</TableCell>

              <TableCell className="py-3 px-4 font-medium">
                {driver.phone}
              </TableCell>
              <TableCell className="py-3 px-4 font-medium">
                {driver.status}
              </TableCell>
              <TableCell className="py-3 px-4 font-medium">
                ₹ {driver.balance}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Page;
