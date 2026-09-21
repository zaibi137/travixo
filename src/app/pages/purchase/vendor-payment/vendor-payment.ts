// src/app/pages/purchase/vendor-payment/vendor-payment.ts

import { Component, OnInit, ViewEncapsulation } from '@angular/core'; // <-- Added ViewEncapsulation
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VendorPaymentService } from '../../../shared/vendor-payment.service';
import { 
  VendorPayment as VendorPaymentModel, 
  PaymentItem 
} from '../../../models/vendor-payment.model';

interface Vendor {
  id: number;
  vendorName: string;
}

interface Purchase {
  id: number;
  purchaseNumber: string;
  vendorId: number;
  vendorName: string;
  netPayable: number;
  dueDate: Date;
  paymentStatus: string;
}

@Component({
  selector: 'app-vendor-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vendor-payment.html',
  styleUrls: ['./vendor-payment.css'],
  // <-- ADDED THIS LINE TO FIX THE CSS SCOPING ISSUE
  encapsulation: ViewEncapsulation.None 
})
export class VendorPaymentComponent implements OnInit {
  
  // ==================== DATA ====================
  payments: VendorPaymentModel[] = [];
  filteredPayments: VendorPaymentModel[] = [];
  selectedPayment: VendorPaymentModel | null = null;
  
  // ==================== FILTERS ====================
  searchQuery: string = '';
  vendorFilter: string = 'All';
  methodFilter: string = 'All';
  statusFilter: string = 'All';
  
  // ==================== FILTER CHIPS ====================
  filterChips = [
    { label: 'All', value: 'All', icon: '📄' },
    { label: 'Pending', value: 'Pending', icon: '⏳' },
    { label: 'Approved', value: 'Approved', icon: '✅' },
    { label: 'Completed', value: 'Completed', icon: '🎯' },
    { label: 'Rejected', value: 'Rejected', icon: '❌' }
  ];
  
  // ==================== PAGINATION ====================
  currentPage: number = 1;
  pageSize: number = 5;
  
  // ==================== MODAL ====================
  showModal: boolean = false;
  isEditMode: boolean = false;
  
  // ==================== MOCK DATA ====================
  vendors: Vendor[] = [
    { id: 1, vendorName: 'Hilton Hotels' },
    { id: 2, vendorName: 'Emirates Airlines' },
    { id: 3, vendorName: 'Local Tours Ltd' },
    { id: 4, vendorName: 'Visa Express' },
    { id: 5, vendorName: 'Marriott Hotels' }
  ];
  
  vendorPurchases: Purchase[] = [];
  
  // ==================== ACTIVE PAYMENT FOR MODAL ====================
  activePayment: any = {
    paymentNumber: '',
    paymentDate: new Date(),
    vendorId: null,
    vendorName: '',
    purchaseIds: [],
    purchaseNumbers: [],
    totalPayable: 0,
    discountReceived: 0,
    amountPaid: 0,
    paymentMethod: 'Bank Transfer',
    paymentStatus: 'Pending',
    referenceNumber: null,
    bankAccount: null,
    notes: '',
    createdBy: 1
  };
  
  selectedPurchaseIds: number[] = [];
  
  // ==================== MATH UTILITY ====================
  Math = Math;
  
  // ==================== CONSTRUCTOR ====================
  constructor(private paymentService: VendorPaymentService) {}
  
  // ==================== LIFECYCLE HOOKS ====================
  ngOnInit(): void {
    this.loadPayments();
  }
  
  // ==================== DATA LOADING ====================
  loadPayments(): void {
    this.paymentService.getPayments().subscribe((data: VendorPaymentModel[]) => {
      this.payments = data;
      this.applyFilters();
      
      if (this.filteredPayments.length > 0 && !this.selectedPayment) {
        this.selectedPayment = { ...this.filteredPayments[0] };
      }
      
      if (this.selectedPayment) {
        const exists = this.filteredPayments.find(p => p.id === this.selectedPayment?.id);
        if (!exists && this.filteredPayments.length > 0) {
          this.selectedPayment = { ...this.filteredPayments[0] };
        }
      }
    });
  }
  
