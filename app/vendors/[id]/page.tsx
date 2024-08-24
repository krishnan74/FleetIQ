"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import axios from "axios";
import { Trip } from "@/lib/interface";

import { VendorDetails } from "@/lib/interface";

const Page = () => {
  const [vendorDetails, setVendorDetails] = useState<VendorDetails>();
  const pathname = usePathname();
  console.log(pathname);

  const id = 1;

  const fetchData = async () => {
    try {
      const response = await axios.get(`/api/vendor/${id}`);
      setVendorDetails(response.data.data);
    } catch (e: any) {
      console.log(e.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between">
        <div>
          <Image src={""} alt="Vendor's Image"></Image>
        </div>
        <div className="flex flex-col ">
          <p className="text-xl font-bold">{vendorDetails?.name}</p>
          <p className="font-semibold">{vendorDetails?.email}</p>
          <p className="font-semibold">{vendorDetails?.phone}</p>
        </div>
      </div>

      <div className="flex gap-10 overflow-x-scroll">
        {vendorDetails?.trips.map((trip) => (
          <div key={trip.id} className="flex flex-col gap-2">
            <p className="text-xl font-bold">{trip.from}</p>
            <p className="text-xl font-bold">{trip.to}</p>
            <p className="text-gray-700">
              <span className="font-medium">Vendor:</span> {trip.vendor.name}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Created At:</span>{" "}
              {new Date(trip.createdAt).toLocaleDateString()}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Updated At:</span>{" "}
              {new Date(trip.updatedAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
