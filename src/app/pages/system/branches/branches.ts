import { Component, signal, effect, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-branches',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './branches.html',
  styleUrls: ['./branches.css']
})
export class Branches {
  searchQuery: string = '';
  selectedBranch: any = null;
  showModal: boolean = false;
  isEditMode: boolean = false;

  // Persistent Grid View
  isGridView = signal<boolean>(
    localStorage.getItem('branches_view') === 'grid'
  );

  constructor(private injector: Injector) {
    effect(() => {
      localStorage.setItem('branches_view', this.isGridView() ? 'grid' : 'list');
    }, { injector: this.injector });
  }

  // Mock Data (Added isHeadOffice field)
  branches = [
    {
      id: 1,
      code: 'LHR-AIR',
      name: 'Lahore Airport Office',
      city: 'Lahore',
      address: 'Terminal 1, Allama Iqbal International Airport, Lahore',
      phone: '+92 42 111 2222',
      manager: 'Ali Raza',
      status: 'Active',
      isHeadOffice: true // 🏆 This is the HQ
    },
    {
      id: 2,
      code: 'KHI-DOW',
      name: 'Karachi Downtown Branch',
      city: 'Karachi',
      address: '32-A, Clifton Road, Block 5, Karachi',
      phone: '+92 21 333 4444',
      manager: 'Sarah Khan',
      status: 'Active',
      isHeadOffice: false
    },
    {
      id: 3,
      code: 'ISL-F10',
      name: 'Islamabad F-10 Branch',
      city: 'Islamabad',
      address: 'Shop 4, F-10 Markaz, Islamabad',
      phone: '+92 51 555 6666',
      manager: '',
      status: 'Inactive',
      isHeadOffice: false
    }
  ];

  // Form Model (Added isHeadOffice)
  activeBranch: {
    id: number | null;
    code: string;
    name: string;
    city: string;
    address: string;
    phone: string;
    manager: string;
    status: string;
    isHeadOffice: boolean;
  } = {
    id: null,
    code: '',
    name: '',
    city: '',
    address: '',
    phone: '',
    manager: '',
    status: 'Active',
    isHeadOffice: false
  };

  get filteredBranches() {
    if (!this.searchQuery) return this.branches;
    return this.branches.filter(b => 
      b.code.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      b.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      b.city.toLowerCase().includes(this.searchQuery.toLowerCase())
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

  selectBranch(branch: any): void {
    this.selectedBranch = branch;
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.activeBranch = {
      id: null,
      code: '',
      name: '',
      city: '',
      address: '',
      phone: '',
      manager: '',
      status: 'Active',
      isHeadOffice: false
    };
    this.showModal = true;
  }

  openEditModal(): void {
    if (this.selectedBranch) {
      this.isEditMode = true;
      this.activeBranch = { ...this.selectedBranch };
      this.showModal = true;
    }
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveBranchData(): void {
    if (!this.activeBranch.code || !this.activeBranch.name || !this.activeBranch.city || !this.activeBranch.address) {
      alert('Please fill in all required fields.');
      return;
    }

    if (this.isEditMode) {
      const index = this.branches.findIndex(b => b.id === this.activeBranch.id);
      if (index > -1) {
        this.branches[index] = {
          ...this.branches[index],
          ...this.activeBranch,
          id: this.activeBranch.id as number
        };
        this.selectedBranch = this.branches[index];
      }
    } else {
      const newId = Math.max(...this.branches.map(b => b.id), 0) + 1;
      this.branches.push({
        id: newId,
        code: this.activeBranch.code,
        name: this.activeBranch.name,
        city: this.activeBranch.city,
        address: this.activeBranch.address,
        phone: this.activeBranch.phone || '',
        manager: this.activeBranch.manager || '',
        status: 'Active',
        isHeadOffice: this.activeBranch.isHeadOffice // ✅ New property saved
      });
    }
    this.closeModal();
  }
}