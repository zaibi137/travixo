import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InvoiceService, Invoice } from '../../../shared/invoice.service';

@Component({
  selector: 'app-customer-invoice',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-invoice.html',
  styleUrls: ['./customer-invoice.css']
})
export class CustomerInvoiceComponent implements OnInit {
  Math = Math;

  // Master Data & Lists
  invoices: Invoice[] = [];
  filteredInvoices: Invoice[] = [];
  paginatedInvoices: Invoice[] = [];
  selectedInvoice: Invoice | null = null;
  
  // Real Customers List from API
  customers: any[] = []; // <--- ADD THIS

  // UI State Controls
  isLoading: boolean = false;
  isGridView: boolean = false;
  isEditMode: boolean = false;
  showCreateModal: boolean = false;
  showDetailModal: boolean = false;
  detailTab: 'details' | 'items' = 'details';

  // Filter & Search Controls
  searchQuery: string = '';
  statusFilter: string = 'All';
  filterPeriod: string = 'all';

  // Pagination Controls
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;

  // Form State
  newInvoice: Invoice = this.getEmptyInvoiceModel();

  constructor(
    private invoiceService: InvoiceService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadInvoices();
    this.loadCustomers(); // <--- FETCH CUSTOMERS ON INIT
  }

  // --- FETCH REAL CUSTOMERS FROM API ---
  loadCustomers(): void {
    this.invoiceService.getCustomers().subscribe({
      next: (response: any) => {
        if (Array.isArray(response)) {
          this.customers = response;
        } else if (response?.data && Array.isArray(response.data)) {
          this.customers = response.data;
        } else if (response?.data?.data && Array.isArray(response.data.data)) {
          this.customers = response.data.data;
        } else {
          this.customers = [];
        }
        console.log('✅ Loaded Customers:', this.customers);
      },
      error: (err) => {
        console.error('❌ Failed to load customers:', err);
        this.customers = [];
      }
    });
  }

  getEmptyInvoiceModel(): Invoice {
    return {
      id: 0,
      invoicecode: '',
      customerid: 0, // <--- DEFAULT TO 0 SO USER MUST PICK A CUSTOMER
      customername: '',
      invoicedate: new Date().toISOString().substring(0, 10),
      duedate: new Date().toISOString().substring(0, 10),
      status: 'Pending',
      createdby: 'admin',
      totalamount: 0,
      paidamount: 0,
      balanceamount: 0,
      details: [
        {
          servicecategory: '',
          quantity: 1,
          cost: 0,
          totalamount: 0,
          referenceno: '',
          description: ''
        }
      ]
    };
  }

  // --- DATA LOADING & PARSING ---

  loadInvoices(): void {
  this.isLoading = true;
  this.invoiceService.getInvoices().subscribe({
    next: (response: any) => {
      if (Array.isArray(response)) {
        this.invoices = response;
      } else if (response?.data?.data && Array.isArray(response.data.data)) {
        this.invoices = response.data.data;
      } else if (response?.data && Array.isArray(response.data)) {
        this.invoices = response.data;
      } else if (response?.invoices && Array.isArray(response.invoices)) {
        this.invoices = response.invoices;
      } else {
        this.invoices = [];
      }

      this.applyFilters();
      this.isLoading = false;
      
      // Force DOM repaint AFTER data arrives from API
      this.cdRef.detectChanges();
    },
    error: (err) => {
      console.error('❌ Failed to load invoices:', err);
      this.invoices = [];
      this.applyFilters();
      this.isLoading = false;
      this.cdRef.detectChanges();
    }
  });
}

  // --- FILTERING & PAGINATION LOGIC ---

  applyFilters(): void {
    if (!Array.isArray(this.invoices)) {
      this.invoices = [];
    }

    let result = [...this.invoices];

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      result = result.filter(inv =>
        (inv.invoicecode && inv.invoicecode.toLowerCase().includes(q)) ||
        (inv.customerid && inv.customerid.toString().includes(q)) ||
        (inv.customername && inv.customername.toLowerCase().includes(q)) ||
        (inv.createdby && inv.createdby.toLowerCase().includes(q))
      );
    }

    if (this.statusFilter !== 'All') {
      result = result.filter(inv => inv.status === this.statusFilter);
    }