  // ==================== FILTERING ====================
  applyFilters(): void {
    this.filteredPayments = this.payments.filter((p: VendorPaymentModel) => {
      const matchesSearch = !this.searchQuery ||
        p.paymentNumber.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        p.vendorName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        (p.referenceNumber && p.referenceNumber.toLowerCase().includes(this.searchQuery.toLowerCase()));
      
      const matchesVendor = this.vendorFilter === 'All' || p.vendorName === this.vendorFilter;
      const matchesMethod = this.methodFilter === 'All' || p.paymentMethod === this.methodFilter;
      const matchesStatus = this.statusFilter === 'All' || p.paymentStatus === this.statusFilter;
      
      return matchesSearch && matchesVendor && matchesMethod && matchesStatus;
    });
    
    this.currentPage = 1;
  }
  
  clearAllFilters(): void {
    this.searchQuery = '';
    this.vendorFilter = 'All';
    this.methodFilter = 'All';
    this.statusFilter = 'All';
    this.applyFilters();
  }
  
  // ==================== UNIQUE VENDORS ====================
  getUniqueVendors(): string[] {
    const vendors = this.payments.map(p => p.vendorName);
    return [...new Set(vendors)];
  }
  
  // ==================== STATISTICS ====================
  getCompletedCount(): number {
    return this.payments.filter(p => p.paymentStatus === 'Completed').length;
  }
  
  getPendingCount(): number {
    return this.payments.filter(p => p.paymentStatus === 'Pending' || p.paymentStatus === 'Approved').length;
  }
  
  getTotalPaid(): number {
    return this.payments.reduce((sum, p) => sum + p.amountPaid, 0);
  }
  
  getFilteredTotal(): number {
    return this.filteredPayments.reduce((sum, p) => sum + p.amountPaid, 0);
  }
  
  // ==================== METHOD HELPERS ====================
  getMethodIcon(method: string): string {
    const icons: { [key: string]: string } = {
      'Cash': '💵',
      'Bank Transfer': '🏦',
      'Cheque': '📝',
      'Online Payment': '💻'
    };
    return icons[method] || '💳';
  }
  
  getMethodClass(method: string): string {
    const classes: { [key: string]: string } = {
      'Cash': 'method-cash',
      'Bank Transfer': 'method-bank',
      'Cheque': 'method-cheque',
      'Online Payment': 'method-online'
    };
    return classes[method] || '';
  }
  
  getStatusClass(status: string): string {
    const classes: { [key: string]: string } = {
      'Pending': 'status-pending',
      'Approved': 'status-approved',
      'Completed': 'status-completed',
      'Rejected': 'status-rejected'
    };
    return classes[status] || '';
  }
  
  // ==================== PAGINATION ====================
  get paginatedPayments(): VendorPaymentModel[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredPayments.slice(startIndex, startIndex + this.pageSize);
  }
  
  get totalPages(): number {
    return Math.ceil(this.filteredPayments.length / this.pageSize) || 1;
  }
  
