// src/app/services/receipt.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Receipt, CreateReceiptPayload } from '../models/receipt.model';

@Injectable({
  providedIn: 'root'
})
export class ReceiptService {
  
  private http = inject(HttpClient);

  // 🔴 REPLACE THIS WITH YOUR ACTUAL BACKEND BASE URL (e.g. http://localhost:3000)
  private apiUrl = 'http://your-backend-api.com/api/v1/customer-receipts';

  // ==========================================================
  // 1. GET ALL RECEIPTS
  // [GET] /api/v1/customer-receipts
  // ==========================================================
  getReceipts(search?: string): Observable<Receipt[]> {
    let params = new HttpParams();
    if (search) {
      params = params.set('search', search);
    }
    return this.http.get<Receipt[]>(this.apiUrl, { params });
  }

  // ==========================================================
  // 2. GET SINGLE RECEIPT BY ID
  // [GET] /api/v1/customer-receipts/{id}
  // ==========================================================
  getReceiptById(id: number): Observable<Receipt> {
    return this.http.get<Receipt>(`${this.apiUrl}/${id}`);
  }

  // ==========================================================
  // 3. CREATE NEW RECEIPT
  // [POST] /api/v1/customer-receipts
  // ==========================================================
  createReceipt(payload: CreateReceiptPayload): Observable<Receipt> {
    return this.http.post<Receipt>(this.apiUrl, payload);
  }

  // ==========================================================
  // 4. UPDATE EXISTING RECEIPT
  // [PUT] /api/v1/customer-receipts/{id}
  // ==========================================================
  updateReceipt(id: number, payload: CreateReceiptPayload): Observable<Receipt> {
    return this.http.put<Receipt>(`${this.apiUrl}/${id}`, payload);
  }

  // ==========================================================
  // 5. DELETE RECEIPT
  // [DELETE] /api/v1/customer-receipts/{id}
  // ==========================================================
  deleteReceipt(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // ==========================================================
  // BONUS: PRINT / EXPORT PDF
  // (You will need to add this endpoint to your backend if missing)
  // ==========================================================
  printReceipt(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/print`, { responseType: 'blob' });
  }
}