    this.filteredInvoices = result;
    this.currentPage = 1;
    this.updatePagination();
  }

  clearAllFilters(): void {
    this.searchQuery = '';
    this.statusFilter = 'All';
    this.filterPeriod = 'all';
    this.applyFilters();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredInvoices.length / this.pageSize) || 1;
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedInvoices = this.filteredInvoices.slice(startIndex, endIndex);
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  toggleView(): void {
    this.isGridView = !this.isGridView;
  }

  // --- STATS CALCULATIONS ---

  getPendingCount(): number {
    if (!Array.isArray(this.invoices)) return 0;
    return this.invoices.filter(i => i.status === 'Pending' || i.status === 'Draft').length;
  }

  getPaidCount(): number {
    if (!Array.isArray(this.invoices)) return 0;
    return this.invoices.filter(i => i.status === 'Paid').length;
  }

  getTotalAmount(): number {
    if (!Array.isArray(this.invoices)) return 0;
    return this.invoices.reduce((sum, item) => sum + (item.totalamount || 0), 0);
  }

  getInitials(name: string): string {
    if (!name) return 'CU';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  // --- DETAIL MODAL LOGIC ---

  openInvoiceDetails(invoice: Invoice): void {
    this.selectedInvoice = invoice;
    this.detailTab = 'details';
    this.showDetailModal = true;
  }

  closeDetailModal(): void {
    this.showDetailModal = false;
    this.selectedInvoice = null;
  }

  // --- CREATE / EDIT MODAL LOGIC ---

  openCreateModal(): void {
    this.isEditMode = false;
    this.newInvoice = this.getEmptyInvoiceModel();
    this.showCreateModal = true;
  }

  openEditModal(invoice: Invoice): void {
    this.isEditMode = true;
    this.newInvoice = JSON.parse(JSON.stringify(invoice));
    if (!this.newInvoice.details || this.newInvoice.details.length === 0) {
      this.addDetailItem();
    }
    this.showCreateModal = true;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
    this.newInvoice = this.getEmptyInvoiceModel();
  }

  addDetailItem(): void {
    if (!this.newInvoice.details) {
      this.newInvoice.details = [];
    }
    this.newInvoice.details.push({
      servicecategory: '',
      quantity: 1,
      cost: 0,
      totalamount: 0,
      referenceno: '',
      description: ''
    });
    this.calculateTotals();
  }

  removeDetailItem(index: number): void {
    if (this.newInvoice.details && this.newInvoice.details.length > 1) {
      this.newInvoice.details.splice(index, 1);
      this.calculateTotals();
    }
  }

  calculateTotals(): void {
    let grandTotal = 0;
    (this.newInvoice.details || []).forEach(item => {
      item.totalamount = Number(item.quantity || 0) * Number(item.cost || 0);
      grandTotal += item.totalamount;
    });
    this.newInvoice.totalamount = grandTotal;
  }

  private formatToIsoDateTime(dateVal: any): string {
    if (!dateVal) return new Date().toISOString();
    const d = new Date(dateVal);
    return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
  }

 saveInvoice(): void {
  this.calculateTotals();

  const code = this.newInvoice.invoicecode ? String(this.newInvoice.invoicecode).trim() : '';
  const customerId = Number(this.newInvoice.customerid);

  if (!code || isNaN(customerId) || customerId <= 0) {
    alert('Please select a valid Customer and enter an Invoice Code.');
    return;
  }

  // Debug check: verify what Angular read from the dropdown
  console.log('📌 Selected Status in UI:', this.newInvoice.status);

  const selectedStatus = this.newInvoice.status || 'Pending';

  const cleanPayload: any = {
    invoicecode: code,
    customerid: customerId,
    invoicedate: this.formatToIsoDateTime(this.newInvoice.invoicedate),
    duedate: this.formatToIsoDateTime(this.newInvoice.duedate),
    status: selectedStatus,
    Status: selectedStatus,
    createdby: this.newInvoice.createdby || 'admin',
    totalamount: Number(this.newInvoice.totalamount || 0),
    details: (this.newInvoice.details || []).map(item => ({
      servicecategory: (item.servicecategory || '').trim(),
      quantity: Number(item.quantity || 1),
      cost: Number(item.cost || 0),
      totalamount: Number(item.quantity || 1) * Number(item.cost || 0),
      referenceno: (item.referenceno || '').trim(),
      description: (item.description || '').trim()
    }))
  };

  this.isLoading = true;

  if (this.isEditMode && this.newInvoice.id) {
    // EDIT MODE
    this.invoiceService.updateInvoice(this.newInvoice.id, cleanPayload).subscribe({
      next: () => {
        this.isLoading = false;
        this.closeCreateModal();
        this.loadInvoices();

        setTimeout(() => {
          alert('✅ Invoice updated successfully!');
        }, 100);
      },
      error: (error) => this.handleBackendError(error)
    });
  } else {
    // CREATE MODE
    this.invoiceService.createInvoice(cleanPayload).subscribe({
      next: (createdInvoiceResponse: any) => {
        // Extract new ID created by backend
        const newId = createdInvoiceResponse?.id || createdInvoiceResponse?.data?.id;

        // If backend ignored 'status' on POST and forced 'Draft', send immediate PUT to update status
        if (newId && selectedStatus !== 'Draft') {
          this.invoiceService.updateInvoice(newId, cleanPayload).subscribe({
            next: () => {
              this.isLoading = false;
              this.closeCreateModal();
              this.loadInvoices();
              setTimeout(() => { alert('✅ Invoice created successfully!'); }, 100);
            },
            error: () => {
              this.isLoading = false;
              this.closeCreateModal();
              this.loadInvoices();
            }
          });
        } else {
          this.isLoading = false;
          this.closeCreateModal();
          this.loadInvoices();
          setTimeout(() => { alert('✅ Invoice created successfully!'); }, 100);
        }
      },
      error: (error) => this.handleBackendError(error)
    });
  }
}
  deleteInvoice(invoice: Invoice): void {
    if (!invoice.id) return;
    if (confirm(`Are you sure you want to delete invoice ${invoice.invoicecode}?`)) {
      this.isLoading = true;
      this.invoiceService.deleteInvoice(invoice.id).subscribe({
        next: () => {
          this.isLoading = false;
          this.invoices = this.invoices.filter(item => item.id !== invoice.id);
          this.applyFilters();
          this.cdRef.detectChanges();

          setTimeout(() => {
            alert('✅ Invoice deleted successfully!');
          }, 100);
        },
        error: (err) => this.handleBackendError(err)
      });
    }
  }

  private handleBackendError(error: any): void {
    this.isLoading = false;
    console.error('❌ Full HTTP Error Response:', error);
    
    let message = 'An error occurred while saving.';
    if (error?.error?.errors) {
      const validationErrors = error.error.errors;
      const errorList = Object.keys(validationErrors)
        .map(key => `• ${key}: ${validationErrors[key].join(', ')}`)
        .join('\n');
      message = `Validation Failed:\n${errorList}`;
    } else if (error?.error?.message) {
      message = error.error.message;
    } else if (typeof error?.error === 'string') {
      message = error.error;
    } else if (error?.message) {
      message = error.message;
    }

    alert(`Failed to save invoice:\n${message}`);
  }
}