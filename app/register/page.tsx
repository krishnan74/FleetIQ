"use client";
import React, { useState } from "react";
import axios from "axios";
import { User } from "@/lib/createInterface";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LoginButton } from "../auth";

const Register = () => {
  const [formData, setFormData] = useState<User>({
    userName: "",
    phone: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (name: string, value: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/register/", formData);

      if (response.data.message === "success") {
        setSuccess("User created successfully. Please log in.");
        setError(null);
      } else {
        setError("Failed to create user. Please try again.");
        setSuccess(null);
      }
    } catch (e: any) {
      setError("An error occurred while creating the user.");
      setSuccess(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-400 to-purple-600 text-white p-6">
      <div className="w-full max-w-md bg-white text-gray-900 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Create Your Account
        </h1>
        {success && (
          <div className="bg-green-100 text-green-800 p-4 rounded mb-4">
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-100 text-red-800 p-4 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label htmlFor="userName" className="font-medium mb-1">
              Username *
            </label>
            <input
              type="text"
              id="userName"
              name="userName"
              value={formData.userName}
              onChange={(e) => handleChange("userName", e.target.value)}
              placeholder="Enter username"
              className="border border-gray-300 rounded-md p-3 mt-1 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="phone" className="font-medium mb-1">
              Phone *
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="Enter phone number"
              className="border border-gray-300 rounded-md p-3 mt-1 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="email" className="font-medium mb-1">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="Enter email"
              className="border border-gray-300 rounded-md p-3 mt-1 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className="font-medium mb-1">
              Password *
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder="Enter password"
              className="border border-gray-300 rounded-md p-3 mt-1 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <Button
            type="submit"
            className="bg-blue-500 text-white rounded-md p-3 mt-4 hover:bg-blue-600 transition-colors"
          >
            Register
          </Button>

          <p className="mt-4 text-center text-gray-600">
            Already have an account?{" "}
          </p>
          <LoginButton />
        </form>
      </div>
    </div>
  );
};

export default Register;
