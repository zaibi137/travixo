export interface Vendor {
  id: number;
  vendorName: string;
  category: 'Hotel' | 'Airline' | 'Transport' | 'Tour Operator' | 'Visa Agency';
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  paymentTerms: string;
  outstandingBalance: number;
  status: 'Active' | 'Inactive';
} 