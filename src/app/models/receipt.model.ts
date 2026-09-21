// src/app/models/receipt.model.ts

export interface Receipt {
  id: number;                 
  receiptcode: string;        
  invoiceid: number;          
  customerid: number;         
  documentno?: string;        
  receiptdate: string;        
  paymentmode: string;        
  branchid?: number;          
  amount: number;             
  description?: string;       
  remarks?: string;           
  createdby?: string;         
  
  // UI-ONLY FIELDS (FIXED: Added these so HTML stops complaining)
  status?: 'Pending' | 'Cleared' | 'Cancelled'; 
  customername?: string;      
  bankReference?: string;     // <-- ADDED HERE
  agentCode?: string;         // <-- ADDED HERE
  linkedInvoices?: string[];  // <-- ADDED HERE
}

export interface CreateReceiptPayload {
  receiptcode: string;
  invoiceid: number;
  customerid: number;
  documentno?: string;
  receiptdate: string;
  paymentmode: string;
  branchid?: number;
  amount: number;
  description?: string;
  remarks?: string;
  createdby?: string;
}