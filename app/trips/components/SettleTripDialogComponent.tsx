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
import axios from "axios";

import { TripTransaction } from "@/lib/createInterface";
import {
  TransactionMode,
  TransactionType,
  TripStatus,
  TripTransactionType,
} from "@prisma/client";

import { DataFormProps } from "@/lib/interface";

const SettleTripDialogComponent: React.FC<DataFormProps> = ({
  setRefresh,
  refresh,
  tripId,
}) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  useEffect(() => {}, []);

  const [formData, setFormData] = useState<TripTransaction>({
    tripId: "",
    amount: 0,
    tripTransactionType: TripTransactionType.PAYMENT,
    transactionType: TransactionType.CREDIT,
    transactionDate: "",
    transactionMode: TransactionMode.CASH,
    transactionDescription: "",
    partyBalance: 0,
  });

  const handleChange = (name: string, value: any) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const fetchPartyBalance = async () => {
    try {
      const tripResponse = await axios.get(`/api/trip/${tripId}`);
      console.log("Party balance:", tripResponse.data.data.partyBalance);
      setFormData((prevFormData) => ({
        ...prevFormData,
        amount: tripResponse.data.data.partyBalance,
      }));
    } catch (error) {
      console.error("Error while fetching party balance:", error);
    }
  };

  useEffect(() => {
    fetchPartyBalance();
  }, [open]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formattedDate = selectedDate ? selectedDate.toISOString() : "";

    console.log("Form data:", formData);

    try {
      const tripResponse = await axios.get(`/api/trip/${tripId}`);
      const partyBalance = tripResponse.data.data.partyBalance;

      const updateResponse = await axios.put(
        `/api/trip/transaction/${tripId}`,
        {
          ...formData,
          transactionDate: formattedDate,
          partyBalance: partyBalance,
        }
      );

      const tripTransactionResponse = await axios.post(
        `/api/trip/transaction/${tripId}`,
        {
          ...formData,
          transactionDate: formattedDate,
          partyBalance: partyBalance,
        }
      );

      const statusUpdateResponse = await axios.put(`/api/trip/${tripId}`, {
        status: TripStatus.SETTLED,
      });

      if (updateResponse.data.message === "success") {
        toast({
          title: "Trip updated successfully",
          description: `Current party balance is ${updateResponse.data.data.partyBalance}`,
        });
        setOpen(false);
        setRefresh(!refresh);
      } else {
        toast({
          title: "Trip updation failed",
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
        <DialogTrigger className="w-full">
          <Button
            onClick={() => setOpen(true)}
            variant={"secondary"}
            className="w-full border"
          >
            Settle Amount
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-bold text-2xl pb-5 border-b mb-5">
              Settle Party Balance
            </DialogTitle>
            <DialogDescription>
              <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                <div className="flex flex-col">
                  <label htmlFor="amount" className="text-gray-700 font-medium">
                    Settle Amount *
                  </label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    disabled={true}
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
                    htmlFor="transactionMode"
                    className="text-gray-700 font-medium mb-3"
                  >
                    Payment Mode *
                  </label>
                  <RadioGroup
                    required
                    defaultValue={TransactionMode.CASH}
                    className="flex flex-wrap gap-x-10"
                    onValueChange={(value) =>
                      handleChange("transactionMode", value)
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={TransactionMode.CASH} id="cash" />
                      <label htmlFor="cash">Cash</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={TransactionMode.UPI} id="upi" />
                      <label htmlFor="upi">UPI</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={TransactionMode.NETBANKING}
                        id="netbanking"
                      />
                      <label htmlFor="netbanking">Netbanking</label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={TransactionMode.BANKTRANSFER}
                        id="banktransfer"
                      />
                      <label htmlFor="banktransfer">Bank Transfer</label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={TransactionMode.FUEL} id="fuel" />
                      <label htmlFor="fuel">Fuel</label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={TransactionMode.OTHER}
                        id="other"
                      />
                      <label htmlFor="other">Other</label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="flex-1">
                  <label
                    htmlFor="transactionDate"
                    className="text-gray-700 font-medium"
                  >
                    Settlement Date *
                  </label>
                  <div className="mt-3">
                    <DatePicker date={selectedDate} setDate={setSelectedDate} />
                  </div>
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="transactionDescription"
                    className="text-gray-700 font-medium"
                  >
                    Description *
                  </label>
                  <textarea
                    id="transactionDescription"
                    name="transactionDescription"
                    value={formData.transactionDescription}
                    onChange={(e) =>
                      handleChange("transactionDescription", e.target.value)
                    }
                    className="border border-gray-300 rounded-md p-2"
                    rows={3}
                    required
                  />
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

export default SettleTripDialogComponent;
