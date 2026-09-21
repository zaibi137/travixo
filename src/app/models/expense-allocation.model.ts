// src/app/models/expense-allocation.model.ts

export interface ExpenseAllocation {
  id: number;
  allocationNumber: string;
  expenseDate: Date;
  expenseType: string;
  expenseCategory: string;
  description: string;
  amount: number;
  allocationType: string;
  allocatedToId: number;
  allocatedToName: string;
  department: string;
  status: string;
  paymentMethod: string;
  referenceNumber: string | null;
  notes: string | null;
  purchaseId: number | null;
  invoiceId: number | null;
  clientId: number | null;
  vendorId: number | null;
  createdBy: number;
  createdAt: Date;
  updatedAt: Date;
}

export const ExpenseType = {
  DIRECT: 'Direct',
  INDIRECT: 'Indirect'
} as const;

export const AllocationType = {
  CLIENT: 'Client',
  DEPARTMENT: 'Department',
  BRANCH: 'Branch',
  PROJECT: 'Project'
} as const;

export const AllocationStatus = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected'
} as const;

export const Departments = {
  SALES: 'Sales',
  OPERATIONS: 'Operations',
  MARKETING: 'Marketing',
  ADMIN: 'Administration',
  FINANCE: 'Finance',
  IT: 'Information Technology',
  HR: 'Human Resources'
} as const;

export const DirectExpenseCategories = [
  'Flight Tickets',
  'Hotel Accommodation',
  'Tour Packages',
  'Visa Processing',
  'Transportation',
  'Insurance',
  'Meals & Dining',
  'Activities & Excursions',
  'Car Rental',
  'Cruise Booking'
] as const;

export const IndirectExpenseCategories = [
  'Employee Salaries',
  'Office Rent',
  'Utilities',
  'Internet & Phone',
  'Office Stationery',
  'Marketing & Advertising',
  'Software Licenses',
  'Office Maintenance',
  'Employee Travel',
  'Employee Training',
  'Business Insurance',
  'Legal & Professional Fees',
  'Bank Charges',
  'Office Equipment'
] as const;

export type ExpenseTypeType = typeof ExpenseType[keyof typeof ExpenseType];
export type AllocationTypeType = typeof AllocationType[keyof typeof AllocationType];
export type AllocationStatusType = typeof AllocationStatus[keyof typeof AllocationStatus];
export type DepartmentType = typeof Departments[keyof typeof Departments];
export type DirectExpenseCategoryType = typeof DirectExpenseCategories[number];
export type IndirectExpenseCategoryType = typeof IndirectExpenseCategories[number];