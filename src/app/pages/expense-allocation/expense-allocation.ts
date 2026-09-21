// src/app/pages/expense-allocation/expense-allocation.ts

import { Component, OnInit, ViewEncapsulation } from '@angular/core'; // <-- Added ViewEncapsulation
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpenseAllocationService } from '../../shared/expense-allocation.service';
import { 
  ExpenseAllocation as ExpenseAllocationModel,
  DirectExpenseCategories,
  IndirectExpenseCategories
} from '../../models/expense-allocation.model';

interface AllocationOption {
  id: number;
  name: string;
}

@Component({
  selector: 'app-expense-allocation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './expense-allocation.html',
  styleUrls: ['./expense-allocation.css'],
  // <-- ADDED THIS LINE TO FIX THE CSS SCOPING ISSUE
  encapsulation: ViewEncapsulation.None 
})
export class ExpenseAllocationComponent implements OnInit {
  
  // ==================== DATA ====================
  allocations: ExpenseAllocationModel[] = [];
  filteredAllocations: ExpenseAllocationModel[] = [];
  selectedAllocation: ExpenseAllocationModel | null = null;
  
  // ==================== FILTERS ====================
  searchQuery: string = '';
  expenseTypeFilter: string = 'All';
  statusFilter: string = 'All';
  departmentFilter: string = 'All';
  allocationTypeFilter: string = 'All';
  
  // ==================== FILTER CHIPS ====================
  filterChips = [
    { label: 'All', value: 'All', icon: '📄' },
    { label: 'Pending', value: 'Pending', icon: '⏳' },
    { label: 'Approved', value: 'Approved', icon: '✅' },
    { label: 'Rejected', value: 'Rejected', icon: '❌' }
  ];
  
  // ==================== PAGINATION ====================
  currentPage: number = 1;
  pageSize: number = 5;
  
  // ==================== MODAL ====================
  showModal: boolean = false;
  isEditMode: boolean = false;
  
  // ==================== MOCK DATA ====================
  clients: AllocationOption[] = [
    { id: 1, name: 'Mr. Ahmed Khan' },
    { id: 2, name: 'Ms. Sarah Ali' },
    { id: 3, name: 'Family of 4' },
    { id: 4, name: 'Mr. David Brown' }
  ];
  
  departments: string[] = [
    'Sales',
    'Operations',
    'Marketing',
    'Administration',
    'Finance',
    'Information Technology',
    'Human Resources'
  ];
  
  // ==================== ACTIVE ALLOCATION FOR MODAL ====================
  activeAllocation: any = {
    allocationNumber: '',
    expenseDate: new Date(),
    expenseType: 'Direct',
    expenseCategory: 'Flight Tickets',
    description: '',
    amount: 0,
    allocationType: 'Client',
    allocatedToId: null,
    allocatedToName: '',
    department: 'Sales',
    status: 'Pending',
    paymentMethod: 'Bank Transfer',
    referenceNumber: null,
    notes: '',
    purchaseId: null,
    invoiceId: null,
    clientId: null,
    vendorId: null,
    createdBy: 1
  };
  
  // ==================== MATH UTILITY ====================
  Math = Math;
  
  // ==================== CONSTRUCTOR ====================
  constructor(private allocationService: ExpenseAllocationService) {
    console.log('✅ ExpenseAllocationComponent loaded successfully!');
  }
  
  // ==================== LIFECYCLE HOOKS ====================
  ngOnInit(): void {
    this.loadAllocations();
  }
  
