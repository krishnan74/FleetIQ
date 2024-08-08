"use client";
import React, { useState, useEffect } from "react";

import { usePathname } from "next/navigation";
import axios from "axios";
import { Truck } from "@/lib/interface";

const Page = () => {
  const [truckDetails, setDriverDetails] = useState<Truck>();
  const pathname = usePathname();
  const id = pathname.split("/")[2];

  const fetchDriver = async () => {
    try {
      const response = await axios.get(`/api/truck/${id}`);
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

  return truckDetails ? (
    <div>
      <p>{truckDetails?.truckType}</p>
      <p>{truckDetails?.truckOwnerShip}</p>

      <p>{truckDetails?.status}</p>

      <p>{`${truckDetails?.trips[0].from} ==> ${truckDetails?.trips[0].to}`}</p>
      <p>{`${truckDetails?.registrationNumber}`}</p>
    </div>
  ) : (
    <div>Loading....</div>
  );
};

export default Page;
