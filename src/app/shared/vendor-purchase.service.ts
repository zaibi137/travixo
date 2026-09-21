// src/app/shared/vendor-purchase.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { 
  VendorPurchase, 
  PurchaseItem 
} from '../models/vendor-purchase.model';

@Injectable({
  providedIn: 'root'
})
export class VendorPurchaseService {
  private apiUrl = '/api/vendor-purchases';

  constructor(private http: HttpClient) {}

  // Mock data for development
  private mockPurchases: VendorPurchase[] = [
    {
      id: 1,
      purchaseNumber: 'PO-2026-001',
      purchaseDate: new Date('2026-01-15'),
      vendorId: 1,
      vendorName: 'Hilton Hotels',
      clientId: 1,
      clientName: 'Mr. Ahmed Khan',
      items: [
        {
          id: 1,
          description: 'Deluxe Room - 5 nights',
          serviceType: 'Hotel',
          quantity: 5,
          unitPrice: 100,
          totalPrice: 500,
          clientId: 1,
          clientName: 'Mr. Ahmed Khan',
          dateOfService: new Date('2026-01-20'),
          notes: 'Includes breakfast'
        }
      ],
      subTotal: 500,
      taxRate: 10,
      taxAmount: 50,
      discountAmount: 25,
      totalAmount: 525,
      commissionRate: 15,
      commissionAmount: 75,
      netPayable: 425,
      paymentTerms: 'Net 30 Days',
      dueDate: new Date('2026-02-14'),
      amountPaid: 0,
      paymentStatus: 'Pending',
      status: 'Submitted',
      notes: 'Corporate booking for client',
      createdBy: 1,
      createdAt: new Date('2026-01-15'),
      updatedAt: new Date('2026-01-15')
    },
    {
      id: 2,
      purchaseNumber: 'PO-2026-002',
      purchaseDate: new Date('2026-01-18'),
      vendorId: 2,
      vendorName: 'Emirates Airlines',
      clientId: 2,
      clientName: 'Ms. Sarah Ali',
      items: [
        {
          id: 2,
          description: 'Roundtrip Dubai-London',
          serviceType: 'Airline',
          quantity: 2,
          unitPrice: 600,
          totalPrice: 1200,
          clientId: 2,
          clientName: 'Ms. Sarah Ali',
          dateOfService: new Date('2026-02-01'),
          notes: 'Business class'
        }
      ],
      subTotal: 1200,
      taxRate: 0,
      taxAmount: 0,
      discountAmount: 0,
      totalAmount: 1200,
      commissionRate: 8,
      commissionAmount: 96,
      netPayable: 1104,
      paymentTerms: 'Net 15 Days',
      dueDate: new Date('2026-02-02'),
      amountPaid: 1200,
      paymentStatus: 'Paid',
      status: 'Approved',
      notes: 'Fully paid',
      createdBy: 1,
      createdAt: new Date('2026-01-18'),
      updatedAt: new Date('2026-02-02')
    },
    {
      id: 3,
      purchaseNumber: 'PO-2026-003',
      purchaseDate: new Date('2026-01-10'),
      vendorId: 3,
      vendorName: 'Local Tours Ltd',
      clientId: 3,
      clientName: 'Family of 4',
      items: [
        {
          id: 3,
          description: '3-Day Desert Safari Package',
          serviceType: 'Tour',
          quantity: 1,
          unitPrice: 800,
          totalPrice: 800,
          clientId: 3,
          clientName: 'Family of 4',
          dateOfService: new Date('2026-01-25'),
          notes: 'Includes all meals'
        }
      ],
      subTotal: 800,
      taxRate: 5,
      taxAmount: 40,
      discountAmount: 0,
      totalAmount: 840,
      commissionRate: 20,
      commissionAmount: 160,
      netPayable: 640,
      paymentTerms: 'Net 30 Days',
      dueDate: new Date('2026-02-09'),
      amountPaid: 0,
      paymentStatus: 'Pending',
      status: 'Submitted',
      notes: 'Family package special',
      createdBy: 1,
      createdAt: new Date('2026-01-10'),
      updatedAt: new Date('2026-01-10')
    },
    {
      id: 4,
      purchaseNumber: 'PO-2026-004',
      purchaseDate: new Date('2025-12-20'),
      vendorId: 4,
      vendorName: 'Visa Express',
      clientId: 4,
      clientName: 'Mr. David Brown',
      items: [
        {
          id: 4,
          description: 'USA Tourist Visa Processing',
          serviceType: 'Visa Agency',
          quantity: 2,
          unitPrice: 150,
          totalPrice: 300,
          clientId: 4,
          clientName: 'Mr. David Brown',
          dateOfService: new Date('2025-12-22'),
          notes: 'Urgent processing'
        }
      ],
      subTotal: 300,
      taxRate: 0,
      taxAmount: 0,
      discountAmount: 0,
      totalAmount: 300,
      commissionRate: 10,
      commissionAmount: 30,
      netPayable: 270,
      paymentTerms: 'Net 15 Days',
      dueDate: new Date('2026-01-04'),
      amountPaid: 0,
      paymentStatus: 'Overdue',
      status: 'Submitted',
      notes: 'Overdue payment',
      createdBy: 1,
      createdAt: new Date('2025-12-20'),
      updatedAt: new Date('2025-12-20')
    }
  ];

  getPurchases(): Observable<VendorPurchase[]> {
    return of(this.mockPurchases);
  }

  getPurchaseById(id: number): Observable<VendorPurchase | undefined> {
    return of(this.mockPurchases.find(p => p.id === id));
  }

  getPurchasesByVendor(vendorId: number): Observable<VendorPurchase[]> {
    return of(this.mockPurchases.filter(p => p.vendorId === vendorId));
  }

  getPurchasesByCustomer(clientId: number): Observable<VendorPurchase[]> {
    return of(this.mockPurchases.filter(p => p.clientId === clientId));
  }

  createPurchase(purchase: any): Observable<VendorPurchase> {
    const newPurchase = {
      ...purchase,
      id: this.mockPurchases.length + 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.mockPurchases.push(newPurchase);
    return of(newPurchase);
  }

  updatePurchase(id: number, purchase: any): Observable<VendorPurchase> {
    const index = this.mockPurchases.findIndex(p => p.id === id);
    if (index !== -1) {
      this.mockPurchases[index] = {
        ...this.mockPurchases[index],
        ...purchase,
        updatedAt: new Date()
      };
      return of(this.mockPurchases[index]);
    }
    throw new Error('Purchase not found');
  }

  updatePaymentStatus(id: number, status: string, amountPaid: number): Observable<VendorPurchase> {
    const index = this.mockPurchases.findIndex(p => p.id === id);
    if (index !== -1) {
      this.mockPurchases[index] = {
        ...this.mockPurchases[index],
        paymentStatus: status,
        amountPaid: amountPaid,
        updatedAt: new Date()
      };
      return of(this.mockPurchases[index]);
    }
    throw new Error('Purchase not found');
  }

  deletePurchase(id: number): Observable<void> {
    const index = this.mockPurchases.findIndex(p => p.id === id);
    if (index !== -1) {
      this.mockPurchases.splice(index, 1);
    }
    return of(undefined);
  }

  generatePurchaseNumber(): string {
    const date = new Date();
    const year = date.getFullYear();
    const count = this.mockPurchases.length + 1;
    return `PO-${year}-${String(count).padStart(4, '0')}`;
  }
}