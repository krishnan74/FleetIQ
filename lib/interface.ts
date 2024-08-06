interface PartyDetails {
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



interface VendorDetails {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: {
    id: string;
    doorNumber: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    vendorId: string;
  };
  trips: [];
}