import axios from "axios";
import React, { useEffect, useState } from "react";
import { Trip } from "@/lib/interface";
import { usePathname } from "next/navigation";
import { OnlineBiltyDetails } from "@/lib/createInterface";

interface BillComponentPage3Props {
  setOnlineBiltyDetails: (details: OnlineBiltyDetails) => void;
  onlineBiltyDetails: OnlineBiltyDetails;
}

const BillComponentPage3: React.FC<BillComponentPage3Props> = ({
  setOnlineBiltyDetails,
  onlineBiltyDetails,
}) => {
  const [tripDetails, setTripDetails] = useState<Trip | null>(null);

  const pathname = usePathname();
  const id = pathname.split("/")[2];

  const fetchTripDetails = async () => {
    try {
      const response = await axios.get(`/api/trip/${id}`);
      if (response.data.message === "success") {
        setTripDetails(response.data.data);
      }
    } catch (error) {
      console.error(
        "An error occurred while fetching tripDetails details",
        error
      );
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (
      name === "weight" ||
      name === "noOfPackages" ||
      name === "gstPercentage"
    ) {
      setOnlineBiltyDetails({
        ...onlineBiltyDetails,
        [name]: parseInt(value),
      });
      return;
    } else {
      setOnlineBiltyDetails({
        ...onlineBiltyDetails,
        [name]: value,
      });
    }
  };

  useEffect(() => {
    fetchTripDetails();
  }, []);

  return (
    <div className="p-5 bg-[#F1F0F2] h-[70vh] overflow-y-scroll">
      {/* Trip Details Header */}
      <h2 className="text-gray-700 text-sm">TRIP DETAILS</h2>

      {/* Main Card */}
      <div className="bg-[#111E37] rounded-lg p-4 text-white mt-2">
        <div className="flex justify-between">
          {/* From Location and Date */}
          <div>
            <p className="font-semibold">{tripDetails?.from}</p>
            <p className="text-sm">
              {tripDetails?.startedAt
                ? new Date(tripDetails.startedAt).toDateString()
                : "--"}
            </p>
          </div>

          {/* Arrow and Destination */}
          <div className="flex items-center">
            <div className="mx-2 text-lg">→</div>
          </div>

          {/* To Location and Date */}
          <div>
            <p className="font-semibold">{tripDetails?.to}</p>
            <p className="text-sm">
              {tripDetails?.completedAt
                ? new Date(tripDetails.completedAt).toDateString()
                : "--"}
            </p>
          </div>
        </div>

        {/* Details Below Locations */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          {/* Left Column */}
          <div className="flex flex-col gap-2">
            {/* Party Name */}
            <div>
              <p className="text-gray-400 text-sm">Party Name</p>
              <p className="font-semibold">{tripDetails?.party.name}</p>
            </div>

            {/* Freight Amount */}
            <div>
              <p className="text-gray-400 text-sm">Freight Amount</p>
              <p className="font-semibold">
                ₹ {tripDetails?.partyFreightAmount}
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-2">
            {/* Billing Type */}
            <div>
              <p className="text-gray-400 text-sm">Billing Type</p>
              <p className="font-semibold">--</p>
            </div>

            {/* Party Balance */}
            <div>
              <p className="text-gray-400 text-sm">Party Balance</p>
              <p className="font-semibold">₹ {tripDetails?.partyBalance}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Load Details Section */}
      <div className="bg-white rounded-lg p-4 mt-4">
        <h2 className="text-gray-800 font-semibold mb-4">Load Details</h2>

        {/* Material Category */}
        <div className="mb-4">
          <label className="block text-gray-600 text-sm mb-1">
            Material Category*
          </label>
          <input
            type="text"
            name="material"
            value={onlineBiltyDetails.material}
            onChange={handleInputChange}
            placeholder="Eg: Steel"
            className="w-full border-gray-300 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Weight and Unit */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <label className="block text-gray-600 text-sm mb-1">Weight</label>
            <input
              type="number"
              name="weight"
              value={onlineBiltyDetails.weight}
              onChange={handleInputChange}
              className="w-full border-gray-300 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-gray-600 text-sm mb-1">Unit</label>
            <select
              name="unit"
              value={onlineBiltyDetails.unit}
              onChange={handleInputChange}
              className="w-full border-gray-300 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Tonnes">Tonnes</option>
              <option value="Kilograms">Kilograms</option>
            </select>
          </div>
        </div>

        {/* No. of Bags / Box / Shipments */}
        <div className="mb-4">
          <label className="block text-gray-600 text-sm mb-1">
            No. of Bags / Box / Shipments
          </label>
          <input
            type="number"
            name="noOfPackages"
            value={onlineBiltyDetails.noOfPackages}
            onChange={handleInputChange}
            className="w-full border-gray-300 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Freight Paid By */}
        <div className="mb-4">
          <p className="text-gray-600 text-sm mb-1">FREIGHT PAID BY</p>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="paidBy"
                value="Consignor"
                checked={onlineBiltyDetails.paidBy === "Consignor"}
                onChange={handleInputChange}
                className="form-radio text-blue-500"
              />
              <span className="ml-2">Consignor</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="paidBy"
                value="Consignee"
                checked={onlineBiltyDetails.paidBy === "Consignee"}
                onChange={handleInputChange}
                className="form-radio text-blue-500"
              />
              <span className="ml-2">Consignee</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="paidBy"
                value="Agent"
                checked={onlineBiltyDetails.paidBy === "Agent"}
                onChange={handleInputChange}
                className="form-radio text-blue-500"
              />
              <span className="ml-2">Agent</span>
            </label>
          </div>
        </div>

        {/* GST Percentage */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <label className="block text-gray-600 text-sm mb-1">
              GST Percentage
            </label>
            <input
              type="number"
              name="gstPercentage"
              value={onlineBiltyDetails.gstPercentage}
              onChange={handleInputChange}
              className="w-full border-gray-300 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center">
            <span className="text-gray-600 text-sm">%</span>
          </div>
        </div>

        {/* GST Paid By */}
        <div className="mb-4">
          <p className="text-gray-600 text-sm mb-1">GST PAID BY</p>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="gstPaidBy"
                value="Consignor"
                checked={onlineBiltyDetails.gstPaidBy === "Consignor"}
                onChange={handleInputChange}
                className="form-radio text-blue-500"
              />
              <span className="ml-2">Consignor</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="gstPaidBy"
                value="Consignee"
                checked={onlineBiltyDetails.gstPaidBy === "Consignee"}
                onChange={handleInputChange}
                className="form-radio text-blue-500"
              />
              <span className="ml-2">Consignee</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="gstPaidBy"
                value="Agent"
                checked={onlineBiltyDetails.gstPaidBy === "Agent"}
                onChange={handleInputChange}
                className="form-radio text-blue-500"
              />
              <span className="ml-2">Agent</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillComponentPage3;
