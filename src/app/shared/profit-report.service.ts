import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface MonthlyFinancial {
  month: string;
  revenue: number;
  cost: number;
  profit: number;
}

export interface ProfitReportResult {
  revenue: number;
  costs: number;
  previousRevenue: number;
  previousCosts: number;
  monthlyData: MonthlyFinancial[];
}

@Injectable({ providedIn: 'root' })
export class ProfitReportService {
  /**
   * TODO (backend integration): once travelapi.siddev.online exposes a reports endpoint,
   * replace the body of this method with something like:
   *
   *   return this.http.get<ProfitReportResult>(`${environment.apiUrl}/reports/profit`, {
   *     params: { range, startDate, endDate }
   *   });
   *
   * The component never needs to change — it only depends on this method's signature.
   */
  getReportData(
    range: 'Monthly' | 'Quarterly' | 'Yearly',
    startDate: string,
    endDate: string
  ): Observable<ProfitReportResult> {
    const monthlyData: MonthlyFinancial[] = [
      { month: 'January 2026', revenue: 210000, cost: 140000, profit: 70000 },
      { month: 'February 2026', revenue: 230000, cost: 155000, profit: 75000 },
      { month: 'March 2026', revenue: 190000, cost: 130000, profit: 60000 },
      { month: 'April 2026', revenue: 250000, cost: 165000, profit: 85000 },
      { month: 'May 2026', revenue: 270000, cost: 180000, profit: 90000 },
      { month: 'June 2026', revenue: 300000, cost: 210000, profit: 90000 }
    ];

    const revenue = monthlyData.reduce((sum, m) => sum + m.revenue, 0);
    const costs = monthlyData.reduce((sum, m) => sum + m.cost, 0);

    // Mock "previous period" totals used only for the trend arrows on the KPI cards.
    // Replace with a real prior-period query once the backend is wired up.
    const previousRevenue = Math.round(revenue * 0.91);
    const previousCosts = Math.round(costs * 0.94);

    return of({ revenue, costs, previousRevenue, previousCosts, monthlyData });
  }
}