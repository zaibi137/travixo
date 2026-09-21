// src/app/shared/expense-allocation.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ExpenseAllocation } from '../models/expense-allocation.model';

@Injectable({
  providedIn: 'root'
})
export class ExpenseAllocationService {
  private apiUrl = '/api/expense-allocations';

  constructor(private http: HttpClient) {}

  // Mock data for development
  private mockAllocations: ExpenseAllocation[] = [
    {
      id: 1,
      allocationNumber: 'EA-2026-001',
      expenseDate: new Date('2026-01-15'),
      expenseType: 'Direct',
      expenseCategory: 'Flight Tickets',
      description: 'Dubai-London return tickets for client',
      amount: 500,
      allocationType: 'Client',
      allocatedToId: 1,
      allocatedToName: 'Mr. Ahmed Khan',
      department: 'Sales',
      status: 'Approved',
      paymentMethod: 'Bank Transfer',
      referenceNumber: 'TR-2026-001',
      notes: 'Corporate booking expense',
      purchaseId: 1,
      invoiceId: 1,
      clientId: 1,
      vendorId: null,
      createdBy: 1,
      createdAt: new Date('2026-01-15'),
      updatedAt: new Date('2026-01-15')
    },
    {
      id: 2,
      allocationNumber: 'EA-2026-002',
      expenseDate: new Date('2026-01-18'),
      expenseType: 'Indirect',
      expenseCategory: 'Office Rent',
      description: 'Monthly office rent - January 2026',
      amount: 2000,
      allocationType: 'Department',
      allocatedToId: 4,
      allocatedToName: 'Administration',
      department: 'Admin',
      status: 'Pending',
      paymentMethod: 'Bank Transfer',
      referenceNumber: 'TR-2026-002',
      notes: 'Monthly rent payment',
      purchaseId: null,
      invoiceId: null,
      clientId: null,
      vendorId: null,
      createdBy: 1,
      createdAt: new Date('2026-01-18'),
      updatedAt: new Date('2026-01-18')
    },
    {
      id: 3,
      allocationNumber: 'EA-2026-003',
      expenseDate: new Date('2026-01-20'),
      expenseType: 'Direct',
      expenseCategory: 'Hotel Accommodation',
      description: 'Hilton Hotel stay - 5 nights for client',
      amount: 425,
      allocationType: 'Client',
      allocatedToId: 2,
      allocatedToName: 'Ms. Sarah Ali',
      department: 'Sales',
      status: 'Approved',
      paymentMethod: 'Online Payment',
      referenceNumber: 'ON-2026-003',
      notes: 'Hotel booking expense',
      purchaseId: 3,
      invoiceId: 2,
      clientId: 2,
      vendorId: null,
      createdBy: 1,
      createdAt: new Date('2026-01-20'),
      updatedAt: new Date('2026-01-20')
    },
    {
      id: 4,
      allocationNumber: 'EA-2026-004',
      expenseDate: new Date('2026-01-25'),
      expenseType: 'Indirect',
      expenseCategory: 'Software Licenses',
      description: 'Annual software license renewal',
      amount: 500,
      allocationType: 'Department',
      allocatedToId: 6,
      allocatedToName: 'Information Technology',
      department: 'IT',
      status: 'Approved',
      paymentMethod: 'Online Payment',
      referenceNumber: 'ON-2026-004',
      notes: 'CRM software license',
      purchaseId: null,
      invoiceId: null,
      clientId: null,
      vendorId: null,
      createdBy: 1,
      createdAt: new Date('2026-01-25'),
      updatedAt: new Date('2026-01-25')
    },
    {
      id: 5,
      allocationNumber: 'EA-2026-005',
      expenseDate: new Date('2026-01-28'),
      expenseType: 'Direct',
      expenseCategory: 'Visa Processing',
      description: 'Visa processing for family of 4',
      amount: 270,
      allocationType: 'Client',
      allocatedToId: 3,
      allocatedToName: 'Family of 4',
      department: 'Sales',
      status: 'Pending',
      paymentMethod: 'Cash',
      referenceNumber: null,
      notes: 'Visa fees for family',
      purchaseId: 4,
      invoiceId: 3,
      clientId: 3,
      vendorId: null,
      createdBy: 1,
      createdAt: new Date('2026-01-28'),
      updatedAt: new Date('2026-01-28')
    }
  ];

  getAllocations(): Observable<ExpenseAllocation[]> {
    return of(this.mockAllocations);
  }

  getAllocationById(id: number): Observable<ExpenseAllocation | undefined> {
    return of(this.mockAllocations.find(a => a.id === id));
  }

  getAllocationsByClient(clientId: number): Observable<ExpenseAllocation[]> {
    return of(this.mockAllocations.filter(a => a.clientId === clientId));
  }

  getAllocationsByDepartment(department: string): Observable<ExpenseAllocation[]> {
    return of(this.mockAllocations.filter(a => a.department === department));
  }

  createAllocation(allocation: any): Observable<ExpenseAllocation> {
    const newAllocation = {
      ...allocation,
      id: this.mockAllocations.length + 1,
      allocationNumber: this.generateAllocationNumber(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.mockAllocations.push(newAllocation);
    return of(newAllocation);
  }

  updateAllocation(id: number, allocation: any): Observable<ExpenseAllocation> {
    const index = this.mockAllocations.findIndex(a => a.id === id);
    if (index !== -1) {
      this.mockAllocations[index] = {
        ...this.mockAllocations[index],
        ...allocation,
        updatedAt: new Date()
      };
      return of(this.mockAllocations[index]);
    }
    throw new Error('Allocation not found');
  }

  updateStatus(id: number, status: string): Observable<ExpenseAllocation> {
    const index = this.mockAllocations.findIndex(a => a.id === id);
    if (index !== -1) {
      this.mockAllocations[index] = {
        ...this.mockAllocations[index],
        status: status,
        updatedAt: new Date()
      };
      return of(this.mockAllocations[index]);
    }
    throw new Error('Allocation not found');
  }

  deleteAllocation(id: number): Observable<void> {
    const index = this.mockAllocations.findIndex(a => a.id === id);
    if (index !== -1) {
      this.mockAllocations.splice(index, 1);
    }
    return of(undefined);
  }

  generateAllocationNumber(): string {
    const date = new Date();
    const year = date.getFullYear();
    const count = this.mockAllocations.length + 1;
    return `EA-${year}-${String(count).padStart(4, '0')}`;
  }

  // Get unique departments for filter
  getUniqueDepartments(): string[] {
    const departments = this.mockAllocations.map(a => a.department);
    return [...new Set(departments)];
  }

  // Get unique expense types
  getUniqueExpenseTypes(): string[] {
    const types = this.mockAllocations.map(a => a.expenseType);
    return [...new Set(types)];
  }
}