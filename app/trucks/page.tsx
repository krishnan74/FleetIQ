import React from "react";
import { CiSearch } from "react-icons/ci";
import { FaBell } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";



const Page = () => {
  return (
    <div className="flex flex-col p-8 bg-white w-full h-full rounded-lg">
      <div className="flex justify-between">
        <p className="text-2xl font-bold">
          Dashboard Overview <br />{" "}
          <span className="text-base font-normal text-[#666]">
            10th July 2024
          </span>
        </p>
        <div className="flex"></div>
      </div>
    </div>
  );
};

export default Page;
