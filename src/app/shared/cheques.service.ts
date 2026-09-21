import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Cheque } from '../models/cheques.model';

@Injectable({
  providedIn: 'root'
})
export class ChequesService {
  private cheques: Cheque[] = [
    {
      id: '1',
      chequeNumber: 'CHQ-1001',
      chequeDate: '2026-07-01',
      clientName: 'Acme Corp',
      bankName: 'Meezan Bank',
      amount: 45000,
      status: 'In Hand',
      chequeType: 'Incoming',
      payeeName: 'Opal Haven',
      depositDate: '',
      linkedInvoice: 'INV-2026-001',
      remarks: 'Pending clearance'
    },
    {
      id: '2',
      chequeNumber: 'CHQ-1002',
      chequeDate: '2026-07-05',
      clientName: 'Global Tech',
      bankName: 'HBL',
      amount: 120000,
      status: 'Cleared',
      chequeType: 'Incoming',
      payeeName: 'Opal Haven',
      depositDate: '2026-07-06',
      linkedInvoice: 'INV-2026-002',
      remarks: 'Cleared successfully'
    },
    {
      id: '3',
      chequeNumber: 'CHQ-99283',
      chequeDate: '2026-07-10',
      clientName: 'Nexus Suppliers',
      bankName: 'Alfalah',
      amount: 35000,
      status: 'Bounced',
      chequeType: 'Incoming',
      payeeName: 'Opal Haven',
      depositDate: '2026-07-11',
      linkedInvoice: 'INV-2026-003',
      remarks: 'Insufficient funds'
    }
  ];

  constructor() {}

  getCheques(): Observable<Cheque[]> {
    return of(this.cheques);
  }

  addCheque(cheque: Omit<Cheque, 'id'>): Observable<Cheque> {
    const newId = (this.cheques.length + 1).toString();
    const createdCheque: Cheque = { id: newId, ...cheque };
    this.cheques.unshift(createdCheque);
    return of(createdCheque);
  }

  updateCheque(updatedCheque: Cheque): Observable<Cheque> {
    const index = this.cheques.findIndex(c => c.id === updatedCheque.id);
    if (index !== -1) {
      this.cheques[index] = { ...updatedCheque };
    }
    return of(updatedCheque);
  }

  deleteCheque(id: string | number): Observable<boolean> {
    this.cheques = this.cheques.filter(c => c.id !== id);
    return of(true);
  }
}