import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Customer {
  id?: number;
  clientcode: string;
  name: string;
  customertype: string;
  status?: number;
  mobile?: string;
  whatsapp?: string;
  email?: string;
  cnic?: string;
  passportno?: string;
  passportexpirydate?: string;
  dateofbirth?: string;
  nationality?: string;
  gender?: string;
  paymentterm?: string;
  address?: string;
  createdby?: string;
}

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/customers`;

  // GET: /api/v1/customers
  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.apiUrl);
  }

  // GET: /api/v1/customers/{id}
  getCustomerById(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/${id}`);
  }

  // POST: /api/v1/customers
  createCustomer(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(this.apiUrl, customer);
  }

  // PUT: /api/v1/customers/{id}
  updateCustomer(id: number, customer: Customer): Observable<Customer> {
    return this.http.put<Customer>(`${this.apiUrl}/${id}`, customer);
  }

  // DELETE: /api/v1/customers/{id}
  deleteCustomer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}