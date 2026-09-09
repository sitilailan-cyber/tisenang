import React, { useState } from 'react';
import {
  BookOpen,
  HelpCircle,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Award,
  RotateCcw,
  Calculator,
} from 'lucide-react';
import { storage } from '../../services/storage';

interface Misi1PahamiKonsepProps {
  studentId: string;
  missionId: string;
  onCompleted?: () => void;
  onClose?: () => void;
}

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  hint: string;
  explanation: string;
}

export const Misi1PahamiKonsep: React.FC<Misi1PahamiKonsepProps> = ({
  studentId,
  missionId,
  onCompleted,
  onClose,
}) => {
  // Tab within Mission 1: 'MATERI' or 'KUIS' or 'HASIL'
  const [activeTab, setActiveTab] = useState<'MATERI' | 'KUIS' | 'HASIL'>('MATERI');

  // Interactive Prediction Playground
  const [predictX, setPredictX] = useState<number>(6);

  // Dynamic Scatter Data: (Jam Belajar X vs Nilai Ujian Y)
  const scatterPoints = [
    { x: 1, y: 60 },
    { x: 2, y: 65 },
    { x: 3, y: 70 },
    { x: 4, y: 78 },
    { x: 5, y: 85 },
  ];
  // Linear regression: y = m*x + c
  // m ≈ 6.3, c ≈ 52.7
  const slope = 6.3;
  const intercept = 52.7;
  const predictedY = Math.min(100, Math.max(0, parseFloat((slope * predictX + intercept).toFixed(1))));

  // Quiz State
  const questions: QuizQuestion[] = [
    {
      id: 1,
      question:
        'Jika titik-titik pada diagram pencar (scatter plot) cenderung menyebar naik dari kiri-bawah ke kanan-atas, maka hubungan antarvariabel tersebut adalah...',
      options: [
        'Korelasi Negatif Kuat',
        'Korelasi Positif',
        'Tidak Ada Korelasi Sama Sekali',
        'Korelasi Acak Non-linear',
      ],
      correctIndex: 1,
      hint: 'Perhatikan: saat nilai variabel sumbu X bertambah, nilai variabel sumbu Y juga turut meningkat.',
      explanation:
        'Tepat! Ketika pertambahan nilai pada variabel bebas (X) diikuti dengan kenaikan variabel terikat (Y), tren tersebut dinamakan korelasi positif.',
    },
    {
      id: 2,
      question:
        'Diberikan model persamaan regresi linear penyerapan kalor: ŷ = 4x + 50. Jika lama pemanasan (x) adalah 5 menit, berapa perkiraan suhu akhir (ŷ)?',
      options: ['65°C', '70°C', '75°C', '80°C'],
      correctIndex: 1,
      hint: 'Substitusikan nilai x = 5 ke dalam persamaan ŷ = (4 × 5) + 50.',
      explanation: 'Benar! ŷ = (4 × 5) + 50 = 20 + 50 = 70°C.',
    },
    {
      id: 3,
      question:
        'Suatu penelitian menghasilkan nilai koefisien determinasi R² = 0.92 (92%). Makna fisis dari nilai tersebut adalah...',
      options: [
        'Hanya 8% data yang benar, sisanya adalah galat instrumen',
        'Model garis regresi tidak layak digunakan untuk prediksi',
        '92% variasi variabel terikat dapat dijelaskan secara linear oleh variabel bebas',
        'Suhu air naik 92 derajat setiap detik eksperimen',
      ],
      correctIndex: 2,
      hint: 'Nilai R² mengukur seberapa baik garis regresi mewakili sebaran titik-titik data aktual.',
      explanation:
        'Sangat tepat! R² = 0.92 menunjukkan bahwa 92% keragaman perubahan data Y berhasil diterangkan oleh model regresi terhadap X.',
    },
  ];

  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showHintFor, setShowHintFor] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState<number>(0);

  const handleSelectAnswer = (qId: number, optionIdx: number) => {
    if (submitted) return;
    setUserAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
  };

  const handleFinishQuiz = () => {
    let correctCount = 0;
    questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctIndex) {
        correctCount += 1;
      }
    });

    const finalScore = Math.round((correctCount / questions.length) * 100);
    setQuizScore(finalScore);
    setSubmitted(true);
    setActiveTab('HASIL');

    // Save completion in database
    storage.completeMission(studentId, missionId, finalScore, 100);

    if (onCompleted) {
      onCompleted();
    }
  };

  const getScoreCategory = (score: number) => {
    if (score >= 90) return { label: 'Sangat Berkembang', color: 'text-emerald-700 bg-emerald-100 border-emerald-300' };
    if (score >= 80) return { label: 'Berkembang', color: 'text-blue-700 bg-blue-100 border-blue-300' };
    if (score >= 60) return { label: 'Sedang Berkembang', color: 'text-amber-700 bg-amber-100 border-amber-300' };
    return { label: 'Perlu Penguatan', color: 'text-rose-700 bg-rose-100 border-rose-300' };
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              Misi 1 • Pahami Konsep
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight">
              Regresi Linear & Analisis Korelasi Sains
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm mt-1 max-w-xl">
              Mata Pelajaran: Matematika Tingkat Lanjut • Fase F (Kelas XII)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('MATERI')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'MATERI'
                  ? 'bg-white text-blue-800 shadow-md'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              📖 Konsep & Visualisasi
            </button>
            <button
              onClick={() => setActiveTab('KUIS')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'KUIS' || activeTab === 'HASIL'
                  ? 'bg-white text-blue-800 shadow-md'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              ✍️ Kuis Pemahaman (3 Soal)
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'MATERI' && (
        <div className="space-y-6">
          {/* Section 1: Pertanyaan Pemantik */}
          <div className="bg-amber-50 rounded-3xl p-5 border border-amber-200 flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-amber-900 text-sm">
                Pertanyaan Pemantik (Mindful Question)
              </h3>
              <p className="text-amber-800 text-xs sm:text-sm mt-1 leading-relaxed">
                Pernahkah Anda bertanya: Jika durasi penyinaran matahari terus meningkat, apakah suhu air di lingkungan akan naik secara beraturan tanpa batas? Bagaimana matematikawan dan saintis merumuskan pola tersebut menjadi persamaan matematis terpercaya?
              </p>
            </div>
          </div>

          {/* Section 2: Konsep Inti */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h2 className="font-display font-bold text-slate-800 text-base flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              1. Diagram Pencar & Garis Regresi Terbaik (Line of Best Fit)
            </h2>
            <div className="text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed">
              <p>
                <strong>Diagram Pencar (Scatter Plot)</strong> adalah representasi grafis koordinat pasangan titik data $(x_i, y_i)$. Diagram ini memungkinkan kita mengenali secara intuitif apakah dua fenomena memiliki hubungan sebab-akibat (korelasi positif, negatif, atau tidak berpola).
              </p>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 font-mono text-xs text-slate-800 space-y-1">
                <div className="text-indigo-700 font-bold">Persamaan Regresi Linear Sederhana:</div>
                <div className="text-sm font-bold">ŷ = mx + c</div>
                <div className="text-slate-500 text-[11px]">
                  ŷ = nilai estimasi variabel terikat (suhu / capaian) • m = gradien tren laju perubahan • c = titik potong sumbu Y saat x=0.
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Visualisasi Dinamis Interaktif */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="font-display font-bold text-slate-800 text-sm sm:text-base flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-purple-600" />
                  Visualisasi Dinamis: Scatter Plot & Garis Tren
                </h3>
                <p className="text-xs text-slate-500">
                  Uji prediksi nilai Y secara interaktif dengan mengubah input X di bawah.
                </p>
              </div>

              {/* Prediction Input Box */}
              <div className="flex items-center gap-2 bg-purple-50 px-3 py-1.5 rounded-2xl border border-purple-200">
                <span className="text-xs font-bold text-purple-900">Uji Nilai x:</span>
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.5"
                  value={predictX}
                  onChange={(e) => setPredictX(parseFloat(e.target.value) || 0)}
                  className="w-16 h-8 bg-white border border-purple-300 rounded-lg px-2 text-center text-xs font-mono font-bold text-purple-800 focus:outline-hidden focus:ring-2 focus:ring-purple-400"
                />
                <span className="text-xs font-mono font-bold text-purple-700">
                  ➔ ŷ = {predictedY}
                </span>
              </div>
            </div>

            {/* Dynamic SVG Canvas */}
            <div className="h-64 sm:h-72 w-full bg-slate-900 rounded-2xl p-4 relative overflow-hidden border border-slate-700 flex flex-col justify-end">
              <svg className="w-full h-full" viewBox="0 0 500 240" preserveAspectRatio="none">
                {/* Grid Lines */}
                {[40, 80, 120, 160, 200].map((y) => (
                  <line
                    key={y}
                    x1="40"
                    y1={y}
                    x2="480"
                    y2={y}
                    stroke="#334155"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                ))}
                {[100, 180, 260, 340, 420].map((x) => (
                  <line
                    key={x}
                    x1={x}
                    y1="20"
                    x2={x}
                    y2="210"
                    stroke="#334155"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                ))}

                {/* Axes */}
                <line x1="40" y1="210" x2="480" y2="210" stroke="#94a3b8" strokeWidth="2" />
                <line x1="40" y1="20" x2="40" y2="210" stroke="#94a3b8" strokeWidth="2" />

                {/* Linear Regression Line */}
                <line
                  x1="40"
                  y1={210 - (slope * 0 + intercept) * 1.8}
                  x2="460"
                  y2={210 - (slope * 7 + intercept) * 1.8}
                  stroke="#38bdf8"
                  strokeWidth="3"
                />

                {/* Actual Scatter Points */}
                {scatterPoints.map((pt, idx) => {
                  const cx = 40 + pt.x * 60;
                  const cy = 210 - pt.y * 1.8;
                  return (
                    <g key={idx}>
                      <circle cx={cx} cy={cy} r="6" fill="#ec4899" stroke="#ffffff" strokeWidth="2" />
                      <text
                        x={cx}
                        y={cy - 10}
                        textAnchor="middle"
                        fill="#f472b6"
                        fontSize="10"
                        fontFamily="monospace"
                      >
                        ({pt.x}, {pt.y})
                      </text>
                    </g>
                  );
                })}

                {/* User Interactive Prediction Point */}
                {predictX > 0 && predictX <= 7 && (
                  <g>
                    <circle
                      cx={40 + predictX * 60}
                      cy={210 - predictedY * 1.8}
                      r="8"
                      fill="#a855f7"
                      stroke="#ffffff"
                      strokeWidth="2.5"
                      className="animate-pulse"
                    />
                    <text
                      x={40 + predictX * 60}
                      y={210 - predictedY * 1.8 - 12}
                      textAnchor="middle"
                      fill="#c084fc"
                      fontSize="11"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      Estimasi: ({predictX}, {predictedY})
                    </text>
                  </g>
                )}
              </svg>

              {/* Legend overlay */}
              <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md rounded-xl p-2.5 border border-slate-700 text-[10px] text-slate-300 font-mono space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
                  <span>Data Aktual Hasil Eksperimen</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-0.5 bg-sky-400" />
                  <span>Model Linear: ŷ = 6.3x + 52.7</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                  <span>Titik Prediksi Interaktif</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Ringkasan & Tombol Mulai Kuis */}
          <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-display font-bold text-blue-900 text-sm">
                Siap Menguji Pemahaman Anda?
              </h4>
              <p className="text-blue-700 text-xs mt-0.5">
                Selesaikan 3 soal kuis pemahaman konsep untuk menuntaskan Misi 1 dan membuka Misi berikutnya.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('KUIS')}
              className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 shrink-0 active:scale-98"
            >
              <span>Mulai Kuis Konsep</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* QUIZ TAB */}
      {activeTab === 'KUIS' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
              <div>
                <h2 className="font-display font-bold text-slate-800 text-lg">
                  Kuis Pemahaman: Regresi Linear (3 Soal)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pilih jawaban yang paling tepat. Gunakan tombol petunjuk jika menemui keraguan.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                Reward: 100 XP
              </span>
            </div>

            {/* Questions List */}
            <div className="space-y-6">
              {questions.map((q, idx) => (
                <div
                  key={q.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold text-slate-800 text-sm leading-relaxed">
                      <span className="inline-block w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold text-center leading-6 mr-2">
                        {idx + 1}
                      </span>
                      {q.question}
                    </h3>
                    <button
                      onClick={() =>
                        setShowHintFor((prev) => (prev === q.id ? null : q.id))
                      }
                      className="text-amber-600 hover:text-amber-700 p-1.5 rounded-lg hover:bg-amber-50 transition-colors shrink-0"
                      title="Lihat Petunjuk Berpikir"
                    >
                      <HelpCircle className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Socratic Hint */}
                  {showHintFor === q.id && (
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Petunjuk Berpikir:</strong> {q.hint}
                      </div>
                    </div>
                  )}

                  {/* Option Choices */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = userAnswers[q.id] === optIdx;
                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleSelectAnswer(q.id, optIdx)}
                          className={`p-3 rounded-xl border text-left text-xs font-medium transition-all flex items-center gap-2.5 ${
                            isSelected
                              ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                              : 'bg-white border-slate-200 hover:border-blue-300 text-slate-700 hover:bg-blue-50/40'
                          }`}
                        >
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 border ${
                              isSelected
                                ? 'bg-white text-blue-600 border-white'
                                : 'bg-slate-100 text-slate-500 border-slate-300'
                            }`}
                          >
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="line-clamp-2">{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Submit Quiz Action */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Dijawab: {Object.keys(userAnswers).length} dari {questions.length} soal
              </span>
              <button
                onClick={handleFinishQuiz}
                disabled={Object.keys(userAnswers).length < questions.length}
                className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 active:scale-98"
              >
                <span>Kirim Jawaban & Selesaikan Misi</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RESULT TAB */}
      {activeTab === 'HASIL' && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-md text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Hasil Asesmen Misi 1
            </span>
            <h2 className="text-3xl font-display font-extrabold text-slate-800 mt-1">
              Skor Pemahaman: {quizScore} / 100
            </h2>

            <div className="mt-3">
              <span
                className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold border ${
                  getScoreCategory(quizScore).color
                }`}
              >
                Kategori Capaian: {getScoreCategory(quizScore).label}
              </span>
            </div>
          </div>

          {/* Explanation Recap */}
          <div className="max-w-2xl mx-auto text-left space-y-3 pt-4 border-t border-slate-100">
            <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider">
              Ulasan Pembahasan Mindful:
            </h4>
            {questions.map((q) => (
              <div key={q.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                  {userAnswers[q.id] === q.correctIndex ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                  )}
                  <span>Soal {q.id}: {q.question}</span>
                </div>
                <p className="mt-1.5 text-slate-600 pl-5 leading-relaxed">
                  {q.explanation}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={() => {
                setSubmitted(false);
                setUserAnswers({});
                setActiveTab('KUIS');
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Coba Kuis Lagi</span>
            </button>

            {onClose && (
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-2"
              >
                <span>Kembali ke Perjalanan Misi</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
