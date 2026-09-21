// src/app/app.routes.ts

import { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';

// Core
import { DashboardComponent } from './pages/dashboard/dashboard';
import { LoginComponent } from './pages/login/login';
import { LogoutComponent } from './pages/logout/logout';
import { authGuard } from './shared/auth.guard';

// Sales
import { CustomersComponent } from './pages/sales/customers/customers';
import { CustomerInvoiceComponent } from './pages/sales/customer-invoice/customer-invoice';
import { CustomerReceiptComponent } from './pages/sales/customer-receipt/customer-receipt';
import { Cheques } from './pages/sales/cheques/cheques';

// Purchase
import { Vendors } from './pages/purchase/vendors/vendors';
import { VendorPurchaseComponent } from './pages/purchase/vendor-purchase/vendor-purchase';
import { VendorPaymentComponent } from './pages/purchase/vendor-payment/vendor-payment';
import { ExpenseAllocationComponent } from './pages/expense-allocation/expense-allocation';

// Reports
import { ProfitReportComponent } from './pages/reports/profit-report/profit-report';
import { CustomerLedgerComponent } from './pages/reports/customer-ledger/customer-ledger';
import { VendorLedgerComponent } from './pages/reports/vendor-ledger/vendor-ledger';

// System
import { Users } from './pages/system/users/users';
import { Branches } from './pages/system/branches/branches';
import { AuditLogs } from './pages/system/audit-logs/audit-logs';

// ============================================================
// MANAGEMENT PAGES CONFIGURATION
// ============================================================
const managementPages: Routes = [
  // SALES
  { path: 'sales/customers', component: CustomersComponent },
  { path: 'sales/customer-invoice', component: CustomerInvoiceComponent },
  { path: 'sales/customer-receipt', component: CustomerReceiptComponent },
  { path: 'sales/cheques', component: Cheques },

  // PURCHASE
  { path: 'purchase/vendors', component: Vendors },
  { path: 'purchase/vendor-purchase', component: VendorPurchaseComponent },
  { path: 'purchase/vendor-payment', component: VendorPaymentComponent },
  { path: 'purchase/expense-allocation', component: ExpenseAllocationComponent },

  // REPORTS
  { path: 'reports/profit-report', component: ProfitReportComponent },
  { path: 'reports/customer-ledger', component: CustomerLedgerComponent },
  { path: 'reports/vendor-ledger', component: VendorLedgerComponent },

  // SYSTEM
  { path: 'system/users', component: Users },
  { path: 'system/branches', component: Branches },
  { path: 'system/audit-logs', component: AuditLogs },
];

// ============================================================
// ROOT ROUTES
// ============================================================
export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  
  // Apply Auth Guard to all management pages safely
  ...managementPages.map((route) => ({ ...route, canActivate: [authGuard] })),
  
  { path: 'logout', component: LogoutComponent, canActivate: [authGuard] },
  
  // Wildcard fallback (Redirects to dashboard if route not found)
  { path: '**', redirectTo: 'dashboard' }
];