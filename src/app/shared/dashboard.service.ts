import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'https://travelapi.siddev.online/api/v1/dashboard';

  constructor(private http: HttpClient) {}

  getDashboardData(branchId: number, branchKey: number, fromDate: string, toDate: string): Observable<any> {
    const params = new HttpParams()
      .set('branchId', branchId)
      .set('branchKey', branchKey)
      .set('fromDate', fromDate)
      .set('toDate', toDate);

    return this.http.get<any>(this.apiUrl, { params });
  }
}