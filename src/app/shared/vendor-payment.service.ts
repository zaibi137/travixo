// src/app/shared/vendor-payment.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { VendorPayment, PaymentItem } from '../models/vendor-payment.model';

@Injectable({
  providedIn: 'root'
})
export class VendorPaymentService {
  private apiUrl = '/api/vendor-payments';

  constructor(private http: HttpClient) {}

  // Mock data for development
  private mockPayments: VendorPayment[] = [
    {
      id: 1,
      paymentNumber: 'PMT-2026-001',
      paymentDate: new Date('2026-01-20'),
      vendorId: 1,
      vendorName: 'Hilton Hotels',
      purchaseIds: [1],
      purchaseNumbers: ['PO-2026-001'],
      totalPayable: 425,
      discountReceived: 0,
      amountPaid: 425,
      paymentMethod: 'Bank Transfer',
      paymentStatus: 'Completed',
      referenceNumber: 'TR-2026-001',
      bankAccount: 'Main Account #1234',
      notes: 'Payment for Hilton corporate booking',
      approvedBy: 1,
      createdBy: 1,
      createdAt: new Date('2026-01-20'),
      updatedAt: new Date('2026-01-20')
    },
    {
      id: 2,
      paymentNumber: 'PMT-2026-002',
      paymentDate: new Date('2026-01-25'),
      vendorId: 2,
      vendorName: 'Emirates Airlines',
      purchaseIds: [2],
      purchaseNumbers: ['PO-2026-002'],
      totalPayable: 1104,
      discountReceived: 0,
      amountPaid: 1104,
      paymentMethod: 'Online Payment',
      paymentStatus: 'Completed',
      referenceNumber: 'ON-2026-002',
      bankAccount: 'Main Account #1234',
      notes: 'Online payment for flight tickets',
      approvedBy: 1,
      createdBy: 1,
      createdAt: new Date('2026-01-25'),
      updatedAt: new Date('2026-01-25')
    },
    {
      id: 3,
      paymentNumber: 'PMT-2026-003',
      paymentDate: new Date('2026-02-01'),
      vendorId: 4,
      vendorName: 'Visa Express',
      purchaseIds: [4],
      purchaseNumbers: ['PO-2026-004'],
      totalPayable: 270,
      discountReceived: 10,
      amountPaid: 260,
      paymentMethod: 'Cash',
      paymentStatus: 'Completed',
      referenceNumber: null,
      bankAccount: null,
      notes: 'Cash payment with early payment discount',
      approvedBy: 1,
      createdBy: 1,
      createdAt: new Date('2026-02-01'),
      updatedAt: new Date('2026-02-01')
    }
  ];

  getPayments(): Observable<VendorPayment[]> {
    return of(this.mockPayments);
  }

  getPaymentById(id: number): Observable<VendorPayment | undefined> {
    return of(this.mockPayments.find(p => p.id === id));
  }

  getPaymentsByVendor(vendorId: number): Observable<VendorPayment[]> {
    return of(this.mockPayments.filter(p => p.vendorId === vendorId));
  }

  createPayment(payment: any): Observable<VendorPayment> {
    const newPayment = {
      ...payment,
      id: this.mockPayments.length + 1,
      paymentNumber: this.generatePaymentNumber(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.mockPayments.push(newPayment);
    return of(newPayment);
  }

  updatePayment(id: number, payment: any): Observable<VendorPayment> {
    const index = this.mockPayments.findIndex(p => p.id === id);
    if (index !== -1) {
      this.mockPayments[index] = {
        ...this.mockPayments[index],
        ...payment,
        updatedAt: new Date()
      };
      return of(this.mockPayments[index]);
    }
    throw new Error('Payment not found');
  }

  deletePayment(id: number): Observable<void> {
    const index = this.mockPayments.findIndex(p => p.id === id);
    if (index !== -1) {
      this.mockPayments.splice(index, 1);
    }
    return of(undefined);
  }

  generatePaymentNumber(): string {
    const date = new Date();
    const year = date.getFullYear();
    const count = this.mockPayments.length + 1;
    return `PMT-${year}-${String(count).padStart(4, '0')}`;
  }
}