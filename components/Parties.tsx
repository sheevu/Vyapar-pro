
import React, { useState } from 'react';

interface PartiesProps {
  store: any;
  onBack: () => void;
}

const Parties: React.FC<PartiesProps> = ({ store, onBack }) => {
  const { state, addParty } = store;
  const [filter, setFilter] = useState<'ALL' | 'CUSTOMER' | 'SUPPLIER'>('ALL');

  const filteredParties = state.parties.filter((p: any) => 
    filter === 'ALL' ? true : p.type === filter
  );

  return (
    <div className="bg-slate-100 min-h-full pb-32">
      <div className="bg-white p-6 shadow-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={onBack} className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-900 active:scale-90">
            <i className="fa-solid fa-arrow-left text-xl"></i>
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Parties</h1>
            <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">Customers & Suppliers</p>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl">
          {(['ALL', 'CUSTOMER', 'SUPPLIER'] as const).map(t => (
            <button 
              key={t}
              onClick={() => setFilter(t)}
              className={`flex-1 py-3 text-xs font-black rounded-xl uppercase tracking-tighter transition-all ${filter === t ? 'bg-white text-blue-600 shadow-md' : 'text-slate-400'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 space-y-4">
        {filteredParties.map((p: any) => (
          <div key={p.id} className="bg-white p-6 rounded-[32px] shadow-sm flex items-center justify-between border-2 border-slate-50 group active:scale-95 transition-all">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-slate-50 rounded-[22px] flex items-center justify-center text-2xl font-black text-slate-300">
                {p.name.charAt(0)}
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-black text-slate-900">{p.name}</h4>
                <p className="text-sm font-bold text-slate-400">{p.phone}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-2xl font-black ${p.balance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                ₹{Math.abs(p.balance).toLocaleString()}
              </p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{p.balance >= 0 ? 'Collect' : 'Pay'}</p>
            </div>
          </div>
        ))}
        {filteredParties.length === 0 && (
          <div className="text-center py-24 text-slate-300">
            <i className="fa-solid fa-users-slash text-6xl mb-4 opacity-20"></i>
            <p className="text-lg font-black uppercase tracking-widest">No Parties Found</p>
          </div>
        )}
      </div>

      <button 
        onClick={() => {
          const name = prompt('Enter Party Name:');
          const type = confirm('Is this a Customer? (Click Cancel for Supplier)') ? 'CUSTOMER' : 'SUPPLIER';
          if (name) addParty({ id: Date.now().toString(), name, phone: '0000000000', type, balance: 0 });
        }}
        className="fixed bottom-24 right-8 bg-blue-600 text-white w-20 h-20 rounded-[28px] shadow-2xl shadow-blue-200 flex items-center justify-center text-3xl z-50 active:scale-90 transition-all"
      >
        <i className="fa-solid fa-plus"></i>
      </button>
    </div>
  );
};

export default Parties;
