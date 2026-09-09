import React, { useState } from 'react';
import {
  Bot,
  Sparkles,
  Send,
  Lightbulb,
  HelpCircle,
  Compass,
  X,
  BookOpen,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { TemanBerpikirEvidence } from '../../types';

interface TemanBerpikirAIProps {
  currentContext?: string;
  onClose?: () => void;
  isFloating?: boolean;
  onEvidenceGenerated?: (evidence: TemanBerpikirEvidence) => void;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  hintLevel?: number;
}

export const TemanBerpikirAI: React.FC<TemanBerpikirAIProps> = ({
  currentContext = 'Pembelajaran MIPA Fase F',
  onClose,
  isFloating = false,
  onEvidenceGenerated,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-01',
      sender: 'ai',
      text: `Halo! Saya ALME, Teman Berpikir Sains Anda. 🌟 Saya di sini untuk memberikan pertanyaan penuntun, scaffolding konsep, dan petunjuk berpikir kritis. Ingat, saya tidak memberikan jawaban akhir secara instan, melainkan memandu pemikiran Anda secara mandiri. Apa yang sedang ingin kita diskusikan?`,
      timestamp: 'Baru saja',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [hintLevel, setHintLevel] = useState<number>(1); // Level 1, Level 2, Level 3
  const [maxHintReached, setMaxHintReached] = useState<number>(1);

  // =========================================================================
  // HELPER FUNCTIONS SESUAI SPESIFIKASI:
  // asksForDirectAnswer(), showsConfusion(), provideNextHint(),
  // explainConceptBriefly(), askGuidingQuestion()
  // =========================================================================

  /**
   * Mendeteksi apakah murid meminta jawaban akhir secara langsung
   */
  const asksForDirectAnswer = (text: string): boolean => {
    const lower = text.toLowerCase();
    return (
      lower.includes('apa jawabannya') ||
      lower.includes('jawabannya apa') ||
      lower.includes('kasih tau jawabannya') ||
      lower.includes('berikan jawaban') ||
      lower.includes('kunci jawaban') ||
      lower.includes('jawaban akhirnya') ||
      lower.includes('tolong jawabkan') ||
      lower.includes('langsung jawab')
    );
  };

  /**
   * Mendeteksi apakah murid menunjukkan kebingungan atau stuck
   */
  const showsConfusion = (text: string): boolean => {
    const lower = text.toLowerCase();
    return (
      lower.includes('bingung') ||
      lower.includes('tidak paham') ||
      lower.includes('ga ngerti') ||
      lower.includes('sulit') ||
      lower.includes('susah') ||
      lower.includes('stuck') ||
      lower.includes('pusing') ||
      lower.includes('maksudnya')
    );
  };

  /**
   * Menyediakan petunjuk bertahap (Level 1, Level 2, Level 3)
   */
  const provideNextHint = (
    topic: string,
    currentLevel: number
  ): { hintText: string; newLevel: number } => {
    const targetLevel = Math.min(3, currentLevel);
    let hintText = '';

    if (targetLevel === 1) {
      hintText = `🔍 [Petunjuk Level 1 — Identifikasi Variabel]:\nPerhatikan variabel apa yang sengaja diubah (variabel bebas) dan apa yang diukur sebagai akibatnya (variabel terikat). Bagaimana arah perubahan nilai keduanya?`;
    } else if (targetLevel === 2) {
      hintText = `💡 [Petunjuk Level 2 — Hubungan Kausalitas]:\nIngat rumus kalor Q = m · c · ΔT. Jika intensitas energi yang diserap bertambah seiring berjalannya waktu, ke mana perginya energi tersebut? Apa dampaknya pada getaran molekul partikel air?`;
    } else {
      hintText = `🎯 [Petunjuk Level 3 — Scaffolding Lengkap]:\nBandingkan data pada t = 0 menit dengan t = 20 menit. Selisih suhunya positif (+), membuktikan terjadi penyerapan kalor secara berbanding lurus. Gunakan kata kunci: 'Semakin besar intensitas dan waktu, maka suhu akhir semakin meningkat.'`;
    }

    const nextLevel = targetLevel < 3 ? targetLevel + 1 : 3;
    return { hintText, newLevel: nextLevel };
  };

  /**
   * Memberikan penjelasan konsep singkat yang padat & esensial
   */
  const explainConceptBriefly = (topic: string): string => {
    const lower = topic.toLowerCase();
    if (lower.includes('kalor') || lower.includes('suhu')) {
      return `Konsep Singkat: Kalor adalah bentuk energi yang berpindah akibat perbedaan temperatur. Sementara Suhu adalah derajat panas atau ukuran rata-rata energi kinetik partikel zat. Saat zat menyerap kalor, suhu zat akan naik.`;
    }
    if (lower.includes('regresi') || lower.includes('pencar') || lower.includes('grafik')) {
      return `Konsep Singkat: Diagram pencar (scatter plot) memperlihatkan korelasi antara dua variabel. Garis tren yang menanjak ke kanan atas menunjukkan korelasi positif kuat (searah).`;
    }
    return `Konsep Singkat: Metode ilmiah berlandaskan pada bukti data empiris. Analisis yang kuat selalu menghubungkan data terukur dengan hipotesis awal.`;
  };

  /**
   * Mengajukan pertanyaan penuntun (guiding question)
   */
  const askGuidingQuestion = (context: string): string => {
    return `Coba kita pecahkan bersama. Informasi apa yang sudah kamu ketahui dari tabel atau pengamatan awal?`;
  };

  // =========================================================================
  // HANDLERS
  // =========================================================================

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // Evaluasi aturan Teman Berpikir secara responsif
    setTimeout(() => {
      let replyText = '';
      let assignedHintLevel: number | undefined;

      // 1. Jika murid bertanya langsung "Apa jawabannya?"
      if (asksForDirectAnswer(text)) {
        replyText = askGuidingQuestion(text);
      }
      // 2. Jika murid menunjukkan kebingungan
      else if (showsConfusion(text)) {
        const hintResult = provideNextHint(text, hintLevel);
        replyText = `Saya memahami materi ini cukup menantang. Mari kita urai langkah demi langkah:\n\n${hintResult.hintText}`;
        assignedHintLevel = hintLevel;

        const nextLvl = hintResult.newLevel;
        setHintLevel(nextLvl);
        const updatedMax = Math.max(maxHintReached, hintLevel);
        setMaxHintReached(updatedMax);

        if (onEvidenceGenerated) {
          onEvidenceGenerated({ hintLevelReached: updatedMax, scaffoldingUsed: true });
        }
      }
      // 3. Permintaan penjelasan konsep
      else if (text.toLowerCase().includes('apa itu') || text.toLowerCase().includes('jelaskan')) {
        const concept = explainConceptBriefly(text);
        replyText = `${concept}\n\nBagaimana konsep tersebut dapat Anda terapkan pada fenomena eksperimen yang sedang kita amati?`;
      }
      // 4. Analisis data & variabel
      else if (
        text.toLowerCase().includes('grafik') ||
        text.toLowerCase().includes('suhu') ||
        text.toLowerCase().includes('cahaya')
      ) {
        replyText = `Pemikiran yang bagus! Jika kita melihat tren data, apakah kenaikan suhu tersebut konstan atau melambat? Menurut pemikiran Anda, faktor lingkungan apa yang mungkin mempengaruhinya?`;
      }
      // 5. Default Socratic response
      else {
        replyText = `Pengamatan yang sangat menarik. Jika Anda membandingkan hal tersebut dengan prinsip dasar sains yang sedang dipelajari, kesimpulan awal apa yang terlintas dalam benak Anda?`;
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        hintLevel: assignedHintLevel,
      };

      setMessages((prev) => [...prev, aiMsg]);
    }, 500);
  };

  // Trigger manual Scaffolding Hint (Level 1, Level 2, Level 3)
  const handleRequestHint = () => {
    const hintResult = provideNextHint(currentContext, hintLevel);
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: `Mohon berikan Petunjuk Berpikir (Level ${hintLevel})`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const aiMsg: ChatMessage = {
      id: `ai-${Date.now() + 1}`,
      sender: 'ai',
      text: hintResult.hintText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      hintLevel: hintLevel,
    };

    setMessages((prev) => [...prev, userMsg, aiMsg]);

    const nextLvl = hintResult.newLevel;
    const reached = hintLevel;
    setHintLevel(nextLvl);
    const updatedMax = Math.max(maxHintReached, reached);
    setMaxHintReached(updatedMax);

    if (onEvidenceGenerated) {
      onEvidenceGenerated({ hintLevelReached: updatedMax, scaffoldingUsed: true });
    }
  };

  return (
    <div
      id="teman-berpikir-container"
      className={`flex flex-col bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden ${
        isFloating ? 'w-80 sm:w-96 h-[500px]' : 'h-full max-w-3xl mx-auto'
      }`}
    >
      {/* 1. Header */}
      <div className="p-4 bg-gradient-to-r from-purple-700 via-indigo-700 to-pink-700 text-white flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center border border-white/30 text-amber-300">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-extrabold text-sm sm:text-base tracking-tight">
                🤖 TEMAN BERPIKIR
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-400/40 text-pink-100 border border-pink-300/30">
                Sokratik MIPA
              </span>
            </div>
            <p className="text-[11px] text-purple-100 line-clamp-1">{currentContext}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="text-[10px] font-mono bg-white/10 px-2 py-1 rounded-xl border border-white/20 text-purple-100 hidden sm:block">
            Hint Level: {hintLevel}/3
          </div>
          {isFloating && onClose && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors text-white"
              title="Tutup dialog"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/60">
        {/* Mindful Scaffold Banner */}
        <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100 text-xs text-purple-900 flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
          <span>
            <strong>Prinsip Mindful:</strong> Teman Berpikir mendampingi proses refleksi Anda dengan pertanyaan penuntun dan scaffolding konsep tanpa memberikan jawaban akhir secara instan.
          </span>
        </div>

        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
                m.sender === 'user'
                  ? 'bg-purple-600 text-white rounded-br-xs shadow-xs'
                  : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs shadow-xs'
              }`}
            >
              {m.text}
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-1 px-1">
              <span>{m.timestamp}</span>
              {m.hintLevel && (
                <span className="font-bold text-indigo-600">• Level {m.hintLevel} Hint</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 3. Scaffolding & Action Controls */}
      <div className="p-2.5 bg-slate-100/80 border-t border-slate-200 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => handleSend('Apa jawabannya?')}
            className="text-[11px] whitespace-nowrap px-3 py-1.5 rounded-xl bg-white hover:bg-purple-50 text-slate-700 hover:text-purple-700 border border-slate-200 font-medium transition-all shrink-0"
          >
            💬 "Apa jawabannya?"
          </button>
          <button
            onClick={() => handleSend('Saya masih bingung dengan korelasi data grafik')}
            className="text-[11px] whitespace-nowrap px-3 py-1.5 rounded-xl bg-white hover:bg-purple-50 text-slate-700 hover:text-purple-700 border border-slate-200 font-medium transition-all shrink-0"
          >
            ❓ Tunjukkan Kebingungan
          </button>
        </div>

        {/* Minta Petunjuk Bertahap */}
        <button
          onClick={handleRequestHint}
          className="text-[11px] whitespace-nowrap px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold shadow-xs flex items-center gap-1 shrink-0 transition-all active:scale-95"
        >
          <Lightbulb className="w-3.5 h-3.5" />
          <span>Petunjuk Level {hintLevel}</span>
        </button>
      </div>

      {/* 4. Input bar */}
      <div className="p-3 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Tanyakan konsep atau diskusikan analisis data..."
            className="flex-1 h-10 px-3.5 rounded-xl border border-slate-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 text-xs outline-hidden"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="w-10 h-10 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white flex items-center justify-center shrink-0 transition-colors shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
