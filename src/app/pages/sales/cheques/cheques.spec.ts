import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  selectedCheque: Cheque | null = null;
  
  showCreateModal: boolean = false;
  newCheque: Omit<Cheque, 'id'> = {
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

  constructor(private chequesService: ChequesService) {}

  ngOnInit(): void {
    this.loadCheques();
  }

  loadCheques() {
    this.chequesService.getCheques().subscribe((data: Cheque[]) => {
      this.cheques = data;
      if (this.cheques.length > 0) {
        const exists = this.cheques.find(c => c.id === this.selectedCheque?.id);
        if (!exists) {
          this.selectedCheque = { ...this.cheques[0] };
        }
      } else {
        this.selectedCheque = null;
      }
    });
  }

  get filteredCheques(): Cheque[] {
    return this.cheques.filter(c => {
      const matchesSearch = !this.searchQuery || 
        c.chequeNumber.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        c.clientName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        c.bankName.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      const matchesStatus = this.statusFilter === 'All' || c.status === this.statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }

  get paginatedCheques(): Cheque[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredCheques.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredCheques.length / this.pageSize) || 1;
  }

  selectCheque(cheque: Cheque) {
    this.selectedCheque = { ...cheque };
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  openCreateModal() {
    this.newCheque = { 
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
    this.showCreateModal = true;
  }

  closeCreateModal() {
    this.showCreateModal = false;
  }

  saveNewCheque() {
    this.chequesService.addCheque(this.newCheque).subscribe(() => {
      this.loadCheques();
      this.closeCreateModal();
    });
  }

  saveChanges() {
    if (this.selectedCheque) {
      this.chequesService.updateCheque(this.selectedCheque).subscribe(() => {
        this.loadCheques();
      });
    }
  }

  deleteCheque() {
    if (this.selectedCheque && confirm(`Are you sure you want to delete cheque ${this.selectedCheque.chequeNumber}?`)) {
      this.chequesService.deleteCheque(this.selectedCheque.id).subscribe(() => {
        this.selectedCheque = null;
        this.loadCheques();
      });
    }
  }
}