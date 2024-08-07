import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const locations: string[] = [
  "Chennai",
  "Bangalore",
  "Hyderabad",
  "Mumbai",
  "Delhi",
  "Kolkata",
  "Pune",
  "Jaipur",
  "Ahmedabad",
  "Surat",
  "Vadodara",
  "Lucknow",
  "Kanpur",
  "Nagpur",
  "Patna",
  "Indore",
  "Thane",
  "Bhopal",
  "Visakhapatnam",
  "Pimpri-Chinchwad",
  "Agra",
  "Nashik",
];
