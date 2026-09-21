export interface ApiField {
  key: string;
  label: string;
  type: 'string' | 'number' | 'integer' | 'date' | 'boolean';
}

export interface TableColumn {
  key: string;
  label: string;
}

export interface ApiEndpointConfig {
  area: string;
  schema: string;
  listUrl: string;
  saveUrl?: string;
  notes: string;
}

export interface ScreenConfig {
  route: string;
  title: string;
  section: string;
  icon: string;
  api?: ApiEndpointConfig;
  fields: ApiField[];
  columns: TableColumn[];
  previewRows: Record<string, string | number>[];
  missingReason?: string;
}

export const API_BASE_URL = 'https://travelapi.siddev.online';

export const CUSTOMER_FIELDS: ApiField[] = [
  { key: 'clicod', label: 'Client Code', type: 'string' },
  { key: 'clinam', label: 'Client Name', type: 'string' },
  { key: 'clityp', label: 'Client Type', type: 'string' },
  { key: 'b2BFLG', label: 'B2B Flag', type: 'integer' },
  { key: 'b2CFLG', label: 'B2C Flag', type: 'integer' },
  { key: 'ptykey', label: 'Party Key', type: 'integer' },
  { key: 'mobnum', label: 'Mobile No', type: 'string' },
  { key: 'whtnum', label: 'WhatsApp No', type: 'string' },
  { key: 'emladr', label: 'Email Address', type: 'string' },
  { key: 'ntlnum', label: 'National No', type: 'string' },
  { key: 'pasnum', label: 'Passport No', type: 'string' },
  { key: 'nation', label: 'Nationality', type: 'string' },
  { key: 'dobdat', label: 'Date of Birth', type: 'date' },
  { key: 'gender', label: 'Gender', type: 'string' },
  { key: 'address', label: 'Address', type: 'string' },
  { key: 'cityid', label: 'City ID', type: 'integer' },
  { key: 'cntyid', label: 'Country ID', type: 'integer' },
  { key: 'comnam', label: 'Company Name', type: 'string' },
  { key: 'agtcod', label: 'Agent Code', type: 'string' },
  { key: 'crdlmt', label: 'Credit Limit', type: 'number' },
  { key: 'paytrm', label: 'Payment Terms', type: 'integer' },
  { key: 'depamt', label: 'Deposit Amount', type: 'number' },
  { key: 'crdsts', label: 'Credit Status', type: 'integer' },
  { key: 'status', label: 'Status', type: 'integer' }
];

export const SUPPLIER_FIELDS: ApiField[] = [
  { key: 'ptycod', label: 'Supplier Code', type: 'string' },
  { key: 'ptynam', label: 'Supplier Name', type: 'string' },
  { key: 'brnkey', label: 'Branch Key', type: 'integer' },
  { key: 'mobnum', label: 'Mobile No', type: 'string' },
  { key: 'emladr', label: 'Email Address', type: 'string' },
  { key: 'address', label: 'Address', type: 'string' },
  { key: 'balamt', label: 'Balance Amount', type: 'number' },
  { key: 'status', label: 'Status', type: 'integer' },
  { key: 'remark', label: 'Remark', type: 'string' }
];

export const VENDOR_PAYMENT_FIELDS: ApiField[] = [
  { key: 'paycod', label: 'Payment Code', type: 'string' },
  { key: 'brnkey', label: 'Branch Key', type: 'integer' },
  { key: 'docnum', label: 'Voucher No', type: 'string' },
  { key: 'ptykey', label: 'Vendor / Party Key', type: 'integer' },
  { key: 'purkey', label: 'Purchase Key', type: 'integer' },
  { key: 'paydat', label: 'Payment Date', type: 'date' },
  { key: 'paymod', label: 'Payment Mode', type: 'string' },
  { key: 'payamt', label: 'Amount Paid', type: 'number' },
  { key: 'chqamt', label: 'Cheque Amount', type: 'number' },
  { key: 'chkdat', label: 'Cheque Date', type: 'date' },
  { key: 'descrp', label: 'Bank Name / Description', type: 'string' },
  { key: 'status', label: 'Status', type: 'integer' },
  { key: 'remark', label: 'Remarks', type: 'string' }
];

