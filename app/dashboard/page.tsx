"use client";
import React, { useEffect, useState } from "react";

import { BarChartComponent } from "@/app/dashboard/components/BarChartComponent";
import { PieChartComponent } from "@/app/dashboard/components/PieChartComponent";
import { TransactionComponent } from "@/app/dashboard/components/TransactionComponent";

import DriverCard from "@/app/dashboard/components/DriverCard";
import { DriverDetails, Trip, VendorDetails } from "@/lib/interface";
import axios from "axios";
import { TripStatus, TruckStatus } from "@prisma/client";
import TripCard from "@/app/dashboard/components/TripCard";
import VendorCard from "@/app/dashboard/components/VendorCard";
import TruckCard from "@/app/dashboard/components/TruckCard";
const Page = () => {
  const [allTrips, setAllTrips] = useState<Trip[]>([]);
  const [monthlyTrips, setMonthlyTrips] = useState<Trip[]>([]);
  const [tripCount, setTripCount] = useState(0);
  const [driverCount, setDriverCount] = useState(0);
  const [truckCount, setTruckCount] = useState(0);
  const [vendorCount, setVendorCount] = useState(0);
  const [totalVendorBalance, setTotalVendorBalance] = useState(0);
  const [totalDriverBalance, setTotalDriverBalance] = useState(0);
  const [onTripTruckCount, setOnTripTruckCount] = useState(0);
  const [availableTruckCount, setAvailableTruckCount] = useState(0);
  const [completedTripCount, setCompletedTripCount] = useState(0);
  const [onGoingTripCount, setOnGoingTripCount] = useState(0);

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

      const vendorBalance = vendorResponse.data.data.reduce(
        (acc: number, vendor: VendorDetails) => acc + vendor.totalBalance,
        0
      );
      setTotalVendorBalance(vendorBalance);

      const driverBalance = driverResponse.data.data.reduce(
        (acc: number, driver: DriverDetails) => acc + driver.balance,
        0
      );
      setTotalDriverBalance(driverBalance);

      const TripComplete = tripResponse.data.data.filter(
        (trip: Trip) => trip.status === TripStatus.COMPLETED
      ).length;

      setCompletedTripCount(TripComplete);

      const TripOnGoing = tripResponse.data.data.filter(
        (trip: Trip) => trip.status === TripStatus.PLANNED
      ).length;

      setOnGoingTripCount(TripOnGoing);

      const onTripTruck = truckResponse.data.data.filter(
        (truck: any) => truck.status === TruckStatus.ONTRIP
      ).length;

      setOnTripTruckCount(onTripTruck);

      const availableTruck = truckResponse.data.data.filter(
        (truck: any) => truck.status === TruckStatus.AVAILABLE
      ).length;

      setAvailableTruckCount(availableTruck);
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
        <TripCard
          count={tripCount}
          title="Trips in travel"
          percentage="30.00"
          completedTripCount={completedTripCount}
          onGoingTripCount={onGoingTripCount}
        />
      </div>
      <div className="row-span-1">
        <VendorCard
          count={vendorCount}
          title="Vendors"
          vendorBalance={totalVendorBalance}
        />
      </div>
      <div className="row-span-1">
        <DriverCard
          count={driverCount}
          title="Drivers in service"
          driverBalance={totalDriverBalance}
        />
      </div>
      <div className="col-span-1 row-span-2">
        <PieChartComponent trips={allTrips} type={"allTrips"} />
      </div>
      <div className="col-span-2 row-span-2">
        <TransactionComponent />
      </div>
      <div className="row-span-1">
        <TruckCard
          count={truckCount}
          title="Trucks in service"
          onTripTruckCount={onTripTruckCount}
          availableTruckCount={availableTruckCount}
        />
      </div>
    </div>
  );
};
export default Page;
