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

interface Trip {
  vendorId: string;
  partyId: string;
  driverId: string;
  truckId: string;
  from: string;
  to: string;
}

const AppTripDialogComponent = () => {
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
  });

  const handleChange = (name: string, value: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
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
          <Button onClick={() => setOpen(true)}>Add Trip</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-bold text-2xl pb-10 border-b mb-5">
              Add Trip Details
            </DialogTitle>
            <DialogDescription>
              <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-x-5 gap-y-5">
                  <div className="flex flex-col">
                    <label htmlFor="party">Select Party</label>
                    <Select
                      value={formData.partyId}
                      onValueChange={(value) => handleChange("partyId", value)}
                    >
                      <SelectTrigger className="w-[180px]">
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
                    <label htmlFor="vendor">Select Vendor</label>
                    <Select
                      value={formData.vendorId}
                      onValueChange={(value) => handleChange("vendorId", value)}
                    >
                      <SelectTrigger className="w-[180px]">
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
                    <label htmlFor="driver">Select Driver</label>
                    <Select
                      value={formData.driverId}
                      onValueChange={(value) => handleChange("driverId", value)}
                    >
                      <SelectTrigger className="w-[180px]">
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
                    <label htmlFor="truck">
                      Select Truck Registration Number
                    </label>
                    <Select
                      value={formData.truckId}
                      onValueChange={(value) => handleChange("truckId", value)}
                    >
                      <SelectTrigger className="w-[180px]">
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
                    <label htmlFor="from">From</label>
                    <Select
                      value={formData.from}
                      onValueChange={(value) => handleChange("from", value)}
                    >
                      <SelectTrigger className="w-[180px]">
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
                    <label htmlFor="to">To</label>
                    <Select
                      value={formData.to}
                      onValueChange={(value) => handleChange("to", value)}
                    >
                      <SelectTrigger className="w-[180px]">
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
                </div>

                <DialogFooter className="justify-end border-t pt-10">
                  <DialogClose asChild>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setOpen(false)}
                    >
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

export default AppTripDialogComponent;
