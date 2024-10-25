import axios from "axios";
import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

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
import { ConsigneeDetails } from "@/lib/createInterface";

const AddConsignorDialogComponent = () => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<ConsigneeDetails>({
    gstNumber: "",
    name: "",
    addressLine1: "",
    addressLine2: "",
    state: "",
    zipCode: "",
    phone: "",
  });

  const handleChange = (name: string, value: any) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/consignor", formData);
      if (response.data.message === "success") {
        toast({
          title: "Consignor created successfully",
          description: `Name: ${response.data.data.name} | GSTNumber: ${response.data.data.gstNumber}`,
        });
        setOpen(false);
      } else {
        toast({
          title: "Consignor creation failed",
          description: "Please try again.",
        });
      }
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while creating the consignor.",
      });
      console.error("Error while creating consignor:", error);
    }
  };

  const fetchDetailsFromGST = async () => {
    if (formData.gstNumber) {
      try {
        const gstResponse = await axios.get(
          `/api/checkGST?gstNumber=${formData.gstNumber}`
        );
        const data = gstResponse.data.data.data;

        console.log(data);

        const addLine1 = data.pradr.adr
          .split(",")
          .slice(0, data.pradr.adr.split(",").length / 2)
          .join(",");

        const addLine2 = data.pradr.adr
          .split(",")
          .slice(data.pradr.adr.split(",").length / 2)
          .join(",");

        // Update formData with fetched details if needed
        setFormData((prev) => ({
          ...prev,
          name: data.lgnm || prev.name,
          addressLine1: addLine1 || prev.addressLine1,
          addressLine2: addLine2 || prev.addressLine2,
          state: data.pradr.addr.stcd,
          zipCode: data.pradr.addr.pncd,
        }));
      } catch (error) {
        console.error("Error fetching GST details:", error);
      }
    }
  };

  return (
    <div>
      <Dialog
        open={open}
        onOpenChange={() => {
          setOpen(!open);
        }}
      >
        <DialogTrigger>
          <Button
            className="text-white bg-blue-500 hover:bg-blue-700"
            onClick={() => setOpen(true)}
          >
            Add Consignor
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-bold text-2xl pb-5 border-b mb-5">
              Add Consignor
            </DialogTitle>
            <DialogDescription>
              <p>We will be fetching details from GST Number</p>
              <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                <div className="flex flex-col">
                  <label
                    htmlFor="gstNumber"
                    className="text-gray-700 font-medium"
                  >
                    GST Number
                  </label>
                  <input
                    type="text"
                    id="gstNumber"
                    name="gstNumber"
                    value={formData.gstNumber}
                    onChange={(e) => handleChange("gstNumber", e.target.value)}
                    className="border border-gray-300 rounded-md p-2"
                    required
                  />
                  <Button
                    type="button"
                    onClick={fetchDetailsFromGST}
                    className="mt-2"
                  >
                    Fetch Details
                  </Button>
                </div>

                <div className="flex flex-col">
                  <label htmlFor="name" className="text-gray-700 font-medium">
                    Consignee Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="border border-gray-300 rounded-md p-2"
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="addressLine1"
                    className="text-gray-700 font-medium"
                  >
                    Consignee Address Line 1
                  </label>
                  <input
                    type="text"
                    id="addressLine1"
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={(e) =>
                      handleChange("addressLine1", e.target.value)
                    }
                    className="border border-gray-300 rounded-md p-2"
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="addressLine2"
                    className="text-gray-700 font-medium"
                  >
                    Consignee Address Line 2
                  </label>
                  <input
                    type="text"
                    id="addressLine2"
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={(e) =>
                      handleChange("addressLine2", e.target.value)
                    }
                    className="border border-gray-300 rounded-md p-2"
                  />
                </div>

                <div className="flex justify-between">
                  <div className="flex flex-col">
                    <label
                      htmlFor="state"
                      className="text-gray-700 font-medium"
                    >
                      State
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={(e) => handleChange("state", e.target.value)}
                      className="border border-gray-300 rounded-md p-2"
                      required
                    />
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor="zipCode"
                      className="text-gray-700 font-medium"
                    >
                      Pin code
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={(e) => handleChange("zipCode", e.target.value)}
                      className="border border-gray-300 rounded-md p-2"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <label htmlFor="phone" className="text-gray-700 font-medium">
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="border border-gray-300 rounded-md p-2"
                    required
                  />
                </div>

                <DialogFooter className="justify-end border-t pt-5">
                  <Button type="submit" className="bg-blue-500 text-white">
                    Submit
                  </Button>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
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

export default AddConsignorDialogComponent;
