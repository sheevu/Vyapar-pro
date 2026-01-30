
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { geminiService } from '../services/geminiService';

interface DashboardProps { store: any; }

const Dashboard: React.FC<DashboardProps> = ({ store }) => {
  const { state } = store;
  const [performanceNote, setPerformanceNote] = useState('Computing performance stats...');

  const salesData = [
    { name: 'M', amount: 4500 },
    { name: 'T', amount: 3200 },
    { name: 'W', amount: 5600 },
    { name: 'T', amount: 2100 },
    { name: 'F', amount: 7800 },
    { name: 'S', amount: 8900 },
    { name: 'S', amount: 4200 },
  ];

  const inventoryValue = state.items.reduce((acc: number, item: any) => acc + (item.stock * item.purchasePrice), 0);
  const lowStockCount = state.items.filter((item: any) => item.stock < 10).length;

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const ai = await geminiService.startChatSession();
        const res = await ai.sendMessage({ message: `Based on this data: ${JSON.stringify(salesData)}, give a 1-sentence performance review for this week in Hindi.` });
        setPerformanceNote(res.text || "इस हफ्ते सेल बढ़िया रही!");
      } catch (e) {
        setPerformanceNote("इस हफ्ते की सेल का ग्राफ ऊपर जा रहा है!");
      }
    };
    fetchPerformance();
  }, []);

  return (
    <div className="bg-slate-50 min-h-full pb-32 px-6 pt-16 space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-950 tracking-tight leading-none">Stats</h1>
          <p className="text-sm font-bold text-slate-400 mt-2 uppercase tracking-widest">Business Vitality</p>
        </div>
        <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-200 flex items-center space-x-3">
          <i className="fa-solid fa-clock-rotate-left text-blue-600"></i>
          <span className="text-xs font-black uppercase tracking-widest text-slate-600">Live</span>
        </div>
      </div>

      {/* High-Impact Stat Hero */}
      <div className="space-y-5">
        <div className="bg-white p-10 rounded-[48px] shadow-xl border border-slate-100 flex justify-between items-center group active:scale-95 transition-all">
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Inventory Value</p>
            <p className="text-6xl font-black text-slate-950 tracking-tighter">₹{(inventoryValue/1000).toFixed(1)}k</p>
          </div>
          <div className="w-20 h-20 bg-blue-600 text-white rounded-[32px] flex items-center justify-center text-4xl shadow-xl shadow-blue-100 group-hover:rotate-12 transition-transform">
            <i className="fa-solid fa-coins"></i>
          </div>
        </div>

        <div className="bg-rose-600 p-10 rounded-[48px] shadow-2xl shadow-rose-200 text-white flex justify-between items-center group active:scale-95 transition-all">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] opacity-70 mb-2">Restock Priority</p>
            <p className="text-6xl font-black tracking-tighter">{lowStockCount}</p>
          </div>
          <div className="w-20 h-20 bg-white/20 rounded-[32px] flex items-center justify-center text-4xl backdrop-blur-md group-hover:-rotate-12 transition-transform">
            <i className="fa-solid fa-boxes-packing"></i>
          </div>
        </div>
      </div>

      {/* AI Performance Commentary */}
      <div className="bg-slate-950 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Gemini Review</h3>
          </div>
          <p className="text-xl font-bold italic leading-snug">"{performanceNote}"</p>
        </div>
        <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-blue-600/20 blur-[60px] rounded-full"></div>
      </div>

      {/* Simplified Revenue Chart */}
      <div className="bg-white p-10 rounded-[48px] shadow-sm border border-slate-100 space-y-10">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-lg font-black text-slate-950 uppercase tracking-tight">Weekly Sales</h3>
          <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-[10px] font-black">
            <i className="fa-solid fa-arrow-trend-up"></i>
            UP 12%
          </div>
        </div>
        
        <div className="h-56 w-full -ml-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 14, fill: '#cbd5e1', fontWeight: 900}} />
              <Tooltip 
                cursor={{fill: '#f8fafc'}}
                contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)', fontSize: '14px', fontWeight: 'bold' }}
              />
              <Bar dataKey="amount" radius={[12, 12, 12, 12]} barSize={24}>
                {salesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.amount > 6000 ? '#2563eb' : '#94a3b8'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