export const VENDOR_PURCHASE_FIELDS: ApiField[] = [
  { key: 'purcod', label: 'Purchase Code', type: 'string' },
  { key: 'brnkey', label: 'Branch Key', type: 'integer' },
  { key: 'docnum', label: 'Document No', type: 'string' },
  { key: 'ptykey', label: 'Vendor / Party Key', type: 'integer' },
  { key: 'invkey', label: 'Invoice Key', type: 'integer' },
  { key: 'inlkey', label: 'Invoice Line Key', type: 'integer' },
  { key: 'purdat', label: 'Purchase Date', type: 'date' },
  { key: 'srvtyp', label: 'Service Type', type: 'string' },
  { key: 'owntyp', label: 'Owner Type', type: 'string' },
  { key: 'puramt', label: 'Purchase Amount', type: 'number' },
  { key: 'payamt', label: 'Amount Paid', type: 'number' },
  { key: 'balamt', label: 'Balance Amount', type: 'number' },
  { key: 'descrp', label: 'Description', type: 'string' },
  { key: 'status', label: 'Status', type: 'integer' },
  { key: 'remark', label: 'Remark', type: 'string' }
];

export const INVOICE_FIELDS: ApiField[] = [
  { key: 'invnum', label: 'Invoice No', type: 'string' },
  { key: 'invdat', label: 'Invoice Date', type: 'date' },
  { key: 'ptykey', label: 'Customer Key / ID', type: 'integer' },
  { key: 'custname', label: 'Customer Name', type: 'string' },
  { key: 'srvtyp', label: 'Service Type', type: 'string' },
  { key: 'amount', label: 'Total Amount', type: 'number' },
  { key: 'status', label: 'Payment Status', type: 'string' },
  { key: 'remark', label: 'Remarks / Booking Ref', type: 'string' }
];

export const CUSTOMER_RECEIPT_FIELDS: ApiField[] = [
  { key: 'rcptnum', label: 'Receipt No', type: 'string' },
  { key: 'rcptdat', label: 'Receipt Date', type: 'date' },
  { key: 'ptykey', label: 'Customer Key / ID', type: 'integer' },
  { key: 'custname', label: 'Customer Name', type: 'string' },
  { key: 'amount', label: 'Amount', type: 'number' },
  { key: 'paymod', label: 'Payment Mode', type: 'string' },
  { key: 'status', label: 'Status', type: 'string' },
  { key: 'remark', label: 'Remarks / Ref', type: 'string' }
];

export const EXPENSE_ALLOCATION_FIELDS: ApiField[] = [
  { key: 'expcod', label: 'Expense Code', type: 'string' },
  { key: 'expdat', label: 'Allocation Date', type: 'date' },
  { key: 'brnkey', label: 'Branch Key', type: 'integer' },
  { key: 'dept_key', label: 'Department / Desk', type: 'string' },
  { key: 'expcat', label: 'Expense Category', type: 'string' },
  { key: 'expamt', label: 'Amount Allocated', type: 'number' },
  { key: 'paymod', label: 'Payment Mode', type: 'string' },
  { key: 'remark', label: 'Description / Remarks', type: 'string' }
];

export const CHEQUE_FIELDS: ApiField[] = [
  { key: 'chqnum', label: 'Cheque No', type: 'string' },
  { key: 'chqdat', label: 'Cheque Date', type: 'date' },
  { key: 'banknam', label: 'Bank Name', type: 'string' },
  { key: 'ptykey', label: 'Party Key', type: 'integer' },
  { key: 'custname', label: 'Party / Customer Name', type: 'string' },
  { key: 'amount', label: 'Amount', type: 'number' },
  { key: 'status', label: 'Status', type: 'integer' },
  { key: 'remark', label: 'Remarks', type: 'string' }
];

export const BRANCH_FIELDS: ApiField[] = [
  { key: 'brncod', label: 'Branch Code', type: 'string' },
  { key: 'brnnam', label: 'Branch Name', type: 'string' },
  { key: 'address', label: 'Address', type: 'string' },
  { key: 'phone', label: 'Phone No', type: 'string' },
  { key: 'status', label: 'Status', type: 'integer' },
  { key: 'remark', label: 'Remark', type: 'string' }
];

