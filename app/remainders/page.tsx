"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { DatePicker } from "@/components/DatePicker";
import axios from "axios";
import { Card, CardTitle, CardContent } from "@/components/ui/card";

import { ReminderCreate } from "@/lib/createInterface";
import { Reminder } from "@/lib/interface";
import { useSession } from "next-auth/react";

const ReminderPage: React.FC = () => {
  const { toast } = useToast();
  const { data: session } = useSession();

  const [reminders, setReminders] = useState<Reminder[]>([]);

  const [formData, setFormData] = useState<ReminderCreate>({
    type: "",
    details: "",
    date: "",

    userId: "", // Assign the user ID here
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  // Fetch reminders from the API on component mount
  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const response = await axios.get(
          `/api/remainder/?userId=${session?.user.id ? session?.user.id : ""}`
        );

        if (response.data.message === "success") {
          setReminders(response.data.data);
        } else {
          toast({
            title: "Failed to fetch reminders",
            description: "Please try again.",
          });
        }
      } catch (error) {
        console.error("Failed to fetch reminders:", error);
        setReminders([]); // Set to empty array on error
      }
    };

    fetchReminders();
  }, []);

  // Handle adding a new reminder
  const handleAddReminder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formattedDate = selectedDate ? selectedDate.toISOString() : "";

    if (formData.type && formData.details && formattedDate) {
      const newReminder = {
        ...formData,
        date: formattedDate,
        userId: session?.user.id,
      };

      try {
        const response = await axios.post("/api/remainder/", newReminder);

        if (response.data.message === "success") {
          toast({
            title: "Reminder added successfully",
            description: `Date: ${response.data.data.date}`,
          });

          // Update reminders state without reload
          const createdReminder: Reminder = response.data.data;
          setReminders([...reminders, createdReminder]);
          setFormData({
            type: "",
            details: "",
            date: "",

            userId: session?.user.id || "",
          });
          setSelectedDate(undefined);
        } else {
          toast({
            title: "Reminder creation failed",
            description: "Please try again.",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An error occurred while adding the reminder.",
        });
        console.error("Failed to add reminder:", error);
      }
    } else {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
      });
    }
  };

  return (
    <div className="flex gap-10 w-full justify-between p-6">
      {/* Reminder Form */}
      <Card className="flex-2 mb-12 p-6 shadow-lg bg-white rounded-lg border border-gray-200">
        <CardTitle className="text-2xl font-semibold mb-4">
          Add a Reminder
        </CardTitle>
        <CardContent>
          <form className="flex flex-col gap-6" onSubmit={handleAddReminder}>
            <Input
              placeholder="Reminder Type (e.g., Trip Balance)"
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              className="p-4 border rounded-lg shadow-sm"
            />
            <Input
              placeholder="Details"
              value={formData.details}
              onChange={(e) =>
                setFormData({ ...formData, details: e.target.value })
              }
              className="p-4 border rounded-lg shadow-sm"
            />
            <div className="flex flex-col">
              <label htmlFor="date" className="mb-2">
                Reminder Date
              </label>
              <DatePicker date={selectedDate} setDate={setSelectedDate} />
            </div>
            <Button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
            >
              Add Reminder
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Reminders List */}
      <div className="flex-1">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Reminders List
        </h2>
        <ul className="space-y-6">
          {reminders.map((reminder) => (
            <Card
              key={reminder.id}
              className="p-6 bg-white shadow-lg rounded-lg border border-gray-200"
            >
              <CardTitle className="text-xl font-semibold mb-2">
                {reminder.type}
              </CardTitle>
              <CardContent>
                <p className="text-gray-700 mb-2">{reminder.details}</p>
                <p className="text-sm text-gray-500">{reminder.date}</p>
              </CardContent>
            </Card>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ReminderPage;
