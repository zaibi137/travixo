// src/app/pages/purchase/vendor-purchase/vendor-purchase.ts

// src/app/pages/purchase/vendor-purchase/vendor-purchase.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VendorPurchaseService } from '../../../shared/vendor-purchase.service';  // ← Fixed path
import { 
  VendorPurchase, 
  PurchaseItem 
} from '../../../models/vendor-purchase.model';

// ... rest of the component code

interface Vendor {
  id: number;
  vendorName: string;
  commissionRate: number;
  paymentTerms: string;
}

interface Client {
  id: number;
  customerName: string;
  email: string;
  phone: string;
}

@Component({
  selector: 'app-vendor-purchase',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vendor-purchase.html',
  styleUrls: ['./vendor-purchase.css']
})
export class VendorPurchaseComponent implements OnInit {
  
  // ==================== DATA ====================
  purchases: VendorPurchase[] = [];
  filteredPurchases: VendorPurchase[] = [];
  selectedPurchase: VendorPurchase | null = null;
  
  // ==================== FILTERS ====================
  searchQuery: string = '';
  vendorFilter: string = 'All';
  paymentStatusFilter: string = 'All';
  
  // ==================== FILTER CHIPS ====================
  filterChips = [
    { label: 'All', value: 'All', icon: '📄' },
    { label: 'Pending', value: 'Pending', icon: '⏳' },
    { label: 'Paid', value: 'Paid', icon: '✅' },
    { label: 'Overdue', value: 'Overdue', icon: '⚠️' }
  ];
  
  // ==================== PAGINATION ====================
  currentPage: number = 1;
  pageSize: number = 5;
  
  // ==================== MODAL ====================
  showModal: boolean = false;
  isEditMode: boolean = false;
  
  // ==================== MOCK DATA ====================
  vendors: Vendor[] = [
    { id: 1, vendorName: 'Hilton Hotels', commissionRate: 15, paymentTerms: 'Net 30 Days' },
    { id: 2, vendorName: 'Emirates Airlines', commissionRate: 8, paymentTerms: 'Net 15 Days' },
    { id: 3, vendorName: 'Local Tours Ltd', commissionRate: 20, paymentTerms: 'Net 30 Days' },
    { id: 4, vendorName: 'Visa Express', commissionRate: 10, paymentTerms: 'Net 15 Days' },
    { id: 5, vendorName: 'Marriott Hotels', commissionRate: 12, paymentTerms: 'Net 30 Days' }
  ];
  
  clients: Client[] = [
    { id: 1, customerName: 'Mr. Ahmed Khan', email: 'ahmed@email.com', phone: '+92 300 1234567' },
    { id: 2, customerName: 'Ms. Sarah Ali', email: 'sarah@email.com', phone: '+92 300 7654321' },
    { id: 3, customerName: 'Family of 4', email: 'family@email.com', phone: '+92 300 9876543' },
    { id: 4, customerName: 'Mr. David Brown', email: 'david@email.com', phone: '+92 300 4567890' }
  ];
  
  // ==================== ACTIVE PURCHASE FOR MODAL ====================
  activePurchase: any = {
    purchaseNumber: '',
    purchaseDate: new Date(),
    vendorId: null,
    vendorName: '',
    clientId: null,
    clientName: '',
    items: [] as PurchaseItem[],
    subTotal: 0,
    taxRate: 0,
    taxAmount: 0,
    discountAmount: 0,
    totalAmount: 0,
    commissionRate: 0,
    commissionAmount: 0,
    netPayable: 0,
    paymentTerms: 'Net 30 Days',
    dueDate: new Date(),
    amountPaid: 0,
    paymentStatus: 'Pending',
    status: 'Draft',
    notes: '',
    createdBy: 1
  };
  
  // ==================== MATH UTILITY ====================
  Math = Math;
  
  // ==================== CONSTRUCTOR ====================
  constructor(private purchaseService: VendorPurchaseService) {}
  
  // ==================== LIFECYCLE HOOKS ====================
  ngOnInit(): void {
    this.loadPurchases();
  }
  
  // ==================== DATA LOADING ====================
  loadPurchases(): void {
    this.purchaseService.getPurchases().subscribe((data: VendorPurchase[]) => {
      this.purchases = data;
      this.applyFilters();
      
      if (this.filteredPurchases.length > 0 && !this.selectedPurchase) {
        this.selectedPurchase = { ...this.filteredPurchases[0] };
      }
      
      if (this.selectedPurchase) {
        const exists = this.filteredPurchases.find(p => p.id === this.selectedPurchase?.id);
        if (!exists && this.filteredPurchases.length > 0) {
          this.selectedPurchase = { ...this.filteredPurchases[0] };
        }
      }
    });
  }
  
