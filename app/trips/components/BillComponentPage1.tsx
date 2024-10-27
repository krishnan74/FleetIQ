import { BillFormProps, UserDetails } from "@/lib/interface";
import axios from "axios";
import React, { useEffect, useState } from "react";

const BillComponentPage1: React.FC<BillFormProps> = ({ setPageNo, pageNo }) => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get("/api/user/1");
      if (response.data.message === "success") {
        setUserDetails(response.data.data);
      }
    } catch (error) {
      console.error("An error occurred while fetching user details", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  return (
    <div className="w-full max-w-md bg-gray-200 shadow-md rounded-lg p-6">
      <div className="mb-4">
        <p className="font-semibold">Company Name</p>
        <p className="text-black">{userDetails?.companyName || "--"}</p>
      </div>

      <div className="mb-4">
        <p className="font-semibold">GST Number</p>
        <p className="text-black">{userDetails?.gstNumber || "--"}</p>
      </div>

      <div className="mb-4">
        <p className="font-semibold">Company Address Line 1</p>
        <p className="text-black">{userDetails?.doorNumber || "--"}</p>
      </div>

      <div className="mb-4">
        <p className="font-semibold">Company Address Line 2</p>
        <p className="text-black">{userDetails?.street || "--"}</p>
      </div>

      <div className="flex justify-between mb-4">
        <div>
          <p className="font-semibold">State</p>
          <p className="text-black">{userDetails?.state || "--"}</p>
        </div>

        <div>
          <p className="font-semibold">Pincode</p>
          <p className="text-black">{userDetails?.zipCode || "--"}</p>
        </div>
      </div>

      <div>
        <p className="font-semibold">Mobile Number</p>
        <p className="text-black">{userDetails?.phone || "--"}</p>
      </div>
    </div>
  );
};

export default BillComponentPage1;
