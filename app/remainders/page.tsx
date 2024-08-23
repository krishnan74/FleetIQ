"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MdEdit } from "react-icons/md";
import { MdAdd } from "react-icons/md";

import { MdDelete } from "react-icons/md";

import { useToast } from "@/components/ui/use-toast";
import { DatePicker } from "@/components/DatePicker";
import axios from "axios";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Reminder } from "@/lib/interface";
import { useSession } from "next-auth/react";
import { ReminderCreate } from "@/lib/createInterface";

const ReminderPage: React.FC = () => {
  const { toast } = useToast();
  const { data: session } = useSession();

  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [formData, setFormData] = useState<ReminderCreate>({
    type: "",
    details: "",
    date: "",
    userId: "",
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [editingReminderId, setEditingReminderId] = useState<string | null>(
    null
  );

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
        setReminders([]);
      }
    };

    if (session?.user.id) fetchReminders();
  }, [session?.user.id]);

  const handleAddOrUpdateReminder = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    let formattedDate = "";
    if (selectedDate) {
      const adjustedDate = new Date(
        selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000
      );
      formattedDate = adjustedDate.toISOString();
    }

    if (formData.type && formData.details && formattedDate) {
      const reminderData = {
        ...formData,
        date: formattedDate,
        userId: session?.user.id,
      };

      try {
        if (editingReminderId) {
          // Update existing reminder
          const response = await axios.put(
            `/api/remainder/${editingReminderId}`,
            reminderData
          );

          if (response.data.message === "success") {
            toast({
              title: "Reminder updated successfully",
              description: `Date: ${response.data.data.date}`,
            });

            setReminders((prevReminders) =>
              prevReminders.map((reminder) =>
                reminder.id === editingReminderId
                  ? { ...reminder, ...response.data.data }
                  : reminder
              )
            );
            setEditingReminderId(null);
          }
        } else {
          // Add new reminder
          const response = await axios.post("/api/remainder/", reminderData);

          if (response.data.message === "success") {
            toast({
              title: "Reminder added successfully",
              description: `Date: ${response.data.data.date}`,
            });

            setReminders([...reminders, response.data.data]);
          }
        }

        // Reset form
        setFormData({
          type: "",
          details: "",
          date: "",
          userId: session?.user.id || "",
        });
        setSelectedDate(undefined);
      } catch (error) {
        toast({
          title: "Error",
          description: "An error occurred while processing the reminder.",
        });
        console.error("Failed to process reminder:", error);
      }
    } else {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
      });
    }
  };

  const handleEditReminder = (reminder: Reminder) => {
    setFormData({
      type: reminder.type,
      details: reminder.details,
      date: reminder.date,
      userId: session?.user.id || "",
    });
    setSelectedDate(new Date(reminder.date));
    setEditingReminderId(reminder.id);
  };

  const handleDeleteReminder = async (id: string) => {
    try {
      const response = await axios.delete(`/api/remainder/${id}`);

      if (response.data.message === "success") {
        toast({
          title: "Reminder deleted successfully",
        });

        setReminders(reminders.filter((reminder) => reminder.id !== id));
      } else {
        toast({
          title: "Failed to delete reminder",
          description: "Please try again.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while deleting the reminder.",
      });
      console.error("Failed to delete reminder:", error);
    }
  };

  return (
    <div className="flex gap-10 w-full justify-between p-6">
      {/* Reminder Form */}
      <Card className="flex-2 mb-12 p-6 shadow-lg bg-white rounded-lg border border-gray-200 h-fit">
        <CardTitle className="flex justify-between mb-4">
          <p className="text-2xl font-semibold">
            {editingReminderId ? "Edit Reminder" : "Add a Reminder"}
          </p>

          {editingReminderId && (
            <Button
              className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
              onClick={() => setEditingReminderId(null)}
            >
              <MdAdd />
            </Button>
          )}
        </CardTitle>
        <CardContent className="p-0 h-fit">
          <form
            className="flex flex-col gap-6"
            onSubmit={handleAddOrUpdateReminder}
          >
            <Input
              placeholder="Reminder Type (e.g., Trip Balance)"
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              className=" border rounded-lg shadow-sm"
            />
            <Input
              placeholder="Details"
              value={formData.details}
              onChange={(e) =>
                setFormData({ ...formData, details: e.target.value })
              }
              className=" border rounded-lg shadow-sm"
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
              {editingReminderId ? "Update Reminder" : "Add Reminder"}
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
              <CardTitle className="text-xl font-semibold mb-2 flex justify-between">
                {reminder.type}
              </CardTitle>
              <CardContent className="p-0 flex justify-between items-start">
                <div>
                  <p className="text-gray-700 mb-2">{reminder.details}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(reminder.date).toDateString()}
                  </p>
                </div>
                <div className="flex gap-5">
                  <Button
                    onClick={() => handleEditReminder(reminder)}
                    className="bg-blue-500 text-white py-1 px-3 rounded-lg shadow-md hover:bg-blue-600 transition-colors"
                  >
                    <MdEdit />
                  </Button>
                  <Button
                    onClick={() => handleDeleteReminder(reminder.id)}
                    className="bg-red-600 text-white py-1 px-3 rounded-lg shadow-md hover:bg-red-700 transition-colors"
                  >
                    <MdDelete />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ReminderPage;
