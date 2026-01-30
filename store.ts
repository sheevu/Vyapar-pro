
import { useState, useEffect } from 'react';
import { AppState, BusinessProfile, Party, Item, Transaction, Reminder } from './types';

const INITIAL_STATE: AppState = {
  business: {
    name: "Vyapaar Pro / व्यापार प्रो",
    address: "Market Square, Sector 4",
    gstin: "22AAAAA0000A1Z5",
    phone: "9876543210",
    email: "admin@vyapaar-ai.com"
  },
  parties: [
    { id: '1', name: 'Ramesh Kirana', phone: '9000011111', type: 'CUSTOMER', balance: 1500 },
    { id: '2', name: 'Ujala General Store', phone: '9000022222', type: 'CUSTOMER', balance: -200 },
    { id: '3', name: 'Global Wholesalers', phone: '9000033333', type: 'SUPPLIER', balance: -5000 }
  ],
  items: [
    { id: '1', name: 'Wheat Flour (5kg)', salePrice: 250, purchasePrice: 220, stock: 45, inStock: true, category: 'Grocery' },
    { id: '2', name: 'Cooking Oil (1L)', salePrice: 160, purchasePrice: 145, stock: 12, inStock: true, category: 'Grocery' },
    { id: '3', name: 'Soap Bar', salePrice: 35, purchasePrice: 28, stock: -5, inStock: true, category: 'Personal Care' }
  ],
  transactions: [
    { id: 't1', type: 'SALE', partyId: '1', amount: 500, date: new Date().toISOString(), notes: 'Sample Sale', items: [] },
    { id: 't2', type: 'PURCHASE', partyId: '3', amount: 2000, date: new Date().toISOString(), notes: 'Initial Purchase', items: [] }
  ],
  reminders: [
    { id: 'r1', partyId: '1', note: 'Payment follow up', date: new Date().toISOString(), completed: false }
  ]
};

const STORAGE_KEY = 'vyapaar_ai_storage_v1';

export const useAppStore = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_STATE;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const findOrCreateParty = (name: string, type: 'CUSTOMER' | 'SUPPLIER' = 'SUPPLIER'): string => {
    const existing = state.parties.find(p => p.name.toLowerCase() === name.toLowerCase());
    if (existing) return existing.id;
    
    const newId = Date.now().toString() + Math.random().toString(36).substr(2, 5);
    const newParty: Party = {
      id: newId,
      name,
      phone: '0000000000',
      type,
      balance: 0
    };
    addParty(newParty);
    return newId;
  };

  const addTransaction = (txn: Transaction) => {
    setState(prev => {
      const updatedParties = prev.parties.map(p => {
        if (p.id === txn.partyId) {
          let delta = 0;
          if (txn.type === 'SALE') delta = txn.amount;
          else if (txn.type === 'PURCHASE') delta = -txn.amount;
          return { ...p, balance: p.balance + delta };
        }
        return p;
      });

      // Update stock if items are present
      const updatedItems = [...prev.items];
      txn.items.forEach(txnItem => {
        const idx = updatedItems.findIndex(i => i.id === txnItem.itemId);
        if (idx !== -1) {
          if (txn.type === 'SALE') updatedItems[idx].stock -= txnItem.qty;
          else if (txn.type === 'PURCHASE') updatedItems[idx].stock += txnItem.qty;
        }
      });

      return {
        ...prev,
        transactions: [txn, ...prev.transactions],
        parties: updatedParties,
        items: updatedItems
      };
    });
  };

  const addItem = (item: Item) => {
    setState(prev => ({ ...prev, items: [...prev.items, item] }));
  };

  const updateItem = (itemId: string, updates: Partial<Item>) => {
    setState(prev => ({
      ...prev,
      items: prev.items.map(item => item.id === itemId ? { ...item, ...updates } : item)
    }));
  };

  const addParty = (party: Party) => {
    setState(prev => ({ ...prev, parties: [...prev.parties, party] }));
  };

  const updateBusiness = (business: BusinessProfile) => {
    setState(prev => ({ ...prev, business }));
  };

  return { state, addTransaction, addItem, updateItem, addParty, updateBusiness, findOrCreateParty };
};
