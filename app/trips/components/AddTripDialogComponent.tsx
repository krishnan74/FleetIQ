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
import { DatePicker } from "@/components/DatePicker";
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
import { DataFormProps } from "@/lib/interface";
import { TruckOwnership } from "@prisma/client";

const AddTripDialogComponent = () => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const [vendor, setVendor] = useState<VendorDetails>();
  const [drivers, setDrivers] = useState<DriverDetails[]>();

  const [parties, setParties] = useState<PartyDetails[]>();
  const [trucks, setTrucks] = useState<Truck[]>();
  const [selectedTruckOwnership, setSelectedTruckOwnership] =
    useState<String>();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const [showMore, setShowMore] = useState(false);

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
    startedAt: "",
    partyFreightAmount: 0,
    startKMSReadings: 0,
    vendorBalance: 0,
    lrNumber: "",
    material: "",
    notes: "",
  });

  const handleChange = async (name: string, value: any) => {
    if (name == "truckId") {
      const truckResponse = await axios.get(`/api/truck/${value}`);
      const vendor: VendorDetails = truckResponse.data.data.vendor;
      setVendor(vendor);

      setFormData((prevFormData) => ({
        ...prevFormData,
        vendorId: vendor.id,
      }));
    }

    if (name == "partyFreightAmount" || name == "startKMSReadings") {
      value = Number(value);
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]:
        name == "partyFreightAmount" ||
        name == "startKMSReadings" ||
        name == "vendorBalance"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("Form data:", formData);

    const formattedDate = selectedDate ? selectedDate.toISOString() : "";

    try {
      const response = await axios.post("/api/trip/", {
        ...formData,
        startedAt: formattedDate,
      });
      if (response.data.message === "success") {
        toast({
          title: "Trip created successfully",
          description: `From: ${response.data.data.from} | To: ${response.data.data.to}`,
        });
        setOpen(false);
        window.location.reload();
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
                    {vendor && (
                      <>
                        <label
                          htmlFor="vendor"
                          className="text-gray-700 font-medium"
                        >
                          Select Vendor
                        </label>
                        <Select value={formData.vendorId} disabled={true}>
                          <SelectTrigger className="w-full mt-2 bg-gray-100 border border-gray-300 rounded-md px-3 py-2">
                            <SelectValue placeholder="Select a vendor" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value={formData.vendorId}>
                                {vendor?.name}
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </>
                    )}
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
                            <SelectItem
                              key={truck.id}
                              value={truck.id}
                              onClick={() =>
                                setSelectedTruckOwnership(truck.truckOwnerShip)
                              }
                            >
                              <div className="border p-3 flex gap-5">
                                {truck.registrationNumber}
                                <div
                                  className={`px-3 py-1 ${
                                    truck.truckOwnerShip == "MY_TRUCK"
                                      ? "bg-blue-500"
                                      : "bg-orange-500"
                                  }`}
                                >
                                  {truck.truckOwnerShip}
                                </div>
                              </div>
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

                  {vendor?.name != "Own Vendor" && (
                    <div className="flex flex-col">
                      <label
                        htmlFor="vendorBalance"
                        className="text-gray-700 font-medium"
                      >
                        Truck Hire Cost
                      </label>
                      <input
                        type="number"
                        value={formData.vendorBalance}
                        onChange={(e) =>
                          handleChange("vendorBalance", e.target.value)
                        }
                        className="w-full mt-2 bg-gray-100 border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>
                  )}

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

                  <div className="flex items-center col-span-2">
                    <div className=" flex-1">
                      <label
                        htmlFor="startDate"
                        className="text-gray-700 font-medium"
                      >
                        Start Date
                      </label>
                      <div className="mt-3">
                        <DatePicker
                          date={selectedDate}
                          setDate={setSelectedDate}
                        />
                      </div>
                    </div>
                    <Button
                      className="flex-1"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowMore(true);
                      }}
                    >
                      Add More Details
                    </Button>
                  </div>

                  {showMore && (
                    <>
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
                          onChange={(e) =>
                            handleChange("lrNumber", e.target.value)
                          }
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
                          onChange={(e) =>
                            handleChange("material", e.target.value)
                          }
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
                          onChange={(e) =>
                            handleChange("notes", e.target.value)
                          }
                          className="w-full mt-2 bg-gray-100 border border-gray-300 rounded-md px-3 py-2"
                          rows={4}
                        />
                      </div>
                    </>
                  )}
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
