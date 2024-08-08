"use client";
import React, { useState, useEffect } from "react";

import { usePathname } from "next/navigation";
import axios from "axios";
import { DriverDetails } from "@/lib/interface";

const Page = () => {
  const [driverDetails, setDriverDetails] = useState<DriverDetails>();
  const pathname = usePathname();
  const id = pathname.split("/")[2];

  const fetchDriver = async () => {
    try {
      const response = await axios.get(`/api/driver/${id}`);
      if (response.data.message === "success") {
        console.log(response.data.data);
        setDriverDetails(response.data.data);
      }
    } catch (error) {
      console.error("An error occurred while fetching data", error);
    }
  };

  useEffect(() => {
    fetchDriver();
  }, []);

  return driverDetails ? (
    <div>
      <p>{driverDetails?.name}</p>
      <p>{driverDetails?.phone}</p>

      <p>{driverDetails?.status}</p>

      <p>{driverDetails?.balance}</p>
      <p>{`${driverDetails?.trips[0].from} ==> ${driverDetails?.trips[0].to}`}</p>
      <p>{`${driverDetails?.truck.registrationNumber}`}</p>
    </div>
  ) : (
    <div>Loading....</div>
  );
};

export default Page;