  // ==================== FILTERING ====================
  applyFilters(): void {
    this.filteredPurchases = this.purchases.filter((p: VendorPurchase) => {
      const matchesSearch = !this.searchQuery ||
        p.purchaseNumber.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        p.vendorName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        (p.clientName && p.clientName.toLowerCase().includes(this.searchQuery.toLowerCase()));
      
      const matchesVendor = this.vendorFilter === 'All' || p.vendorName === this.vendorFilter;
      const matchesStatus = this.paymentStatusFilter === 'All' || p.paymentStatus === this.paymentStatusFilter;
      
      return matchesSearch && matchesVendor && matchesStatus;
    });
    
    this.currentPage = 1;
  }
  
  clearAllFilters(): void {
    this.searchQuery = '';
    this.vendorFilter = 'All';
    this.paymentStatusFilter = 'All';
    this.applyFilters();
  }
  
  // ==================== UNIQUE VENDORS ====================
  getUniqueVendors(): string[] {
    const vendors = this.purchases.map(p => p.vendorName);
    return [...new Set(vendors)];
  }
  
  // ==================== STATISTICS ====================
  getPendingCount(): number {
    return this.purchases.filter(p => p.paymentStatus === 'Pending' || p.paymentStatus === 'Partial Paid').length;
  }
  
  getPaidCount(): number {
    return this.purchases.filter(p => p.paymentStatus === 'Paid').length;
  }
  
  getOverdueCount(): number {
    return this.purchases.filter(p => p.paymentStatus === 'Overdue').length;
  }
  
  getTotalPayable(): number {
    return this.filteredPurchases.reduce((sum, p) => sum + p.netPayable, 0);
  }
  
  isOverdue(purchase: VendorPurchase): boolean {
    const today = new Date();
    const dueDate = new Date(purchase.dueDate);
    return purchase.paymentStatus !== 'Paid' && dueDate < today;
  }
  
  // ==================== STATUS CLASSES ====================
  getPaymentStatusClass(status: string): string {
    const classes: { [key: string]: string } = {
      'Pending': 'status-pending',
      'Partial Paid': 'status-partial',
      'Paid': 'status-paid',
      'Overdue': 'status-overdue'
    };
    return classes[status] || '';
  }
  
  getPurchaseStatusClass(status: string): string {
    const classes: { [key: string]: string } = {
      'Draft': 'status-draft',
      'Submitted': 'status-submitted',
      'Approved': 'status-approved',
      'Cancelled': 'status-cancelled'
    };
    return classes[status] || '';
  }
  
  // ==================== PAYMENT PROGRESS ====================
  getPaymentProgress(purchase: VendorPurchase): number {
    if (purchase.netPayable === 0) return 0;
    return Math.round((purchase.amountPaid / purchase.netPayable) * 100);
  }
  
  // ==================== PAGINATION ====================
  get paginatedPurchases(): VendorPurchase[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredPurchases.slice(startIndex, startIndex + this.pageSize);
  }
  
