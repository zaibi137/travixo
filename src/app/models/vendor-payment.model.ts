// src/app/models/vendor-payment.model.ts

export interface VendorPayment {
  id: number;
  paymentNumber: string;
  paymentDate: Date;
  vendorId: number;
  vendorName: string;
  purchaseIds: number[];
  purchaseNumbers: string[];
  totalPayable: number;
  discountReceived: number;
  amountPaid: number;
  paymentMethod: string;
  paymentStatus: string;
  referenceNumber: string | null;
  bankAccount: string | null;
  notes: string | null;
  approvedBy: number | null;
  createdBy: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentItem {
  id?: number;
  paymentId?: number;
  purchaseId: number;
  purchaseNumber: string;
  amount: number;
  vendorId: number;
  vendorName: string;
  dueDate: Date;
  status: string;
}

export const PaymentMethod = {
  CASH: 'Cash',
  BANK_TRANSFER: 'Bank Transfer',
  CHEQUE: 'Cheque',
  ONLINE: 'Online Payment'
} as const;

export const PaymentStatus = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  COMPLETED: 'Completed',
  REJECTED: 'Rejected'
} as const;

export type PaymentMethodType = typeof PaymentMethod[keyof typeof PaymentMethod];
export type PaymentStatusType = typeof PaymentStatus[keyof typeof PaymentStatus];