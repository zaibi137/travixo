export interface Cheque {
  id: string | number;
  chequeNumber: string;
  chequeDate: string;
  clientName: string;
  bankName: string;
  amount: number;
  status: 'In Hand' | 'Deposited' | 'Cleared' | 'Bounced' | 'Cancelled';
  remarks?: string;
  chequeType: 'Incoming' | 'Outgoing';
  payeeName?: string;
  depositDate?: string;
  linkedInvoice?: string; // <-- Add this property here
}