export const TRANSACTION_FIELDS: ApiField[] = [
  { key: 'opertn', label: 'Operation', type: 'integer' },
  { key: 'pagsiz', label: 'Page Size', type: 'integer' },
  { key: 'pagnum', label: 'Page Number', type: 'integer' },
  { key: 'search', label: 'Search', type: 'string' },
  { key: 'trxkey', label: 'Transaction Key', type: 'integer' },
  { key: 'trxnum', label: 'Transaction No', type: 'string' },
  { key: 'trxdat', label: 'Transaction Date', type: 'date' },
  { key: 'cusnam', label: 'Customer Name', type: 'string' },
  { key: 'mobnum', label: 'Mobile No', type: 'string' },
  { key: 'emladr', label: 'Email Address', type: 'string' },
  { key: 'srvtyp', label: 'Service Type', type: 'string' },
  { key: 'destin', label: 'Destination', type: 'string' },
  { key: 'pnrnum', label: 'PNR No', type: 'string' },
  { key: 'amount', label: 'Amount', type: 'number' },
  { key: 'curcod', label: 'Currency Code', type: 'string' },
  { key: 'status', label: 'Status', type: 'integer' },
  { key: 'remarks', label: 'Remarks', type: 'string' },
  { key: 'crtdat', label: 'Created Date', type: 'date' },
  { key: 'crtusr', label: 'Created User', type: 'string' },
  { key: 'upddat', label: 'Updated Date', type: 'date' },
  { key: 'updusr', label: 'Updated User', type: 'string' },
  { key: 'delflg', label: 'Delete Flag', type: 'integer' },
  { key: 'deldat', label: 'Deleted Date', type: 'date' },
  { key: 'delusr', label: 'Deleted User', type: 'string' }
];

export const TICKET_STOCK_FIELDS: ApiField[] = [
  { key: 'opertn', label: 'Operation', type: 'integer' },
  { key: 'pagsiz', label: 'Page Size', type: 'integer' },
  { key: 'pagnum', label: 'Page Number', type: 'integer' },
  { key: 'search', label: 'Search', type: 'string' },
  { key: 'tshkey', label: 'Stock Header Key', type: 'integer' },
  { key: 'tshcod', label: 'Stock Code', type: 'string' },
  { key: 'ptykey', label: 'Party Key', type: 'integer' },
  { key: 'airkey', label: 'Airline Key', type: 'integer' },
  { key: 'brnkey', label: 'Branch Key', type: 'integer' },
  { key: 'stktyp', label: 'Stock Type', type: 'string' },
  { key: 'purdat', label: 'Purchase Date', type: 'date' },
  { key: 'stadat', label: 'Start Date', type: 'date' },
  { key: 'enddat', label: 'End Date', type: 'date' },
  { key: 'curkey', label: 'Currency Key', type: 'integer' },
  { key: 'excrat', label: 'Exchange Rate', type: 'number' },
  { key: 'totqty', label: 'Total Qty', type: 'integer' },
  { key: 'avlqty', label: 'Available Qty', type: 'integer' },
  { key: 'resqty', label: 'Reserved Qty', type: 'integer' },
  { key: 'issqty', label: 'Issued Qty', type: 'integer' },
  { key: 'voiqty', label: 'Void Qty', type: 'integer' },
  { key: 'rfdqty', label: 'Refund Qty', type: 'integer' },
  { key: 'puramt', label: 'Purchase Amount', type: 'number' },
  { key: 'unitct', label: 'Unit Cost', type: 'number' },
  { key: 'cstmth', label: 'Cost Method', type: 'string' },
  { key: 'status', label: 'Status', type: 'integer' },
  { key: 'remark', label: 'Remark', type: 'string' },
  { key: 'tsdkey', label: 'Stock Detail Key', type: 'integer' },
  { key: 'orgkey', label: 'Origin Key', type: 'integer' },
  { key: 'dstkey', label: 'Destination Key', type: 'integer' },
  { key: 'depdat', label: 'Departure Date', type: 'date' },
  { key: 'retdat', label: 'Return Date', type: 'date' },
  { key: 'fltnum', label: 'Flight No', type: 'string' },
  { key: 'cabcls', label: 'Cabin Class', type: 'string' },
  { key: 'bkgcls', label: 'Booking Class', type: 'string' },
  { key: 'farbas', label: 'Fare Basis', type: 'string' },
  { key: 'pnrnum', label: 'PNR No', type: 'string' },
  { key: 'tktnum', label: 'Ticket No', type: 'string' },
  { key: 'paskey', label: 'Passenger Key', type: 'integer' },
  { key: 'stkqty', label: 'Stock Qty', type: 'integer' },
  { key: 'salrat', label: 'Sale Rate', type: 'number' },
  { key: 'tsmkey', label: 'Stock Movement Key', type: 'integer' },
  { key: 'movtyp', label: 'Movement Type', type: 'string' },
  { key: 'movdat', label: 'Movement Date', type: 'date' },
  { key: 'bkgkey', label: 'Booking Key', type: 'integer' },
  { key: 'tktkey', label: 'Ticket Key', type: 'integer' },
  { key: 'purkey', label: 'Purchase Key', type: 'integer' },
  { key: 'rfdkey', label: 'Refund Key', type: 'integer' },
  { key: 'frmbrn', label: 'From Branch', type: 'integer' },
  { key: 'tobrn', label: 'To Branch', type: 'integer' },
  { key: 'inqty', label: 'In Qty', type: 'integer' },
  { key: 'outqty', label: 'Out Qty', type: 'integer' },
  { key: 'totcst', label: 'Total Cost', type: 'number' },
  { key: 'avlcst', label: 'Available Cost', type: 'number' },
  { key: 'crtdat', label: 'Created Date', type: 'date' },
  { key: 'crtusr', label: 'Created User', type: 'string' },
  { key: 'upddat', label: 'Updated Date', type: 'date' },
  { key: 'updusr', label: 'Updated User', type: 'string' },
  { key: 'delflg', label: 'Delete Flag', type: 'integer' },
  { key: 'deldat', label: 'Deleted Date', type: 'date' },
  { key: 'delusr', label: 'Deleted User', type: 'string' }
];

