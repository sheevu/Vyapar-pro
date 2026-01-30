
import React, { useState, useRef } from 'react';
import { geminiService } from '../services/geminiService';

interface TranscriberProps {
  onBack: () => void;
}

const Transcriber: React.FC<TranscriberProps> = ({ onBack }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [loading, setLoading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    chunksRef.current = [];

    mediaRecorder.ondataavailable = (e) => chunksRef.current.push(e.data);
    mediaRecorder.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = (reader.result as string).split(',')[1];
        setLoading(true);
        try {
          const text = await geminiService.transcribeAudio(base64);
          setTranscription(text);
        } catch (err) {
          alert("Transcription failed. Please try again.");
        } finally {
          setLoading(false);
        }
      };
      reader.readAsDataURL(blob);
    };

    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  return (
    <div className="h-screen bg-white flex flex-col text-slate-900">
      {/* Header */}
      <div className="p-6 bg-white border-b border-slate-100 flex items-center gap-4 sticky top-0 z-10">
        <button onClick={onBack} className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-900 active:scale-90 transition-all">
          <i className="fa-solid fa-arrow-left text-xl"></i>
        </button>
        <h1 className="text-xl font-black tracking-tight uppercase">Voice Transcribe</h1>
      </div>

      <div className="flex-1 p-8 flex flex-col items-center justify-center space-y-12">
        {/* Massive Button */}
        <div className="relative">
          <button 
            onClick={isRecording ? stopRecording : startRecording}
            className={`w-64 h-64 rounded-full flex flex-col items-center justify-center transition-all duration-500 shadow-2xl active:scale-95 ${
              isRecording 
                ? 'bg-rose-600 shadow-rose-200' 
                : 'bg-blue-600 shadow-blue-200'
            }`}
          >
            <i className={`fa-solid ${isRecording ? 'fa-stop text-7xl' : 'fa-microphone text-7xl'} text-white mb-4`}></i>
            <span className="text-sm font-black text-white/80 uppercase tracking-widest">
              {isRecording ? 'TAP TO STOP' : 'TAP TO START'}
            </span>
            {isRecording && <div className="absolute inset-0 bg-rose-600 rounded-full animate-ping opacity-20 -z-10"></div>}
          </button>
        </div>

        <div className="text-center space-y-4 max-w-xs">
          <h2 className="text-3xl font-black text-slate-900">
            {isRecording ? 'Listening...' : 'Record Notes'}
          </h2>
          <p className="text-lg font-bold text-slate-400 uppercase leading-snug">
            Hindi or English speech will be converted to text instantly.
          </p>
        </div>
      </div>

      {/* Optimized Result Section */}
      {(loading || transcription) && (
        <div className="p-8 bg-slate-950 text-white min-h-[50vh] animate-slide-up rounded-t-[56px] shadow-2xl fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xs font-black text-blue-400 uppercase tracking-[0.3em]">Transcription Result</h3>
            {transcription && (
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(transcription);
                  alert("Text Copied!");
                }}
                className="bg-white/10 px-4 py-2 rounded-full text-[10px] font-black text-white uppercase tracking-widest active:scale-90 transition-all"
              >
                Copy All
              </button>
            )}
          </div>
          
          <div className="bg-white/5 p-8 rounded-[40px] border border-white/10 min-h-[200px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-6">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs font-black text-blue-500 uppercase tracking-widest animate-pulse">Gemini is writing...</p>
              </div>
            ) : (
              <p className="text-2xl font-black text-white leading-relaxed">{transcription}</p>
            )}
          </div>
          
          <button 
            onClick={() => { setTranscription(''); setLoading(false); }}
            className="w-full mt-8 py-2 text-sm font-black text-slate-500 uppercase tracking-[0.4em] hover:text-white transition-colors"
          >
            Clear and Restart
          </button>
        </div>
      )}
    </div>
  );
};

export default Transcriber;
