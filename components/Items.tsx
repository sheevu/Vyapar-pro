
import React, { useState } from 'react';

interface ItemsProps {
  store: any;
}

const Items: React.FC<ItemsProps> = ({ store }) => {
  const { state, addItem } = store;
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = state.items.filter((item: any) => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-slate-100 min-h-full pb-32 px-6 pt-12 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Stock</h1>
          <p className="text-sm font-bold text-slate-400 mt-2 uppercase tracking-widest">Inventory List</p>
        </div>
        <button 
          onClick={() => {
            const name = prompt('Enter Item Name:');
            if (name) addItem({
              id: Date.now().toString(),
              name,
              salePrice: 0,
              purchasePrice: 0,
              stock: 0,
              inStock: true,
              category: 'General'
            });
          }}
          className="w-14 h-14 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200 flex items-center justify-center text-xl btn-press"
        >
          <i className="fa-solid fa-plus"></i>
        </button>
      </div>

      {/* Simplified Search Bar */}
      <div className="relative">
        <i className="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-lg"></i>
        <input 
          type="text"
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-14 pr-6 py-5 bg-white border-2 border-slate-200 rounded-[28px] text-lg font-medium outline-none focus:border-blue-500 transition-all shadow-sm"
        />
      </div>

      {/* Enhanced List */}
      <div className="space-y-4">
        {filteredItems.map((item: any) => (
          <div key={item.id} className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-200 flex items-center justify-between group transition-all animate-slide-up">
            <div className="flex items-center space-x-5">
              <div className="w-16 h-16 bg-slate-50 rounded-[20px] flex items-center justify-center text-slate-300">
                <i className="fa-solid fa-box text-2xl"></i>
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-black text-slate-900">{item.name}</h4>
                <div className="flex space-x-4">
                  <span className="text-sm font-black text-emerald-600">₹{item.salePrice}</span>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Stock: {item.stock}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-1">
              <div className={`w-3 h-3 rounded-full ${item.stock < 10 ? 'bg-rose-500' : 'bg-emerald-500'} shadow-sm shadow-current`}></div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.category}</span>
            </div>
          </div>
        ))}
        {filteredItems.length === 0 && (
          <div className="text-center py-24 text-slate-400 bg-white/50 rounded-[40px] border-2 border-dashed border-slate-200">
            <i className="fa-solid fa-box-open text-6xl mb-6 opacity-20"></i>
            <p className="text-lg font-black uppercase tracking-widest">No Items Found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Items;