const customerColumns: TableColumn[] = [
  { key: 'clicod', label: 'Client Code' },
  { key: 'clinam', label: 'Client Name' },
  { key: 'clityp', label: 'Type' },
  { key: 'mobnum', label: 'Mobile' },
  { key: 'emladr', label: 'Email' },
  { key: 'crdlmt', label: 'Credit Limit' },
  { key: 'status', label: 'Status' }
];

const supplierColumns: TableColumn[] = [
  { key: 'ptycod', label: 'Code' },
  { key: 'ptynam', label: 'Supplier Name' },
  { key: 'mobnum', label: 'Mobile' },
  { key: 'emladr', label: 'Email' },
  { key: 'balamt', label: 'Balance' },
  { key: 'status', label: 'Status' }
];

const vendorPaymentColumns: TableColumn[] = [
  { key: 'paycod', label: 'Payment Code' },
  { key: 'docnum', label: 'Voucher No' },
  { key: 'paydat', label: 'Payment Date' },
  { key: 'paymod', label: 'Payment Mode' },
  { key: 'payamt', label: 'Amount Paid' },
  { key: 'status', label: 'Status' }
];

const vendorPurchaseColumns: TableColumn[] = [
  { key: 'purcod', label: 'Purchase Code' },
  { key: 'docnum', label: 'Document No' },
  { key: 'purdat', label: 'Purchase Date' },
  { key: 'srvtyp', label: 'Service Type' },
  { key: 'puramt', label: 'Purchase Amount' },
  { key: 'balamt', label: 'Balance' },
  { key: 'status', label: 'Status' }
];

const invoiceColumns: TableColumn[] = [
  { key: 'invnum', label: 'Invoice #' },
  { key: 'invdat', label: 'Date' },
  { key: 'custname', label: 'Customer' },
  { key: 'srvtyp', label: 'Service' },
  { key: 'amount', label: 'Amount' },
  { key: 'status', label: 'Status' }
];

const customerReceiptColumns: TableColumn[] = [
  { key: 'rcptnum', label: 'Receipt #' },
  { key: 'rcptdat', label: 'Date' },
  { key: 'custname', label: 'Customer' },
  { key: 'paymod', label: 'Mode' },
  { key: 'amount', label: 'Amount' },
  { key: 'status', label: 'Status' }
];

const expenseAllocationColumns: TableColumn[] = [
  { key: 'expcod', label: 'Voucher #' },
  { key: 'expdat', label: 'Date' },
  { key: 'dept_key', label: 'Department' },
  { key: 'expcat', label: 'Category' },
  { key: 'expamt', label: 'Amount' },
  { key: 'paymod', label: 'Paid Via' }
];

const chequeColumns: TableColumn[] = [
  { key: 'chqnum', label: 'Cheque #' },
  { key: 'chqdat', label: 'Date' },
  { key: 'banknam', label: 'Bank Name' },
  { key: 'custname', label: 'Party Name' },
  { key: 'amount', label: 'Amount' },
  { key: 'status', label: 'Status' }
];

const branchColumns: TableColumn[] = [
  { key: 'brncod', label: 'Branch Code' },
  { key: 'brnnam', label: 'Branch Name' },
  { key: 'address', label: 'Address' },
  { key: 'phone', label: 'Phone' },
  { key: 'status', label: 'Status' }
];

const transactionColumns: TableColumn[] = [
  { key: 'trxnum', label: 'Transaction No' },
  { key: 'trxdat', label: 'Date' },
  { key: 'cusnam', label: 'Customer' },
  { key: 'srvtyp', label: 'Service' },
  { key: 'destin', label: 'Destination' },
  { key: 'pnrnum', label: 'PNR' },
  { key: 'amount', label: 'Amount' },
  { key: 'status', label: 'Status' }
];

