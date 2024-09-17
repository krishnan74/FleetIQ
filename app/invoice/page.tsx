import React from "react";
import AddPartyInvoiceDialogComponent from "./components/AddPartyInvoiceDialogComponent";
import Link from "next/link";

const Page = () => {
  return (
    <div className="flex flex-col items-center p-8 bg-gray-100 min-h-screen">
      <div className="flex gap-10 mt-10">
        <Link
          href={"/invoice/party"}
          className="bg-white shadow-lg rounded-lg p-6 w-80 h-40 flex items-center justify-center border border-gray-200"
        >
          <div className="text-center text-lg font-semibold text-gray-700">
            Party Invoice Page
          </div>
        </Link>
        <Link
          href={"/invoice/vendor"}
          className="bg-white shadow-lg rounded-lg p-6 w-80 h-40 flex items-center justify-center border border-gray-200"
        >
          <div className="text-center text-lg font-semibold text-gray-700">
            Vendor Invoice Page
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Page;
