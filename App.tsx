
import React, { useState } from 'react';
import { useAppStore } from './store';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import Items from './components/Items';
import Menu from './components/Menu';
import VoiceAgent from './components/VoiceAgent';
import Scanner from './components/Scanner';
import Parties from './components/Parties';
import Chatbot from './components/Chatbot';
import Transcriber from './components/Transcriber';

type Tab = 'HOME' | 'DASHBOARD' | 'ITEMS' | 'MENU';
type Screen = Tab | 'VOICE' | 'SCAN' | 'PARTIES' | 'ADD_SALE' | 'ADD_PURCHASE' | 'CHATBOT' | 'TRANSCRIBE';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('HOME');
  const [activeScreen, setActiveScreen] = useState<Screen>('HOME');
  const store = useAppStore();

  const navigateTo = (screen: Screen) => {
    setActiveScreen(screen);
    if (['HOME', 'DASHBOARD', 'ITEMS', 'MENU'].includes(screen)) {
      setActiveTab(screen as Tab);
    }
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case 'HOME': return <Home store={store} onNavigate={navigateTo} />;
      case 'DASHBOARD': return <Dashboard store={store} />;
      case 'ITEMS': return <Items store={store} />;
      case 'MENU': return <Menu store={store} onNavigate={navigateTo} />;
      case 'VOICE': return <VoiceAgent store={store} onBack={() => navigateTo('HOME')} />;
      case 'SCAN': return <Scanner store={store} onBack={() => navigateTo('HOME')} />;
      case 'PARTIES': return <Parties store={store} onBack={() => navigateTo('MENU')} />;
      case 'CHATBOT': return <Chatbot onBack={() => navigateTo('HOME')} />;
      case 'TRANSCRIBE': return <Transcriber onBack={() => navigateTo('HOME')} />;
      default: return <Home store={store} onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-slate-100 overflow-hidden shadow-2xl relative">
      <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
        {renderScreen()}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-xl border-t border-slate-200 flex justify-around items-center h-20 safe-bottom z-50 shadow-2xl rounded-t-[40px]">
        <button 
          onClick={() => navigateTo('HOME')}
          className={`flex flex-col items-center justify-center w-full h-full transition-all ${activeTab === 'HOME' ? 'text-blue-600 scale-110' : 'text-slate-400'}`}
        >
          <i className="fa-solid fa-house-chimney text-2xl mb-1"></i>
          <span className="text-[10px] font-black uppercase tracking-widest">Main</span>
        </button>
        <button 
          onClick={() => navigateTo('DASHBOARD')}
          className={`flex flex-col items-center justify-center w-full h-full transition-all ${activeTab === 'DASHBOARD' ? 'text-blue-600 scale-110' : 'text-slate-400'}`}
        >
          <i className="fa-solid fa-chart-column text-2xl mb-1"></i>
          <span className="text-[10px] font-black uppercase tracking-widest">Stats</span>
        </button>
        <button 
          onClick={() => navigateTo('ITEMS')}
          className={`flex flex-col items-center justify-center w-full h-full transition-all ${activeTab === 'ITEMS' ? 'text-blue-600 scale-110' : 'text-slate-400'}`}
        >
          <i className="fa-solid fa-layer-group text-2xl mb-1"></i>
          <span className="text-[10px] font-black uppercase tracking-widest">Stock</span>
        </button>
        <button 
          onClick={() => navigateTo('MENU')}
          className={`flex flex-col items-center justify-center w-full h-full transition-all ${activeTab === 'MENU' ? 'text-blue-600 scale-110' : 'text-slate-400'}`}
        >
          <i className="fa-solid fa-grid-2 text-2xl mb-1"></i>
          <span className="text-[10px] font-black uppercase tracking-widest">Menu</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
