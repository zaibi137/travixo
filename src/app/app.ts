import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from './shared/auth.service';

interface NavChild {
  label: string;
  icon: string;
  route: string;
}

interface NavSection {
  label: string;
  icon: string;
  route?: string;
  children?: NavChild[];
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent implements OnInit {
  activeSection: NavSection | null = null;
  isLoginPage = false;
  isSidebarOpen = true;
   toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  readonly navSections: NavSection[] = [
    { label: 'Dashboard', icon: 'fa-solid fa-house', route: '/dashboard' },
    {
      label: 'Sales',
      icon: 'fa-solid fa-briefcase',
      children: [
        { label: 'Customers', icon: 'fa-solid fa-users', route: '/sales/customers' },
        { label: 'Customer Invoice', icon: 'fa-solid fa-file-invoice', route: '/sales/customer-invoice' },
        { label: 'Customer Receipt', icon: 'fa-solid fa-receipt', route: '/sales/customer-receipt' },
        { label: 'Cheques', icon: 'fa-solid fa-money-check', route: '/sales/cheques' }
      ]
    },
    {
      label: 'Purchase',
      icon: 'fa-solid fa-cart-shopping',
      children: [
        { label: 'Vendors', icon: 'fa-solid fa-people-carry-box', route: '/purchase/vendors' },
        { label: 'Vendor Purchase', icon: 'fa-solid fa-cart-shopping', route: '/purchase/vendor-purchase' },
        { label: 'Vendor Payment', icon: 'fa-solid fa-hand-holding-dollar', route: '/purchase/vendor-payment' },
        { label: 'Expense Allocation', icon: 'fa-solid fa-table-cells', route: '/purchase/expense-allocation' }
      ]
    },
    {
      label: 'Reports',
      icon: 'fa-solid fa-chart-column',
      children: [
        { label: 'Profit Report', icon: 'fa-solid fa-chart-line', route: '/reports/profit-report' },
        { label: 'Customer Ledger', icon: 'fa-solid fa-book-open', route: '/reports/customer-ledger' },
        { label: 'Vendor Ledger', icon: 'fa-solid fa-book', route: '/reports/vendor-ledger' }
      ]
    },
    {
      label: 'System',
      icon: 'fa-solid fa-sitemap',
      children: [
        { label: 'Users', icon: 'fa-solid fa-user-gear', route: '/system/users' },
        { label: 'Branches', icon: 'fa-solid fa-code-branch', route: '/system/branches' },
        { label: 'Audit / Login Logs', icon: 'fa-solid fa-file-shield', route: '/system/audit-logs' }
      ]
    },
    { label: 'Log Out', icon: 'fa-solid fa-right-from-bracket', route: '/logout' }
  ];

  constructor(
    private readonly router: Router,
    private readonly auth: AuthService
  ) {}

  ngOnInit(): void {
    this.syncActiveSection();
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => this.syncActiveSection());
  }

  selectSection(section: NavSection): void {
    if (section.route) {
      this.activeSection = null;
      void this.router.navigateByUrl(section.route);
      return;
    }

    this.activeSection = this.activeSection?.label === section.label ? null : section;
  }

  closeSubmenu(): void {
    this.activeSection = null;
  }

  logout(): void {
    console.log('🔴 LOGOUT CLICKED');
    this.activeSection = null;
    
    this.auth.logout().subscribe({
      next: () => {
        void this.router.navigateByUrl('/login');
      },
      error: () => {
        void this.router.navigateByUrl('/login');
      }
    });
  }

  isSectionActive(section: NavSection): boolean {
    if (section.route) {
      return this.router.url.split('?')[0] === section.route;
    }

    return Boolean(section.children?.some((child) => this.router.url.split('?')[0] === child.route));
  }

  private syncActiveSection(): void {
    const currentRoute = this.router.url.split('?')[0];
    this.isLoginPage = currentRoute === '/login';
    const matchedSection = this.navSections.find((section) => section.children?.some((child) => child.route === currentRoute));
    this.activeSection = matchedSection ?? null;
  }

  // ✅ NEW: Helper method to scroll to top when page changes
  scrollToTop(): void {
    window.scrollTo(0, 0);
  }
}