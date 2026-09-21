import { Component, signal, effect, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-ledger',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-ledger.html',
  styleUrls: ['./customer-ledger.css']
})
export class CustomerLedgerComponent {
  searchQuery: string = '';
  selectedCustomer: any = null;

  // 🆕 IMPROVED: Load preference from localStorage, fallback to false (List View)
  isGridView = signal<boolean>(
    localStorage.getItem('customerLedger_view') === 'grid'
  );

  constructor(
    private router: Router,
    private injector: Injector
  ) {
    // 🆕 Automatically save to localStorage whenever the signal changes
    effect(() => {
      const currentView = this.isGridView() ? 'grid' : 'list';
      localStorage.setItem('customerLedger_view', currentView);
    }, { injector: this.injector });
  }

  customers = [
    {
      id: 1,
      name: 'Ali Ahmed',
      email: 'ali.ahmed@email.com',
      phone: '+92 300 1234567',
      totalDebit: 50000,
      totalCredit: 35000,
      balance: 15000,
      transactions: [
        { date: '2026-07-01', refId: 'INV-2026-001', description: 'Dubai Flight Booking', type: 'debit', amount: 50000, balance: 50000 },
        { date: '2026-07-05', refId: 'REC-2026-001', description: 'Payment via Cash', type: 'credit', amount: 35000, balance: 15000 }
      ]
    },
    {
      id: 2,
      name: 'Sarah Khan',
      email: 'sarah.k@travel.com',
      phone: '+92 301 9876543',
      totalDebit: 120000,
      totalCredit: 145000,
      balance: -25000,
      transactions: [
        { date: '2026-06-15', refId: 'INV-2026-010', description: 'Turkey Package', type: 'debit', amount: 120000, balance: 120000 },
        { date: '2026-06-20', refId: 'REC-2026-008', description: 'Bank Transfer', type: 'credit', amount: 145000, balance: -25000 }
      ]
    }
  ];

  get filteredCustomers() {
    if (!this.searchQuery) return this.customers;
    return this.customers.filter(c => 
      c.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  getInitials(name: string): string {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }

  // 🆕 Toggle between List and Grid view (Signal handles auto-save via effect)
  toggleView(): void {
    this.isGridView.update(val => !val);
  }

  selectCustomer(customer: any): void {
    this.selectedCustomer = customer;
  }

  navigateToInvoice(invoiceId: string): void {
    if (!invoiceId) return;
    this.router.navigate(['/sales/customer-invoice'], { queryParams: { search: invoiceId } });
  }

  openPaymentModal(): void {
    if (!this.selectedCustomer) return;
    alert(`Opening payment modal for ${this.selectedCustomer.name} to pay ₨ ${this.selectedCustomer.balance}`);
  }

  printLedger(): void {
    window.print();
  }

  exportLedger(): void {
    alert(`Exporting Customer Ledger for ${this.selectedCustomer?.name || 'all customers'}...`);
  }
}