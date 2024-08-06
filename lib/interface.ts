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

interface Trip {
  id: string;
  from: string;
  to: string;
  vendor: VendorDetails;
  vendorId: string;
  createdAt: Date;
  updatedAt: Date;
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
