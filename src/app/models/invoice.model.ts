export interface InvoiceDetailDto {
  servicecategory: string;
  quantity: number;
  cost: number;
  totalamount: number; // Computed automatically: quantity * cost
  referenceno: string;
  description: string;
}

export interface CreateInvoiceDto {
  invoicecode: string;
  customerid: number;     // Selected from dropdown of loaded customers
  invoicedate: string;    // ISO string or YYYY-MM-DD
  duedate: string;
  totalamount: number;    // Computed automatically: sum of all item totalamounts
  createdby: string;
  details: InvoiceDetailDto[];
}