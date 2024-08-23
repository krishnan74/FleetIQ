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
import axios from "axios";

import { DatePicker } from "@/components/DatePicker";
import { TripStatus } from "@prisma/client";

import { DataFormProps } from "@/lib/interface";

const PODSubmittedDialogComponent: React.FC<DataFormProps> = ({
  setRefresh,
  refresh,
  tripId,
}) => {
  const { toast } = useToast();

  const [open, setOpen] = useState(false);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formattedDate = selectedDate ? selectedDate.toISOString() : "";

    const formData = {
      status: TripStatus.POD_SUBMITTED,
      completedAt: formattedDate,
      endKMSReadings: "",
    };

    try {
      const updateResponse = await axios.put(`/api/trip/${tripId}`, formData);

      if (updateResponse.data.message === "success") {
        toast({
          title: "POD Submitted successfully",
          description: `POD submitted on ${formattedDate}`,
        });
        setOpen(false);
        setRefresh(!refresh);
      } else {
        toast({
          title: "POD receiving failed",
          description: "Please try again.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while receiving POD.",
      });
      console.error("Error while receiving POD:", error);
    }
  };

  return (
    <div className=" ">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="w-full">
          <Button
            onClick={() => setOpen(true)}
            variant={"secondary"}
            className="w-full border"
          >
            POD Submitted
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-bold text-2xl pb-10 border-b mb-5">
              Mark POD Submitted
            </DialogTitle>
            <DialogDescription>
              <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                <div className="flex items-center gap-5">
                  <div className="">
                    <label
                      htmlFor="transactionDate"
                      className="text-gray-700 font-medium"
                    >
                      POD Submitted On *
                    </label>
                    <div className="mt-3">
                      <DatePicker
                        date={selectedDate}
                        setDate={setSelectedDate}
                      />
                    </div>
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

export default PODSubmittedDialogComponent;
