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
import { DatePicker } from "@/components/DatePicker";
import axios from "axios";
import {
  PartyDetails,
  DriverDetails,
  VendorDetails,
  Truck,
} from "@/lib/interface";

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
    const vendorResponse = await axios.get("/api/vendor/");
    setVendors(vendorResponse.data.data);
    const driverResponse = await axios.get("/api/driver/");
    setDrivers(driverResponse.data.data);
    const partyResponse = await axios.get("/api/party/");
    setParties(partyResponse.data.data);
    const truckResponse = await axios.get("/api/truck/");
    setTrucks(truckResponse.data.data);
  };

  const [formData, setFormData] = useState<Trip>({
    from: "",
    to: "",
    vendorId: "",
    driverId: "",
    partyId: "",
    truckId: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "openingBalance") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: parseFloat(value) || 0, // Ensure it's a number
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/trip/", formData);
      if (response.data.message === "Success") {
        toast({
          title: "Party created successfully",
          description: `Name: ${response.data.data.name} | Opening Balance: ${response.data.data.openingBalance}`,
        });
      } else {
        toast({
          title: "Party creation failed",
          description: "Please try again.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while creating the party.",
      });
      console.error("Error while creating party:", error);
    }
  };

  const handleOpen = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger>
          <Button>Add Trip</Button>
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
                    <label htmlFor="party"> Select Party</label>
                    <Select>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a party" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel></SelectLabel>
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
                    <label htmlFor="vendor"> Select Vendor</label>
                    <Select>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a vendor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel></SelectLabel>
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
                    <label htmlFor="driver"> Select Driver</label>
                    <Select>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a driver" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel></SelectLabel>
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
                    <label htmlFor="truck_register_number">
                      {" "}
                      Select Truck Registration Number
                    </label>
                    <Select>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a Truck Registration Number" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel></SelectLabel>
                          {trucks?.map((truck) => (
                            <SelectItem key={truck.id} value={truck.id}>
                              {truck.registrationNumber}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
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

export default AppTripDialogComponent;
