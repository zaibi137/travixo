import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './audit-logs.html',
  styleUrls: ['./audit-logs.css']
})
export class AuditLogs implements OnInit {
  // Filters
  searchUser: string = '';
  actionFilter: string = 'All';
  fromDate: string = '';
  toDate: string = '';

  // Pagination
  currentPage: number = 1;
  pageSize: number = 10;

  // 🆕 NEW: View Mode & Loading State
  viewMode: 'list' | 'timeline' = 'list';
  isRefreshing: boolean = false;

  // Mock Data
  private allLogs = [
    { id: 1, timestamp: '2026-08-01 09:15:22', user: 'Muhammad Tanveer', action: 'Login', description: 'User logged in successfully from Chrome on Windows', ip: '192.168.1.10' },
    { id: 2, timestamp: '2026-08-01 09:22:10', user: 'Sarah Khan', action: 'Login', description: 'User logged in successfully from Edge on Windows', ip: '192.168.1.25' },
    { id: 3, timestamp: '2026-08-01 09:35:15', user: 'Muhammad Tanveer', action: 'Create', description: 'Created new Customer: Ali Ahmed', ip: '192.168.1.10' },
    { id: 4, timestamp: '2026-08-01 10:05:00', user: 'Sarah Khan', action: 'Update', description: 'Updated Invoice #INV-2026-089 (Amount changed to 50,000)', ip: '192.168.1.25' },
    { id: 5, timestamp: '2026-08-01 10:30:45', user: 'Fatima Zafar', action: 'Login', description: 'User logged in successfully from Firefox on Windows', ip: '192.168.1.30' },
    { id: 6, timestamp: '2026-08-01 11:15:20', user: 'Muhammad Tanveer', action: 'Delete', description: 'Deleted Cheque #CHQ-10022 (Bounced cheque)', ip: '192.168.1.10' },
    { id: 7, timestamp: '2026-08-01 12:00:00', user: 'Sarah Khan', action: 'Export', description: 'Exported Customer Ledger to Excel', ip: '192.168.1.25' },
    { id: 8, timestamp: '2026-08-01 14:20:10', user: 'Fatima Zafar', action: 'Create', description: 'Created new Vendor: Emirates Airlines', ip: '192.168.1.30' },
    { id: 9, timestamp: '2026-08-01 15:45:30', user: 'Muhammad Tanveer', action: 'Login', description: 'User logged in successfully from Safari on MacOS', ip: '192.168.1.15' },
    { id: 10, timestamp: '2026-08-01 16:00:00', user: 'Sarah Khan', action: 'Update', description: 'Updated User Role for Ali Raza (Staff -> Inactive)', ip: '192.168.1.25' },
    { id: 11, timestamp: '2026-08-01 16:30:00', user: 'Ali Raza', action: 'Login', description: 'User logged in successfully from Chrome on Windows', ip: '192.168.1.20' },
    { id: 12, timestamp: '2026-08-02 08:00:00', user: 'Sarah Khan', action: 'Login', description: 'User logged in successfully from Chrome on Windows', ip: '192.168.1.25' },
    { id: 13, timestamp: '2026-08-02 08:15:00', user: 'Muhammad Tanveer', action: 'Create', description: 'Created new Customer: Sarah Khan (New client)', ip: '192.168.1.10' },
    { id: 14, timestamp: '2026-08-02 09:00:00', user: 'Fatima Zafar', action: 'Delete', description: 'Deleted Vendor Purchase #PUR-2026-010', ip: '192.168.1.30' },
    { id: 15, timestamp: '2026-08-02 10:30:00', user: 'Ali Raza', action: 'Update', description: 'Updated Invoice #INV-2026-101', ip: '192.168.1.20' },
    { id: 16, timestamp: '2026-08-02 11:45:00', user: 'Muhammad Tanveer', action: 'Export', description: 'Exported Profit Report to Excel', ip: '192.168.1.10' },
    { id: 17, timestamp: '2026-08-02 13:00:00', user: 'Sarah Khan', action: 'Login', description: 'User logged in successfully from Chrome on Windows', ip: '192.168.1.25' },
    { id: 18, timestamp: '2026-08-02 15:30:00', user: 'Fatima Zafar', action: 'Create', description: 'Created new User: Ahmed Usman (Staff)', ip: '192.168.1.30' },
    { id: 19, timestamp: '2026-08-02 17:00:00', user: 'Ali Raza', action: 'Delete', description: 'Deleted Customer: Imran Ali', ip: '192.168.1.20' },
    { id: 20, timestamp: '2026-08-03 09:00:00', user: 'Muhammad Tanveer', action: 'Login', description: 'User logged in successfully from Chrome on Windows', ip: '192.168.1.10' },
  ];

