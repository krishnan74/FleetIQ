export interface PartyDetails {
  id: string;
  name: string;
  phone: string;
  openingBalance: number;
  gstNumber: string;
  openingBalanceDate: Date;
  PANNumber: string;
  companyName: string;
}

export interface Trip {
  id: string;
  status: string;
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
