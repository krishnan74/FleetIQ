import React from "react";
import Image from "next/image";
import ProfitReportDialogComponent from "./components/ProfitReportDialogComponent";
import TruckRevenueReportDialogComponent from "./components/TruckRevenueReportDialogComponent";
import PartyRevenueReportDialogComponent from "./components/PartyRevenueReportDialogComponent";
import PartyBalanceReportDialogComponent from "./components/PartyBalanceReportDialogComponent";
import VendorBalanceReportDialogComponent from "./components/VendorBalanceReportDialogComponent";
import TransactionReportDialogComponent from "./components/TransactionReportDialogComponent";

const Page = () => {
  return (
    <div className="grid grid-cols-3 gap-10">
      <ProfitReportDialogComponent />

      <TruckRevenueReportDialogComponent />

      <PartyRevenueReportDialogComponent />

      <PartyBalanceReportDialogComponent />

      <VendorBalanceReportDialogComponent />

      <TransactionReportDialogComponent />
      {/*
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
      </div> */}
    </div>
  );
};

export default Page;