  // ==================== DATA LOADING ====================
  loadAllocations(): void {
    console.log('Loading allocations...');
    this.allocationService.getAllocations().subscribe({
      next: (data: ExpenseAllocationModel[]) => {
        console.log('Allocations loaded:', data.length);
        this.allocations = data;
        this.applyFilters();
        
        if (this.filteredAllocations.length > 0 && !this.selectedAllocation) {
          this.selectedAllocation = { ...this.filteredAllocations[0] };
        }
        
        if (this.selectedAllocation) {
          const exists = this.filteredAllocations.find(a => a.id === this.selectedAllocation?.id);
          if (!exists && this.filteredAllocations.length > 0) {
            this.selectedAllocation = { ...this.filteredAllocations[0] };
          }
        }
      },
      error: (error) => {
        console.error('Error loading allocations:', error);
      }
    });
  }
  
  // ==================== FILTERING ====================
  applyFilters(): void {
    this.filteredAllocations = this.allocations.filter((a: ExpenseAllocationModel) => {
      const matchesSearch = !this.searchQuery ||
        a.allocationNumber.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        a.description.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        a.allocatedToName.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      const matchesExpenseType = this.expenseTypeFilter === 'All' || a.expenseType === this.expenseTypeFilter;
      const matchesStatus = this.statusFilter === 'All' || a.status === this.statusFilter;
      const matchesDepartment = this.departmentFilter === 'All' || a.department === this.departmentFilter;
      const matchesAllocationType = this.allocationTypeFilter === 'All' || a.allocationType === this.allocationTypeFilter;
      
      return matchesSearch && matchesExpenseType && matchesStatus && matchesDepartment && matchesAllocationType;
    });
    
    this.currentPage = 1;
  }
  
  clearAllFilters(): void {
    this.searchQuery = '';
    this.expenseTypeFilter = 'All';
    this.statusFilter = 'All';
    this.departmentFilter = 'All';
    this.allocationTypeFilter = 'All';
    this.applyFilters();
  }
  
  // ==================== UNIQUE DEPARTMENTS ====================
  getUniqueDepartments(): string[] {
    const departments = this.allocations.map(a => a.department);
    return [...new Set(departments)];
  }
  
  // ==================== STATISTICS ====================
  getPendingCount(): number {
    return this.allocations.filter(a => a.status === 'Pending').length;
  }
  
  getApprovedCount(): number {
    return this.allocations.filter(a => a.status === 'Approved').length;
  }
  
  getTotalAmount(): number {
    return this.allocations.reduce((sum, a) => sum + a.amount, 0);
  }
  
  getFilteredTotal(): number {
    return this.filteredAllocations.reduce((sum, a) => sum + a.amount, 0);
  }
  
  // ==================== STATUS CLASSES ====================
  getStatusClass(status: string): string {
    const classes: { [key: string]: string } = {
      'Pending': 'status-pending',
      'Approved': 'status-approved',
      'Rejected': 'status-rejected'
    };
    return classes[status] || '';
  }
  
  // ==================== CATEGORIES ====================
  getCategories(): string[] {
    if (this.activeAllocation.expenseType === 'Direct') {
      return [...DirectExpenseCategories];
    } else {
      return [...IndirectExpenseCategories];
    }
  }
  
  onExpenseTypeChange(): void {
    const categories = this.getCategories();
    this.activeAllocation.expenseCategory = categories[0] || '';
  }
  
  // ==================== ALLOCATION OPTIONS ====================
  getAllocationOptions(): AllocationOption[] {
    if (this.activeAllocation.allocationType === 'Client') {
      return this.clients;
    } else if (this.activeAllocation.allocationType === 'Department') {
      return this.departments.map((dept, index) => ({
        id: index + 100,
        name: dept
      }));
    } else {
      return [
        { id: 1, name: 'Head Office' },
        { id: 2, name: 'Branch - Lahore' },
        { id: 3, name: 'Branch - Karachi' }
      ];
    }
  }
  
  onAllocatedToChange(): void {
    const options = this.getAllocationOptions();
    const selected = options.find(opt => opt.id === this.activeAllocation.allocatedToId);
    if (selected) {
      this.activeAllocation.allocatedToName = selected.name;
    }
  }
  
  getDepartments(): string[] {
    return this.departments;
  }
  
