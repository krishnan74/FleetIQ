import React from "react";
import { PiDotsThreeOutlineFill } from "react-icons/pi";

interface TruckCardProps {
  count: number;
  title: string;
  onTripTruckCount: number;
  availableTruckCount: number;
}

const TruckCard: React.FC<TruckCardProps> = ({
  count,
  title,
  onTripTruckCount,
  availableTruckCount,
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
          Available:{" "}
          <span className="text-black font-bold">{availableTruckCount} </span>
        </p>

        <p className="text-[#666] text-sm">
          On Trip:{" "}
          <span className="text-black font-bold">{onTripTruckCount}</span>
        </p>
      </div>
    </div>
  );
};

export default TruckCard;
