import {
  TransactionMode,
  TransactionType,
  TripTransactionType,
  ExpenseType,
  TruckOwnership,
  TruckType,
  TruckStatus,
  ReminderStatus,
} from "@prisma/client";

export interface User {
  userName: string;
  email: string;
  password: string;
  phone: string;
}

export interface ReminderCreate {
  type: string;
  details: string;
  date: string;

  userId: string;
}

export interface PartyDetails {
  name: string;
  phone: string;
  openingBalance: number;
  gstNumber?: string;
  openingBalanceDate: string;

  PANNumber?: string;
  companyName?: string;
}

export interface PartyInvoiceDetails {
  invoiceDate: string;
  dueDate: string;
  amount: number;
  balance: number;
  tripId: string;
  invoiceNumber: string;
  partyId: string;
}

export interface VendorInvoiceDetails {
  invoiceDate: string;
  dueDate: string;
  amount: number;
  balance: number;
  tripId: string;
  invoiceNumber: string;
  vendorId: string;
}

export interface Trip {
  from: string;
  to: string;
  vendorId: string;
  partyId: string;
  driverId: string;
  truckId: string;
  partyFreightAmount: number;
  vendorBalance: number;
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

export interface OnlineBiltyDetails {
  consigneeId: string;
  consignorId: string;
  tripId: string;
  material: string;
  weight: number;
  unit: string;
  noOfPackages: number;
  paidBy: string;
  gstPercentage: number;
  gstPaidBy: string;
}

export interface ConsigneeDetails {
  gstNumber: string;
  name: string;
  addressLine1: string;
  addressLine2: string;
  state: string;
  zipCode: string;
  phone: string;
}
