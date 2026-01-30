
export type TransactionType = 'SALE' | 'PURCHASE' | 'EXPENSE';

export interface BusinessProfile {
  name: string;
  address: string;
  gstin: string;
  phone: string;
  email: string;
}

export interface Party {
  id: string;
  name: string;
  phone: string;
  type: 'CUSTOMER' | 'SUPPLIER';
  balance: number;
  lastVisit?: string;
}

export interface Item {
  id: string;
  name: string;
  salePrice: number;
  purchasePrice: number;
  stock: number;
  inStock: boolean;
  category: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  partyId?: string;
  amount: number;
  date: string;
  notes: string;
  items: TransactionItem[];
}

export interface TransactionItem {
  itemId: string;
  name: string;
  qty: number;
  rate: number;
  amount: number;
}

export interface Reminder {
  id: string;
  partyId: string;
  note: string;
  date: string;
  completed: boolean;
}

export interface AppState {
  business: BusinessProfile;
  parties: Party[];
  items: Item[];
  transactions: Transaction[];
  reminders: Reminder[];
}