  public filteredLogs: any[] = [];

  ngOnInit(): void {
    this.loadSavedFilters();
    this.applyFilters();
  }

  // ---- FILTER LOGIC ----
  get totalPages(): number {
    return Math.ceil(this.filteredLogs.length / this.pageSize) || 1;
  }

  get paginatedLogs(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredLogs.slice(startIndex, startIndex + this.pageSize);
  }

  applyFilters(): void {
    this.filteredLogs = this.allLogs.filter(log => {
      const matchUser = !this.searchUser || 
        log.user.toLowerCase().includes(this.searchUser.toLowerCase());

      const matchAction = this.actionFilter === 'All' || log.action === this.actionFilter;

      const matchFromDate = !this.fromDate || new Date(log.timestamp) >= new Date(this.fromDate + 'T00:00:00');
      const matchToDate = !this.toDate || new Date(log.timestamp) <= new Date(this.toDate + 'T23:59:59');

      return matchUser && matchAction && matchFromDate && matchToDate;
    });
    this.currentPage = 1;
  }

  loadLogs(): void {
    this.isRefreshing = true;
    // Simulate API delay
    setTimeout(() => {
      this.applyFilters();
      this.isRefreshing = false;
    }, 800);
  }

  // ---- PERSISTENCE ----
  saveFilters(): void {
    localStorage.setItem('audit_searchUser', this.searchUser);
    localStorage.setItem('audit_actionFilter', this.actionFilter);
    localStorage.setItem('audit_fromDate', this.fromDate);
    localStorage.setItem('audit_toDate', this.toDate);
    this.applyFilters();
  }

  loadSavedFilters(): void {
    this.searchUser = localStorage.getItem('audit_searchUser') || '';
    this.actionFilter = localStorage.getItem('audit_actionFilter') || 'All';
    this.fromDate = localStorage.getItem('audit_fromDate') || '';
    this.toDate = localStorage.getItem('audit_toDate') || '';
  }

  resetFilters(): void {
    this.searchUser = '';
    this.actionFilter = 'All';
    this.fromDate = '';
    this.toDate = '';
    localStorage.removeItem('audit_searchUser');
    localStorage.removeItem('audit_actionFilter');
    localStorage.removeItem('audit_fromDate');
    localStorage.removeItem('audit_toDate');
    this.applyFilters();
  }

  // ---- UTILITIES ----
  getInitials(name: string): string {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }

  exportLogs(): void {
    alert(`Exporting ${this.filteredLogs.length} audit records to CSV...`);
  }

  // ---- PAGINATION ----
  getPageNumbers(): number[] {
    const total = this.totalPages;
    const current = this.currentPage;
    const pages: number[] = [];
    
    if (total <= 5) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      if (current <= 3) {
        for (let i = 1; i <= 5; i++) pages.push(i);
      } else if (current >= total - 2) {
        for (let i = total - 4; i <= total; i++) pages.push(i);
      } else {
        for (let i = current - 2; i <= current + 2; i++) pages.push(i);
      }
    }
    return pages;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  prevPage(): void {
    if (this.currentPage > 1) this.currentPage--;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) this.currentPage = page;
  }
}