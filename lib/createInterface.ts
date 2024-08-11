import { TransactionMode } from "@prisma/client";
import { TransactionType } from "@prisma/client";
import { TripTransactionType } from "@prisma/client";
import { ExpenseType } from "@prisma/client";

export interface Trip {
  from: string;
  to: string;
  vendorId: string;
  partyId: string;
  driverId: string;
  truckId: string;
  partyFreightAmount: number;
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
