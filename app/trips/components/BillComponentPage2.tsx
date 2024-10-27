import React, { useEffect, useState } from "react";
import { DatePicker } from "@/components/DatePicker";
import AddConsigneeDialogComponent from "./AddConsigneeDialogComponent";
import axios from "axios";
import AddConsignorDialogComponent from "./AddConsignorDialogComponent";
import { ConsigneeDetails } from "@/lib/interface";
import { OnlineBiltyDetails } from "@/lib/createInterface";

interface BillComponentPage2Props {
  setOnlineBiltyDetails: (details: OnlineBiltyDetails) => void;
  onlineBiltyDetails: OnlineBiltyDetails;
}

const BillComponentPage2: React.FC<BillComponentPage2Props> = ({
  setOnlineBiltyDetails,
  onlineBiltyDetails,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedConsignor, setSelectedConsignor] =
    useState<ConsigneeDetails | null>(null);
  const [selectedConsignee, setSelectedConsignee] =
    useState<ConsigneeDetails | null>(null);

  const [consignorDetails, setConsignorDetails] = useState<ConsigneeDetails[]>(
    []
  );

  const [consigneeDetails, setConsigneeDetails] = useState<ConsigneeDetails[]>(
    []
  );

  const getConsignorDetails = async () => {
    const response = await axios.get("/api/consignor");
    setConsignorDetails(response.data.data);
  };

  const getConsigneeDetails = async () => {
    const response = await axios.get("/api/consignee");
    setConsigneeDetails(response.data.data);
  };

  useEffect(() => {
    getConsignorDetails();
    getConsigneeDetails();
  }, []);

  return (
    <div className="w-full max-w-md bg-gray-200 shadow-md rounded-lg p-6 overflow-y-scroll h-[70vh]">
      <div className="flex flex-col gap-3">
        {/* LR Date */}
        <div className="flex-1">
          <label htmlFor="date">LR Date *</label>
          <div className="mt-3">
            <DatePicker date={selectedDate} setDate={setSelectedDate} />
          </div>
        </div>

        {/* Consignor Details */}
        <div className="">
          <p className="font-semibold mb-2">Consignor Details</p>
          <div className="p-5 bg-gray-300 rounded-md">
            {selectedConsignor && (
              <div className="bg-white p-4 shadow-md rounded-md mb-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-lg font-bold">{selectedConsignor?.name}</p>
                </div>
                <p>
                  <span className="font-semibold">GST Number: </span>
                  <a href="#" className="text-blue-600">
                    {selectedConsignor?.gstNumber}
                  </a>
                </p>
                <div className="mt-2">
                  <p>{selectedConsignor?.addressLine1}</p>
                  <p>{selectedConsignor?.addressLine2}</p>
                  <p>
                    <span className="font-semibold">State: </span>
                    {selectedConsignor?.state}
                    <span className="ml-2 font-semibold">Pincode: </span>
                    {selectedConsignor?.zipCode}
                  </p>
                  <p>
                    <span className="font-semibold">Mobile Number: </span>
                    {selectedConsignor?.phone || "--"}
                  </p>
                </div>
              </div>
            )}
            {consignorDetails.map((consignor, index) => (
              <div
                key={index}
                className="bg-white p-4 shadow-md rounded-md mb-4"
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="text-lg font-bold">{consignor.name}</p>
                  <button
                    className="text-blue-500 font-semibold"
                    onClick={() => {
                      setOnlineBiltyDetails({
                        ...onlineBiltyDetails,
                        ["consignorId"]: consignor.id,
                      });
                      setSelectedConsignor(consignor);
                    }}
                  >
                    Select
                  </button>
                </div>
              </div>
            ))}
            <AddConsignorDialogComponent />
          </div>
        </div>

        {/* Consignee Details */}
        <div className="">
          <p className="font-semibold mb-2">Consignee Details</p>
          <div className="p-5 bg-gray-300 rounded-md">
            {selectedConsignee && (
              <div className="bg-white p-4 shadow-md rounded-md mb-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-lg font-bold">{selectedConsignee?.name}</p>
                </div>
                <p>
                  <span className="font-semibold">GST Number: </span>
                  <a href="#" className="text-blue-600">
                    {selectedConsignee?.gstNumber}
                  </a>
                </p>
                <div className="mt-2">
                  <p>{selectedConsignee?.addressLine1}</p>
                  <p>{selectedConsignee?.addressLine2}</p>
                  <p>
                    <span className="font-semibold">State: </span>
                    {selectedConsignee?.state}
                    <span className="ml-2 font-semibold">Pincode: </span>
                    {selectedConsignee?.zipCode}
                  </p>
                  <p>
                    <span className="font-semibold">Mobile Number: </span>
                    {selectedConsignee?.phone || "--"}
                  </p>
                </div>
              </div>
            )}
            {consigneeDetails.map((consignee, index) => (
              <div
                key={index}
                className="bg-white p-4 shadow-md rounded-md mb-4"
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="text-lg font-bold">{consignee.name}</p>
                  <button
                    className="text-blue-500 font-semibold"
                    onClick={() => {
                      setOnlineBiltyDetails({
                        ...onlineBiltyDetails,
                        ["consigneeId"]: consignee.id,
                      });

                      setSelectedConsignee(consignee);
                    }}
                  >
                    Select
                  </button>
                </div>
              </div>
            ))}
            <AddConsigneeDialogComponent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillComponentPage2;
