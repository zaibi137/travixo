import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Vendor } from '../../../models/vendor.model';
import { VendorsService } from '../../../shared/vendors.service';

@Component({
  selector: 'app-vendors',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vendors.html',
  styleUrls: ['./vendors.css']
})
export class Vendors implements OnInit {
  // ==================== DATA PROPERTIES ====================
  vendors: Vendor[] = [];
  filteredVendors: Vendor[] = [];
  selectedVendor: Vendor | null = null;
  
  // ==================== FILTER PROPERTIES ====================
  searchQuery: string = '';
  categoryFilter: string = 'All';
  statusFilter: string = 'All';
  
  // ==================== UI STATE ====================
  isGridView: boolean = false;
  showModal: boolean = false;
  isEditMode: boolean = false;
  currentPage: number = 1;
  pageSize: number = 5;
  
  // ==================== QUICK FILTER CHIPS ====================
  filterChips = [
    { label: 'Hotels', value: 'Hotel', icon: '🏨' },
    { label: 'Airlines', value: 'Airline', icon: '✈️' },
    { label: 'Transport', value: 'Transport', icon: '🚗' },
    { label: 'Tour Operators', value: 'Tour Operator', icon: '🗺️' },
    { label: 'Visa Agencies', value: 'Visa Agency', icon: '📄' }
  ];
  
  // ==================== ACTIVE VENDOR FOR MODAL ====================
  activeVendor: Omit<Vendor, 'id'> | Vendor = {
    vendorName: '',
    category: 'Hotel',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    paymentTerms: 'Net 30 Days',
    outstandingBalance: 0,
    status: 'Active'
  };

  // ==================== CONSTRUCTOR ====================
  constructor(private vendorsService: VendorsService) {}

  // ==================== LIFECYCLE HOOKS ====================
  ngOnInit(): void {
    this.loadVendors();
  }

  // ==================== DATA LOADING ====================
  loadVendors(): void {
    this.vendorsService.getVendors().subscribe((data: Vendor[]) => {
      this.vendors = data;
      this.applyFilters();
      
      // Select first vendor if available and no selection exists
      if (this.filteredVendors.length > 0 && !this.selectedVendor) {
        this.selectedVendor = { ...this.filteredVendors[0] };
      }
      
      // If selected vendor not in filtered list, select first
      if (this.selectedVendor) {
        const exists = this.filteredVendors.find(v => v.id === this.selectedVendor?.id);
        if (!exists && this.filteredVendors.length > 0) {
          this.selectedVendor = { ...this.filteredVendors[0] };
        }
      }
    });
  }

