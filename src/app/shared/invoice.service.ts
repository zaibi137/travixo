import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface InvoiceDetail {
  id?: number;
  servicecategory?: string;
  quantity: number;
  cost: number;
  totalamount?: number;
  referenceno?: string;
  description?: string;
}

export interface CreateInvoiceDto {
  invoicecode: string;
  customerid: number;
  invoicedate: string;
  duedate: string;
  status?: string;
  totalamount?: number;
  createdby?: string;
  details: InvoiceDetail[];
}

export interface Invoice {
  id?: number;
  invoicecode: string;
  customerid: number;
  customername?: string;
  invoicedate: string;
  duedate: string;
  totalamount?: number;
  paidamount?: number;
  balanceamount?: number;
  status?: string;
  createdby?: string;
  details: InvoiceDetail[];
}

export interface Customer {
  id: number;
  name?: string;
  customername?: string;
  fullname?: string;
  email?: string;
  phone?: string;
}

export interface ApiResponse<T> {
  status: string;
  message: string;
  data: {
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    data: T[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private apiUrl = 'http://localhost:4200/api/v1/customer-invoices';
  private customersUrl = 'http://localhost:4200/api/v1/customers';

  constructor(private http: HttpClient) {}

  getInvoices(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getInvoiceById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  getCustomers(): Observable<any> {
    return this.http.get<any>(this.customersUrl);
  }

  createInvoice(payload: CreateInvoiceDto): Observable<any> {
    return this.http.post<any>(this.apiUrl, payload);
  }

  updateInvoice(id: number, payload: CreateInvoiceDto): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, payload);
  }

  deleteInvoice(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}