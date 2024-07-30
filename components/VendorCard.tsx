import React from "react";
import { PiDotsThreeOutlineFill } from "react-icons/pi";

interface VendorCardProps {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: {
    id: string;
    doorNumber: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    vendorId: string;
  };
  trips: [];
}

const VendorCard: React.FC<VendorCardProps> = ({
  id,
  name,
  email,
  phone,
  address,
  trips,
}) => {
  return (
    <div className="relative w-[300px] p-6 h-full bg-white border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out">
      <div className="absolute top-4 right-4 text-gray-600">
        <PiDotsThreeOutlineFill className="text-xl cursor-pointer hover:text-gray-800" />
      </div>
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">{name}</h2>
      </div>
      <div className="space-y-1">
        <p className="text-gray-700">
          <span className="font-medium">Email:</span> {email}
        </p>
        <p className="text-gray-700">
          <span className="font-medium">Phone:</span> {phone}
        </p>
        <p className="text-gray-700">
          <span className="font-medium">Address:</span>
          <br />
          {address.doorNumber} {address.street}
          <br />
          {address.city}, {address.state} {address.zipCode}
        </p>
      </div>
    </div>
  );
};

export default VendorCard;
