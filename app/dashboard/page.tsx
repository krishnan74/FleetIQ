"use client";
import React, { useEffect, useState } from "react";

import { BarChartComponent } from "./components/BarChartComponent";
import { PieChartComponent } from "./components/PieChartComponent";
import { TransactionComponent } from "./components/TransactionComponent";

import DummyCard from "./components/DummyCard";
import { Trip } from "@/lib/interface";
import axios from "axios";
const Page = () => {
  const [allTrips, setAllTrips] = useState<Trip[]>([]);
  const [monthlyTrips, setMonthlyTrips] = useState<Trip[]>([]);
  const [tripCount, setTripCount] = useState(0);
  const [driverCount, setDriverCount] = useState(0);
  const [truckCount, setTruckCount] = useState(0);
  const [vendorCount, setVendorCount] = useState(0);
  const fetchData = async () => {
    try {
      const tripResponse = await axios.get("/api/trip");

      const orderedTrips: Trip[] = tripResponse.data.data
        .slice() // Create a copy to avoid mutating the original array
        .sort(
          (a: Trip, b: Trip) =>
            Number(new Date(a.startedAt)) - Number(new Date(b.startedAt))
        );

      setAllTrips(orderedTrips);

      const trips = tripResponse.data.data.filter(
        (trip: Trip) =>
          new Date(trip.startedAt).getMonth() == new Date().getMonth()
      );

      setMonthlyTrips(trips);
      const driverResponse = await axios.get("/api/driver");
      const truckResponse = await axios.get("/api/truck");
      const vendorResponse = await axios.get("/api/vendor");
      setTripCount(tripResponse.data.data.length);
      setDriverCount(driverResponse.data.data.length);
      setTruckCount(truckResponse.data.data.length);
      setVendorCount(vendorResponse.data.data.length);
    } catch (error) {
      console.log("An error occurred while fetching data");
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="grid grid-cols-4 gap-10 ">
      <div className="col-span-2 row-span-2 ">
        <BarChartComponent trips={allTrips} />
      </div>
      <div className="col-span-1 row-span-2">
        <PieChartComponent trips={monthlyTrips} type={"monthlyTrips"} />
      </div>
      <div className="row-span-1">
        <DummyCard
          count={tripCount}
          title="Trips in travel"
          percentage="30.00"
        />
      </div>
      <div className="row-span-1">
        <DummyCard count={vendorCount} title="Vendors" percentage="30.00" />
      </div>
      <div className="row-span-1">
        <DummyCard
          count={driverCount}
          title="Drivers in service"
          percentage="30.00"
        />
      </div>
      <div className="col-span-1 row-span-2">
        <PieChartComponent trips={allTrips} type={"allTrips"} />
      </div>
      <div className="col-span-2 row-span-2">
        <TransactionComponent />
      </div>
      <div className="row-span-1">
        <DummyCard
          count={truckCount}
          title="Trucks in service"
          percentage="30.00"
        />
      </div>
    </div>
  );
};
export default Page;
