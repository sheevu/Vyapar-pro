
import React, { useState, useEffect } from 'react';
import { geminiService } from '../services/geminiService';

interface VoiceAgentProps {
  store: any;
  onBack: () => void;
}

const VoiceAgent: React.FC<VoiceAgentProps> = ({ store, onBack }) => {
  const [messages, setMessages] = useState<any[]>([
    { text: "नमस्ते! मैं व्यापार AI हूँ। मैं आपकी कैसे मदद कर सकता हूँ?", sender: 'bot' }
  ]);
  const [isListening, setIsListening] = useState(false);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    
    const userMsg = { text, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const response = await geminiService.processVoiceCommand(text, store.state);
      
      const botMsg = { 
        text: response.message || "समझ गया।", 
        sender: 'bot',
        action: response.action 
      };
      
      setMessages(prev => [...prev, botMsg]);

      // Handle actual state changes if AI requested an action
      if (response.action === 'CREATE_SALE' && response.data) {
        store.addTransaction({
          id: Date.now().toString(),
          type: 'SALE',
          amount: response.data.amount || 0,
          date: new Date().toISOString(),
          notes: `Created via AI: ${text}`,
          items: []
        });
      }
    } catch (err) {
      setMessages(prev => [...prev, { text: "माफ़ी चाहता हूँ, कुछ तकनीकी दिक्कत आ गई।", sender: 'bot' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-indigo-50 flex flex-col">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm flex items-center space-x-4">
        <button onClick={onBack} className="text-gray-500"><i className="fa-solid fa-arrow-left"></i></button>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white">
            <i className="fa-solid fa-robot text-xs"></i>
          </div>
          <div>
            <h1 className="text-sm font-bold">Vyapaar AI Assistant</h1>
            <div className="flex items-center space-x-1">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <span className="text-[10px] text-gray-400 font-bold uppercase">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl text-sm shadow-sm ${
              m.sender === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none'
            }`}>
              <p>{m.text}</p>
              {m.action && m.action !== 'NONE' && (
                <div className="mt-2 pt-2 border-t border-indigo-200/30 flex items-center space-x-2 text-[10px] font-bold uppercase">
                  <i className="fa-solid fa-circle-check text-green-400"></i>
                  <span>Action Executed: {m.action}</span>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm flex space-x-1">
              <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-100"></div>
              <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex items-center space-x-2">
          <input 
            type="text" 
            placeholder="Type in Hindi or English..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend(inputText)}
            className="flex-1 bg-gray-100 py-3 px-4 rounded-2xl outline-none text-sm"
          />
          <button 
            onClick={() => handleSend(inputText)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              inputText.trim() ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-100 text-gray-400'
            }`}
          >
            <i className={`fa-solid ${isListening ? 'fa-square' : 'fa-paper-plane'}`}></i>
          </button>
        </div>
        <div className="mt-3 text-center">
          <p className="text-[10px] text-gray-400 font-bold uppercase">Try: "रमेश को ₹250 की सेल जोड़ें"</p>
        </div>
      </div>
    </div>
  );
};

export default VoiceAgent;
