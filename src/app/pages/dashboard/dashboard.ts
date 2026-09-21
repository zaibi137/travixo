// src/app/pages/dashboard/dashboard.ts

import { Component, OnInit, signal, computed, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  
  @ViewChild('revenueChart') revenueCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('vendorChart') vendorCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('doughnutChart') doughnutCanvas!: ElementRef<HTMLCanvasElement>;
  
  private chartInstances: any[] = [];

  userName = signal<string>('Administrator');
  currentDate = signal<Date>(new Date());
  
  timeGreeting = computed(() => {
    const hour = this.currentDate().getHours();
    if (hour < 12) return 'Morning';
    if (hour < 17) return 'Afternoon';
    return 'Evening';
  });

  revenue = signal<number>(1850000);
  invoices = signal<number>(128);
  customers = signal<number>(56);
  pendingAmount = signal<number>(45000);

  topCustomers = [
    { name: 'Muhammad Tanveer', invoices: 12, amount: 125000 },
    { name: 'Ali Ahmed', invoices: 8, amount: 85000 },
    { name: 'Fatima Zafar', invoices: 6, amount: 72000 },
    { name: 'Sarah Khan', invoices: 5, amount: 50000 },
    { name: 'Usman Raza', invoices: 4, amount: 32000 }
  ];

  // ==================== BRANCH & PROFILE DATA ====================
  branches = [
    { id: 1, name: 'Head Office - Lahore', owner: 'Mr. Ahmed Khan' },
    { id: 2, name: 'Branch - Karachi', owner: 'Ms. Sarah Ali' },
    { id: 3, name: 'Branch - Islamabad', owner: 'Mr. Usman Raza' }
  ];

  activeBranch = signal<{ id: number; name: string; owner: string }>(this.branches[0]);
  
  // ==================== DROPDOWN STATE ====================
  isBranchDropdownOpen = false;

  // ==================== BRANCH SELECT FUNCTION ====================
  selectBranch(branch: { id: number; name: string; owner: string }) {
    this.activeBranch.set(branch);
    this.isBranchDropdownOpen = false;
    // You can trigger a reload of dashboard data here based on branch ID later!
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.renderMainChart();
      this.renderVendorChart();
      this.renderDoughnutChart();
    }, 100);
  }

  // ==================== CHART RENDERERS ====================

  private renderMainChart(): void {
    const ctx = this.revenueCanvas.nativeElement.getContext('2d');
    if (!ctx) return;
    this.destroyChart(0);

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Revenue',
            data: [120000, 145000, 160000, 180000, 150000, 210000],
            backgroundColor: (context: any) => {
              const ctx = context.chart.ctx;
              const gradient = ctx.createLinearGradient(0, 0, 0, 350);
              gradient.addColorStop(0, '#14b8a6');
              gradient.addColorStop(1, '#0d9488');
              return gradient;
            },
            borderColor: '#0d9488',
            borderWidth: 1,
            borderRadius: 4
          },
          {
            label: 'Costs',
            data: [80000, 95000, 110000, 120000, 90000, 140000],
            backgroundColor: (context: any) => {
              const ctx = context.chart.ctx;
              const gradient = ctx.createLinearGradient(0, 0, 0, 350);
              gradient.addColorStop(0, '#f87171');
              gradient.addColorStop(1, '#dc2626');
              return gradient;
            },
            borderColor: '#dc2626',
            borderWidth: 1,
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: '#94a3b8', boxWidth: 12, padding: 12 }
          }
        },
        scales: {
          x: {
            ticks: { color: '#94a3b8' },
            grid: { color: '#1e293b' }
          },
          y: {
            ticks: { color: '#94a3b8', callback: (value) => '₨' + value.toLocaleString() },
            grid: { color: '#1e293b' }
          }
        }
      }
    });
    this.chartInstances.push(chart);
  }

  private renderVendorChart(): void {
    const ctx = this.vendorCanvas.nativeElement.getContext('2d');
    if (!ctx) return;
    this.destroyChart(1);

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Hilton Hotels', 'Emirates Air', 'Qatar Airways', 'Marriott', 'Visa Express'],
        datasets: [{
          label: 'Spend (PKR)',
          data: [450000, 380000, 290000, 210000, 150000],
          backgroundColor: (context: any) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 350, 0);
            gradient.addColorStop(0, '#14b8a6');
            gradient.addColorStop(1, '#5eead4');
            return gradient;
          },
          borderRadius: 4
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            ticks: { color: '#94a3b8', callback: (value) => '₨' + value.toLocaleString() },
            grid: { color: '#1e293b' }
          },
          y: {
            ticks: { color: '#94a3b8' },
            grid: { display: false }
          }
        }
      }
    });
    this.chartInstances.push(chart);
  }

  private renderDoughnutChart(): void {
    const ctx = this.doughnutCanvas.nativeElement.getContext('2d');
    if (!ctx) return;
    this.destroyChart(2);

    const totalRevenue = this.revenue();
    const totalCost = 1480000;
    const profit = totalRevenue - totalCost;
    const profitPercentage = ((profit / totalRevenue) * 100).toFixed(1);

    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: [`Net Profit (${profitPercentage}%)`, 'Total Revenue'],
        datasets: [{
          data: [profit, totalCost],
          backgroundColor: ['#14b8a6', '#334155'],
          borderColor: '#131b2e',
          borderWidth: 3,
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#94a3b8', padding: 12, boxWidth: 12 }
          }
        }
      }
    });
    this.chartInstances.push(chart);
  }

  private destroyChart(index: number): void {
    if (this.chartInstances[index]) {
      this.chartInstances[index].destroy();
    }
  }

  getInitials(name: string): string {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }
}