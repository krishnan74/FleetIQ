"use client";
import React, { useState } from "react";
import axios from "axios";
import { User } from "@/lib/createInterface";
import { Button } from "@/components/ui/button";
Button;
const Register = () => {
  const [formData, setFormData] = useState<User>({
    userName: "",
    phone: "",
    email: "",
    password: "",
  });

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
        console.log("User created successfully");
      }
    } catch (e: any) {
      console.log("Error while creating user :: ", e);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <label htmlFor="name">Enter Username *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.userName}
            onChange={(e) => handleChange("userName", e.target.value)}
            placeholder="Enter party name"
            className="border border-gray-300 rounded-md p-2 mt-3"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="phone">Enter Phone *</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="Enter phone number"
            className="border border-gray-300 rounded-md p-2 mt-3"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="email">Enter Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="Enter email"
            className="border border-gray-300 rounded-md p-2 mt-3"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="password">Enter Password *</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
            placeholder="Enter password"
            className="border border-gray-300 rounded-md p-2 mt-3"
            required
          />
        </div>

        <Button
          type="submit"
          className="bg-blue-500 text-white rounded-md p-2 mt-3"
        >
          Register
        </Button>
      </form>
    </div>
  );
};

export default Register;
