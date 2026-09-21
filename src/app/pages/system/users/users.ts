import { Component, signal, effect, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.html',
  styleUrls: ['./users.css']
})
export class Users {
  searchQuery: string = '';
  selectedUser: any = null;
  showModal: boolean = false;
  isEditMode: boolean = false;

  // Persistent Grid View
  isGridView = signal<boolean>(
    localStorage.getItem('users_view') === 'grid'
  );

  constructor(private injector: Injector) {
    effect(() => {
      localStorage.setItem('users_view', this.isGridView() ? 'grid' : 'list');
    }, { injector: this.injector });
  }

  // Mock Data
  users = [
    { 
      id: 1, 
      name: 'Muhammad Tanveer', 
      email: 'tanveer@agency.com', 
      cnic: '12345-1234567-1',
      phone: '+92 300 1111111',
      address: '123 Main Street, Lahore, Punjab',
      joinDate: '2024-01-15',
      role: 'Admin', 
      status: 'Active', 
      lastLogin: '2026-07-28 09:15 AM',
      emergencyContact: { name: 'Ayesha Tanveer', relation: 'Spouse', phone: '+92 300 9999999' },
      loginHistory: [
        { date: '2026-07-28 09:15 AM', ip: '192.168.1.10', device: 'Chrome / Windows' },
        { date: '2026-07-27 05:30 PM', ip: '192.168.1.10', device: 'Chrome / Windows' },
        { date: '2026-07-27 09:00 AM', ip: '192.168.1.15', device: 'Safari / MacOS' },
      ]
    },
    { 
      id: 2, 
      name: 'Sarah Khan', 
      email: 'sarah@agency.com',
      cnic: '12345-1234567-2',
      phone: '+92 300 2222222',
      address: '456 Clifton Road, Karachi, Sindh',
      joinDate: '2025-03-01',
      role: 'Manager', 
      status: 'Active', 
      lastLogin: '2026-07-27 04:30 PM',
      emergencyContact: { name: 'Ahmed Khan', relation: 'Brother', phone: '+92 300 8888888' },
      loginHistory: [
        { date: '2026-07-27 04:30 PM', ip: '192.168.1.25', device: 'Edge / Windows' },
      ]
    },
    { 
      id: 3, 
      name: 'Ali Raza', 
      email: 'ali@agency.com',
      cnic: '12345-1234567-3',
      phone: '+92 300 3333333',
      address: '789 Defence Road, Islamabad',
      joinDate: '2025-06-10',
      role: 'Staff', 
      status: 'Inactive', 
      lastLogin: '2026-06-15 10:00 AM',
      emergencyContact: null,
      loginHistory: []
    },
    { 
      id: 4, 
      name: 'Fatima Zafar', 
      email: 'fatima@agency.com',
      cnic: '12345-1234567-4',
      phone: '+92 300 4444444',
      address: '101 Gulberg, Lahore, Punjab',
      joinDate: '2026-02-20',
      role: 'Staff', 
      status: 'Active', 
      lastLogin: '2026-07-29 11:45 AM',
      emergencyContact: { name: 'Zafar Ahmed', relation: 'Father', phone: '+92 300 7777777' },
      loginHistory: [
        { date: '2026-07-29 11:45 AM', ip: '192.168.1.30', device: 'Firefox / Windows' },
      ]
    }
  ];

  // Form Model
  activeUser: {
    id: number | null;
    name: string;
    email: string;
    cnic: string;
    phone: string;
    address: string;
    joinDate: string;
    role: string;
    status: string;
    password?: string;
    emergencyName: string;
    emergencyPhone: string;
  } = {
    id: null,
    name: '',
    email: '',
    cnic: '',
    phone: '',
    address: '',
    joinDate: '',
    role: 'Staff',
    status: 'Active',
    password: '',
    emergencyName: '',
    emergencyPhone: ''
  };

  get filteredUsers() {
    if (!this.searchQuery) return this.users;
    return this.users.filter(u => 
      u.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      u.cnic?.includes(this.searchQuery)
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

  selectUser(user: any): void {
    this.selectedUser = user;
  }

  toggleUserStatus(user: any, event: any): void {
    user.status = event.target.checked ? 'Active' : 'Inactive';
  }

  resetPassword(user: any): void {
    alert(`Password reset link sent to ${user.email}`);
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.activeUser = { 
      id: null, 
      name: '', 
      email: '', 
      cnic: '', 
      phone: '', 
      address: '', 
      joinDate: '', 
      role: 'Staff', 
      status: 'Active', 
      password: '',
      emergencyName: '',
      emergencyPhone: ''
    };
    this.showModal = true;
  }

  openEditModal(): void {
    if (this.selectedUser) {
      this.isEditMode = true;
      this.activeUser = { 
        ...this.selectedUser, 
        password: '',
        emergencyName: this.selectedUser.emergencyContact?.name || '',
        emergencyPhone: this.selectedUser.emergencyContact?.phone || ''
      }; 
      this.showModal = true;
    }
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveUserData(): void {
    if (!this.activeUser.name || !this.activeUser.email || !this.activeUser.cnic || !this.activeUser.phone || (!this.isEditMode && !this.activeUser.password)) {
      alert('Please fill in all required fields.');
      return;
    }

    if (this.isEditMode) {
      const index = this.users.findIndex(u => u.id === this.activeUser.id);
      if (index > -1) {
        // ✅ FIX: We use 'as any' to bypass strict TypeScript typing on complex nested objects
        const emergencyPayload = this.activeUser.emergencyName && this.activeUser.emergencyPhone 
          ? { name: this.activeUser.emergencyName, phone: this.activeUser.emergencyPhone, relation: 'N/A' } 
          : null;

        this.users[index] = {
          ...this.users[index],
          ...this.activeUser,
          id: this.activeUser.id as number,
          emergencyContact: emergencyPayload as any // <-- Bypass TypeScript here safely
        };
        this.selectedUser = this.users[index];
      }
    } else {
      const newId = Math.max(...this.users.map(u => u.id), 0) + 1;
      this.users.push({
        id: newId,
        name: this.activeUser.name,
        email: this.activeUser.email,
        cnic: this.activeUser.cnic,
        phone: this.activeUser.phone,
        address: this.activeUser.address || '',
        joinDate: this.activeUser.joinDate || '',
        role: this.activeUser.role,
        status: 'Active', 
        lastLogin: '',
        emergencyContact: this.activeUser.emergencyName && this.activeUser.emergencyPhone 
          ? { name: this.activeUser.emergencyName, phone: this.activeUser.emergencyPhone, relation: 'N/A' } 
          : null,
        loginHistory: []
      });
    }
    this.closeModal();
  }
}