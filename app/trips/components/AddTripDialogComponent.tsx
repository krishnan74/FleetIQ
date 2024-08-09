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
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import {
  PartyDetails,
  DriverDetails,
  VendorDetails,
  Truck,
} from "@/lib/interface";

import { locations } from "@/lib/utils";
import { Trip } from "@/lib/createInterface";

const AddTripDialogComponent = () => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const [vendors, setVendors] = useState<VendorDetails[]>();
  const [drivers, setDrivers] = useState<DriverDetails[]>();
  const [parties, setParties] = useState<PartyDetails[]>();
  const [trucks, setTrucks] = useState<Truck[]>();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [vendorResponse, driverResponse, partyResponse, truckResponse] =
        await Promise.all([
          axios.get("/api/vendor/"),
          axios.get("/api/driver/"),
          axios.get("/api/party/"),
          axios.get("/api/truck/"),
        ]);

      setVendors(vendorResponse.data.data);
      setDrivers(driverResponse.data.data);
      setParties(partyResponse.data.data);
      setTrucks(truckResponse.data.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch data.",
      });
      console.error("Error fetching data:", error);
    }
  };

  const [formData, setFormData] = useState<Trip>({
    from: "",
    to: "",
    vendorId: "",
    driverId: "",
    partyId: "",
    truckId: "",
    partyFreightAmount: 0,
    startKMSReadings: 0,
    lrNumber: "",
    material: "",
    notes: "",
  });

  const handleChange = (name: string, value: any) => {
    if (name == "partyFreightAmount" || name == "startKMSReadings") {
      value = Number(value);
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]:
        name == "partyFreightAmount" || name == "startKMSReadings"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("Form data:", formData);

    try {
      const response = await axios.post("/api/trip/", formData);
      if (response.data.message === "success") {
        toast({
          title: "Trip created successfully",
          description: `From: ${response.data.data.from} | To: ${response.data.data.to}`,
        });
        setOpen(false); // Close the dialog on success
      } else {
        toast({
          title: "Trip creation failed",
          description: "Please try again.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while creating the trip.",
      });
      console.error("Error while creating trip:", error);
    }
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <Button className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700">
            Add Trip
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl bg-white p-6 rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle className="font-bold text-2xl text-gray-800 pb-4 border-b mb-6">
              Add Trip Details
            </DialogTitle>
            <DialogDescription>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <label
                      htmlFor="party"
                      className="text-gray-700 font-medium"
                    >
                      Select Party
                    </label>
                    <Select
                      value={formData.partyId}
                      onValueChange={(value) => handleChange("partyId", value)}
                    >
                      <SelectTrigger className="w-full mt-2 bg-gray-100 border border-gray-300 rounded-md px-3 py-2">
                        <SelectValue placeholder="Select a party" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {parties?.map((party) => (
                            <SelectItem key={party.id} value={party.id}>
                              {party.name}
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
                      Select Vendor
                    </label>
                    <Select
                      value={formData.vendorId}
                      onValueChange={(value) => handleChange("vendorId", value)}
                    >
                      <SelectTrigger className="w-full mt-2 bg-gray-100 border border-gray-300 rounded-md px-3 py-2">
                        <SelectValue placeholder="Select a vendor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {vendors?.map((vendor) => (
                            <SelectItem key={vendor.id} value={vendor.id}>
                              {vendor.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor="driver"
                      className="text-gray-700 font-medium"
                    >
                      Select Driver
                    </label>
                    <Select
                      value={formData.driverId}
                      onValueChange={(value) => handleChange("driverId", value)}
                    >
                      <SelectTrigger className="w-full mt-2 bg-gray-100 border border-gray-300 rounded-md px-3 py-2">
                        <SelectValue placeholder="Select a driver" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {drivers?.map((driver) => (
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
                      htmlFor="truck"
                      className="text-gray-700 font-medium"
                    >
                      Select Truck Registration Number
                    </label>
                    <Select
                      value={formData.truckId}
                      onValueChange={(value) => handleChange("truckId", value)}
                    >
                      <SelectTrigger className="w-full mt-2 bg-gray-100 border border-gray-300 rounded-md px-3 py-2">
                        <SelectValue placeholder="Select a Truck Registration Number" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {trucks?.map((truck) => (
                            <SelectItem key={truck.id} value={truck.id}>
                              {truck.registrationNumber}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="from" className="text-gray-700 font-medium">
                      From
                    </label>
                    <Select
                      value={formData.from}
                      onValueChange={(value) => handleChange("from", value)}
                    >
                      <SelectTrigger className="w-full mt-2 bg-gray-100 border border-gray-300 rounded-md px-3 py-2">
                        <SelectValue placeholder="Select Origin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {locations?.map((location) => (
                            <SelectItem key={location} value={location}>
                              {location}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="to" className="text-gray-700 font-medium">
                      To
                    </label>
                    <Select
                      value={formData.to}
                      onValueChange={(value) => handleChange("to", value)}
                    >
                      <SelectTrigger className="w-full mt-2 bg-gray-100 border border-gray-300 rounded-md px-3 py-2">
                        <SelectValue placeholder="Select Destination" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {locations?.map((location) => (
                            <SelectItem key={location} value={location}>
                              {location}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor="partyFreightAmount"
                      className="text-gray-700 font-medium"
                    >
                      Party Freight Amount
                    </label>
                    <input
                      type="number"
                      value={formData.partyFreightAmount}
                      onChange={(e) =>
                        handleChange("partyFreightAmount", e.target.value)
                      }
                      className="w-full mt-2 bg-gray-100 border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor="startKMSReadings"
                      className="text-gray-700 font-medium"
                    >
                      Start KMS Readings
                    </label>
                    <input
                      type="number"
                      value={formData.startKMSReadings}
                      onChange={(e) =>
                        handleChange("startKMSReadings", e.target.value)
                      }
                      className="w-full mt-2 bg-gray-100 border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor="lrNumber"
                      className="text-gray-700 font-medium"
                    >
                      LR Number
                    </label>
                    <input
                      type="text"
                      value={formData.lrNumber?.toString()}
                      onChange={(e) => handleChange("lrNumber", e.target.value)}
                      className="w-full mt-2 bg-gray-100 border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor="material"
                      className="text-gray-700 font-medium"
                    >
                      Material
                    </label>
                    <input
                      type="text"
                      value={formData.material?.toString()}
                      onChange={(e) => handleChange("material", e.target.value)}
                      className="w-full mt-2 bg-gray-100 border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>

                  <div className="flex flex-col col-span-2">
                    <label
                      htmlFor="notes"
                      className="text-gray-700 font-medium"
                    >
                      Notes
                    </label>
                    <textarea
                      value={formData.notes?.toString()}
                      onChange={(e) => handleChange("notes", e.target.value)}
                      className="w-full mt-2 bg-gray-100 border border-gray-300 rounded-md px-3 py-2"
                      rows={4}
                    />
                  </div>
                </div>

                <DialogFooter className="flex justify-end mt-6">
                  <Button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700"
                  >
                    Submit
                  </Button>
                  <DialogClose className="ml-3 text-gray-500 " asChild>
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

export default AddTripDialogComponent;
