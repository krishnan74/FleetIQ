import { TripStatus } from "@prisma/client";
import { ExpenseType } from "@prisma/client";

export interface PartyDetails {
  id: string;
  name: string;
  phone: string;
  openingBalance: number;
  gstNumber: string;
  openingBalanceDate: string;
  totalBalance: number;
  PANNumber: string;
  companyName: string;
  trips: Trip[];
  transactions: TripTransaction[];
}

export interface PartyInvoiceDetails {
  id: string;
  invoiceDate: string;
  dueDate: string;
  amount: number;
  balance: number;
  tripId: string;
  invoiceNumber: string;
  party: PartyDetails;
}

export interface VendorInvoiceDetails {
  id: string;
  invoiceDate: string;
  dueDate: string;
  amount: number;
  balance: number;
  tripId: string;
  invoiceNumber: string;
  vendor: VendorDetails;
}

export interface Reminder {
  id: string;
  type: string;
  details: string;
  date: string;
  status: string;
}

export interface Trip {
  id: string;
  status: TripStatus;
  vendorId: string;
  partyId: string;
  driverId: string;
  truckId: string;
  createdAt: string;
  completedAt: string;
  startedAt: string;
  from: string;
  to: string;
  profit: number;
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
  totalBalance: number;
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

export interface Expense {
  id: string;
  amount: number;
  expenseType: ExpenseType;
  tripId: string;
}

export interface DataFormProps {
  setRefresh?: SetState<boolean>;
  refresh?: boolean;
  tripId?: string;
  partyId?: string;
  className?: string;
}
type SetState<T> = React.Dispatch<React.SetStateAction<T>>;
