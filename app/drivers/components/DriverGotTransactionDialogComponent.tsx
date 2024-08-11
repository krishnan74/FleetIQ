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
import { DriverTransaction } from "@/lib/createInterface";
import { set } from "date-fns";

const DriverGotTransactionDialogComponent = () =>
  //setRefresh: React.Dispatch<React.SetStateAction<boolean>>
  {
    const pathname = usePathname();
    const id = pathname.split("/")[2];
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
      undefined
    );
    const { toast } = useToast();
    const [openAmount, setOpenAmount] = useState(false);
    const [driverPay, setDriverPay] = useState("driverPay");

    const [open, setOpen] = useState(false);

    useEffect(() => {}, []);

    const [formData, setFormData] = useState<DriverTransaction>({
      amount: 0,
      driverBalance: 0,
      transactionDate: "",
      transactionType: TransactionType.CREDIT,
      transactionMode: TransactionMode.CASH,
      transactionDescription: "",
    });

    const handleChange = (name: string, value: any) => {
      if (name === "amount") {
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

      console.log("Form data:", formData);

      try {
        const driverResponse = await axios.get(`/api/driver/${id}`);
        const driverBalance = driverResponse.data.data.balance;

        let newBalance = 0;
        if (formData.transactionType === TransactionType.CREDIT) {
          newBalance = driverBalance + formData.amount;
        } else {
          newBalance = driverBalance - formData.amount;
        }

        console.log("New Balance:", newBalance);

        const driverTransactionResponse = await axios.post(
          `/api/driver/transactions/${id}`,
          {
            ...formData,
            transactionDate: formattedDate,
            driverBalance: newBalance,
          }
        );

        const driverUpdateResponse = await axios.put(`/api/driver/${id}`, {
          newBalance: newBalance,
        });

        if (driverUpdateResponse.data.message === "success") {
          toast({
            title: "Driver Updated successfully",
            description: `Amount: ${driverTransactionResponse.data.data.name} | Driver Balance: ${driverTransactionResponse.data.data.driverBalance}`,
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
            <Button className="bg-green-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-700">
              + Driver Got
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-bold text-2xl pb-5 border-b mb-5">
                Driver Got ( + )
              </DialogTitle>
              <DialogDescription>
                <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                  <div className="flex flex-col">
                    <label
                      htmlFor="amount"
                      className="text-gray-700 font-medium"
                    >
                      Amount
                    </label>
                    <input
                      type="text"
                      id="amount"
                      name="amount"
                      placeholder="Enter amount"
                      value={formData.amount}
                      onChange={(e) =>
                        handleChange("amount", parseFloat(e.target.value))
                      }
                      className="border border-gray-300 rounded-md p-2"
                      required
                    />
                  </div>
                  <div className="flex flex-col">
                    <label
                      htmlFor="transactionDescription"
                      className="text-gray-700 font-medium"
                    >
                      Reason
                    </label>
                    <input
                      type="text"
                      id="transactionDescription"
                      name="transactionDescription"
                      placeholder="Enter Reason"
                      value={formData.transactionDescription}
                      onChange={(e) =>
                        handleChange("transactionDescription", e.target.value)
                      }
                      className="border border-gray-300 rounded-md p-2"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label htmlFor="date">Date</label>
                    <div className="mt-3">
                      <DatePicker
                        date={selectedDate}
                        setDate={setSelectedDate}
                      />
                    </div>
                  </div>

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

export default DriverGotTransactionDialogComponent;