  // ==================== PAGINATION ====================
  get paginatedAllocations(): ExpenseAllocationModel[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredAllocations.slice(startIndex, startIndex + this.pageSize);
  }
  
  get totalPages(): number {
    return Math.ceil(this.filteredAllocations.length / this.pageSize) || 1;
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
  selectAllocation(allocation: ExpenseAllocationModel): void {
    this.selectedAllocation = { ...allocation };
  }
  
  // ==================== MODAL OPERATIONS ====================
  openCreateModal(): void {
    console.log('Opening create modal');
    this.isEditMode = false;
    this.activeAllocation = {
      allocationNumber: this.generateAllocationNumber(),
      expenseDate: new Date(),
      expenseType: 'Direct',
      expenseCategory: 'Flight Tickets',
      description: '',
      amount: 0,
      allocationType: 'Client',
      allocatedToId: null,
      allocatedToName: '',
      department: 'Sales',
      status: 'Pending',
      paymentMethod: 'Bank Transfer',
      referenceNumber: null,
      notes: '',
      purchaseId: null,
      invoiceId: null,
      clientId: null,
      vendorId: null,
      createdBy: 1
    };
    this.showModal = true;
  }
  
  openEditModal(allocation: ExpenseAllocationModel): void {
    console.log('Opening edit modal');
    this.isEditMode = true;
    this.activeAllocation = { ...allocation };
    this.showModal = true;
  }
  
  closeModal(): void {
    console.log('Closing modal');
    this.showModal = false;
  }
  
  // ==================== ALLOCATION NUMBER GENERATION ====================
  generateAllocationNumber(): string {
    return this.allocationService.generateAllocationNumber();
  }
  
  // ==================== SAVE ALLOCATION ====================
  saveAllocation(): void {
    if (!this.activeAllocation.description) {
      alert('Please enter a description');
      return;
    }
    
    if (!this.activeAllocation.amount || this.activeAllocation.amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    
    if (!this.activeAllocation.allocatedToId) {
      alert('Please select who to allocate to');
      return;
    }
    
    if (this.isEditMode) {
      this.allocationService.updateAllocation(this.activeAllocation.id, this.activeAllocation).subscribe({
        next: () => {
          this.loadAllocations();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error updating allocation:', error);
        }
      });
    } else {
      this.allocationService.createAllocation(this.activeAllocation).subscribe({
        next: () => {
          this.loadAllocations();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error creating allocation:', error);
        }
      });
    }
  }
  
  // ==================== APPROVE/REJECT ALLOCATION ====================
  approveAllocation(allocation: ExpenseAllocationModel): void {
    if (confirm(`Approve allocation ${allocation.allocationNumber}?`)) {
      this.allocationService.updateStatus(allocation.id, 'Approved').subscribe({
        next: () => {
          this.loadAllocations();
        },
        error: (error) => {
          console.error('Error approving allocation:', error);
        }
      });
    }
  }
  
  rejectAllocation(allocation: ExpenseAllocationModel): void {
    if (confirm(`Reject allocation ${allocation.allocationNumber}?`)) {
      this.allocationService.updateStatus(allocation.id, 'Rejected').subscribe({
        next: () => {
          this.loadAllocations();
        },
        error: (error) => {
          console.error('Error rejecting allocation:', error);
        }
      });
    }
  }
  
  // ==================== DELETE ALLOCATION ====================
  deleteAllocation(): void {
    if (this.selectedAllocation && confirm(`Are you sure you want to delete allocation ${this.selectedAllocation.allocationNumber}?`)) {
      this.allocationService.deleteAllocation(this.selectedAllocation.id).subscribe({
        next: () => {
          this.selectedAllocation = null;
          this.loadAllocations();
        },
        error: (error) => {
          console.error('Error deleting allocation:', error);
        }
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
  
  printAllocation(allocation: ExpenseAllocationModel): void {
    alert(`Printing allocation ${allocation.allocationNumber}`);
  }
}