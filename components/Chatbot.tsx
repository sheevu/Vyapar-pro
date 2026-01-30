
import React, { useState, useEffect, useRef } from 'react';
import { geminiService } from '../services/geminiService';

interface ChatbotProps {
  onBack: () => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ onBack }) => {
  const [messages, setMessages] = useState<any[]>([
    { text: "नमस्ते! मैं आपका बिज़नेस सलाहकार हूँ। मैं आज आपकी क्या मदद कर सकता हूँ?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initChat = async () => {
      chatRef.current = await geminiService.startChatSession();
    };
    initChat();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !chatRef.current) return;

    const userMsg = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const result = await chatRef.current.sendMessage({ message: userMsg.text });
      setMessages(prev => [...prev, { text: result.text, sender: 'bot' }]);
    } catch (err) {
      setMessages(prev => [...prev, { text: "Error connecting to AI Pro. Please check connection.", sender: 'bot' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-white flex flex-col text-slate-900">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 z-20 bg-white/90 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-900 active:scale-90">
            <i className="fa-solid fa-arrow-left text-xl"></i>
          </button>
          <div>
            <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
              Business AI <span className="bg-blue-600 text-[10px] text-white px-2 py-0.5 rounded-full uppercase">Pro</span>
            </h1>
            <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">Active Advisor</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar pb-32">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}>
            <div className={`max-w-[90%] p-5 rounded-[32px] text-lg font-medium leading-relaxed shadow-sm ${
              m.sender === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 p-5 rounded-[32px] rounded-tl-none border border-slate-200 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-200"></div>
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">Thinking</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white border-t border-slate-100 fixed bottom-0 left-0 right-0 max-w-md mx-auto">
        <div className="flex items-center gap-3">
          <input 
            type="text" 
            placeholder="Ask business advice..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-slate-100 border-2 border-slate-200 py-5 px-8 rounded-full outline-none text-lg font-medium placeholder:text-slate-400 focus:border-blue-500 transition-all shadow-inner"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-xl shadow-blue-200 disabled:bg-slate-300 active:scale-95 transition-all"
          >
            <i className="fa-solid fa-paper-plane text-xl"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
