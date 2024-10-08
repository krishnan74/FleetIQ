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

const CompleteTripDialogComponent: React.FC<DataFormProps> = ({
  setRefresh,
  refresh,
  tripId,
}) => {
  const { toast } = useToast();

  const [open, setOpen] = useState(false);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [endKMSReadings, setEndKMSReadings] = useState(0);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formattedDate = selectedDate ? selectedDate.toISOString() : "";

    const formData = {
      status: TripStatus.COMPLETED,
      completedAt: formattedDate,
      endKMSReadings: endKMSReadings,
    };

    try {
      const updateResponse = await axios.put(`/api/trip/${tripId}`, formData);

      if (updateResponse.data.message === "success") {
        toast({
          title: "Trip completed successfully",
          description: `With end KMS readings: ${endKMSReadings}`,
        });
        setOpen(false);
        setRefresh ? setRefresh(!refresh) : window.location.reload();
      } else {
        toast({
          title: "Trip completion failed",
          description: "Please try again.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while completing the trip.",
      });
      console.error("Error while completing trip:", error);
    }
  };

  return (
    <div className=" ">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="w-full">
          <Button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700">
            Complete Trip
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-bold text-2xl pb-10 border-b mb-5">
              Complete Trip
            </DialogTitle>
            <DialogDescription>
              <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                <div className="flex items-center gap-5">
                  <div className="">
                    <label
                      htmlFor="transactionDate"
                      className="text-gray-700 font-medium"
                    >
                      Completion Date *
                    </label>
                    <div className="mt-3">
                      <DatePicker
                        date={selectedDate}
                        setDate={setSelectedDate}
                      />
                    </div>
                  </div>
                  <div className="">
                    <label
                      htmlFor="endKMSReadings"
                      className="text-gray-700 font-medium"
                    >
                      End KMS Readings *
                    </label>
                    <input
                      type="number"
                      id="endKMSReadings"
                      name="endKMSReadings"
                      value={endKMSReadings}
                      onChange={(e) =>
                        setEndKMSReadings(Number(e.target.value))
                      }
                      required
                      className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                    />
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

export default CompleteTripDialogComponent;
