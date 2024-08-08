"use client";
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { CiSearch } from "react-icons/ci";
import { FaBell } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { useToast } from "@/components/ui/use-toast";


interface VendorDetails {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: {
    id: string;
    doorNumber: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    vendorId: string;
  };
  trips: [];
}

const Page = () => {
  const [vendorDetails, setVendorDetails] = useState<VendorDetails[]>();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("/api/vendor/");
      if (response.data.message === "success") {
        setVendorDetails(response.data.data);
        console.log("Vendor details : ", response.data.data);
      }
    } catch (e: any) {
      console.log("Error while fetching vendors :: ", e);
    }
  };

  return (
    <div className="flex flex-col p-8 bg-white gap-10 w-full h-full rounded-lg">
      <div className="">
        <p className="text-2xl font-bold mb-4">Current Vendors</p>
        {vendorDetails ? (
          <div className="flex flex-wrap gap-10">Vendors..</div>
        ) : (
          <p>No vendors found</p>
        )}
      </div>
    </div>
  );
};

export default Page;
