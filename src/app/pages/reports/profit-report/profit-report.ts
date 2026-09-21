import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfitReportService } from '../../../shared/profit-report.service';
import type { MonthlyFinancial, ProfitReportResult } from '../../../shared/profit-report.service';

@Component({
  selector: 'app-profit-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profit-report.html',
  styleUrls: ['./profit-report.css']
})
export class ProfitReportComponent implements OnInit {
  // Filters
  timeRange = signal<'Monthly' | 'Quarterly' | 'Yearly'>('Monthly');
  startDate = signal<string>('2026-01-01');
  endDate = signal<string>('2026-07-31');
  dateError = signal<string>('');
  isLoading = signal<boolean>(false);

  // Core figures (current period)
  revenue = signal<number>(0);
  costs = signal<number>(0);

  // Previous period figures — used only to compute trend arrows
  previousRevenue = signal<number>(0);
  previousCosts = signal<number>(0);

  tableData = signal<MonthlyFinancial[]>([]);

  profit = computed(() => this.revenue() - this.costs());
  previousProfit = computed(() => this.previousRevenue() - this.previousCosts());

  profitMargin = computed(() => {
    const rev = this.revenue();
    return rev > 0 ? (this.profit() / rev) * 100 : 0;
  });

  revenueTrend = computed(() => this.percentChange(this.revenue(), this.previousRevenue()));
  costTrend = computed(() => this.percentChange(this.costs(), this.previousCosts()));
  profitTrend = computed(() => this.percentChange(this.profit(), this.previousProfit()));

  // Used to scale the bar chart columns proportionally
  chartMax = computed(() => {
    const values = this.tableData().flatMap(r => [r.revenue, r.cost]);
    return Math.max(...values, 1);
  });

  private reportService = inject(ProfitReportService);

  ngOnInit(): void {
    this.loadReportData();
  }

  private percentChange(current: number, previous: number): number {
    if (!previous) return 0;
    return ((current - previous) / previous) * 100;
  }

  barHeightPercent(value: number): number {
    return (value / this.chartMax()) * 100;
  }

  loadReportData(): void {
    if (this.startDate() > this.endDate()) {
      this.dateError.set('Start date cannot be after end date.');
      return;
    }
    this.dateError.set('');
    this.isLoading.set(true);

    this.reportService.getReportData(this.timeRange(), this.startDate(), this.endDate()).subscribe((result: ProfitReportResult) => {
      this.revenue.set(result.revenue);
      this.costs.set(result.costs);
      this.previousRevenue.set(result.previousRevenue);
      this.previousCosts.set(result.previousCosts);
      this.tableData.set(result.monthlyData);
      this.isLoading.set(false);
    });
  }

  exportReport(): void {
    const rows: string[][] = [
      ['Month', 'Revenue (PKR)', 'Cost (PKR)', 'Profit (PKR)'],
      ...this.tableData().map(r => [r.month, r.revenue.toString(), r.cost.toString(), r.profit.toString()]),
      ['TOTAL', this.revenue().toString(), this.costs().toString(), this.profit().toString()]
    ];

    const csvContent = rows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `profit-report-${this.timeRange().toLowerCase()}-${this.startDate()}-to-${this.endDate()}.csv`;
    link.click();

    URL.revokeObjectURL(url);
  }
}