  // ==================== FILTERING ====================
  applyFilters(): void {
    this.filteredVendors = this.vendors.filter((v: Vendor) => {
      // Search filter
      const matchesSearch = !this.searchQuery || 
        v.vendorName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        v.contactPerson.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        v.email.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        v.phone.includes(this.searchQuery);
      
      // Category filter
      const matchesCategory = this.categoryFilter === 'All' || v.category === this.categoryFilter;
      
      // Status filter
      const matchesStatus = this.statusFilter === 'All' || v.status === this.statusFilter;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
    
    // Reset to first page when filters change
    this.currentPage = 1;
  }

  // ==================== FILTER HELPERS ====================
  getCategoryIcon(category: string): string {
    const icons: { [key: string]: string } = {
      'Hotel': '🏨',
      'Airline': '✈️',
      'Transport': '🚗',
      'Tour Operator': '🗺️',
      'Visa Agency': '📄'
    };
    return icons[category] || '🏢';
  }

  getCategoryClass(category: string): string {
    const classes: { [key: string]: string } = {
      'Hotel': 'hotel',
      'Airline': 'airline',
      'Transport': 'transport',
      'Tour Operator': 'tour',
      'Visa Agency': 'visa'
    };
    return classes[category] || '';
  }

  clearAllFilters(): void {
    this.searchQuery = '';
    this.categoryFilter = 'All';
    this.statusFilter = 'All';
    this.applyFilters();
  }

  // ==================== STATISTICS ====================
  getActiveCount(): number {
    return this.vendors.filter(v => v.status === 'Active').length;
  }

  getInactiveCount(): number {
    return this.vendors.filter(v => v.status === 'Inactive').length;
  }

  getTotalOutstanding(): number {
    return this.vendors.reduce((sum, v) => sum + v.outstandingBalance, 0);
  }

  getAverageBalance(): number {
    if (this.vendors.length === 0) return 0;
    return this.getTotalOutstanding() / this.vendors.length;
  }

  getMaxBalance(): number {
    if (this.vendors.length === 0) return 0;
    return Math.max(...this.vendors.map(v => v.outstandingBalance));
  }

  getPercentage(value: number, max: number): number {
    if (max === 0) return 0;
    return (value / max) * 100;
  }

  getBarColor(index: number): string {
    const colors = ['#2563eb', '#7c3aed', '#16a34a', '#d97706', '#dc2626'];
    return colors[index % colors.length];
  }

  // ==================== TOP VENDORS ====================
  getTopVendors(limit: number = 5): Vendor[] {
    return [...this.vendors]
      .sort((a, b) => b.outstandingBalance - a.outstandingBalance)
      .slice(0, limit);
  }

  // ==================== RECENT ACTIVITIES (Mock Data) ====================
  getRecentActivities(): any[] {
    // In a real app, this would come from a service
    return [
      { type: 'purchase', icon: 'fa-cart-plus', text: 'New purchase order created for Hilton Hotels', time: '2 hours ago' },
      { type: 'payment', icon: 'fa-credit-card', text: 'Payment recorded for Emirates Airlines', time: '4 hours ago' },
      { type: 'vendor', icon: 'fa-user-plus', text: 'New vendor added: Royal Tours', time: '1 day ago' },
      { type: 'update', icon: 'fa-pen', text: 'Vendor profile updated: Marriott Hotels', time: '2 days ago' }
    ];
  }

  // ==================== PAGINATION ====================
  get paginatedVendors(): Vendor[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredVendors.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredVendors.length / this.pageSize) || 1;
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

  // ==================== VENDOR SELECTION ====================
  selectVendor(vendor: Vendor): void {
    this.selectedVendor = { ...vendor };
  }

  // ==================== VIEW TOGGLE ====================
  toggleView(): void {
    this.isGridView = !this.isGridView;
  }

  // ==================== MODAL OPERATIONS ====================
openCreateModal(): void {
  console.log('✅ openCreateModal() called');
  this.isEditMode = false;
  this.activeVendor = {
    vendorName: '',
    category: 'Hotel',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    paymentTerms: 'Net 30 Days',
    outstandingBalance: 0,
    status: 'Active'
  };
  this.showModal = true;
  console.log('✅ Modal should now be visible:', this.showModal);
}

closeModal(): void {
  console.log('❌ closeModal() called');
  this.showModal = false;
}

  saveVendorData(): void {
    if (this.isEditMode) {
      this.vendorsService.updateVendor(this.activeVendor as Vendor).subscribe((updated: Vendor) => {
        this.selectedVendor = { ...updated };
        this.loadVendors();
        this.closeModal();
      });
    } else {
      this.vendorsService.addVendor(this.activeVendor).subscribe(() => {
        this.loadVendors();
        this.closeModal();
      });
    }
  }

  deleteVendor(): void {
    if (this.selectedVendor && confirm(`Are you sure you want to delete vendor "${this.selectedVendor.vendorName}"?`)) {
      this.vendorsService.deleteVendor(this.selectedVendor.id).subscribe(() => {
        this.selectedVendor = null;
        this.loadVendors();
      });
    }
  }

  // ==================== MATH UTILITY FOR TEMPLATE ====================
  // This is needed for Math.min() in the template
  Math = Math;
}