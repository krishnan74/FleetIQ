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

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { DatePicker } from "@/components/DatePicker";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { usePathname } from "next/navigation";
import axios from "axios";

import { locations } from "@/lib/utils";
import { TripTransaction } from "@/lib/createInterface";
import {
  TransactionMode,
  TransactionType,
  TripTransactionType,
} from "@prisma/client";
import { DriverDetails } from "@/lib/createInterface";

interface dataFormProps {
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddDriverDialogComponent = () =>
  //setRefresh: React.Dispatch<React.SetStateAction<boolean>>
  {
    const pathname = usePathname();
    const id = pathname.split("/")[2];

    const { toast } = useToast();
    const [openAmount, setOpenAmount] = useState(false);
    const [driverPay, setDriverPay] = useState("driverPay");

    const [open, setOpen] = useState(false);

    useEffect(() => {}, []);

    const [formData, setFormData] = useState<DriverDetails>({
      name: "",
      phone: "",
      balance: 0,
    });
    

    const handleChange = (name: string, value: any) => {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      console.log("Form data:", formData);

      try {
        const driverResponse = await axios.post("/api/driver/", {
          ...formData,
          driverPay: driverPay,
        });

        if (driverResponse.data.message === "success") {
          toast({
            title: "Driver Created successfully",
            description: `Name: ${driverResponse.data.data.name} | Phone: ${driverResponse.data.data.phone}`,
          });
          setOpen(false);
          window.location.reload();
        } else {
          toast({
            title: "Driver creation failed",
            description: "Please try again.",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An error occurred while creating the driver.",
        });
        console.error("Error while updating driver:", error);
      }
    };

    return (
      <div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger>
            <Button className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700">
              Add Driver
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-bold text-2xl pb-5 border-b mb-5">
                Add Driver
              </DialogTitle>
              <DialogDescription>
                <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                  <div className="flex flex-col">
                    <label htmlFor="name" className="text-gray-700 font-medium">
                      Driver Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Enter driver name"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className="border border-gray-300 rounded-md p-2"
                      required
                    />
                  </div>
                  <div className="flex flex-col">
                    <label
                      htmlFor="phone"
                      className="text-gray-700 font-medium"
                    >
                      Mobile Number
                    </label>
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      placeholder="Enter 10 digit mobile number"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      className="border border-gray-300 rounded-md p-2"
                      required
                    />
                  </div>

                  {openAmount ? (
                    <div>
                      <div className="flex flex-col">
                        <label
                          htmlFor="openingBalanceType"
                          className="text-gray-700 font-medium mb-3"
                        >
                          Opening Balance
                        </label>
                        <RadioGroup
                          defaultValue={"driverPay"}
                          className="flex flex-wrap gap-x-10"
                          onValueChange={(value) =>
                            setDriverPay(value as string)
                          }
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value={"driverPay"}
                              id="DriverPay"
                            />
                            <label htmlFor="cash">Driver has to pay</label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value={"driverGet"}
                              id="DriverGet"
                            />
                            <label htmlFor="other">Driver has to get</label>
                          </div>
                        </RadioGroup>
                      </div>
                      <div className="flex flex-col">
                        <label
                          htmlFor="amount"
                          className="text-gray-700 font-medium"
                        >
                          Amount
                        </label>
                        <input
                          type="number"
                          id="balance"
                          name="balance"
                          placeholder="Enter opening balance"
                          value={formData.balance}
                          onChange={(e) =>
                            handleChange("balance", parseFloat(e.target.value))
                          }
                          className="border border-gray-300 rounded-md p-2"
                          required
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <button
                        type="button"
                        onClick={() => setOpenAmount(true)}
                        className="text-blue-500 font-bold"
                      >
                        + Add Opening Balance
                      </button>
                    </div>
                  )}

                  <DialogFooter className="justify-end border-t pt-10">
                    <DialogClose asChild>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => {
                          setOpenAmount(false);
                          setOpen(false);
                        }}
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

export default AddDriverDialogComponent;
