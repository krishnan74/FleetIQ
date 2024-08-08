"use client";
import React from "react";
import { FaBell } from "react-icons/fa";
import { PiLineVerticalThin } from "react-icons/pi";
import { AvatarComponent } from "./Avatar";
import AddPartyDialogComponent from "@/app/parties/components/AddPartyDialogComponent";
import AddTripDialogComponent from "@/app/trips/components/AddTripDialogComponent";
import AddVendorDialogComponent from "@/app/vendors/components/AddVendorDialogComponent";
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
          <AddPartyDialogComponent />
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
          <AddTripDialogComponent />
          <FaBell className="text-2xl text-gray-700 hover:text-gray-900 transition-colors" />
          <PiLineVerticalThin className="text-2xl text-gray-700 hover:text-gray-900 transition-colors" />
          <AvatarComponent />
          <p className="font-bold text-lg text-gray-800">Rajesh Kumar</p>
        </div>
      </div>
    );
  } else if (tab === "drivers") {
    return (
      <div className="flex justify-between items-center mb-8">
        <p className="text-2xl font-bold text-gray-800">
          Drivers <br />
          <span className="text-base font-normal text-gray-500">
            {new Date().toDateString()}
          </span>
        </p>
        <div className="flex items-center space-x-4">
          <AddTripDialogComponent />
          <FaBell className="text-2xl text-gray-700 hover:text-gray-900 transition-colors" />
          <PiLineVerticalThin className="text-2xl text-gray-700 hover:text-gray-900 transition-colors" />
          <AvatarComponent />
          <p className="font-bold text-lg text-gray-800">Rajesh Kumar</p>
        </div>
      </div>
    );
  } else if (tab === "trucks") {
    return (
      <div className="flex justify-between items-center mb-8">
        <p className="text-2xl font-bold text-gray-800">
          Trucks <br />
          <span className="text-base font-normal text-gray-500">
            {new Date().toDateString()}
          </span>
        </p>
        <div className="flex items-center space-x-4">
          <AddTripDialogComponent />
          <FaBell className="text-2xl text-gray-700 hover:text-gray-900 transition-colors" />
          <PiLineVerticalThin className="text-2xl text-gray-700 hover:text-gray-900 transition-colors" />
          <AvatarComponent />
          <p className="font-bold text-lg text-gray-800">Rajesh Kumar</p>
        </div>
      </div>
    );
  } else if (tab === "vendors") {
    return (
      <div className="flex justify-between items-center mb-8">
        <p className="text-2xl font-bold text-gray-800">
          Vendors <br />
          <span className="text-base font-normal text-gray-500">
            {new Date().toDateString()}
          </span>
        </p>
        <div className="flex items-center space-x-4">
          <AddVendorDialogComponent />
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
