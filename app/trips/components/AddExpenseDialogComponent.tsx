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

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { DatePicker } from "@/components/DatePicker";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { usePathname } from "next/navigation";
import axios from "axios";

import { locations } from "@/lib/utils";
import { TripTransaction } from "@/lib/createInterface";
import {
  ExpenseType,
  TransactionMode,
  TransactionType,
  TripTransactionType,
} from "@prisma/client";

interface dataFormProps {
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const expenseTypes = [
  { id: "1", name: ExpenseType.Brokerage },
  { id: "2", name: ExpenseType.Detention_Charges },
  { id: "3", name: ExpenseType.Driver_Bhatta },
  { id: "4", name: ExpenseType.Driver_Payment },
  { id: "5", name: ExpenseType.Fuel_Expense },
  { id: "6", name: ExpenseType.Loading_Charges },
  { id: "7", name: ExpenseType.Unloading_Charges },
  { id: "8", name: ExpenseType.Toll_Expense },
  { id: "9", name: ExpenseType.RTO_Expense },
  { id: "10", name: ExpenseType.Repair_Expense },
  { id: "11", name: ExpenseType.Weight_Charges },
  { id: "12", name: ExpenseType.Police_Charges },
];

const AddExpenseDialogComponent = () =>
  //setRefresh: React.Dispatch<React.SetStateAction<boolean>>
  {
    const pathname = usePathname();
    const id = pathname.split("/")[2];

    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
      undefined
    );

    const [expenseType, setExpenseType] = useState<ExpenseType>();

    useEffect(() => {}, []);

    const [formData, setFormData] = useState<TripTransaction>({
      tripId: "",
      amount: 0,
      tripTransactionType: TripTransactionType.EXPENSE,
      transactionType: TransactionType.DEBIT,
      transactionDate: "",
      transactionMode: TransactionMode.CASH,
      transactionDescription: "",
      partyBalance: 0,
    });

    const handleChange = (name: string, value: any) => {
      if (name == "expenseType") {
        setExpenseType(value);
      }

      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const formattedDate = selectedDate ? selectedDate.toISOString() : "";

      console.log("Form data:", formData);

      try {
        const tripResponse = await axios.get(`/api/trip/${id}`);
        const partyBalance = tripResponse.data.data.partyBalance;

        const updateResponse = await axios.put(`/api/trip/transaction/${id}`, {
          ...formData,
          transactionDate: formattedDate,
          partyBalance: partyBalance,
        });

        const tripTransactionResponse = await axios.post(`/api/trip/transaction/${id}`, {
          ...formData,
          transactionDate: formattedDate,
          partyBalance: partyBalance,
        });

        const expenseResponse = await axios.post(`/api/trip/expense/${id}`, {
          amount: formData.amount,
          expenseType: expenseType,
          tripId: id,
        });

        if (updateResponse.data.message === "success") {
          toast({
            title: "Trip updated successfully",
            description: `Current party balance is ${updateResponse.data.data.partyBalance}`,
          });
          setOpen(false); // Close the dialog on success
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
          <DialogTrigger>
            <Button
              className="text-white bg-blue-500 hover:bg-blue-700 "
              onClick={() => setOpen(true)}
            >
              Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-bold text-2xl pb-5 border-b mb-5">
                Add Expense
              </DialogTitle>
              <DialogDescription>
                <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                  <div className="flex flex-col">
                    <label
                      htmlFor="expenseType"
                      className="text-gray-700 font-medium"
                    >
                      Select Expense Type
                    </label>
                    <Select
                      value={expenseType}
                      onValueChange={(value) =>
                        handleChange("expenseType", value)
                      }
                    >
                      <SelectTrigger className="w-full mt-2 bg-gray-100 border border-gray-300 rounded-md px-3 py-2">
                        <SelectValue placeholder="Select Expense Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {expenseTypes?.map((expense) => (
                            <SelectItem key={expense.id} value={expense.name}>
                              {expense.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor="amount"
                      className="text-gray-700 font-medium"
                    >
                      Expense Amount
                    </label>
                    <input
                      type="number"
                      id="amount"
                      name="amount"
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
                      Payment Type
                    </label>
                    <RadioGroup
                      defaultValue={TransactionMode.CASH}
                      className="flex flex-wrap gap-x-10"
                      onValueChange={(value) =>
                        handleChange("transactionMode", value)
                      }
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={TransactionMode.CASH}
                          id="cash"
                        />
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
                        <RadioGroupItem
                          value={TransactionMode.FUEL}
                          id="fuel"
                        />
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
                      Payment Date
                    </label>
                    <div className="mt-3">
                      <DatePicker
                        date={selectedDate}
                        setDate={setSelectedDate}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor="transactionDescription"
                      className="text-gray-700 font-medium"
                    >
                      Description
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

export default AddExpenseDialogComponent;
