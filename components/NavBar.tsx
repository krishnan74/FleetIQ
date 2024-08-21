"use client";
import React from "react";
import { FaBell } from "react-icons/fa";
import { PiLineVerticalThin } from "react-icons/pi";
import { AvatarComponent } from "./Avatar";
import AddPartyDialogComponent from "@/app/parties/components/AddPartyDialogComponent";
import AddTripDialogComponent from "@/app/trips/components/AddTripDialogComponent";
import AddVendorDialogComponent from "@/app/vendors/components/AddVendorDialogComponent";
import AddDriverDialogComponent from "@/app/drivers/components/AddDriverDialogComponent";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import AddTruckDialogComponent from "@/app/trucks/components/AddTruckDialogComponent";

const NavBar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const tab = pathname.split("/")[1];

  const renderTitle = () => {
    switch (tab) {
      case "dashboard":
        return "Dashboard Overview";
      case "parties":
        return "Parties";
      case "trips":
        return "Trips";
      case "drivers":
        return "Drivers";
      case "trucks":
        return "Trucks";
      case "vendors":
        return "Vendors";
      default:
        return "Overview";
    }
  };

  const renderDialogComponent = () => {
    switch (tab) {
      case "parties":
        return (
          <AddPartyDialogComponent
            userId={session?.user.id ? session?.user.id : ""}
          />
        );
      case "trips":
        return <AddTripDialogComponent />;
      case "drivers":
        return <AddDriverDialogComponent />;
      case "trucks":
        return <AddTruckDialogComponent />;
      case "vendors":
        return <AddVendorDialogComponent />;
      default:
        return null;
    }
  };

  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <p className="text-2xl font-bold text-gray-800">
          {renderTitle()} <br />
          <span className="text-base font-normal text-gray-500">
            {new Date().toDateString()}
          </span>
        </p>
      </div>

      <div className="flex items-center space-x-4">
        {renderDialogComponent()}
        <FaBell className="text-2xl text-gray-700 hover:text-gray-900 transition-colors" />
        <PiLineVerticalThin className="text-2xl text-gray-700 hover:text-gray-900 transition-colors" />
        <AvatarComponent />
        <p className="font-bold text-lg text-gray-800">
          {session?.user?.name || "User Name"}
        </p>
      </div>
    </div>
  );
};

export default NavBar;
