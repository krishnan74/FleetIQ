import {
  TransactionMode,
  TransactionType,
  TripTransactionType,
  ExpenseType,
  TruckOwnership,
  TruckType,
  TruckStatus,
} from "@prisma/client";

export interface Trip {
  from: string;
  to: string;
  vendorId: string;
  partyId: string;
  driverId: string;
  truckId: string;
  partyFreightAmount: number;
  startedAt: string;
  startKMSReadings: number;
  lrNumber: String | null;
  material: String | null;
  notes: String | null;
}

export interface TripTransaction {
  tripId: string;
  amount: number;
  tripTransactionType: TripTransactionType;
  transactionType: TransactionType;
  transactionDate: string;
  transactionMode: TransactionMode;
  transactionDescription: string;
  partyBalance: number;
}

export interface Expense {
  amount: number;
  expenseType: ExpenseType;
  tripId: string;
}

export interface DriverDetails {
  name: string;
  phone: string;
  balance: number;
}

export interface DriverTransaction {
  amount: number;
  driverBalance: number;
  transactionType: string;
  transactionDate: string;
  transactionMode: string;
  transactionDescription: string;
}

export interface Truck {
  registrationNumber: string;
  truckType: TruckType;
  truckOwnerShip: TruckOwnership;
  driverId: string;
  vendorId: string;
}
