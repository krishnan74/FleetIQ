"use client";
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { CiSearch } from "react-icons/ci";
import { FaBell } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { useToast } from "@/components/ui/use-toast";
import VendorCard from "@/components/VendorCard";

interface VendorDetails {
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

const Page = () => {
  const { toast } = useToast();
  const [vendorDetails, setVendorDetails] = useState<VendorDetails[]>();
  const [formData, setFormData] = useState({
    name: "",
    address: {
      doorNumber: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
    },
    email: "",
    phone: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("/api/vendor/");
      if (response.data.message === "success") {
        setVendorDetails(response.data.data);
        console.log("Vendor details : ", response.data.data);
      }
    } catch (e: any) {
      console.log("Error while fetching vendors :: ", e);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const [key, nestedKey] = name.split(".");

    if (nestedKey) {
      // Handling nested address fields
      setFormData((prevFormData) => ({
        ...prevFormData,
        address: {
          ...prevFormData.address,
          [nestedKey]: value,
        },
      }));
    } else {
      // Handling non-nested fields
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log("Form Data :: ", formData);
    e.preventDefault(); // Prevents default form submission behavior
    try {
      const response = await axios.post("/api/vendor/", formData);
      if (response.data.message === "success") {
        toast({
          title: "Vendor created successfully",
          description: `Name: ${response.data.data.name} | Email: ${response.data.data.email}`,
        });
      }
    } catch (e: any) {
      console.log("Error while creating vendor :: ", e);
    }
  };

  return (
    <div className="flex flex-col p-8 bg-white gap-10 w-full h-full rounded-lg">
      <div className="">
        <p className="text-2xl font-bold mb-4">Current Vendors</p>
        {vendorDetails ? (
          <div className="flex flex-wrap gap-10">
            {vendorDetails.map((vendor) => (
              <VendorCard key={vendor.id} {...vendor} />
            ))}
          </div>
        ) : (
          <p>No vendors found</p>
        )}
      </div>

      <div className=" mb-4">
        <p className="text-2xl font-bold mb-4">
          Create Vendor <br />{" "}
          <span className="text-base font-normal text-[#666] ">
            Fill in the details below
          </span>
        </p>
        <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Vendor Name
            </label>
            <input
              type="text"
              name="name"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter vendor name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div className="flex gap-10">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Door Number
              </label>
              <input
                type="text"
                name="address.doorNumber"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter door number"
                value={formData.address.doorNumber}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Street Address
              </label>
              <input
                type="text"
                name="address.street"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter street address"
                value={formData.address.street}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                name="address.city"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter city"
                value={formData.address.city}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                State
              </label>
              <input
                type="text"
                name="address.state"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter state"
                value={formData.address.state}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                ZIP Code
              </label>
              <input
                type="text"
                name="address.zipCode"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter ZIP code"
                value={formData.address.zipCode}
                onChange={handleChange}
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 p-2 bg-blue-500 text-white rounded-md"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;