const ticketStockColumns: TableColumn[] = [
  { key: 'tshcod', label: 'Stock Code' },
  { key: 'stktyp', label: 'Type' },
  { key: 'airkey', label: 'Airline' },
  { key: 'brnkey', label: 'Branch' },
  { key: 'totqty', label: 'Total' },
  { key: 'avlqty', label: 'Available' },
  { key: 'resqty', label: 'Reserved' },
  { key: 'issqty', label: 'Issued' },
  { key: 'status', label: 'Status' }
];

const customerPreviewRows = [
  { clicod: 'C-1001', clinam: 'ABC TRAVELS', clityp: 'B2B', mobnum: '+92 300 1111111', emladr: 'ops@abctravels.pk', crdlmt: 'PKR 1,200,000', status: 'Active' },
  { clicod: 'C-1002', clinam: 'GLOBAL TOURS', clityp: 'B2B', mobnum: '+92 300 2222222', emladr: 'accounts@globaltours.pk', crdlmt: 'PKR 850,000', status: 'Active' },
  { clicod: 'C-1003', clinam: 'WALK-IN CUSTOMER', clityp: 'B2C', mobnum: '+92 300 3333333', emladr: 'customer@example.com', crdlmt: 'PKR 0', status: 'Active' }
];

const supplierPreviewRows = [
  { ptycod: 'SUP-1001', ptynam: 'EMIRATES GSA', mobnum: '+92 300 9999999', emladr: 'gsa@emirates.com', balamt: 0, status: 1 },
  { ptycod: 'SUP-1002', ptynam: 'GULF AIR PSA', mobnum: '+92 300 8888888', emladr: 'psa@gulfair.com', balamt: 50000, status: 1 }
];

const vendorPaymentPreviewRows = [
  {
    paycod: 'PAY-2026-001',
    brnkey: 1,
    docnum: 'VPV-2026-001',
    ptykey: 1001,
    purkey: 501,
    paydat: '2026-07-22',
    paymod: 'Bank Transfer',
    payamt: 150000,
    chqamt: 0,
    chkdat: '2026-07-22',
    descrp: 'HBL Bank - Corporate Account',
    status: 1,
    remark: 'Cleared via online wire transfer'
  }
];

const vendorPurchasePreviewRows = [
  { purcod: 'PUR-1001', docnum: '4567', purdat: '2026-07-15', srvtyp: 'Air Ticket', puramt: 75000, balamt: 0, status: 1 },
  { purcod: 'PUR-1002', docnum: '4568', purdat: '2026-07-18', srvtyp: 'Hotel Booking', puramt: 42000, balamt: 15000, status: 1 }
];

const invoicePreviewRows = [
  { invnum: 'INV-2026-0001', invdat: '2026-07-20', ptykey: 101, custname: 'ABC Travels & Tours', srvtyp: 'International Air Ticket (Emirates)', amount: 345000, status: 'Unpaid', remark: 'PNR: EMR892 - Lahore to Dubai' }
];

const customerReceiptPreviewRows = [
  { rcptnum: 'RCP-2026-0001', rcptdat: '2026-07-22', ptykey: 101, custname: 'ABC Travels & Tours', amount: 150000, paymod: 'Bank Transfer', status: 'Cleared', remark: 'Advance for Emirates PNR' },
  { rcptnum: 'RCP-2026-0002', rcptdat: '2026-07-23', ptykey: 102, custname: 'Global Explorers Pvt Ltd', amount: 250000, paymod: 'Cash', status: 'Completed', remark: 'Cash receipt for visa processing' }
];

const expenseAllocationPreviewRows = [
  { expcod: 'EXP-2405-001', expdat: '2026-05-02', dept_key: 'Ticketing Desk', expcat: 'GDS Subscription (Amadeus)', expamt: 45000, paymod: 'Bank Transfer', remark: 'May Terminal Access Fees' }
];

const chequePreviewRows = [
  { chqnum: 'CHQ-985621', chqdat: '2026-07-25', banknam: 'Meezan Bank', custname: 'ABC Travels & Tours', amount: 125000, status: 1, remark: 'Pending clearance' }
];

const branchPreviewRows = [
  { brncod: 'BRN-001', brnnam: 'Head Office - Lahore', address: 'Main Boulevard, Gulberg III, Lahore', phone: '+92 42 111 222 333', status: 1, remark: 'Primary operations branch' }
];

