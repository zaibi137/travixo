// src/app/pages/sales/customers/customers.ts

import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export interface Customer {
  id?: number;
  clientcode: string;
  name: string;
  customertype: string;
  status?: number | string | boolean;
  mobile?: string;
  whatsapp?: string;
  email?: string;
  cnic?: string;
  passportno?: string;
  passportexpirydate?: string;
  dateofbirth?: string;
  nationality?: string;
  gender?: string;
  paymentterm?: string;
  createdby?: string;
  address?: string;
  bookings?: any[];
  documents?: any[];
}

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customers.html',
  styleUrl: './customers.css'
})
export class CustomersComponent implements OnInit {
  private http = inject(HttpClient);
  
  private apiUrl = '/api/v1/customers';

  Math = Math;

  // All countries list
  countries: string[] = [
    'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda',
    'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas',
    'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize',
    'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil',
    'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon',
    'Canada', 'Cape Verde', 'Central African Republic', 'Chad', 'Chile', 'China',
    'Colombia', 'Comoros', 'Congo', 'Costa Rica', 'Croatia', 'Cuba',
    'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic',
    'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia',
    'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon',
    'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada',
    'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras',
    'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq',
    'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan',
    'Kazakhstan', 'Kenya', 'Kiribati', 'Korea', 'Kuwait', 'Kyrgyzstan',
    'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya',
    'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia',
    'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius',
    'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro',
    'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal',
    'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Macedonia',
    'Norway', 'Oman', 'Pakistan', 'Palau', 'Panama', 'Papua New Guinea',
    'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar',
    'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent',
    'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia',
    'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands',
    'Somalia', 'South Africa', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan',
    'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan',
    'Tanzania', 'Thailand', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia',
    'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates',
    'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City',
    'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
  ];

  // Signals
  customers = signal<Customer[]>([]);
  searchQuery = signal<string>('');
  selectedCustomer = signal<Customer | null>(null);
  showModal = signal<boolean>(false);
  showDetailModal = signal<boolean>(false);

  // Filters as signals for proper reactivity
  typeFilter = signal<string>('All');
  statusFilter = signal<string>('All');
  
  // View & Filter States
  isGridView: boolean = false;
  detailTab: string = 'profile';
  isEditing: boolean = false;

  // Pagination
  currentPage: number = 1;
  pageSize: number = 10;

  // Form Model
  formData: Customer = this.getEmptyCustomer();

  // Validation tracking
  formSubmitted: boolean = false;

  ngOnInit(): void {
    this.loadCustomers();
  }

