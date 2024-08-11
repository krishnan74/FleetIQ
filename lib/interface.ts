import { TripStatus } from "@prisma/client";

export interface PartyDetails {
  id: string;
  name: string;
  phone: string;
  openingBalance: number;
  gstNumber: string;
  openingBalanceDate: Date;
  totalBalance: number;
  PANNumber: string;
  companyName: string;
  trips: Trip[];
  transactions: TripTransaction[];
}

export interface Trip {
  id: string;
  status: TripStatus;
  vendorId: string;
  partyId: string;
  driverId: string;
  truckId: string;
  createdAt: string;
  from: string;
  to: string;
  updatedAt: string;
  truck: Truck;
  party: PartyDetails;
  driver: DriverDetails;
  vendor: VendorDetails;
  partyFreightAmount: number;
  partyBalance: number;
  startKMSReadings: number;
  lrNumber: String | null;
  material: String | null;
  notes: String | null;
  transactions: TripTransaction[];
  totalExpenseAmount: number;
}

export interface TripTransaction {
  id: string;
  tripId: string;
  amount: number;
  tripTransactionType: string;
  transactionType: string;
  transactionDate: string;
  transactionMode: string;
  transactionDescription: string;
  partyBalance: number;
}

export interface DriverTransaction {
  id: string;
  driverId: string;
  amount: number;
  driverBalance: number;
  transactionType: string;
  transactionDate: string;
  transactionMode: string;
  transactionDescription: string;
}

export interface VendorDetails {
  id: string;
  name: string;
  email: string;
  phone: string;
  trips: Trip[];
  trucks: Truck[];
}

export interface DriverDetails {
  id: string;
  name: string;
  phone: string;
  status: string;
  balance: number;
  trips: Trip[];
  truck: Truck;
  transactions: DriverTransaction[];
}

export interface Truck {
  id: string;
  registrationNumber: string;
  truckType: string;
  truckOwnerShip: string;
  driverId: string;
  vendorId: string;
  trips: Trip[];
  status: string;
}
