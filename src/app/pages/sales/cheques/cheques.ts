import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Cheque } from '../../../models/cheques.model';
import { ChequesService } from '../../../shared/cheques.service';

@Component({
  selector: 'app-cheques',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cheques.html',
  styleUrls: ['./cheques.css']
})
export class Cheques implements OnInit {
  cheques: Cheque[] = [];
  searchQuery: string = '';
  statusFilter: string = 'All';
  
  // Filter for the segmented control
  chequeTypeFilter: string = 'All';
  
  selectedCheque: Cheque | null = null;
  
  showModal: boolean = false;
  isEditMode: boolean = false;
  
  activeCheque: Omit<Cheque, 'id'> | Cheque = {
    chequeNumber: '',
    chequeDate: '',
    clientName: '',
    bankName: '',
    amount: 0,
    status: 'In Hand',
    remarks: '',
    chequeType: 'Incoming',
    payeeName: '',
    depositDate: '',
    linkedInvoice: ''
  };

  currentPage: number = 1;
  pageSize: number = 5;

  constructor(
    private chequesService: ChequesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCheques();
  }

  loadCheques(): void {
    this.chequesService.getCheques().subscribe((data: Cheque[]) => {
      this.cheques = data;
      
      // Auto-select the first item if there are results and nothing is currently selected
      if (this.cheques.length > 0) {
        const exists = this.cheques.find((c: Cheque) => c.id === this.selectedCheque?.id);
        if (!exists) {
          this.selectedCheque = { ...this.cheques[0] };
        }
      } else {
        this.selectedCheque = null;
      }
    });
  }

  get filteredCheques(): Cheque[] {
    return this.cheques.filter((c: Cheque) => {
      const matchesSearch = !this.searchQuery || 
        c.chequeNumber.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        c.clientName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        c.bankName.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      const matchesStatus = this.statusFilter === 'All' || c.status === this.statusFilter;
      
      // Type Filter Logic
      const matchesType = this.chequeTypeFilter === 'All' || c.chequeType === this.chequeTypeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }

  get paginatedCheques(): Cheque[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredCheques.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredCheques.length / this.pageSize) || 1;
  }

  getInitials(name: string): string {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }

  getPageNumbers(): number[] {
    const total = this.totalPages;
    const current = this.currentPage;
    const pages: number[] = [];
    
    if (total <= 5) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      if (current <= 3) {
        for (let i = 1; i <= 5; i++) pages.push(i);
      } else if (current >= total - 2) {
        for (let i = total - 4; i <= total; i++) pages.push(i);
      } else {
        for (let i = current - 2; i <= current + 2; i++) pages.push(i);
      }
    }
    return pages;
  }

  selectCheque(cheque: Cheque): void {
    this.selectedCheque = { ...cheque };
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

  navigateToInvoice(invoiceNo?: string): void {
    if (!invoiceNo) return;
    this.router.navigate(['/sales/customer-invoice'], { queryParams: { search: invoiceNo } });
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.activeCheque = { 
      chequeNumber: '', 
      chequeDate: '', 
      clientName: '', 
      bankName: '', 
      amount: 0, 
      status: 'In Hand', 
      remarks: '',
      chequeType: 'Incoming',
      payeeName: '',
      depositDate: '',
      linkedInvoice: ''
    };
    this.showModal = true;
  }

  openEditModal(): void {
    if (this.selectedCheque) {
      this.isEditMode = true;
      this.activeCheque = { ...this.selectedCheque };
      this.showModal = true;
    }
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveChequeData(): void {
    if (this.isEditMode) {
      // Update existing
      this.chequesService.updateCheque(this.activeCheque as Cheque).subscribe({
        next: (updated: Cheque) => {
          this.selectedCheque = { ...updated };
          this.loadCheques();
          this.closeModal();
        },
        error: (err) => console.error('Update failed', err)
      });
    } else {
      // Create new
      this.chequesService.addCheque(this.activeCheque).subscribe({
        next: (created: Cheque) => {
          this.loadCheques();
          this.closeModal();
        },
        error: (err) => console.error('Creation failed', err)
      });
    }
  }

  deleteCheque(): void {
    if (this.selectedCheque && confirm(`Are you sure you want to delete cheque ${this.selectedCheque.chequeNumber}?`)) {
      this.chequesService.deleteCheque(this.selectedCheque.id).subscribe({
        next: (success: boolean) => {
          this.selectedCheque = null;
          this.loadCheques();
        },
        error: (err) => console.error('Delete failed', err)
      });
    }
  }
}