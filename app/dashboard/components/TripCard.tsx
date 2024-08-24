import React from "react";
import { PiDotsThreeOutlineFill } from "react-icons/pi";

interface TripCardProps {
  count: number;
  title: string;
  percentage: string;
  completedTripCount: number;
  onGoingTripCount: number;
}

const TripCard: React.FC<TripCardProps> = ({
  count,
  title,
  completedTripCount,
  onGoingTripCount,
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
          Completed:{" "}
          <span className="text-black font-bold">{completedTripCount}</span>
        </p>
        <p className="text-[#666] text-sm">
          On Going:{" "}
          <span className="text-black font-bold">{onGoingTripCount}</span>
        </p>
      </div>
    </div>
  );
};

export default TripCard;
