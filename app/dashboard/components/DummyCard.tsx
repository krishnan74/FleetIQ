import React from "react";
import { PiDotsThreeOutlineFill } from "react-icons/pi";

interface DummyCardProps {
  count: number;
  title: string;
  percentage: string;
}

const DummyCard: React.FC<DummyCardProps> = ({ count, title, percentage }) => {
  return (
    <div className="relative flex-col justify-between flex p-5 h-full rounded-xl border bg-card text-card-foreground shadow">
      <div className="flex justify-end">
        <PiDotsThreeOutlineFill className="text-2xl" />
      </div>
      <p className="text-5xl font-bold">{count}</p>
      <p className=" font-bold">{title}</p>

      <div className="flex justify-between">
        <p className="text-[#666] text-sm">
          CRS/Total:{" "}
          <span className="text-black font-bold">{percentage} %</span>
        </p>
        <p className="text-[#666] text-sm">
          Trending: <span className="text-black font-bold">N/A</span> %
        </p>
      </div>
    </div>
  );
};

export default DummyCard;
