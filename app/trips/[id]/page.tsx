"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Trip } from "@/lib/interface";
import axios from "axios";

import { FaTruck } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { GiSteeringWheel } from "react-icons/gi";
import { FaChevronRight } from "react-icons/fa";
import AddTripDialogComponent from "../components/AddTripDialogComponent";
import CompleteTripDialogComponent from "../components/CompleteTripDialogComponent";
import Link from "next/link";
import { CiCircleChevRight } from "react-icons/ci";
import TripProgress from "../components/TripProgress";

const page = () => {
  const [tripDetails, setTripDetails] = useState<Trip>();
  const pathname = usePathname();
  const id = pathname.split("/")[2];

  const fetchTripDetails = async () => {
    try {
      const response = await axios.get(`/api/trip/${id}`);
      if (response.data.message === "success") {
        console.log(response.data.data);
        setTripDetails(response.data.data);
      }
    } catch (error) {
      console.error("An error occurred while fetching data", error);
    }
  };

  useEffect(() => {
    fetchTripDetails();
  }, []);

  return (
    <div className="flex gap-x-5">
      <div className="flex flex-col w-[70%] gap-y-5">
        <div className="flex gap-10 w-full justify-between">
          <Link
            href={`/trucks/${tripDetails?.truck.id}`}
            className="truck-card flex-1 flex justify-between border p-5 rounded-md items-center"
          >
            <div className="flex">
              <FaTruck className="text-5xl " />
              <div className="flex flex-col ml-4">
                <p className="text-xl font-bold">Truck Number</p>
                <p className=" text-[#666]">
                  {tripDetails?.truck.registrationNumber}
                </p>
              </div>
            </div>
            <FaChevronRight className="text-2xl ml-4" />
          </Link>

          <Link
            href={`/drivers/${tripDetails?.driver.id}`}
            className="driver-card flex-1 flex justify-between border p-5 rounded-md items-center"
          >
            <div className="flex">
              <GiSteeringWheel className="text-5xl " />
              <div className="flex flex-col ml-4">
                <p className="text-xl font-bold">Driver Name</p>
                <p className=" text-[#666]">{tripDetails?.driver.name}</p>
              </div>
            </div>
            <FaChevronRight className="text-2xl ml-4" />
          </Link>
        </div>

        <div className="flex flex-col p-5 rounded-md border">
          <div className="flex justify-between border-b pb-5">
            <p className="text-2xl font-bold">{tripDetails?.party.name}</p>
            <AddTripDialogComponent />
          </div>

          <div className="grid grid-cols-4 gap-3 mt-5">
            <div className="flex justify-between col-span-2 p-5 border rounded-md">
              <div className="">
                <p className="text-sm font-light">Party Name</p>
                <p className="text-lg font-bold">{tripDetails?.party.name}</p>
              </div>

              <div>
                <p className="text-sm font-light">Party Balance</p>
                <p className="text-lg font-bold">
                  {tripDetails?.party.openingBalance}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center p-5 col-span-1 border rounded-md">
              <div className="">
                <p className="text-sm font-light">LR Number</p>
                <p className="text-lg font-bold">LRN-001</p>
              </div>
            </div>

            <div className="flex items-center justify-center p-5 col-span-1 border rounded-md">
              <div className="">
                <p className="text-sm font-light">Material</p>
                <p className="text-lg font-bold">---</p>
              </div>
            </div>

            <div className="flex justify-between col-span-2 p-5 border rounded-md items-center">
              <div className="">
                <p className="text-lg font-bold">{tripDetails?.from}</p>
                <p className="text-sm font-light">
                  {new Date(
                    tripDetails?.createdAt ? tripDetails?.createdAt : ""
                  ).toDateString()}
                </p>
              </div>

              <div>
                <CiCircleChevRight size={30} />
              </div>

              <div>
                <p className="text-lg font-bold">{tripDetails?.to}</p>
              </div>
            </div>

            <div className="flex justify-between col-span-2 p-5 border rounded-md">
              <div className="">
                <p className="text-sm font-light">Start KMs Reading</p>
                <p className="text-lg font-bold">---</p>
              </div>

              <div>
                <p className="text-sm font-light">End KMs Reading</p>
                <p className="text-lg font-bold">---</p>
              </div>
            </div>
          </div>
        </div>

        <TripProgress status={tripDetails?.status ? tripDetails?.status : ""} />

        <div className="flex gap-5 w-full justify-between">
          <div className="flex-1 ">
            <CompleteTripDialogComponent />
          </div>

          <div className="flex-1">
            <CompleteTripDialogComponent />
          </div>
        </div>

        <div>
          <div className="flex justify-between py-3 items-center">
            <p>Freight Amount</p>
            {"₹0"}
          </div>
        </div>
      </div>
      <div className="w-[30%] flex flex-col gap-5">
        <div className="w-full p-5 gap-y-2 border rounded-md">
          <div className="flex justify-between pb-5 border-b items-center">
            <p>Trip Profit</p>
            <Button>Add Expense</Button>
          </div>

          <div className="">
            <div className="flex justify-between py-3 items-center">
              <p>(+) Revenue</p>
              {"₹0"}
            </div>
            <div className="flex justify-between py-3 border-b items-center">
              <p>(-) Expense</p>
              {"₹0"}
            </div>
          </div>
          <div className="flex justify-between py-3 border-t items-center">
            <p>(-) Profit</p>
            {"₹0"}
          </div>
        </div>

        <div className="w-full p-5 gap-y-2 border rounded-md">
          <div className="flex justify-between pb-5 border-b items-center">
            <p>{tripDetails?.party.name}</p>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex justify-between p-3 items-center border rounded-md">
              <p>Online Bilty/LR</p>
              <Button>Create LR</Button>
            </div>
            <div className="flex justify-between p-3 border-b items-center border rounded-md">
              <p>POD Challan</p>
              <Button>Add POD</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
