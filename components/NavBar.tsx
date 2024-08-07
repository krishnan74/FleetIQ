"use client";
import React from "react";
import { FaBell } from "react-icons/fa";
import { PiLineVerticalThin } from "react-icons/pi";
import { AvatarComponent } from "./Avatar";
import AppPartyDialogComponent from "@/app/parties/components/AddPartyDialogComponent";
import AppTripDialogComponent from "@/app/trips/components/AddTripDialogComponent";
import { usePathname } from "next/navigation";

const NavBar = () => {
  const pathname = usePathname();

  const tab = pathname.split("/")[1];
  if (tab === "dashboard") {
    return (
      <div className="flex justify-between items-center mb-8">
        <p className="text-2xl font-bold text-gray-800">
          Dashboard Overview <br />
          <span className="text-base font-normal text-gray-500">
            {new Date().toDateString()}
          </span>
        </p>
        <div className="flex items-center space-x-4">
          <FaBell className="text-2xl text-gray-700 hover:text-gray-900 transition-colors" />
          <PiLineVerticalThin className="text-2xl text-gray-700 hover:text-gray-900 transition-colors" />
          <AvatarComponent />
          <p className="font-bold text-lg text-gray-800">Rajesh Kumar</p>
        </div>
      </div>
    );
  } else if (tab === "parties") {
    return (
      <div className="flex justify-between items-center mb-8">
        <p className="text-2xl font-bold text-gray-800">
          Parties <br />
          <span className="text-base font-normal text-gray-500">
            {new Date().toDateString()}
          </span>
        </p>
        <div className="flex items-center space-x-4">
          <AppPartyDialogComponent />
          <FaBell className="text-2xl text-gray-700 hover:text-gray-900 transition-colors" />
          <PiLineVerticalThin className="text-2xl text-gray-700 hover:text-gray-900 transition-colors" />
          <AvatarComponent />
          <p className="font-bold text-lg text-gray-800">Rajesh Kumar</p>
        </div>
      </div>
    );
  } else if (tab === "trips") {
    return (
      <div className="flex justify-between items-center mb-8">
        <p className="text-2xl font-bold text-gray-800">
          Trips <br />
          <span className="text-base font-normal text-gray-500">
            {new Date().toDateString()}
          </span>
        </p>
        <div className="flex items-center space-x-4">
          <AppTripDialogComponent />
          <FaBell className="text-2xl text-gray-700 hover:text-gray-900 transition-colors" />
          <PiLineVerticalThin className="text-2xl text-gray-700 hover:text-gray-900 transition-colors" />
          <AvatarComponent />
          <p className="font-bold text-lg text-gray-800">Rajesh Kumar</p>
        </div>
      </div>
    );
  }
};

export default NavBar;
