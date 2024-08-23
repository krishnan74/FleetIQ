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

import { PartyDetails } from "@/lib/createInterface";

const AddPartyDialogComponent: React.FC<{ userId: string }> = ({ userId }) => {
  const { toast } = useToast();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState<PartyDetails>({
    name: "",
    openingBalance: 0,
    openingBalanceDate: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Convert openingBalance to number if it's the correct field
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
    const formattedDate = selectedDate ? selectedDate.toISOString() : "";

    try {
      const response = await axios.post("/api/party/", {
        ...formData,
        openingBalanceDate: formattedDate,
      });
      if (response.data.message === "success") {
        toast({
          title: "Party created successfully",
          description: `Name: ${response.data.data.name} | Opening Balance: ${response.data.data.openingBalance}`,
        });
        setOpen(false);

        window.location.reload();
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
          <Button className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700">
            Add Party
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-bold text-2xl pb-10 border-b mb-5">
              Add Party Details
            </DialogTitle>
            <DialogDescription>
              <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                <div className="flex flex-col">
                  <label htmlFor="name">Enter Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter party name"
                    className="border border-gray-300 rounded-md p-2 mt-3"
                    required
                  />
                </div>

                <div className="flex gap-5">
                  <div className="flex-1">
                    <label htmlFor="openingBalance">Opening Balance *</label>
                    <input
                      type="number"
                      id="openingBalance"
                      name="openingBalance"
                      value={formData.openingBalance}
                      onChange={handleChange}
                      placeholder="0"
                      className="border border-gray-300 rounded-md p-2 mt-3"
                      required
                    />
                  </div>

                  <div className="flex-1">
                    <label htmlFor="date">Opening Balance Date *</label>
                    <div className="mt-3">
                      <DatePicker
                        date={selectedDate}
                        setDate={setSelectedDate}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-start">
                  {open ? (
                    <div className="flex flex-col">
                      <label htmlFor="phone">Enter Mobile Number *</label>
                      <div className="flex items-center mt-3">
                        <input
                          type="text"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Enter mobile number"
                          className="border border-gray-300 rounded-md p-2"
                          required
                        />
                        <button
                          type="button"
                          onClick={handleOpen}
                          className="border ml-5 px-3 py-2 rounded-md"
                        >
                          <span className="text-red-500 font-bold">X</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleOpen}
                      className="text-blue-500 font-bold"
                    >
                      + Add Mobile Number
                    </button>
                  )}
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

export default AddPartyDialogComponent;
