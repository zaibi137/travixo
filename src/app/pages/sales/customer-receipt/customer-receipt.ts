// src/app/pages/sales/customer-receipt/customer-receipt.ts

import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReceiptService } from '../../../shared/receipt.service';
import { Receipt, CreateReceiptPayload } from '../../../models/receipt.model';

@Component({
  selector: 'app-customer-receipt',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-receipt.html',
  styleUrls: ['./customer-receipt.css']
})
export class CustomerReceiptComponent implements OnInit {
  
  // INJECT SERVICE
  private receiptService = inject(ReceiptService);
  Math = Math;

  // ==================== STATE ====================
  searchQuery = signal<string>('');
  paymentModeFilter: string = 'All';
  statusFilter: string = 'All';
  showModal = signal<boolean>(false);
  isEditing: boolean = false;
  isGridView: boolean = false;
  detailTab: string = 'details';

  // ==================== PAGINATION ====================
  currentPage: number = 1;
  pageSize: number = 5;

  // ==================== DATA SIGNALS ====================
  receipts = signal<Receipt[]>([]);
  selectedReceipt = signal<Receipt | null>(null);
  isLoading = signal<boolean>(false);

  // ==================== FORM DATA ====================
  formData: Receipt = this.getEmptyForm();

  // ==================== COMPUTED FILTERS ====================
  filteredReceipts = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    return this.receipts().filter(r => {
      const matchesSearch = !query ||
        r.receiptcode.toLowerCase().includes(query) ||
        (r.customername?.toLowerCase() || '').includes(query) ||
        (r.documentno || '').toLowerCase().includes(query);

      const matchesMode = this.paymentModeFilter === 'All' || r.paymentmode === this.paymentModeFilter;
      const matchesStatus = this.statusFilter === 'All' || (r.status || 'Pending') === this.statusFilter;

      return matchesSearch && matchesMode && matchesStatus;
    });
  });

  // ==================== LIFECYCLE ====================
  ngOnInit(): void {
    this.loadReceipts();
  }

  // ==========================================================
  // INTEGRATED API CALLS
  // ==========================================================

  // 1. LOAD ALL RECEIPTS
  loadReceipts(): void {
    this.isLoading.set(true);
    this.receiptService.getReceipts(this.searchQuery()).subscribe({
      next: (data) => {
        this.receipts.set(data);
        if (data.length > 0) {
          this.selectedReceipt.set(data[0]);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading receipts:', err);
        alert('Failed to load receipts.');
        this.isLoading.set(false);
      }
    });
  }

  // 2. CREATE RECEIPT
  saveReceipt(): void {
    if (!this.formData.customerid || !this.formData.amount) {
      alert('Please fill in required fields (Customer ID and Amount).');
      return;
    }

    // Prepare payload exactly as API expects
    const payload: CreateReceiptPayload = {
      receiptcode: this.formData.receiptcode,
      invoiceid: this.formData.invoiceid || 0,
      customerid: this.formData.customerid,
      documentno: this.formData.documentno,
      receiptdate: this.formData.receiptdate,
      paymentmode: this.formData.paymentmode,
      branchid: this.formData.branchid,
      amount: this.formData.amount,
      description: this.formData.description,
      remarks: this.formData.remarks,
      createdby: this.formData.createdby || 'admin'
    };

    this.isLoading.set(true);

    if (this.isEditing && this.formData.id) {
      // UPDATE
      this.receiptService.updateReceipt(this.formData.id, payload).subscribe({
        next: (updated) => {
          this.receipts.update(list => list.map(r => r.id === updated.id ? updated : r));
          this.selectedReceipt.set(updated);
          this.closeModal();
          this.isLoading.set(false);
          alert('Receipt updated successfully!');
        },
        error: (err) => {
          console.error('Error updating receipt:', err);
          alert('Failed to update receipt.');
          this.isLoading.set(false);
        }
      });
    } else {
      // CREATE
      this.receiptService.createReceipt(payload).subscribe({
        next: (created) => {
          this.receipts.update(list => [created, ...list]);
          this.selectedReceipt.set(created);
          this.closeModal();
          this.isLoading.set(false);
          alert('Receipt created successfully!');
        },
        error: (err) => {
          console.error('Error creating receipt:', err);
          alert('Failed to create receipt.');
          this.isLoading.set(false);
        }
      });
    }
  }

  // 3. DELETE RECEIPT
  deleteReceipt(rec: Receipt): void {
    if (!confirm(`Are you sure you want to delete receipt ${rec.receiptcode}?`)) {
      return;
    }

    this.isLoading.set(true);
    this.receiptService.deleteReceipt(rec.id).subscribe({
      next: () => {
        this.receipts.update(list => list.filter(r => r.id !== rec.id));
        const remaining = this.receipts();
        this.selectedReceipt.set(remaining.length > 0 ? remaining[0] : null);
        this.isLoading.set(false);
        alert('Receipt deleted successfully!');
      },
      error: (err) => {
        console.error('Error deleting receipt:', err);
        alert('Failed to delete receipt.');
        this.isLoading.set(false);
      }
    });
  }

  // ==========================================================
  // UTILITY FUNCTIONS
  // ==========================================================

  get paginatedReceipts() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredReceipts().slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredReceipts().length / this.pageSize) || 1;
  }

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

  nextPage(): void { if (this.currentPage < this.totalPages) this.currentPage++; }
  prevPage(): void { if (this.currentPage > 1) this.currentPage--; }
  goToPage(page: number): void { if (page >= 1 && page <= this.totalPages) this.currentPage = page; }
  toggleView(): void { this.isGridView = !this.isGridView; }
  applyFilters(): void { this.currentPage = 1; }
  clearAllFilters(): void {
    this.searchQuery.set('');
    this.paymentModeFilter = 'All';
    this.statusFilter = 'All';
    this.currentPage = 1;
  }

  getInitials(name: string): string {
    if (!name) return 'CU';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  // ==========================================================
  // MODAL & FORM UTILITIES
  // ==========================================================

  getEmptyForm(): Receipt {
    const date = new Date();
    const year = date.getFullYear();
    const count = this.receipts().length + 1;
    return {
      id: 0,
      receiptcode: `REC-${year}-${String(count).padStart(4, '0')}`,
      invoiceid: 0,
      customerid: 0,
      customername: '',
      documentno: '',
      receiptdate: date.toISOString().split('T')[0],
      paymentmode: 'Bank Transfer',
      branchid: 0,
      amount: 0,
      description: '',
      remarks: '',
      createdby: 'admin',
      status: 'Pending'
    };
  }

  openAddModal(): void {
    this.isEditing = false;
    this.formData = this.getEmptyForm();
    this.showModal.set(true);
  }

  openEditModal(rec: Receipt): void {
    this.isEditing = true;
    this.formData = { ...rec };
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  selectReceipt(rec: Receipt): void {
    this.selectedReceipt.set(rec);
    this.detailTab = 'details';
  }

  printReceipt(rec: Receipt): void {
    // Optional: call this.receiptService.printReceipt(rec.id) if backend supports it
    window.print();
  }

  exportLedger(): void {
    alert('Exporting receipts ledger to Excel/CSV...');
  }
  
  // Quick Stats
  getClearedCount(): number { return this.receipts().filter(r => r.status === 'Cleared').length; }
  getPendingCount(): number { return this.receipts().filter(r => r.status === 'Pending').length; }
  getTotalAmount(): number { return this.receipts().reduce((sum, r) => sum + r.amount, 0); }
  
  getModeIcon(mode: string): string {
    const map: {[key: string]: string} = {'Cash':'💵','Bank Transfer':'🏦','Credit Card':'💳','Online Gateway':'💻','Cheque':'📝'};
    return map[mode] || '💳';
  }
  getModeClass(mode: string): string {
    const map: {[key: string]: string} = {'Cash':'mode-cash','Bank Transfer':'mode-bank','Credit Card':'mode-card','Online Gateway':'mode-online','Cheque':'mode-cheque'};
    return map[mode] || '';
  }
}