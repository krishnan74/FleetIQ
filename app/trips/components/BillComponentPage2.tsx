import React, { useState } from "react";
import { DatePicker } from "@/components/DatePicker";

const BillComponentPage2 = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  return (
    <div className="w-full max-w-md bg-gray-200 shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold text-center mb-4 text-black">
        LR & Consigner Consignee Details
      </h2>

      <div className="flex-1">
        <label htmlFor="date">LR Date *</label>
        <div className="mt-3">
          <DatePicker date={selectedDate} setDate={setSelectedDate} />
        </div>
      </div>

      <div className="flex-1">
        <label htmlFor="date">LR Number *</label>
        <div className="mt-3"></div>
      </div>

      <div className="mb-4">
        <p className="font-semibold">Consignor Details</p>
        <div className="p-5 bg-gray-300">
          <div>Add Consignor</div>
        </div>
      </div>

      <div className="mb-4">
        <p className="font-semibold">Consignor Details</p>
        <div className="p-5 bg-gray-300">
          <div>Add Consignee</div>
        </div>
      </div>
    </div>
  );
};

export default BillComponentPage2;