const transactionPreviewRows = [
  { trxnum: 'TRV2405310001', trxdat: '31-May-2024', cusnam: 'ABC TRAVELS', srvtyp: 'Air Ticket', destin: 'DXB', pnrnum: 'PNR4821', amount: 'PKR 125,450', status: 'Ticketed' }
];

const ticketStockPreviewRows = [
  { tshcod: 'TST-2405-001', stktyp: 'Air Ticket', airkey: 12, brnkey: 1, totqty: 500, avlqty: 325, resqty: 45, issqty: 130, status: 'Active' }
];

const apiBackedScreens: ScreenConfig[] = [
  {
    route: '/dashboard',
    title: 'Dashboard',
    section: 'Overview',
    icon: 'fa-solid fa-chart-pie',
    api: {
      area: 'Dashboard',
      schema: 'DashboardModel',
      listUrl: '/api/v1/dashboard',
      notes: 'Dashboard overview endpoint from Swagger.'
    },
    fields: [],
    columns: [],
    previewRows: []
  },
  {
    route: '/masters/customers',
    title: 'Customers',
    section: 'Masters',
    icon: 'fa-solid fa-users',
    api: {
      area: 'TRVCLIENT',
      schema: 'CreateClientRequest',
      listUrl: '/api/v1/customers',
      saveUrl: '/api/v1/customers',
      notes: 'Swagger exposes GET/POST/GET by id/PUT/DELETE for customers.'
    },
    fields: CUSTOMER_FIELDS,
    columns: customerColumns,
    previewRows: customerPreviewRows
  },
  {
    route: '/masters/suppliers',
    title: 'Suppliers (GSA/PSA)',
    section: 'Masters',
    icon: 'fa-solid fa-people-carry-box',
    api: {
      area: 'TRVCLIENT',
      schema: 'CreateClientRequest',
      listUrl: '/api/v1/vendors',
      saveUrl: '/api/v1/vendors',
      notes: 'Vendors / Suppliers endpoint.'
    },
    fields: SUPPLIER_FIELDS,
    columns: supplierColumns,
    previewRows: supplierPreviewRows
  },
  {
    route: '/finance/supplier-payments',
    title: 'Supplier Payments',
    section: 'Finance',
    icon: 'fa-solid fa-hand-holding-dollar',
    api: {
      area: 'TRVCLIENT',
      schema: 'CreateClientRequest',
      listUrl: '/api/v1/payments',
      saveUrl: '/api/v1/payments',
      notes: 'Vendor Payments management endpoint.'
    },
    fields: VENDOR_PAYMENT_FIELDS,
    columns: vendorPaymentColumns,
    previewRows: vendorPaymentPreviewRows
  },
  {
    route: '/purchase/vendor-purchase',
    title: 'Vendor Purchase',
    section: 'Purchase',
    icon: 'fa-solid fa-cart-shopping',
    api: {
      area: 'TRVCLIENT',
      schema: 'CreateClientRequest',
      listUrl: '/api/v1/purchases',
      saveUrl: '/api/v1/purchases',
      notes: 'Vendor Purchase management endpoint.'
    },
    fields: VENDOR_PURCHASE_FIELDS,
    columns: vendorPurchaseColumns,
    previewRows: vendorPurchasePreviewRows
  },
  {
    route: '/sales/customer-invoice',
    title: 'Customer Invoice',
    section: 'Sales',
    icon: 'fa-solid fa-file-invoice-dollar',
    api: {
      area: 'Sales & Invoicing',
      schema: 'POST /api/v1/invoices',
      listUrl: '/api/v1/invoices',
      saveUrl: '/api/v1/invoices',
      notes: 'Customer Invoicing endpoint from Swagger.'
    },
    fields: INVOICE_FIELDS,
    columns: invoiceColumns,
    previewRows: invoicePreviewRows
  },
  {
    route: '/sales/customer-receipt',
    title: 'Customer Receipt',
    section: 'Sales',
    icon: 'fa-solid fa-receipt',
    api: {
      area: 'Sales & Receipts',
      schema: 'POST /api/v1/receipts',
      listUrl: '/api/v1/receipts',
      saveUrl: '/api/v1/receipts',
      notes: 'Customer Receipt management endpoint from Swagger.'
    },
    fields: CUSTOMER_RECEIPT_FIELDS,
    columns: customerReceiptColumns,
    previewRows: customerReceiptPreviewRows
  },
  {
    route: '/sales/cheques',
    title: 'Cheques',
    section: 'Sales',
    icon: 'fa-solid fa-money-check',
    api: {
      area: 'Cheque',
      schema: 'ChequeModel',
      listUrl: '/api/v1/cheques',
      saveUrl: '/api/v1/cheques',
      notes: 'Cheque management endpoints from Swagger.'
    },
    fields: CHEQUE_FIELDS,
    columns: chequeColumns,
    previewRows: chequePreviewRows
  },
  {
    route: '/purchase/expense-allocation',
    title: 'Expense Allocation',
    section: 'Purchase & Expenses',
    icon: 'fa-solid fa-chart-pie',
    api: {
      area: 'Expense Allocations',
      schema: 'ExpenseAllocationModel',
      listUrl: '/api/v1/expense-allocations',
      saveUrl: '/api/v1/expense-allocations',
      notes: 'Expense Allocation management endpoints from Swagger.'
    },
    fields: EXPENSE_ALLOCATION_FIELDS,
    columns: expenseAllocationColumns,
    previewRows: expenseAllocationPreviewRows
  },
  {
    route: '/system/branches',
    title: 'Branches',
    section: 'System',
    icon: 'fa-solid fa-code-branch',
    api: {
      area: 'Branches',
      schema: 'BranchModel',
      listUrl: '/api/v1/branches',
      saveUrl: '/api/v1/branches',
      notes: 'Branch management endpoints from Swagger.'
    },
    fields: BRANCH_FIELDS,
    columns: branchColumns,
    previewRows: branchPreviewRows
  },
  {
    route: '/masters/airlines',
    title: 'Airlines',
    section: 'Masters',
    icon: 'fa-solid fa-plane',
    api: {
      area: 'TRVCLIENT',
      schema: 'TRVTRXModel',
      listUrl: '/api/v1/airlines',
      saveUrl: '/api/v1/airlines',
      notes: 'Airlines management'
    },
    fields: [],
    columns: [
      { key: 'name', label: 'Airline Name' },
      { key: 'code', label: 'Airline Code' }
    ],
    previewRows: []
  },
  ...([
    ['/sales/bookings', 'Bookings', 'fa-solid fa-calendar-check'],
    ['/sales/ticketing', 'Ticketing', 'fa-solid fa-plane-departure'],
    ['/sales/hotels', 'Hotels', 'fa-solid fa-building'],
    ['/sales/tours', 'Tours', 'fa-solid fa-earth-asia'],
    ['/sales/visa', 'Visa', 'fa-solid fa-passport'],
    ['/sales/umrah-hajj', 'Umrah / Hajj', 'fa-solid fa-kaaba'],
    ['/sales/transport', 'Transport', 'fa-solid fa-bus'],
    ['/sales/insurance', 'Insurance', 'fa-solid fa-shield-heart'],
    ['/sales/other-services', 'Other Services', 'fa-solid fa-location-dot']
  ] as const).map(([route, title, icon]) => ({
    route,
    title,
    section: 'Sales & Booking',
    icon,
    fields: TRANSACTION_FIELDS,
    columns: transactionColumns,
    previewRows: transactionPreviewRows,
    missingReason: 'No matching /api/v1/transactions endpoint exposed in current Swagger.'
  })),
  ...([
    ['/inventory/ticket-stock', 'Ticket Stock', 'fa-solid fa-ticket'],
    ['/inventory/stock-transfers', 'Stock Transfers', 'fa-solid fa-right-left'],
    ['/inventory/stock-movements', 'Stock Movements', 'fa-solid fa-truck-ramp-box']
  ] as const).map(([route, title, icon]) => ({
    route,
    title,
    section: 'Inventory',
    icon,
    api: {
      area: 'TRVTSH',
      schema: 'TRVTSHModel',
      listUrl: '/api/v1/ticket-stock',
      saveUrl: '/api/v1/ticket-stock',
      notes: 'Updated REST endpoint for ticket stock.'
    },
    fields: TICKET_STOCK_FIELDS,
    columns: ticketStockColumns,
    previewRows: ticketStockPreviewRows
  }))
];

