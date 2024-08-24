import React from "react";
import { PiDotsThreeOutlineFill } from "react-icons/pi";

interface DriverCardProps {
  count: number;
  title: string;
  driverBalance: number;
}

const DriverCard: React.FC<DriverCardProps> = ({
  count,
  title,
  driverBalance,
}) => {
  return (
    <div className="relative flex-col justify-between flex p-5 h-full rounded-xl border bg-card text-card-foreground shadow">
      <div className="flex justify-end">
        <PiDotsThreeOutlineFill className="text-2xl" />
      </div>
      <p className="text-5xl font-bold">{count}</p>
      <p className=" font-bold">{title}</p>

      <div className="flex justify-between">
        <p className="text-[#666] text-sm">
          Total Driver Balance:{" "}
          <span className="text-black font-bold">₹ {driverBalance}</span>
        </p>
      </div>
    </div>
  );
};

export default DriverCard;
