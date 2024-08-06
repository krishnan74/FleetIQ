import React from "react";
import { CiSearch } from "react-icons/ci";
import { FaBell } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { PiLineVerticalThin } from "react-icons/pi";
import { RxAvatar } from "react-icons/rx";
import { AreaChartComponent } from "./components/AreaChartComponent";
import { PieChartComponent } from "./components/PieChartComponent";
import { TransactionComponent } from "./components/TransactionComponent";
import { AvatarComponent } from "../../components/Avatar";
import DummyCard from "./components/DummyCard";

const Page = () => {
  return (
    <div className="flex flex-col p-8 bg-white w-full rounded-3xl">
      <div className="flex justify-between items-center mb-8">
        <p className="text-2xl font-bold">
          Dashboard Overview <br />{" "}
          <span className="text-base font-normal text-[#666]">
            10th July 2024
          </span>
        </p>
        <div className="flex items-center">
          <CiSearch className="text-2xl " />
          <FaBell className="text-2xl  ml-8" />
          <IoMdSettings className="text-2xl ml-8" />

          <PiLineVerticalThin className="text-2xl ml-4 mr-3" />
          <AvatarComponent />
          <p className="font-bold text-lg ml-4">Rajesh Kumar</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-10 ">
        <div className="col-span-2 row-span-2">
          <AreaChartComponent />
        </div>
        <div className="col-span-1 row-span-2">
          <PieChartComponent />
        </div>
        <div className="row-span-1">
          <DummyCard count={48} title="Pending Dispatch" percentage="30.00" />
        </div>
        <div className="row-span-1">
          <DummyCard count={14} title="Pending Dispatch" percentage="30.00" />
        </div>
        <div className="row-span-1">
          <DummyCard count={80} title="Pending Dispatch" percentage="30.00" />
        </div>
        <div className="col-span-1 row-span-2">
          <PieChartComponent />
        </div>
        <div className="col-span-2 row-span-2">
          <TransactionComponent />
        </div>
        <div className="row-span-1">
          <DummyCard count={17} title="Pending Dispatch" percentage="30.00" />
        </div>
      </div>
    </div>
  );
};

export default Page;