const missingScreenDefinitions = [
  ['/reports/profit-report', 'Profit Report', 'Reports', 'fa-solid fa-chart-line'],
  ['/masters/airports-cities', 'Airports & Cities', 'Masters', 'fa-solid fa-city'],
  ['/masters/currencies', 'Currencies', 'Masters', 'fa-solid fa-coins'],
  ['/masters/room-types', 'Room Types', 'Masters', 'fa-solid fa-bed'],
  ['/masters/employees', 'Employees', 'Masters', 'fa-solid fa-id-card'],
  ['/masters/document-numbering', 'Document Numbering', 'Masters', 'fa-solid fa-file-signature'],
  ['/inventory/hotel-inventory', 'Hotel Inventory', 'Inventory', 'fa-solid fa-hotel'],
  ['/inventory/visa-quota', 'Visa Quota', 'Inventory', 'fa-solid fa-passport'],
  ['/inventory/tour-inventory', 'Tour Inventory', 'Inventory', 'fa-solid fa-map-location-dot'],
  ['/inventory/transport-inventory', 'Transport Inventory', 'Inventory', 'fa-solid fa-car-side'],
  ['/finance/sales', 'Sales (Cash/Credit)', 'Finance', 'fa-solid fa-cash-register'],
  ['/finance/invoices', 'Invoices', 'Finance', 'fa-solid fa-file-invoice'],
  ['/finance/receipts', 'Receipts', 'Finance', 'fa-solid fa-receipt'],
  ['/finance/payments', 'Payments', 'Finance', 'fa-solid fa-money-bill-transfer'],
  ['/finance/banks', 'Banks', 'Finance', 'fa-solid fa-building-columns'],
  ['/finance/bank-transfers', 'Bank Transfers', 'Finance', 'fa-solid fa-arrow-right-arrow-left'],
  ['/finance/customer-ledger', 'Customer Ledger', 'Finance', 'fa-solid fa-book-open'],
  ['/finance/supplier-ledger', 'Supplier Ledger', 'Finance', 'fa-solid fa-book'],
  ['/accounts/chart-of-accounts', 'Chart of Accounts', 'Accounts', 'fa-solid fa-list-tree'],
  ['/accounts/journal-entries', 'Journal Entries', 'Accounts', 'fa-solid fa-pen-to-square'],
  ['/accounts/cost-allocation', 'Cost Allocation', 'Accounts', 'fa-solid fa-table-cells'],
  ['/accounts/financial-periods', 'Financial Periods', 'Accounts', 'fa-solid fa-calendar-week'],
  ['/accounts/bank-reconciliation', 'Bank Reconciliation', 'Accounts', 'fa-solid fa-scale-balanced'],
  ['/reports/sales-reports', 'Sales Reports', 'Reports', 'fa-solid fa-chart-line'],
  ['/reports/stock-reports', 'Stock Reports', 'Reports', 'fa-solid fa-box-open'],
  ['/reports/accounting-reports', 'Accounting Reports', 'Reports', 'fa-solid fa-file-invoice-dollar'],
  ['/reports/supplier-reports', 'Supplier Reports', 'Reports', 'fa-solid fa-user-tie'],
  ['/reports/stock-summary', 'Stock Reports', 'Reports', 'fa-solid fa-warehouse'],
  ['/reports/mis-reports', 'MIS Reports', 'Reports', 'fa-solid fa-chart-pie'],
  ['/system/users', 'Users', 'System', 'fa-solid fa-user-gear'],
  ['/system/roles', 'Roles', 'System', 'fa-solid fa-users-gear'],
  ['/system/permissions', 'Permissions', 'System', 'fa-solid fa-key'],
  ['/system/audit-trail', 'Audit Trail', 'System', 'fa-solid fa-file-shield'],
  ['/system/settings', 'Settings', 'System', 'fa-solid fa-gear'],
  ['/system/backups', 'Backups', 'System', 'fa-solid fa-database'],
  ['/support/tickets', 'Support Tickets', 'Support', 'fa-solid fa-circle-question'],
  ['/support/system-logs', 'System Logs', 'Support', 'fa-solid fa-file-code'],
  ['/logout', 'Log Out', 'System', 'fa-solid fa-right-from-bracket']
] as const;

export const SCREEN_CONFIGS: ScreenConfig[] = [
  ...apiBackedScreens,
  ...missingScreenDefinitions.map(([route, title, section, icon]) => ({
    route,
    title,
    section,
    icon,
    fields: [],
    columns: [],
    previewRows: [],
    missingReason: 'No matching endpoint or schema is exposed in Swagger.'
  }))
];

export function findScreenConfig(route: string): ScreenConfig {
  const cleanRoute = route.split('?')[0].split('#')[0];
  return (
    SCREEN_CONFIGS.find((screen) => screen.route === cleanRoute) ?? {
      route: cleanRoute,
      title: 'Screen',
      section: 'Operations',
      icon: 'fa-solid fa-briefcase',
      fields: [],
      columns: [],
      previewRows: [],
      missingReason: 'No screen configuration is available for this route.'
    }
  );
}

export const MISSING_API_SCREENS = SCREEN_CONFIGS.filter((screen) => !screen.api).map((screen) => `${screen.section} / ${screen.title}`);