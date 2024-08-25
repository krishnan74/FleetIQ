"use client";
import React, { useEffect, useState } from "react";
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

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { TruckType, TruckOwnership } from "@prisma/client";

import { DriverDetails, VendorDetails } from "@/lib/interface";
import { Truck } from "@/lib/createInterface";
import { DataFormProps } from "@/lib/interface";

const AddTruckDialogComponent: React.FC<DataFormProps> = ({
  setRefresh,
  refresh,
  className,
}) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const [drivers, setDrivers] = useState<DriverDetails[]>([]);
  const [vendors, setVendors] = useState<VendorDetails[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [vendorResponse, driverResponse] = await Promise.all([
        axios.get(`api/vendor/`),
        axios.get(`api/driver/`),
      ]);

      setVendors(vendorResponse.data.data || []);
      setDrivers(driverResponse.data.data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch data.",
      });
      console.error("Error fetching data:", error);
    }
  };

  const [formData, setFormData] = useState<Truck>({
    registrationNumber: "",
    truckType: TruckType.MINI_TRUCK,
    truckOwnerShip: TruckOwnership.MARKET_TRUCK,
    driverId: "",
    vendorId: "66bb0206785fb2b819768411",
  });

  const handleChange = (name: string, value: any) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("formData", formData);

    try {
      const response = await axios.post("/api/truck/", formData);
      if (response.data.message === "success") {
        toast({
          title: "Truck created successfully",
          description: `Registration Number: ${response.data.data.registrationNumber} | Type: ${response.data.data.truckType}`,
        });
        setOpen(false);
        setRefresh ? setRefresh(!refresh) : window.location.reload();
      } else {
        toast({
          title: "Truck creation failed",
          description: "Please try again.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while creating the Truck.",
      });
      console.error("Error while creating Truck:", error);
    }
  };

  return (
    <div className={className}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className={className}>
          <Button
            className={`${className} bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700`}
          >
            Add Truck
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl bg-white p-6 rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle className="font-bold text-2xl text-gray-800 pb-4 border-b mb-6">
              Add Truck Details
            </DialogTitle>
            <DialogDescription>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <label
                      htmlFor="truckRegistrationNumber"
                      className="text-gray-700 font-medium"
                    >
                      Truck Registration Number *
                    </label>
                    <input
                      type="text"
                      id="truckRegistrationNumber"
                      value={formData.registrationNumber}
                      onChange={(e) =>
                        handleChange("registrationNumber", e.target.value)
                      }
                      className="w-full mt-2 bg-gray-100 border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor="truckOwnerShip"
                      className="text-gray-700 font-medium mb-3"
                    >
                      Ownership *
                    </label>
                    <RadioGroup
                      required
                      value={formData.truckOwnerShip}
                      onValueChange={(value) =>
                        handleChange("truckOwnerShip", value)
                      }
                      className="flex flex-wrap gap-x-10"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={TruckOwnership.MARKET_TRUCK}
                          id="marketTruck"
                        />
                        <label htmlFor="marketTruck">Market Truck</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={TruckOwnership.MY_TRUCK}
                          id="myTruck"
                        />
                        <label htmlFor="myTruck">My Truck</label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="col-span-2 flex flex-wrap justify-center gap-5">
                    {Object.keys(TruckType).map((key) => {
                      const value = TruckType[key as keyof typeof TruckType];
                      const isSelected = formData.truckType === value;
                      return (
                        <div
                          key={key}
                          onClick={() => handleChange("truckType", value)}
                          className={`cursor-pointer p-6 border rounded-md ${
                            isSelected ? "border-blue-500" : "border-gray-300"
                          }`}
                        >
                          {value}
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor="driver"
                      className="text-gray-700 font-medium"
                    >
                      Select Driver *
                    </label>
                    <Select
                      required
                      value={formData.driverId}
                      onValueChange={(value) => handleChange("driverId", value)}
                    >
                      <SelectTrigger className="w-full mt-2 bg-gray-100 border border-gray-300 rounded-md px-3 py-2">
                        <SelectValue placeholder="Select a driver" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {drivers.map((driver) => (
                            <SelectItem key={driver.id} value={driver.id}>
                              {driver.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor="vendor"
                      className="text-gray-700 font-medium"
                    >
                      Select a Vendor *
                    </label>
                    <Select
                      required
                      value={formData.vendorId}
                      onValueChange={(value) => handleChange("vendorId", value)}
                      disabled={
                        formData.truckOwnerShip === TruckOwnership.MY_TRUCK
                      }
                    >
                      <SelectTrigger className="w-full mt-2 bg-gray-100 border border-gray-300 rounded-md px-3 py-2">
                        <SelectValue
                          placeholder={
                            formData.truckOwnerShip === TruckOwnership.MY_TRUCK
                              ? "Own Truck"
                              : "Select a Vendor"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {vendors.map((vendor) => (
                            <SelectItem key={vendor.id} value={vendor.id}>
                              {vendor.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <DialogFooter className="flex justify-end mt-6">
                  <Button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700"
                  >
                    Submit
                  </Button>
                  <DialogClose className="ml-3 text-gray-500" asChild>
                    <Button
                      type="button"
                      className="bg-red-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-700"
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddTruckDialogComponent;
