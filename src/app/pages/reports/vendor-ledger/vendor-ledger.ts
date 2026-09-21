import { Component, signal, effect, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vendor-ledger',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vendor-ledger.html',
  styleUrls: ['./vendor-ledger.css']
})
export class VendorLedgerComponent {
  searchQuery: string = '';
  selectedVendor: any = null;

  // 🆕 IMPROVED: Load preference from localStorage, fallback to false (List View)
  isGridView = signal<boolean>(
    localStorage.getItem('vendorLedger_view') === 'grid'
  );

  constructor(
    private router: Router,
    private injector: Injector
  ) {
    // 🆕 Automatically save to localStorage whenever the signal changes
    effect(() => {
      const currentView = this.isGridView() ? 'grid' : 'list';
      localStorage.setItem('vendorLedger_view', currentView);
    }, { injector: this.injector });
  }

  vendors = [
    {
      id: 1,
      name: 'Emirates Airlines',
      contact: 'sales@emirates.com',
      phone: '+92 21 1234567',
      totalDebit: 150000,
      totalCredit: 100000,
      balance: 50000,
      transactions: [
        { date: '2026-07-02', refId: 'PUR-2026-043', description: 'Flight Tickets (Group Booking)', type: 'debit', amount: 100000, balance: 100000 },
        { date: '2026-07-10', refId: 'PUR-2026-051', description: 'Additional Passenger Seat', type: 'debit', amount: 50000, balance: 150000 },
        { date: '2026-07-15', refId: 'PAY-2026-010', description: 'Partial Payment via Bank', type: 'credit', amount: 100000, balance: 50000 }
      ]
    },
    {
      id: 2,
      name: 'Marriott Hotels',
      contact: 'b2b@marriott.com',
      phone: '+92 42 9876543',
      totalDebit: 80000,
      totalCredit: 120000,
      balance: -40000,
      transactions: [
        { date: '2026-06-20', refId: 'PUR-2026-020', description: 'Hotel Block Booking (July)', type: 'debit', amount: 80000, balance: 80000 },
        { date: '2026-06-25', refId: 'PAY-2026-008', description: 'Advance Payment (Prepaid)', type: 'credit', amount: 120000, balance: -40000 }
      ]
    }
  ];

  get filteredVendors() {
    if (!this.searchQuery) return this.vendors;
    return this.vendors.filter(v => 
      v.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      v.contact.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  getInitials(name: string): string {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }

  toggleView(): void {
    this.isGridView.update(val => !val);
  }

  selectVendor(vendor: any): void {
    this.selectedVendor = vendor;
  }

  navigateToPurchase(purchaseId: string): void {
    if (!purchaseId) return;
    this.router.navigate(['/purchase/vendor-purchase'], { queryParams: { search: purchaseId } });
  }

  openPaymentModal(): void {
    if (!this.selectedVendor) return;
    alert(`Opening payment modal for ${this.selectedVendor.name} to pay ₨ ${this.selectedVendor.balance}`);
  }

  printLedger(): void {
    window.print();
  }

  exportLedger(): void {
    alert(`Exporting Vendor Ledger for ${this.selectedVendor?.name || 'all vendors'}...`);
  }
}