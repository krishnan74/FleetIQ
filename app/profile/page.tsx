"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

const UserDetailsPage = () => {
  const [userDetails, setUserDetails] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    id: "",
    password: "",
    userName: "",
    email: "",
    phone: "",
    gstNumber: "",
    companyName: "",
    doorNumber: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    bankName: "",
    accountHolderName: "",
    accountNumber: "",
    bankBranch: "",
    ifscCode: "",
  });

  const { toast } = useToast();
  const router = useRouter();

  // Fetch user details on component mount
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get("/api/user/1");
        if (response.data.message === "success") {
          setUserDetails(response.data.data);
          setFormData(response.data.data); // Set initial form data
        } else {
          setError("Failed to fetch user details");
        }
      } catch (error) {
        setError("An error occurred while fetching user details");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Create a copy of formData without the 'id' field
    const { id, password, ...dataToUpdate } = formData; // Exclude id and password

    try {
      const response = await axios.put("/api/user/3", dataToUpdate);
      if (response.data.message === "User updated successfully") {
        toast({
          title: "Profile updated",
          description: "Your details have been updated successfully.",
        });
        router.push("/profile"); // Redirect to profile or another page
      } else {
        toast({
          title: "Update failed",
          description: "Failed to update your details. Please try again.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while updating your details.",
      });
      console.error("Error while updating user details:", error);
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5">Update User Details</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4">
        {Object.keys(formData).map((key) => {
          // Exclude 'id' and 'password' from rendering
          if (key === "id" || key === "password") return null;
          return (
            <div key={key} className="flex flex-col">
              <label htmlFor={key} className="mb-2">
                {key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
              </label>
              <input
                type="text"
                id={key}
                name={key}
                value={formData[key as keyof typeof formData]}
                onChange={handleChange}
                className="border border-gray-300 rounded-md p-2"
              />
            </div>
          );
        })}
        <Button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Save Changes
        </Button>
      </form>
    </div>
  );
};

export default UserDetailsPage;
