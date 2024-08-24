"use client";
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { CiSearch } from "react-icons/ci";
import { DriverDetails } from "@/lib/interface";

const Page = () => {
  const [drivers, setDrivers] = useState<DriverDetails[]>([]);
  const [filteredDrivers, setFilteredDrivers] = useState<DriverDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const router = useRouter();

  // Fetch drivers data
  const fetchDrivers = async () => {
    try {
      const response = await axios.get(`/api/driver/`);
      if (response.data.message === "success") {
        setDrivers(response.data.data);
        setFilteredDrivers(response.data.data);
      } else {
        setError("Failed to fetch drivers");
      }
    } catch (error) {
      setError("An error occurred while fetching drivers");
    } finally {
      setLoading(false);
    }
  };

  // Handle search input change with debounce
  const handleSearch = useCallback((event: { target: { value: any } }) => {
    const value = event.target.value;
    setSearch(value);
    // Debounce the search
    clearTimeout((window as any).searchTimeout);
    (window as any).searchTimeout = setTimeout(() => {
      setSearchTerm(value);
    }, 300);
  }, []);

  // Apply search filter
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredDrivers(drivers);
    } else {
      const lowercasedTerm = searchTerm.toLowerCase();
      const filtered = drivers.filter((driver) =>
        driver.name.toLowerCase().includes(lowercasedTerm)
      );
      setFilteredDrivers(filtered);
    }
  }, [searchTerm, drivers]);

  // Fetch drivers when session is authenticated
  useEffect(() => {
    fetchDrivers();
  }, []);

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
          onChange={handleSearch}
        />
      </div>

      <Table className="min-w-full bg-white shadow-sm rounded-lg overflow-hidden">
        <TableCaption className="text-gray-600">
          A list of your recent drivers.
        </TableCaption>
        <TableHeader>
          <TableRow className="bg-blue-500 border-b border-blue-300 hover:bg-blue-500">
            <TableHead className="py-3 px-4 text-left text-white">
              Driver Name
            </TableHead>
            <TableHead className="py-3 px-4 text-left text-white">
              Phone
            </TableHead>
            <TableHead className="py-3 px-4 text-left text-white">
              Status
            </TableHead>
            <TableHead className="py-3 px-4 text-left text-white">
              Balance
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredDrivers.map((driver) => (
            <TableRow
              key={driver.id}
              onClick={() => router.push(`/drivers/${driver.id}`)}
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
