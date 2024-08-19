"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { DatePicker } from "@/components/DatePicker";
import axios from "axios";

interface PartyDetails {
  name: string;
  phone: string;
  openingBalance: number; // Should be a number
  openingBalanceDate: string;
}

const AddVendorDialogComponent = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",

    email: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const [key, nestedKey] = name.split(".");

    // Handling non-nested fields
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
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
    <div>
      <Dialog>
        <DialogTrigger>
          <Button className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700">
            Add Vendor
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-bold text-2xl pb-10 border-b mb-5">
              Add Vendor Details
            </DialogTitle>
            <DialogDescription>
              <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                <div className=" mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Vendor Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                      placeholder="Enter vendor name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                      placeholder="Enter email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                      placeholder="Enter phone number"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <DialogFooter className="justify-end border-t pt-10">
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">
                      Close
                    </Button>
                  </DialogClose>
                  <Button type="submit">Save Changes</Button>
                </DialogFooter>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddVendorDialogComponent;
