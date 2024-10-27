import { TripStatus } from "@prisma/client";
import { ExpenseType } from "@prisma/client";

export interface UserDetails {
  id: string;
  userName: string;
  email: string;
  password: string;
  phone: string;
  gstNumber?: string;
  companyName?: string;
  doorNumber?: string;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

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
  lrNumber: string | null;
  material: string | null;
  notes: string | null;
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

export interface ConsigneeDetails {
  id: string;
  gstNumber: string;
  name: string;
  addressLine1: string;
  addressLine2: string;
  state: string;
  zipCode: string;
  phone: string;
}

export interface BiltyTrip {
  from: string;
  to: string;
  truck: {
    registrationNumber: string;
  };
  partyFreightAmount: number;
  partyBalance: number;
  lrNumber: string | null;
  material: string | null;
  completedAt: string;
  startedAt: string;
}

export interface OnlineBiltyDetails {
  id: string;
  material: string;
  weight: number;
  unit: string;
  noOfPackages: number;
  paidBy: string;
  gstPercentage: number;
  gstPaidBy: string;
  user: UserDetails;
  trip: BiltyTrip;
  consignee: ConsigneeDetails;
  consignor: ConsigneeDetails;
}

export interface DataFormProps {
  setRefresh?: SetState<boolean>;
  refresh?: boolean;
  tripId?: string;
  partyId?: string;
  className?: string;
}

export interface BillFormProps {
  setPageNo?: SetState<number>;
  pageNo?: number;
}
type SetState<T> = React.Dispatch<React.SetStateAction<T>>;
