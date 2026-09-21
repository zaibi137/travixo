// src/app/models/vendor-purchase.model.ts

export interface VendorPurchase {
  id: number;
  purchaseNumber: string;
  purchaseDate: Date;
  vendorId: number;
  vendorName: string;
  clientId: number | null;
  clientName: string | null;
  items: PurchaseItem[];
  subTotal: number;
  taxRate: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  commissionRate: number;
  commissionAmount: number;
  netPayable: number;
  paymentTerms: string;
  dueDate: Date;
  amountPaid: number;
  paymentStatus: string; // Using string instead of enum to avoid type issues
  status: string; // Using string instead of enum
  notes: string | null;
  createdBy: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PurchaseItem {
  id?: number;
  purchaseId?: number;
  description: string;
  serviceType: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  clientId: number | null;
  clientName: string | null;
  dateOfService: Date | null;
  notes: string | null;
}

// Export as constants instead of enums to avoid type issues
export const PaymentStatus = {
  PENDING: 'Pending',
  PARTIAL: 'Partial Paid',
  PAID: 'Paid',
  OVERDUE: 'Overdue'
} as const;

export const PurchaseStatus = {
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted',
  APPROVED: 'Approved',
  CANCELLED: 'Cancelled'
} as const;

export const ServiceType = {
  HOTEL: 'Hotel',
  AIRLINE: 'Airline',
  TOUR: 'Tour',
  VISA: 'Visa Agency',
  TRANSPORT: 'Transport',
  INSURANCE: 'Insurance'
} as const;

export type PaymentStatusType = typeof PaymentStatus[keyof typeof PaymentStatus];
export type PurchaseStatusType = typeof PurchaseStatus[keyof typeof PurchaseStatus];
export type ServiceTypeType = typeof ServiceType[keyof typeof ServiceType];