  // --- HELPER: GET AUTH HEADERS WITH JWT TOKEN ---
  private getHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('authToken') || '';

    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
  }

  // --- HELPER: SAFE ISO DATE CONVERTER ---
  private safeIsoDate(dateVal?: string): string {
    if (!dateVal) return new Date().toISOString();
    const d = new Date(dateVal);
    return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
  }

  // --- HELPER: RECURSIVELY FIND ARRAY IN RESPONSE OBJECT ---
  private extractArrayFromResponse(res: any): any[] {
    if (Array.isArray(res)) return res;
    if (!res || typeof res !== 'object') return [];

    const commonKeys = ['Data', 'data', 'result', 'Result', 'items', 'Items', 'value', 'Value'];
    for (const key of commonKeys) {
      if (Array.isArray(res[key])) return res[key];
    }

    for (const key of Object.keys(res)) {
      if (Array.isArray(res[key])) return res[key];
      if (res[key] && typeof res[key] === 'object') {
        const nested = this.extractArrayFromResponse(res[key]);
        if (nested.length > 0) return nested;
      }
    }
    return [];
  }

  // --- HELPER: UNIFY STATUS VALUES (1 = Active, 0 = Inactive) ---
  normalizeStatus(statusVal: any): number {
    if (statusVal === undefined || statusVal === null) return 1;
    if (typeof statusVal === 'boolean') return statusVal ? 1 : 0;
    
    const str = String(statusVal).trim().toLowerCase();
    if (str === '1' || str === 'active' || str === 'true') return 1;
    if (str === '0' || str === 'inactive' || str === 'false') return 0;
    
    return 1;
  }
  
  // --- HELPER: NORMALIZE CUSTOMER TYPE FOR TEMPLATE DISPLAY ---
  normalizeType(typeVal: any): string {
    if (!typeVal) return 'INDIVIDUAL';
    const str = String(typeVal).trim().toUpperCase();
    if (str === 'B2B') return 'B2C';
    return str;
  }

  // --- GET ALL CUSTOMERS ---
  loadCustomers(): void {
    this.http.get<any>(this.apiUrl, this.getHeaders()).subscribe({
      next: (response) => {
        console.log('Raw GET API Response:', response);

        const rawList = this.extractArrayFromResponse(response);

        const serverCustomers: Customer[] = rawList.map((c: any) => ({
          id: c.id ?? c.Id ?? c.clientID ?? c.clientId,
          clientcode: c.clientcode ?? c.clientCode ?? c.ClientCode ?? '',
          name: c.name ?? c.Name ?? '',
          customertype: (c.customertype ?? c.customerType ?? c.CustomerType ?? 'INDIVIDUAL').toUpperCase(),
          status: this.normalizeStatus(c.status ?? c.Status),
          mobile: c.mobile ?? c.Mobile ?? c.phone ?? c.Phone ?? '',
          whatsapp: c.whatsapp ?? c.WhatsApp ?? c.Whatsapp ?? '',
          email: c.email ?? c.Email ?? '',
          cnic: c.cnic ?? c.Cnic ?? c.CNIC ?? '',
          passportno: c.passportno ?? c.passportNo ?? c.PassportNo ?? '',
          passportexpirydate: c.passportexpirydate ?? c.passportExpiryDate ?? c.PassportExpiryDate ?? '',
          dateofbirth: c.dateofbirth ?? c.dateOfBirth ?? c.DateOfBirth ?? '',
          nationality: c.nationality ?? c.Nationality ?? '',
          gender: c.gender ?? c.Gender ?? 'Male',
          paymentterm: c.paymentterm ?? c.paymentTerm ?? c.PaymentTerm ?? '',
          createdby: c.createdby ?? c.createdBy ?? c.CreatedBy ?? 'Admin',
          address: c.address ?? c.Address ?? ''
        }));

        this.customers.set(serverCustomers);
      },
      error: (err) => {
        console.error('Error fetching customers:', err);
        if (err.status === 401) {
          alert('Session expired. Please login again.');
        }
      }
    });
  }

  getEmptyCustomer(): Customer {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return {
      clientcode: `CUST-${randomNum}`,
      name: '',
      customertype: 'INDIVIDUAL',
      status: 1,
      mobile: '',
      whatsapp: '',
      email: '',
      cnic: '',
      passportno: '',
      passportexpirydate: '',
      dateofbirth: '',
      nationality: '',
      gender: 'Male',
      paymentterm: '',
      createdby: 'Admin',
      address: '',
      bookings: [],
      documents: []
    };
  }

  // --- COMPUTED FILTERS WITH SIGNAL REACTIVITY ---
  filteredCustomers = computed(() => {
    let list = this.customers();
    const query = this.searchQuery().toLowerCase().trim();

    if (query) {
      list = list.filter(c =>
        c.name?.toLowerCase().includes(query) ||
        c.clientcode?.toLowerCase().includes(query) ||
        c.email?.toLowerCase().includes(query) ||
        c.mobile?.toLowerCase().includes(query)
      );
    }

    const currentTypeFilter = this.typeFilter();
    if (currentTypeFilter && currentTypeFilter !== 'All') {
      list = list.filter(c => c.customertype?.toUpperCase() === currentTypeFilter.toUpperCase());
    }

    const currentStatusFilter = this.statusFilter();
    if (currentStatusFilter && currentStatusFilter !== 'All') {
      const targetStatus = this.normalizeStatus(currentStatusFilter);
      list = list.filter(c => this.normalizeStatus(c.status) === targetStatus);
    }

    return list;
  });

  paginatedCustomers = computed(() => {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredCustomers().slice(start, start + Number(this.pageSize));
  });

  get totalPages(): number {
    return Math.ceil(this.filteredCustomers().length / this.pageSize) || 1;
  }

  // --- QUICK FILTERS (Active / Inactive Buttons) ---
  setQuickStatusFilter(status: string): void {
    if (this.statusFilter() === status) {
      this.statusFilter.set('All');
    } else {
      this.statusFilter.set(status);
    }
    this.currentPage = 1;
  }

  // --- VALIDATION METHOD ---
  isFormValid(): boolean {
    return !!(this.formData.clientcode?.trim() && 
              this.formData.name?.trim() && 
              this.formData.customertype);
  }

  // --- CREATE / UPDATE CUSTOMER ---
  saveCustomer(): void {
    this.formSubmitted = true;

    // Validate required fields
    if (!this.formData.clientcode?.trim()) {
      alert('Client Code is required');
      return;
    }
    if (!this.formData.name?.trim()) {
      alert('Name is required');
      return;
    }
    if (!this.formData.customertype) {
      alert('Customer Type is required');
      return;
    }

    const uniqueCode = this.formData.clientcode?.trim() || `CUST-${Math.floor(1000 + Math.random() * 9000)}`;

    const payload = {
      clientcode: uniqueCode,
      name: this.formData.name || '',
      customertype: this.formData.customertype || 'INDIVIDUAL',
      mobile: this.formData.mobile || '',
      whatsapp: this.formData.whatsapp || '',
      email: this.formData.email || '',
      cnic: this.formData.cnic || '',
      passportno: this.formData.passportno || '',
      passportexpirydate: this.safeIsoDate(this.formData.passportexpirydate),
      dateofbirth: this.safeIsoDate(this.formData.dateofbirth),
      nationality: this.formData.nationality || '',
      gender: this.formData.gender || 'Male',
      paymentterm: this.formData.paymentterm || '',
      address: this.formData.address || '',
      createdby: this.formData.createdby || 'Admin'
    };

    if (this.isEditing && this.formData.id) {
      this.http.put(`${this.apiUrl}/${this.formData.id}`, payload, this.getHeaders()).subscribe({
        next: () => {
          this.loadCustomers();
          this.closeModal();
          this.formSubmitted = false;
          alert('Customer updated successfully!');
        },
        error: (err) => {
          console.error('Error updating customer:', err);
          if (err.status === 401) {
            alert('Session expired. Please login again.');
          } else {
            alert(`Update Failed: ${err.error?.Message || err.error?.message || 'Server error'}`);
          }
        }
      });
    } else {
      this.http.post<any>(this.apiUrl, payload, this.getHeaders()).subscribe({
        next: (res) => {
          console.log('POST Success:', res);
          
          const newId = res?.Data?.id ?? res?.Data?.Id ?? res?.id ?? res?.Id ?? Date.now();
          
          const newCustomer: Customer = {
            ...payload,
            id: newId,
            status: 1
          };

          this.customers.update(list => [newCustomer, ...list]);
          this.clearAllFilters();
          this.closeModal();
          this.formSubmitted = false;
          alert('Customer created successfully!');
        },
        error: (err) => {
          console.error('Error creating customer:', err);
          if (err.status === 401) {
            alert('Session expired. Please login again.');
          } else {
            const msg = err.error?.Message || err.error?.message || 'Failed to create customer.';
            alert(`Create Failed: ${msg}`);
          }
        }
      });
    }
  }

  // --- DELETE CUSTOMER ---
  deleteCustomer(id?: number, name?: string, event?: Event): void {
    if (event) event.stopPropagation();

    if (!id) {
      alert('Cannot delete customer: Invalid ID.');
      return;
    }

    const confirmText = name ? `Are you sure you want to delete "${name}"?` : 'Are you sure you want to delete this customer?';

    if (confirm(confirmText)) {
      this.http.delete(`${this.apiUrl}/${id}`, this.getHeaders()).subscribe({
        next: () => {
          this.customers.update(list => list.filter(c => c.id !== id));
          alert('Customer deleted successfully!');
        },
        error: (err) => {
          console.error('Error deleting customer:', err);
          if (err.status === 401) {
            alert('Session expired. Please login again.');
          } else {
            const msg = err.error?.Message || err.error?.message || 'Failed to delete customer.';
            alert(`Delete Failed: ${msg}`);
          }
        }
      });
    }
  }

  // --- HEADER & FILTER HANDLERS ---
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      console.log('File selected:', input.files[0].name);
    }
  }

  openNewBookingModal(customer: Customer | null): void {
    console.log('Open booking modal for:', customer);
  }

  toggleView(): void {
    this.isGridView = !this.isGridView;
  }

  applyFilters(): void {
    this.currentPage = 1;
  }

  clearAllFilters(): void {
    this.searchQuery.set('');
    this.typeFilter.set('All');
    this.statusFilter.set('All');
    this.currentPage = 1;
  }

  // --- MODAL HANDLERS ---
  selectCustomer(customer: Customer): void {
    this.selectedCustomer.set(customer);
    this.showDetailModal.set(true);
  }

  openAddModal(): void {
    this.isEditing = false;
    this.formData = this.getEmptyCustomer();
    this.formSubmitted = false;
    this.showModal.set(true);
  }

  openEditModal(customer: Customer | null): void {
    if (!customer) return;
    this.isEditing = true;
    this.formData = { ...customer };
    this.formSubmitted = false;
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.formSubmitted = false;
  }

  closeDetailModal(): void {
    this.showDetailModal.set(false);
  }

  // --- LIVE DATA ANALYTICS HELPERS ---
  getActiveCount(): number {
    return this.customers().filter(c => this.normalizeStatus(c.status) === 1).length;
  }

  getInactiveCount(): number {
    return this.customers().filter(c => this.normalizeStatus(c.status) === 0).length;
  }

  getTypeCount(type: string): number {
    return this.customers().filter(c => c.customertype?.toUpperCase() === type.toUpperCase()).length;
  }

  recentActivities = computed(() => {
    const list = this.customers();
    if (list.length === 0) return [];

    return list.slice(0, 3).map((c, idx) => ({
      icon: idx === 0 ? '📝' : idx === 1 ? '✏️' : '📧',
      title: idx === 0 ? `New customer added: ${c.name}` : idx === 1 ? `Profile updated: ${c.name}` : `Email linked: ${c.email || c.name}`,
      time: idx === 0 ? 'Recently' : `${idx * 2} hours ago`
    }));
  });

  getInitials(name?: string): string {
    if (!name) return '??';
    const parts = name.trim().split(' ');
    return parts.length >= 2 
      ? (parts[0][0] + parts[1][0]).toUpperCase() 
      : name.substring(0, 2).toUpperCase();
  }

  getTypeClass(type?: string): string {
    const upperType = type?.toUpperCase();
    switch (upperType) {
      case 'INDIVIDUAL': return 'badge-individual';
      case 'CORPORATE': return 'badge-corporate';
      case 'B2C': return 'badge-b2c';
      default: return 'badge-default';
    }
  }

  // --- PAGINATION CONTROLS ---
  prevPage(): void {
    if (this.currentPage > 1) this.currentPage--;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  goToPage(page: number): void {
    this.currentPage = page;  
  }

  getPageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}