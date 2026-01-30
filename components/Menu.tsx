
import React from 'react';

interface MenuProps {
  store: any;
  onNavigate: (screen: any) => void;
}

const Menu: React.FC<MenuProps> = ({ store, onNavigate }) => {
  const sections = [
    {
      title: 'Business Management',
      items: [
        { icon: 'fa-users', label: 'Parties & Ledgers', screen: 'PARTIES', color: 'bg-blue-600' },
        { icon: 'fa-file-invoice-dollar', label: 'Transactions', screen: 'DASHBOARD', color: 'bg-emerald-600' },
      ]
    },
    {
      title: 'Smart Features',
      items: [
        { icon: 'fa-robot', label: 'Business AI Chat', screen: 'CHATBOT', color: 'bg-indigo-600' },
        { icon: 'fa-microphone-lines', label: 'Voice Transcribe', screen: 'TRANSCRIBE', color: 'bg-amber-500' }
      ]
    },
    {
      title: 'System',
      items: [
        { icon: 'fa-gear', label: 'Profile Settings', screen: 'PROFILE', color: 'bg-slate-400' },
        { icon: 'fa-file-export', label: 'Export Reports', screen: 'EXPORT', color: 'bg-slate-400' }
      ]
    }
  ];

  return (
    <div className="bg-slate-100 min-h-full pb-32 px-6 pt-12 space-y-10">
      <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-200 flex items-center space-x-6">
        <div className="w-20 h-20 bg-blue-600 text-white rounded-[28px] flex items-center justify-center text-3xl font-black shadow-lg shadow-blue-100">
          {store.state.business.name.charAt(0)}
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900 leading-tight">{store.state.business.name}</h2>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">{store.state.business.phone}</p>
        </div>
      </div>

      {sections.map((section) => (
        <div key={section.title} className="space-y-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] px-2">{section.title}</h3>
          <div className="bg-white rounded-[40px] shadow-sm overflow-hidden border border-slate-200">
            {section.items.map((item, idx) => (
              <button
                key={item.label}
                onClick={() => onNavigate(item.screen)}
                className={`w-full p-6 flex items-center justify-between active:bg-slate-50 transition-colors btn-press ${idx !== section.items.length - 1 ? 'border-b border-slate-100' : ''}`}
              >
                <div className="flex items-center space-x-6">
                  <div className={`${item.color} w-12 h-12 rounded-2xl flex items-center justify-center text-white text-lg`}>
                    <i className={`fa-solid ${item.icon}`}></i>
                  </div>
                  <span className="text-lg font-black text-slate-800 tracking-tight">{item.label}</span>
                </div>
                <i className="fa-solid fa-chevron-right text-slate-200 text-sm"></i>
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="text-center py-6">
        <p className="text-xs text-slate-300 font-black uppercase tracking-[0.5em]">Vyapaar AI v1.2</p>
      </div>
    </div>
  );
};

export default Menu;
