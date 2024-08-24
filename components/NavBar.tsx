"use client";
import React, { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import { PiLineVerticalThin } from "react-icons/pi";
import { AvatarComponent } from "./Avatar";
import AddPartyDialogComponent from "@/app/parties/components/AddPartyDialogComponent";
import AddTripDialogComponent from "@/app/trips/components/AddTripDialogComponent";
import AddVendorDialogComponent from "@/app/vendors/components/AddVendorDialogComponent";
import AddDriverDialogComponent from "@/app/drivers/components/AddDriverDialogComponent";
import { usePathname } from "next/navigation";
import AddTruckDialogComponent from "@/app/trucks/components/AddTruckDialogComponent";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useToast } from "./ui/use-toast";
import Link from "next/link";

const NavBar = () => {
  const pathname = usePathname();
  const tab = pathname.split("/")[1];

  const { toast } = useToast();
  const { data: session } = useSession();

  const [remainderCount, setRemainderCount] = useState(0);

  useEffect(() => {
    const checkReminders = async () => {
      try {
        const response = await axios.get(`/api/remainder/`);

        const today = new Date().toISOString().split("T")[0];

        console.log("Today:", today);
        console.log("Reminders:", response.data.data);

        const dueReminders = response.data.data.filter(
          (reminder: { date: string }) => reminder.date.split("T")[0] === today
        );

        setRemainderCount(dueReminders.length);

        console.log("Due reminders:", dueReminders);

        if (dueReminders.length > 0) {
          dueReminders.forEach(
            (reminder: { type: string; details: string; date: string }) => {
              toast({
                title: `Reminder: ${reminder.type}`,
                description: `${
                  reminder.details
                } is due today. (Date: ${new Date(
                  reminder.date
                ).toLocaleDateString()})`,
                duration: 7000,
              });
            }
          );
        }
      } catch (error) {
        console.error("Error fetching reminders:", error);
      }
    };

    if (session?.user.id) checkReminders();
  }, [session?.user.id]);

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
      case "reports":
        return "Reports";
      case "remainders":
        return "Reminders";
      default:
        return "Overview";
    }
  };

  const renderDialogComponent = () => {
    switch (tab) {
      case "parties":
        return <AddPartyDialogComponent />;
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

        <Link href={"/remainders"} className="relative cursor-pointer">
          <FaBell className="text-2xl text-gray-700 hover:text-gray-900 transition-colors" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {remainderCount}
          </span>
        </Link>
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