  getPageNumbers(): number[] {
    const total = this.totalPages;
    const current = this.currentPage;
    const pages: number[] = [];
    
    if (total <= 5) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      if (current <= 3) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
      } else if (current >= total - 2) {
        for (let i = total - 4; i <= total; i++) {
          pages.push(i);
        }
      } else {
        for (let i = current - 2; i <= current + 2; i++) {
          pages.push(i);
        }
      }
    }
    
    return pages;
  }
  
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }
  
  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
  
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
  
  // ==================== SELECTION ====================
  selectPayment(payment: VendorPaymentModel): void {
    this.selectedPayment = { ...payment };
  }
  
  // ==================== MODAL OPERATIONS ====================
  openCreateModal(): void {
    this.isEditMode = false;
    this.activePayment = {
      paymentNumber: this.generatePaymentNumber(),
      paymentDate: new Date(),
      vendorId: null,
      vendorName: '',
      purchaseIds: [],
      purchaseNumbers: [],
      totalPayable: 0,
      discountReceived: 0,
      amountPaid: 0,
      paymentMethod: 'Bank Transfer',
      paymentStatus: 'Pending',
      referenceNumber: null,
      bankAccount: null,
      notes: '',
      createdBy: 1
    };
    this.selectedPurchaseIds = [];
    this.vendorPurchases = [];
    this.showModal = true;
  }
  
  openEditModal(payment: VendorPaymentModel): void {
    this.isEditMode = true;
    this.activePayment = { ...payment };
    this.selectedPurchaseIds = [...payment.purchaseIds];
    this.showModal = true;
  }
  
  closeModal(): void {
    this.showModal = false;
  }
  
  // ==================== PAYMENT NUMBER GENERATION ====================
  generatePaymentNumber(): string {
    return this.paymentService.generatePaymentNumber();
  }
  
  // ==================== VENDOR CHANGE ====================
  onVendorChange(vendorId: number): void {
    const vendor = this.vendors.find(v => v.id === vendorId);
    if (vendor) {
      this.activePayment.vendorName = vendor.vendorName;
      this.loadVendorPurchases(vendorId);
    }
  }
  
  loadVendorPurchases(vendorId: number): void {
    // Mock data - in real app, fetch from API
    const mockPurchases: Purchase[] = [
      { id: 1, purchaseNumber: 'PO-2026-001', vendorId: 1, vendorName: 'Hilton Hotels', netPayable: 425, dueDate: new Date('2026-02-14'), paymentStatus: 'Pending' },
      { id: 2, purchaseNumber: 'PO-2026-005', vendorId: 1, vendorName: 'Hilton Hotels', netPayable: 650, dueDate: new Date('2026-03-01'), paymentStatus: 'Pending' },
      { id: 3, purchaseNumber: 'PO-2026-008', vendorId: 1, vendorName: 'Hilton Hotels', netPayable: 300, dueDate: new Date('2026-03-15'), paymentStatus: 'Pending' }
    ];
    
    this.vendorPurchases = mockPurchases.filter(p => p.vendorId === vendorId && p.paymentStatus !== 'Paid');
    this.selectedPurchaseIds = [];
    this.calculatePayment();
  }
  
  // ==================== PURCHASE SELECTION ====================
  isPurchaseSelected(purchaseId: number): boolean {
    return this.selectedPurchaseIds.includes(purchaseId);
  }
  
  togglePurchaseSelection(purchase: Purchase): void {
    const index = this.selectedPurchaseIds.indexOf(purchase.id);
    if (index > -1) {
      this.selectedPurchaseIds.splice(index, 1);
    } else {
      this.selectedPurchaseIds.push(purchase.id);
    }
    this.calculatePayment();
  }
  
  // ==================== CALCULATIONS ====================
  calculatePayment(): void {
    const selectedPurchases = this.vendorPurchases.filter(p => this.selectedPurchaseIds.includes(p.id));
    this.activePayment.purchaseIds = selectedPurchases.map(p => p.id);
    this.activePayment.purchaseNumbers = selectedPurchases.map(p => p.purchaseNumber);
    this.activePayment.totalPayable = selectedPurchases.reduce((sum, p) => sum + p.netPayable, 0);
    this.activePayment.amountPaid = this.activePayment.totalPayable - this.activePayment.discountReceived;
  }
  
  // ==================== SAVE PAYMENT ====================
  savePayment(): void {
    if (!this.activePayment.vendorId) {
      alert('Please select a vendor');
      return;
    }
    
    if (this.selectedPurchaseIds.length === 0) {
      alert('Please select at least one purchase to pay');
      return;
    }
    
    this.calculatePayment();
    
    if (this.isEditMode) {
      this.paymentService.updatePayment(this.activePayment.id, this.activePayment).subscribe(() => {
        this.loadPayments();
        this.closeModal();
      });
    } else {
      this.paymentService.createPayment(this.activePayment).subscribe(() => {
        this.loadPayments();
        this.closeModal();
      });
    }
  }
  
  // ==================== DELETE PAYMENT ====================
  deletePayment(): void {
    if (this.selectedPayment && confirm(`Are you sure you want to delete payment ${this.selectedPayment.paymentNumber}?`)) {
      this.paymentService.deletePayment(this.selectedPayment.id).subscribe(() => {
        this.selectedPayment = null;
        this.loadPayments();
      });
    }
  }
  
  // ==================== EXPORT / PRINT ====================
  exportData(): void {
    alert('Export functionality coming soon!');
  }
  
  printData(): void {
    window.print();
  }
  
  printPayment(payment: VendorPaymentModel): void {
    alert(`Printing payment voucher ${payment.paymentNumber}`);
  }
}