  get totalPages(): number {
    return Math.ceil(this.filteredPurchases.length / this.pageSize) || 1;
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
  selectPurchase(purchase: VendorPurchase): void {
    this.selectedPurchase = { ...purchase };
  }
  
  // ==================== MODAL OPERATIONS ====================
  openCreateModal(): void {
    this.isEditMode = false;
    this.activePurchase = {
      purchaseNumber: this.generatePurchaseNumber(),
      purchaseDate: new Date(),
      vendorId: null,
      vendorName: '',
      clientId: null,
      clientName: '',
      items: [],
      subTotal: 0,
      taxRate: 0,
      taxAmount: 0,
      discountAmount: 0,
      totalAmount: 0,
      commissionRate: 0,
      commissionAmount: 0,
      netPayable: 0,
      paymentTerms: 'Net 30 Days',
      dueDate: new Date(),
      amountPaid: 0,
      paymentStatus: 'Pending',
      status: 'Draft',
      notes: '',
      createdBy: 1
    };
    this.showModal = true;
  }
  
  openEditModal(purchase: VendorPurchase): void {
    this.isEditMode = true;
    this.activePurchase = { ...purchase };
    this.showModal = true;
  }
  
  closeModal(): void {
    this.showModal = false;
  }
  
  // ==================== PURCHASE NUMBER GENERATION ====================
  generatePurchaseNumber(): string {
    return this.purchaseService.generatePurchaseNumber();
  }
  
  // ==================== VENDOR CHANGE ====================
  onVendorChange(vendorId: number): void {
    const vendor = this.vendors.find(v => v.id === vendorId);
    if (vendor) {
      this.activePurchase.vendorName = vendor.vendorName;
      this.activePurchase.commissionRate = vendor.commissionRate;
      this.activePurchase.paymentTerms = vendor.paymentTerms;
      this.calculateTotals();
    }
  }
  
  // ==================== ITEMS MANAGEMENT ====================
  addItem(): void {
    this.activePurchase.items.push({
      description: '',
      serviceType: 'Hotel',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
      clientId: null,
      clientName: null,
      dateOfService: null,
      notes: null
    });
  }
  
  removeItem(index: number): void {
    this.activePurchase.items.splice(index, 1);
    this.calculateTotals();
  }
  
  calculateItemTotal(item: PurchaseItem): void {
    item.totalPrice = item.quantity * item.unitPrice;
    this.calculateTotals();
  }
  
  // ==================== CALCULATIONS ====================
  calculateTotals(): void {
    this.activePurchase.subTotal = this.activePurchase.items.reduce(
      (sum: number, item: PurchaseItem) => sum + item.totalPrice, 0
    );
    
    this.activePurchase.taxRate = this.activePurchase.taxRate || 0;
    this.activePurchase.taxAmount = (this.activePurchase.subTotal * this.activePurchase.taxRate) / 100;
    this.activePurchase.totalAmount = this.activePurchase.subTotal + 
                                      this.activePurchase.taxAmount - 
                                      this.activePurchase.discountAmount;
    this.activePurchase.commissionAmount = (this.activePurchase.totalAmount * this.activePurchase.commissionRate) / 100;
    this.activePurchase.netPayable = this.activePurchase.totalAmount - this.activePurchase.commissionAmount;
  }
  
  // ==================== SAVE PURCHASE ====================
  savePurchase(): void {
    if (!this.activePurchase.vendorId) {
      alert('Please select a vendor');
      return;
    }
    
    if (this.activePurchase.items.length === 0) {
      alert('Please add at least one purchase item');
      return;
    }
    
    this.calculateTotals();
    
    // Update payment status based on amount paid
    if (this.activePurchase.amountPaid > 0) {
      if (this.activePurchase.amountPaid >= this.activePurchase.netPayable) {
        this.activePurchase.paymentStatus = 'Paid';
      } else if (this.activePurchase.amountPaid > 0) {
        this.activePurchase.paymentStatus = 'Partial Paid';
      }
    }
    
    if (this.isEditMode) {
      this.purchaseService.updatePurchase(this.activePurchase.id, this.activePurchase).subscribe(() => {
        this.loadPurchases();
        this.closeModal();
      });
    } else {
      this.purchaseService.createPurchase(this.activePurchase).subscribe(() => {
        this.loadPurchases();
        this.closeModal();
      });
    }
  }
  
  // ==================== DELETE PURCHASE ====================
  deletePurchase(): void {
    if (this.selectedPurchase && confirm(`Are you sure you want to delete purchase ${this.selectedPurchase.purchaseNumber}?`)) {
      this.purchaseService.deletePurchase(this.selectedPurchase.id).subscribe(() => {
        this.selectedPurchase = null;
        this.loadPurchases();
      });
    }
  }
  
  // ==================== RECORD PAYMENT ====================
  recordPayment(purchase: VendorPurchase): void {
    const amount = prompt(`Enter payment amount for ${purchase.purchaseNumber}:`, '0');
    if (amount !== null) {
      const paymentAmount = parseFloat(amount);
      if (!isNaN(paymentAmount) && paymentAmount > 0) {
        const newPaidAmount = purchase.amountPaid + paymentAmount;
        let status = 'Partial Paid';
        if (newPaidAmount >= purchase.netPayable) {
          status = 'Paid';
        }
        
        this.purchaseService.updatePaymentStatus(purchase.id, status, newPaidAmount).subscribe(() => {
          this.loadPurchases();
          alert(`Payment of ₨ ${paymentAmount} recorded successfully!`);
        });
      }
    }
  }
  
  // ==================== EXPORT / PRINT ====================
  exportData(): void {
    alert('Export functionality coming soon!');
  }
  
  printData(): void {
    window.print();
  }
  
  printPurchase(purchase: VendorPurchase): void {
    alert(`Printing purchase ${purchase.purchaseNumber}`);
  }
}