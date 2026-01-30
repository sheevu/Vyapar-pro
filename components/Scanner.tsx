
import React, { useState, useRef, useMemo } from 'react';
import { geminiService } from '../services/geminiService';
import { TransactionType, Item } from '../types';

interface ScannerProps {
  store: any;
  onBack: () => void;
}

const Scanner: React.FC<ScannerProps> = ({ store, onBack }) => {
  const { state, addTransaction, updateItem, findOrCreateParty } = store;
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        setImage(reader.result as string);
        processImage(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async (base64: string) => {
    setLoading(true);
    setResult(null);
    try {
      const data = await geminiService.scanInvoice(base64);
      setResult(data);
    } catch (err) {
      alert("Error scanning invoice. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const processedItems = useMemo(() => {
    if (!result?.items) return [];
    return result.items.map((scanned: any) => {
      const trimmedScannedName = (scanned.name || '').trim().toLowerCase();
      const existing = state.items.find((i: Item) => 
        i.name.trim().toLowerCase() === trimmedScannedName
      );
      
      return {
        ...scanned,
        existingId: existing?.id,
        existingPrice: existing?.purchasePrice,
        isPriceDifferent: existing && scanned.rate && existing.purchasePrice !== scanned.rate
      };
    });
  }, [result, state.items]);

  const handleSave = (type: TransactionType) => {
    if (!result) return;

    const vendorName = (result.vendor_name || 'Unknown Vendor').trim();
    const partyId = findOrCreateParty(vendorName, type === 'PURCHASE' ? 'SUPPLIER' : 'CUSTOMER');

    if (type === 'PURCHASE') {
      processedItems.forEach((it: any) => {
        if (it.existingId && it.rate) {
          updateItem(it.existingId, { purchasePrice: it.rate });
        }
      });
    }

    addTransaction({
      id: Date.now().toString(),
      type: type,
      partyId: partyId,
      amount: result.total || 0,
      date: new Date().toISOString(),
      notes: `AI Scanned ${type}. Vendor: ${vendorName}`,
      items: processedItems.map((it: any) => ({
        itemId: it.existingId || 'unknown',
        name: it.name || 'Scanned Item',
        qty: it.qty || 1,
        rate: it.rate || it.amount || 0,
        amount: it.amount || 0
      }))
    });

    onBack();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col animate-fade-in">
      {/* Dynamic Header */}
      <div className="px-6 pt-12 pb-6 flex items-center justify-between border-b border-slate-100 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <button onClick={onBack} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-900 btn-press">
          <i className="fa-solid fa-chevron-left text-xl"></i>
        </button>
        <div className="text-center">
          <h1 className="text-lg font-black tracking-tight uppercase leading-none">Smart Scan</h1>
          <p className="text-[9px] font-black text-blue-600 uppercase tracking-[0.3em] mt-1">Vision Intelligence</p>
        </div>
        <div className="w-12"></div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-10 no-scrollbar pb-32">
        {!image ? (
          <div className="flex flex-col items-center justify-center h-[70vh] space-y-8 animate-slide-up">
            <div 
              className="relative group cursor-pointer" 
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-[100px] animate-pulse"></div>
              <div className="relative w-64 h-64 border-2 border-dashed border-slate-200 rounded-[64px] flex flex-col items-center justify-center bg-white shadow-2xl hover:border-blue-400 transition-all duration-500">
                <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[32px] flex items-center justify-center text-4xl mb-4">
                   <i className="fa-solid fa-plus"></i>
                </div>
                <p className="text-sm font-black text-slate-900 uppercase tracking-widest">Add Bill Photo</p>
                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">JPG, PNG or PDF</p>
              </div>
            </div>
            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
          </div>
        ) : (
          <div className="space-y-10 max-w-lg mx-auto">
            {/* Optimized Preview Area */}
            <div className={`relative rounded-[56px] overflow-hidden shadow-2xl bg-white border border-slate-100 h-96 transition-all duration-1000 ${!loading && result ? 'scale-[1.02] ring-8 ring-emerald-500/10' : ''}`}>
              <img 
                src={image} 
                className={`w-full h-full object-cover transition-all duration-1000 ${loading ? 'opacity-30 blur-md grayscale' : 'opacity-100'}`} 
                alt="Bill Preview" 
              />
              
              {/* Scanning Overlay */}
              {loading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6">
                  <div className="relative">
                    <div className="w-20 h-20 border-4 border-blue-500/20 rounded-full"></div>
                    <div className="absolute inset-0 w-20 h-20 border-t-4 border-blue-600 rounded-full animate-spin"></div>
                  </div>
                  <div className="text-center">
                    <p className="text-blue-600 font-black text-xl uppercase tracking-[0.3em] animate-pulse">Analyzing</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Reading Ledger Details</p>
                  </div>
                </div>
              )}

              {/* Success Badge */}
              {!loading && result && (
                <div className="absolute top-8 right-8 bg-emerald-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl animate-scale-in">
                  <i className="fa-solid fa-check text-2xl"></i>
                </div>
              )}
            </div>

            {/* Extracted Details Section */}
            {result && !loading && (
              <div className="animate-slide-up space-y-8 pb-10">
                {/* Header Info */}
                <div className="bg-white p-10 rounded-[56px] shadow-xl border border-slate-50 space-y-8">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Extracted Vendor</span>
                      <h2 className="text-3xl font-black text-slate-900 tracking-tighter leading-none">{result.vendor_name || 'New Party'}</h2>
                      <div className="flex items-center gap-2 text-slate-400">
                        <i className="fa-solid fa-calendar-days text-xs"></i>
                        <span className="text-xs font-bold uppercase">{result.date || 'Today'}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bill Amount</span>
                      <div className="flex items-center gap-1 justify-end mt-1">
                         <span className="text-xl font-bold text-slate-300">₹</span>
                         <p className="text-4xl font-black text-slate-900 tracking-tighter">{result.total?.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-slate-100 w-full"></div>

                  {/* Items List Refined */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Items List</h3>
                      <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{processedItems.length} ITEMS</span>
                    </div>
                    
                    <div className="space-y-3">
                      {processedItems.map((it: any, i: number) => (
                        <div 
                          key={i} 
                          className={`p-6 rounded-[32px] flex items-center justify-between border-2 transition-all ${
                            it.existingId ? 'bg-white border-slate-50 shadow-sm' : 'bg-blue-50/30 border-blue-100'
                          }`}
                        >
                          <div className="flex items-center gap-5">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl ${it.existingId ? 'bg-slate-50 text-slate-400' : 'bg-blue-600 text-white'}`}>
                              <i className={`fa-solid ${it.existingId ? 'fa-box' : 'fa-plus'}`}></i>
                            </div>
                            <div>
                              <p className="text-lg font-black text-slate-900 leading-tight">{it.name}</p>
                              <p className="text-xs font-bold text-slate-400 mt-1 uppercase">₹{it.rate?.toLocaleString()} <span className="mx-1">×</span> {it.qty || 1}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-black text-slate-900">₹{it.amount?.toLocaleString()}</p>
                            {it.isPriceDifferent && (
                              <div className="mt-1 bg-amber-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest flex items-center gap-1">
                                <i className="fa-solid fa-up-long"></i>
                                Rate Change
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Summary Section */}
                  <div className="space-y-4 pt-4">
                    <button 
                      onClick={() => handleSave('PURCHASE')}
                      className="w-full py-8 bg-slate-950 text-white rounded-[40px] flex items-center justify-center gap-4 shadow-2xl shadow-slate-300 active:scale-95 transition-all group"
                    >
                      <i className="fa-solid fa-cart-arrow-down text-2xl group-hover:rotate-12 transition-transform"></i>
                      <span className="text-xl font-black uppercase tracking-widest">Save as Purchase</span>
                    </button>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={() => handleSave('SALE')}
                        className="py-6 bg-emerald-500 text-white rounded-[32px] flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-all"
                      >
                        <i className="fa-solid fa-plus"></i>
                        <span className="text-sm font-black uppercase tracking-widest">Sale</span>
                      </button>
                      <button 
                        onClick={() => handleSave('EXPENSE')}
                        className="py-6 bg-white text-slate-900 border-2 border-slate-100 rounded-[32px] flex items-center justify-center gap-3 active:scale-95 transition-all"
                      >
                        <i className="fa-solid fa-receipt text-slate-400"></i>
                        <span className="text-sm font-black uppercase tracking-widest">Expense</span>
                      </button>
                    </div>
                  </div>

                  <button 
                    onClick={() => { setImage(null); setResult(null); }}
                    className="w-full text-center py-4 text-slate-300 font-black text-[10px] uppercase tracking-[0.5em] hover:text-slate-900 transition-colors"
                  >
                    Cancel and Start Over
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Scanner;
