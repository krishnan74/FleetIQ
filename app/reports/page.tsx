import React from "react";
import Image from "next/image";

const Page = () => {
  return (
    <div className="grid grid-cols-3">
      <div className="flex gap-5 p-5 border">
        <Image src={"/"} height={50} width={50} alt=""></Image>
        <p>Profit & Loss Report </p>
      </div>
      <div className="flex gap-5 p-5 border">
        <Image src={"/"} height={50} width={50} alt=""></Image>
        <p>Truck Revenue Report </p>
      </div>
      <div className="flex gap-5 p-5 border">
        <Image src={"/"} height={50} width={50} alt=""></Image>
        <p>Party Revenue Report </p>
      </div>
      <div className="flex gap-5 p-5 border">
        <Image src={"/"} height={50} width={50} alt=""></Image>
        <p>Supplier Balance Revenue Report </p>
      </div>
      <div className="flex gap-5 p-5 border">
        <Image src={"/"} height={50} width={50} alt=""></Image>
        <p>Party Balance Report </p>
      </div>
      <div className="flex gap-5 p-5 border">
        <Image src={"/"} height={50} width={50} alt=""></Image>
        <p>Transaction Report </p>
      </div>
    </div>
  );
};

export default Page;
