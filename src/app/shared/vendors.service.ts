import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Vendor } from '../models/vendor.model';

@Injectable({
  providedIn: 'root'
})
export class VendorsService {
  private vendors: Vendor[] = [
    {
      id: 1,
      vendorName: 'Opal Haven Hotel',
      category: 'Hotel',
      contactPerson: 'Ahmad Khan',
      email: 'reservations@opalhaven.com',
      phone: '+92 300 1234567',
      address: 'Mall Road, Murree',
      paymentTerms: 'Net 30 Days',
      outstandingBalance: 150000,
      status: 'Active'
    },
    {
      id: 2,
      vendorName: 'PIA Corporate Bookings',
      category: 'Airline',
      contactPerson: 'Sara Ali',
      email: 'corporate@piacorp.com',
      phone: '+92 21 9990001',
      address: 'Airport Road, Karachi',
      paymentTerms: 'Advance Payment',
      outstandingBalance: 0,
      status: 'Active'
    }
  ];

  getVendors(): Observable<Vendor[]> {
    return of(this.vendors);
  }

  addVendor(vendor: Omit<Vendor, 'id'>): Observable<Vendor> {
    const newVendor: Vendor = { ...vendor, id: Date.now() };
    this.vendors.push(newVendor);
    return of(newVendor);
  }

  updateVendor(vendor: Vendor): Observable<Vendor> {
    const index = this.vendors.findIndex(v => v.id === vendor.id);
    if (index !== -1) {
      this.vendors[index] = vendor;
    }
    return of(vendor);
  }

  deleteVendor(id: number): Observable<boolean> {
    this.vendors = this.vendors.filter(v => v.id !== id);
    return of(true);
  }
}