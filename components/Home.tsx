
import React, { useState, useEffect } from 'react';
import { geminiService } from '../services/geminiService';

interface HomeProps {
  store: any;
  onNavigate: (screen: any) => void;
}

const Home: React.FC<HomeProps> = ({ store, onNavigate }) => {
  const { state } = store;
  const [insight, setInsight] = useState<string>('Analyzing your business data...');
  const [loadingInsight, setLoadingInsight] = useState(true);
  
  const getReceivable = state.parties
    .filter((p: any) => p.type === 'CUSTOMER' && p.balance > 0)
    .reduce((acc: number, p: any) => acc + p.balance, 0);

  const getPayable = state.parties
    .filter((p: any) => p.type === 'SUPPLIER' && p.balance < 0)
    .reduce((acc: number, p: any) => acc + Math.abs(p.balance), 0);

  const growthTips = [
    { 
      title: "Impulse Buying / काउंटर सेल", 
      desc: "Place small, high-margin items (toffees, batteries, pens) exactly at the eye level on the counter. (काउंटर पर ग्राहकों की आँखों के सामने छोटे आइटम रखें।)", 
      icon: "fa-shopping-basket" 
    },
    { 
      title: "Offer Bundles / कॉम्बो पैक", 
      desc: "Create 'Tea + Sugar' or 'Snacks + Cold Drink' bundles with a tiny discount to move stock faster. (जल्दी बिकने वाले आइटम्स का कॉम्बो पैक बनाएं।)", 
      icon: "fa-box-open" 
    },
    { 
      title: "Product Placement / सामान रखने का तरीका", 
      desc: "Keep staples (milk, bread) at the back so customers walk past all other items first. (जरूरी सामान दुकान के पीछे रखें ताकि ग्राहक सब कुछ देखते हुए जाएं।)", 
      icon: "fa-layer-group" 
    },
    { 
      title: "Digital Status / डिजिटल स्टेटस", 
      desc: "Post 3 daily status updates on WhatsApp showing new stock arrivals to pull customers in. (रोजाना व्हाट्सएप पर 3 स्टेटस डालें - नए स्टॉक की जानकारी के साथ।)", 
      icon: "fa-mobile-screen-button" 
    },
    { 
      title: "Upselling / ज्यादा बिक्री", 
      desc: "Ask 'Anything else?' or suggest a larger pack size to increase the average bill value. (हमेशा पूछें 'कुछ और चाहिए?' या बड़े पैक का सुझाव दें।)", 
      icon: "fa-arrow-up-right-dots" 
    }
  ];

  useEffect(() => {
    const fetchInsight = async () => {
      try {
        const text = await geminiService.getBusinessInsight(state);
        setInsight(text);
      } catch (e) {
        setInsight(`Udhari ₹${getPayable.toLocaleString()} hai aur aane sirf ₹${getReceivable.toLocaleString()} hain, turant collection fast karo!`);
      } finally {
        setLoadingInsight(false);
      }
    };
    fetchInsight();
  }, [getPayable, getReceivable, state]);

  return (
    <div className="bg-[#f8fafc] min-h-full pb-32">
      {/* Premium Header Layout */}
      <div className="bg-white px-6 pt-12 pb-8 rounded-b-[50px] shadow-[0_15px_40px_-15px_rgba(0,0,0,0.1)] mb-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter leading-none">{state.business.name.split(' / ')[0]}</h1>
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></span>
              Live Growth Pulse
            </p>
          </div>
          <button className="w-14 h-14 bg-slate-50 text-slate-800 rounded-2xl border border-slate-100 flex items-center justify-center btn-press">
            <i className="fa-solid fa-store text-xl"></i>
          </button>
        </div>

        {/* Summary Cards - High Contrast */}
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-[#10b981] to-[#059669] p-8 rounded-[40px] text-white shadow-xl shadow-emerald-100 flex justify-between items-center relative overflow-hidden group btn-press">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-1">Receivable / लेना है</p>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold opacity-60">₹</span>
                <p className="text-4xl font-black tracking-tighter">{getReceivable.toLocaleString()}</p>
              </div>
            </div>
            <i className="fa-solid fa-arrow-trend-up text-7xl opacity-10 absolute -right-4 -bottom-4"></i>
          </div>

          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-100/50 flex justify-between items-center relative overflow-hidden group btn-press">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Payable / देना है</p>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-slate-300">₹</span>
                <p className="text-4xl font-black tracking-tighter text-rose-600">{getPayable.toLocaleString()}</p>
              </div>
            </div>
            <i className="fa-solid fa-arrow-trend-down text-7xl text-slate-50 absolute -right-4 -bottom-4"></i>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-10">
        {/* Smart Insight Card - Screenshot Layout */}
        <div className="bg-gradient-to-br from-[#6366f1] to-[#4f46e5] p-8 rounded-[40px] text-white shadow-2xl shadow-indigo-200 relative overflow-hidden animate-scale-in">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-200">Smart AI Insight</h3>
              <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                <i className="fa-solid fa-sparkles text-lg"></i>
              </div>
            </div>
            <p className={`text-xl font-black leading-tight ${loadingInsight ? 'animate-pulse opacity-50' : ''}`}>
              {insight}
            </p>
            <div className="mt-4 flex items-center gap-2">
              <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-300 w-2/3 animate-pulse"></div>
              </div>
              <span className="text-[8px] font-black uppercase tracking-widest opacity-60">Realtime Analysis</span>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
        </div>

        {/* Quick Actions - Screenshot Inspired */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] text-center mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-6">
            <button 
              onClick={() => onNavigate('ADD_SALE')}
              className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col items-center gap-4 btn-press"
            >
              <div className="w-16 h-16 bg-[#eefcf8] text-[#10b981] rounded-[28px] flex items-center justify-center text-3xl">
                <i className="fa-solid fa-plus"></i>
              </div>
              <span className="text-xs font-black text-slate-800 uppercase tracking-widest">New Sale</span>
            </button>
            <button 
              onClick={() => onNavigate('SCAN')}
              className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col items-center gap-4 btn-press"
            >
              <div className="w-16 h-16 bg-[#eff6ff] text-[#3b82f6] rounded-[28px] flex items-center justify-center text-3xl">
                <i className="fa-solid fa-camera"></i>
              </div>
              <span className="text-xs font-black text-slate-800 uppercase tracking-widest">Scan Bill</span>
            </button>
          </div>
        </div>

        {/* Growth Strategy Section - Requested Addition */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Sales Growth Strategy</h3>
            <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">5 SMART STEPS</span>
          </div>
          <div className="space-y-3 pb-8">
            {growthTips.map((tip, i) => (
              <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-start gap-5 hover:border-indigo-200 transition-all animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="w-12 h-12 bg-slate-50 text-indigo-600 rounded-2xl flex items-center justify-center text-xl flex-shrink-0">
                  <i className={`fa-solid ${tip.icon}`}></i>
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 mb-1">{tip.title}</h4>
                  <p className="text-[11px] font-bold text-slate-400 leading-snug">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Advisor CTA */}
        <button 
          onClick={() => onNavigate('CHATBOT')}
          className="w-full bg-slate-950 p-8 rounded-[48px] text-white flex items-center justify-between group btn-press mb-12 shadow-2xl shadow-slate-200"
        >
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-indigo-600 rounded-[24px] flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/30">
              <i className="fa-solid fa-robot"></i>
            </div>
            <div className="text-left">
              <h4 className="text-xl font-black tracking-tight leading-none">Consult AI</h4>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Chat about business expansion</p>
            </div>
          </div>
          <i className="fa-solid fa-chevron-right text-slate-700 group-hover:translate-x-2 transition-transform"></i>
        </button>
      </div>
    </div>
  );
};

export default Home;
