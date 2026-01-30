
import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

export const geminiService = {
  // General Business Chat (using Pro for complex reasoning)
  async startChatSession(history: any[] = []) {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    return ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction: "You are Vyapaar AI Pro, a senior business consultant and accounting expert for Indian SMEs. You help users understand their finances, give marketing advice, and explain tax laws in simple terms. Use a mix of Hindi and English (Hinglish). Be concise and professional."
      }
    });
  },

  // Quick Business Insights for Dashboard/Home
  async getBusinessInsight(state: any) {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const summary = {
      receivables: state.parties.filter((p: any) => p.type === 'CUSTOMER' && p.balance > 0).reduce((a: any, b: any) => a + b.balance, 0),
      payables: state.parties.filter((p: any) => p.type === 'SUPPLIER' && p.balance < 0).reduce((a: any, b: any) => a + Math.abs(b.balance), 0),
      lowStockCount: state.items.filter((i: any) => i.stock < 10).length,
      cashOnHand: 5000, // Placeholder
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze this business status and provide a single, strong, motivating insight in Hinglish (Hindi + English). Focus on cash flow and stock balance.
      Context: ${JSON.stringify(summary)}
      Example style: "Udhari ₹5000 hai aur aane sirf ₹1500 hain, turant collection fast karo!"
      Format: Return ONLY the sentence. No quotes.`
    });
    return response.text?.trim() || "बिज़नेस बढ़ रहा है! फोकस बनाये रखें।";
  },

  // Audio Transcription (using Flash for speed/efficiency)
  async transcribeAudio(base64Audio: string) {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const audioPart = {
      inlineData: {
        mimeType: 'audio/webm',
        data: base64Audio,
      },
    };
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          audioPart,
          { text: "Transcribe this audio exactly as spoken. If Hindi, use Devanagari. If English, use English. No commentary." }
        ]
      }
    });

    return response.text || "";
  },

  // Voice/Text Assistant Logic
  async processVoiceCommand(prompt: string, context: any) {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are Vyapaar AI, a helpful accounting assistant.
      Current context: ${JSON.stringify(context.business)}
      User prompt: "${prompt}"
      
      Tasks:
      1. Interpret intent (Add Sale, Add Purchase, Query List).
      2. If creating entry, return JSON with amount, party, etc.
      
      Return JSON only:
      {
        "action": "CREATE_SALE" | "CREATE_PURCHASE" | "QUERY_LIST" | "NONE",
        "data": { "amount": number, "party": string, "items": string[] },
        "message": "Hindi explanation"
      }`,
      config: {
        responseMimeType: "application/json"
      }
    });

    try {
      return JSON.parse(response.text || '{}');
    } catch (e) {
      return { action: "NONE", message: "क्षमा करें, मैं समझ नहीं पाया।" };
    }
  },

  // Document Scanning Logic
  async scanInvoice(base64Image: string) {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const imagePart = {
      inlineData: {
        mimeType: 'image/jpeg',
        data: base64Image,
      },
    };
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          imagePart,
          { text: "Extract invoice details into JSON: vendor_name, date, total, gst, items (name, qty, rate, amount)." }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            vendor_name: { type: Type.STRING },
            date: { type: Type.STRING },
            total: { type: Type.NUMBER },
            gst: { type: Type.NUMBER },
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  qty: { type: Type.NUMBER },
                  rate: { type: Type.NUMBER },
                  amount: { type: Type.NUMBER }
                }
              }
            }
          }
        }
      }
    });

    try {
      return JSON.parse(response.text || '{}');
    } catch (e) {
      return null;
    }
  }
};
