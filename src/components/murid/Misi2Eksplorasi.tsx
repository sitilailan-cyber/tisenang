import React, { useState, useEffect } from 'react';
import {
  FlaskConical,
  Activity,
  Database,
  LineChart,
  HelpCircle,
  FileCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Eye,
  Lock,
  Globe2,
  Share2,
  Plus,
} from 'lucide-react';
import { storage } from '../../services/storage';
import {
  ExperimentRow,
  ExperimentData,
  AnalysisAnswers,
  PortfolioItem,
  PortfolioVisibility,
} from '../../types';

interface Misi2EksplorasiProps {
  studentId: string;
  studentName?: string;
  classId?: string;
  className?: string;
  missionId: string;
  onNavigateToLab?: () => void;
  onCompleted?: () => void;
  onClose?: () => void;
}

type StepType = 'OBSERVE' | 'EXPERIMENT' | 'COLLECT' | 'ANALYZE' | 'CONCLUDE' | 'REFLECT';

export const Misi2Eksplorasi: React.FC<Misi2EksplorasiProps> = ({
  studentId,
  studentName = 'Murid MIPA',
  classId = 'cls-xii-1',
  className = 'XII-1',
  missionId,
  onNavigateToLab,
  onCompleted,
  onClose,
}) => {
  const [activeStep, setActiveStep] = useState<StepType>('OBSERVE');

  // Input Mode: 'MANUAL' | 'SIMULATION'
  const [inputMode, setInputMode] = useState<'MANUAL' | 'SIMULATION'>('MANUAL');

  // Default row data for manual mode
  const [tableRows, setTableRows] = useState<ExperimentRow[]>([
    { waktu: 0, suhuAwal: 25.0, intensitasCahaya: 600, suhuAkhir: 25.0 },
    { waktu: 5, suhuAwal: 25.0, intensitasCahaya: 600, suhuAkhir: 28.5 },
    { waktu: 10, suhuAwal: 25.0, intensitasCahaya: 600, suhuAkhir: 32.5 },
    { waktu: 15, suhuAwal: 25.0, intensitasCahaya: 600, suhuAkhir: 37.0 },
    { waktu: 20, suhuAwal: 25.0, intensitasCahaya: 600, suhuAkhir: 41.5 },
  ]);

  // Sensor data state
  const [hasSensorData, setHasSensorData] = useState<boolean>(false);
  const [sensorSessionInfo, setSensorSessionInfo] = useState<string>('');

  // 4 Analisis questions
  const [analysis, setAnalysis] = useState<AnalysisAnswers>({
    q1_amat: '',
    q2_pola: '',
    q3_sebabSuhu: '',
    q4_hubunganVariabel: '',
  });

  // Conclusion and Reflection
  const [conclusion, setConclusion] = useState('');
  const [reflection, setReflection] = useState('');

  // Portfolio settings
  const [portfolioTitle, setPortfolioTitle] = useState(
    'Laporan Eksperimen: Kalor dan Kenaikan Suhu Air',
  );
  const [visibility, setVisibility] = useState<PortfolioVisibility>('PRIVATE');
  const [isSavedToPortfolio, setIsSavedToPortfolio] = useState(false);

  // Check if simulation data exists in storage on mount
  useEffect(() => {
    const session = storage.getStudentExperimentSession(studentId, missionId);
    if (session && session.rows && session.rows.length > 0) {
      setHasSensorData(true);
      setSensorSessionInfo(
        `${session.rows.length} titik data simulasi terekam (${new Date(
          session.completedAt || session.recordedAt || Date.now(),
        ).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`,
      );
    } else {
      setHasSensorData(false);
    }
  }, [studentId, missionId]);

  // Handler to switch to simulation data
  const handleFetchSensorData = () => {
    const session = storage.getStudentExperimentSession(studentId, missionId);
    if (session && session.rows && session.rows.length > 0) {
      setTableRows(session.rows);
      setInputMode('SIMULATION');
      setHasSensorData(true);
    } else {
      setHasSensorData(false);
      setInputMode('SIMULATION');
    }
  };

  const handleManualRowChange = (index: number, field: keyof ExperimentRow, value: number) => {
    if (inputMode === 'SIMULATION') return; // Read-only in simulation mode
    setTableRows((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Save to Portfolio & Complete Mission
  const handleSaveToPortfolio = () => {
    if (!conclusion.trim() || !reflection.trim()) {
      alert('Mohon isi Kesimpulan dan Refleksi sebelum menyimpan ke portofolio.');
      return;
    }

    const unifiedExperimentData: ExperimentData = {
      experimentId: `exp-${studentId}-${Date.now()}`,
      studentId,
      missionId,
      inputMode,
      rows: tableRows,
      timestamp: new Date().toISOString(),
    };

    const newPortfolioItem: PortfolioItem = {
      id: `pf-${Date.now()}`,
      studentId,
      studentName,
      classId,
      className,
      title: portfolioTitle,
      subjectName: 'Fisika Eksperimental & Terapan',
      subjectId: 'sbj-fisika',
      missionId,
      date: new Date().toISOString().split('T')[0],
      category: 'Eksperimen',
      xpEarned: 150,
      visibility,
      reflectionSummary: reflection,
      conclusion,
      analysisAnswers: analysis,
      experimentData: unifiedExperimentData,
      portfolioEvidence: {
        completed: true,
        category: 'experiment',
        hasData: tableRows.length > 0,
        hasGraph: true,
        hasConclusion: !!conclusion.trim(),
        hasReflection: !!reflection.trim(),
      },
    };

    // Save to storage
    storage.savePortfolio(newPortfolioItem);

    // Complete Misi 2 in database
    storage.completeMission(studentId, missionId, 100, 150);

    setIsSavedToPortfolio(true);

    if (onCompleted) {
      onCompleted();
    }
  };

  const stepsList: { key: StepType; label: string; num: string }[] = [
    { key: 'OBSERVE', label: 'Amati', num: '1' },
    { key: 'EXPERIMENT', label: 'Eksperimen', num: '2' },
    { key: 'COLLECT', label: 'Kumpul Data', num: '3' },
    { key: 'ANALYZE', label: 'Analisis', num: '4' },
    { key: 'CONCLUDE', label: 'Simpulkan', num: '5' },
    { key: 'REFLECT', label: 'Refleksi', num: '6' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-700 via-emerald-700 to-cyan-700 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider mb-2">
              <FlaskConical className="w-3.5 h-3.5" />
              Misi 2 • Eksplorasi & Eksperimen
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight">
              Eksperimen Suhu & Kalor Virtual Lab
            </h1>
            <p className="text-teal-100 text-xs sm:text-sm mt-1 max-w-xl">
              Mata Pelajaran: Fisika Eksperimental & Terapan • Fase F (Kelas XII)
            </p>
          </div>

          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/20 backdrop-blur border border-white/30 text-white self-start sm:self-auto">
            +150 XP Reward
          </span>
        </div>

        {/* 6 Flow Steps Indicator */}
        <div className="mt-6 pt-4 border-t border-white/20 grid grid-cols-3 sm:grid-cols-6 gap-2">
          {stepsList.map((step) => {
            const isActive = activeStep === step.key;
            return (
              <button
                key={step.key}
                onClick={() => setActiveStep(step.key)}
                className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-0.5 ${
                  isActive
                    ? 'bg-white text-emerald-800 shadow-md scale-102'
                    : 'bg-white/10 hover:bg-white/20 text-white/90'
                }`}
              >
                <span className="text-[10px] opacity-75">Tahap {step.num}</span>
                <span className="truncate">{step.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 1: OBSERVE */}
      {activeStep === 'OBSERVE' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center gap-3 text-emerald-700">
            <Eye className="w-6 h-6" />
            <h2 className="font-display font-bold text-slate-800 text-lg">
              Tahap 1: Pengamatan Fenomena Saintifik (Observe)
            </h2>
          </div>

          <div className="p-4 bg-teal-50 rounded-2xl border border-teal-200 text-xs sm:text-sm text-teal-900 leading-relaxed space-y-2">
            <p className="font-bold">Fenomena Nyata:</p>
            <p>
              Saat kita menaruh bejana berisi air di bawah sumber panas radiatif (seperti lampu halogen atau cahaya matahari terfokus), kita merasakan bahwa air perlahan menjadi hangat. Tetapi mengapa laju kenaikan suhu tidak selalu sama setiap saat? Dan bagaimana energi radiasi berpindah ke molekul air?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-1.5">
              <h4 className="font-bold text-xs text-slate-800">Variabel Bebas (Manipulasi):</h4>
              <p className="text-xs text-slate-600">
                Waktu pemanasan (menit) dan Intensitas radiasi cahaya (Lux).
              </p>
            </div>
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-1.5">
              <h4 className="font-bold text-xs text-slate-800">Variabel Terikat (Respon):</h4>
              <p className="text-xs text-slate-600">
                Suhu akhir zat cair (°C) yang diukur dengan termometer presisi.
              </p>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={() => setActiveStep('EXPERIMENT')}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-2"
            >
              <span>Lanjut ke Eksperimen</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: EXPERIMENT */}
      {activeStep === 'EXPERIMENT' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-emerald-700">
              <Activity className="w-6 h-6" />
              <div>
                <h2 className="font-display font-bold text-slate-800 text-lg">
                  Tahap 2: Pelaksanaan Eksperimen (Experiment)
                </h2>
                <p className="text-xs text-slate-500">
                  Lakukan simulasi sensor di Virtual Lab atau masukkan data terukur laboratorium.
                </p>
              </div>
            </div>

            {onNavigateToLab && (
              <button
                onClick={onNavigateToLab}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5"
              >
                <FlaskConical className="w-4 h-4" />
                <span>Buka Virtual Lab & Sensor</span>
              </button>
            )}
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 space-y-3">
            <h3 className="font-bold text-xs text-emerald-900 uppercase tracking-wider">
              Status Data Sensor Laboratorium Anda:
            </h3>
            {hasSensorData ? (
              <div className="flex items-center gap-2 text-xs text-emerald-700 font-semibold">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Data sensor siap digunakan! ({sensorSessionInfo})</span>
              </div>
            ) : (
              <div className="flex items-start gap-2 text-xs text-amber-800">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">⚠️ Belum ada sesi sensor tersimpan dari Virtual Lab.</p>
                  <p className="text-amber-700 mt-1">
                    Anda dapat menjalankan Virtual Lab sekarang, ATAU langsung mengisi data secara manual pada tahap berikutnya.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => setActiveStep('OBSERVE')}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs transition-colors"
            >
              Kembali
            </button>
            <button
              onClick={() => setActiveStep('COLLECT')}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-2"
            >
              <span>Lanjut ke Pengumpulan Data</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: COLLECT DATA */}
      {activeStep === 'COLLECT' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="font-display font-bold text-slate-800 text-lg flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-600" />
                Tahap 3: Pengumpulan Data & Visualisasi (Collect Data)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Pilih mode pengisian: Ketik manual atau ambil data langsung dari sensor laboratorium.
              </p>
            </div>

            {/* Input Mode Toggle Buttons */}
            <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-2xl border border-slate-200 self-start sm:self-auto">
              <button
                id="btn-mode-manual"
                type="button"
                onClick={() => setInputMode('MANUAL')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  inputMode === 'MANUAL'
                    ? 'bg-white text-slate-800 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                ✍️ ISI MANUAL
              </button>
              <button
                id="btn-mode-simulation"
                type="button"
                onClick={() => {
                  handleFetchSensorData();
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  inputMode === 'SIMULATION'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                📡 AMBIL DATA HASIL EKSPERIMEN
              </button>
            </div>
          </div>

          {/* Warning if SIMULATION mode selected but no session found */}
          {inputMode === 'SIMULATION' && !hasSensorData && (
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-amber-900">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <strong className="block">⚠️ BELUM ADA HASIL EKSPERIMEN</strong>
                  <span className="text-amber-800">
                    Silakan lakukan eksperimen terlebih dahulu di Device Center.
                  </span>
                </div>
              </div>
              {onNavigateToLab && (
                <button
                  id="btn-open-device-center"
                  onClick={onNavigateToLab}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs shrink-0 flex items-center gap-1.5"
                >
                  <span>🔬 BUKA DEVICE CENTER</span>
                </button>
              )}
            </div>
          )}

          {/* Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>
                Mode aktif: <strong>{inputMode === 'SIMULATION' ? 'Simulasi (Read-only)' : 'Manual (Editable)'}</strong>
              </span>
              <span>{tableRows.length} Titik Pengamatan</span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100/70 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Waktu (Menit)</th>
                    <th className="py-2.5 px-3">Suhu Awal (°C)</th>
                    <th className="py-2.5 px-3">Intensitas Cahaya (Lux)</th>
                    <th className="py-2.5 px-3 text-emerald-700">Suhu Akhir Terukur (°C)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {tableRows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60">
                      <td className="py-2 px-3 font-bold text-slate-700">
                        {inputMode === 'SIMULATION' ? (
                          row.waktu
                        ) : (
                          <input
                            type="number"
                            value={row.waktu}
                            onChange={(e) =>
                              handleManualRowChange(idx, 'waktu', Number(e.target.value))
                            }
                            className="w-16 h-8 px-2 rounded-lg border border-slate-300 font-mono font-bold"
                          />
                        )}
                      </td>
                      <td className="py-2 px-3 text-slate-600">
                        {inputMode === 'SIMULATION' ? (
                          row.suhuAwal.toFixed(1)
                        ) : (
                          <input
                            type="number"
                            step="0.5"
                            value={row.suhuAwal}
                            onChange={(e) =>
                              handleManualRowChange(idx, 'suhuAwal', Number(e.target.value))
                            }
                            className="w-20 h-8 px-2 rounded-lg border border-slate-300 font-mono"
                          />
                        )}
                      </td>
                      <td className="py-2 px-3 text-slate-600">
                        {inputMode === 'SIMULATION' ? (
                          row.intensitasCahaya
                        ) : (
                          <input
                            type="number"
                            step="50"
                            value={row.intensitasCahaya}
                            onChange={(e) =>
                              handleManualRowChange(
                                idx,
                                'intensitasCahaya',
                                Number(e.target.value),
                              )
                            }
                            className="w-24 h-8 px-2 rounded-lg border border-slate-300 font-mono"
                          />
                        )}
                      </td>
                      <td className="py-2 px-3 font-bold text-emerald-600">
                        {inputMode === 'SIMULATION' ? (
                          row.suhuAkhir.toFixed(1)
                        ) : (
                          <input
                            type="number"
                            step="0.1"
                            value={row.suhuAkhir}
                            onChange={(e) =>
                              handleManualRowChange(idx, 'suhuAkhir', Number(e.target.value))
                            }
                            className="w-24 h-8 px-2 rounded-lg border border-emerald-300 bg-emerald-50/50 font-mono font-bold text-emerald-700"
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Dynamic SVG Graph */}
          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-bold flex items-center gap-1.5">
                <LineChart className="w-4 h-4 text-emerald-400" />
                Grafik Dinamis: Perubahan Suhu Akhir vs Waktu
              </span>
              <span className="font-mono text-[11px] text-emerald-400">
                Data Mode: {inputMode}
              </span>
            </div>

            <div className="h-48 w-full relative">
              <svg className="w-full h-full" viewBox="0 0 500 180" preserveAspectRatio="none">
                {/* Y-axis grid lines */}
                {[30, 70, 110, 150].map((y) => (
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

                {/* Axes */}
                <line x1="40" y1="150" x2="480" y2="150" stroke="#94a3b8" strokeWidth="2" />
                <line x1="40" y1="20" x2="40" y2="150" stroke="#94a3b8" strokeWidth="2" />

                {/* Connecting Polyline */}
                {tableRows.length > 1 && (
                  <polyline
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                    points={tableRows
                      .map((r, i) => {
                        const x = 50 + (i / (tableRows.length - 1)) * 400;
                        // Map temp (20°C to 50°C) to SVG Y (150 down to 30)
                        const y = 150 - ((r.suhuAkhir - 20) / 30) * 120;
                        return `${x},${y}`;
                      })
                      .join(' ')}
                  />
                )}

                {/* Point markers */}
                {tableRows.map((r, i) => {
                  const x = 50 + (i / (tableRows.length - 1)) * 400;
                  const y = 150 - ((r.suhuAkhir - 20) / 30) * 120;
                  return (
                    <g key={i}>
                      <circle cx={x} cy={y} r="5" fill="#34d399" stroke="#ffffff" strokeWidth="2" />
                      <text
                        x={x}
                        y={y - 8}
                        textAnchor="middle"
                        fill="#6ee7b7"
                        fontSize="10"
                        fontFamily="monospace"
                      >
                        {r.suhuAkhir}°C
                      </text>
                      <text
                        x={x}
                        y="165"
                        textAnchor="middle"
                        fill="#94a3b8"
                        fontSize="10"
                        fontFamily="monospace"
                      >
                        {r.waktu}m
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => setActiveStep('EXPERIMENT')}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs transition-colors"
            >
              Kembali
            </button>
            <button
              onClick={() => setActiveStep('ANALYZE')}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-2"
            >
              <span>Lanjut ke Analisis Data</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: ANALYZE (4 Mandatory Student Questions) */}
      {activeStep === 'ANALYZE' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="font-display font-bold text-slate-800 text-lg flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-indigo-600" />
              Tahap 4: Analisis Data Kuantitatif (Analyze)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Jawablah 4 pertanyaan saintifik berikut berdasarkan tabel dan grafik data Anda sendiri.
            </p>
          </div>

          <div className="space-y-5">
            {/* Question 1 */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                1. Apa yang kamu amati dari data eksperimen di atas?
              </label>
              <textarea
                rows={2}
                value={analysis.q1_amat}
                onChange={(e) => setAnalysis({ ...analysis, q1_amat: e.target.value })}
                placeholder="Deskripsikan perubahan nilai suhu air saat waktu pengamatan bertambah..."
                className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 text-xs outline-hidden"
              />
            </div>

            {/* Question 2 */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                2. Pola apa yang terlihat pada grafik perubahan suhu terhadap waktu?
              </label>
              <textarea
                rows={2}
                value={analysis.q2_pola}
                onChange={(e) => setAnalysis({ ...analysis, q2_pola: e.target.value })}
                placeholder="Apakah kurva berbentuk garis lurus naik (linear), eksponensial, atau mendatar?..."
                className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 text-xs outline-hidden"
              />
            </div>

            {/* Question 3 */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                3. Mengapa suhu air berubah (tinjau dari sudut pandang kalor dan energi)?
              </label>
              <textarea
                rows={2}
                value={analysis.q3_sebabSuhu}
                onChange={(e) => setAnalysis({ ...analysis, q3_sebabSuhu: e.target.value })}
                placeholder="Jelaskan mekanisme transfer energi radiasi cahaya menjadi energi termal zat cair..."
                className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 text-xs outline-hidden"
              />
            </div>

            {/* Question 4 */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                4. Apa hubungan antarvariabel (waktu, intensitas radiasi, dan kenaikan suhu)?
              </label>
              <textarea
                rows={2}
                value={analysis.q4_hubunganVariabel}
                onChange={(e) => setAnalysis({ ...analysis, q4_hubunganVariabel: e.target.value })}
                placeholder="Tuliskan hubungan proporsionalitas antarvariabel yang Anda temukan..."
                className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 text-xs outline-hidden"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => setActiveStep('COLLECT')}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs transition-colors"
            >
              Kembali
            </button>
            <button
              onClick={() => setActiveStep('CONCLUDE')}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-2"
            >
              <span>Lanjut ke Kesimpulan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: CONCLUDE */}
      {activeStep === 'CONCLUDE' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="font-display font-bold text-slate-800 text-lg flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-teal-600" />
              Tahap 5: Perumusan Kesimpulan Saintifik (Conclude)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Rumuskan kesimpulan utama yang menjawab rumusan masalah secara lugas dan berbasis bukti data.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">
              Kesimpulan Akhir Eksperimen:
            </label>
            <textarea
              rows={4}
              value={conclusion}
              onChange={(e) => setConclusion(e.target.value)}
              placeholder="Contoh: Dari percobaan termodinamika ini, dapat disimpulkan bahwa intensitas radiasi cahaya berbanding lurus dengan laju penyerapan kalor, menghasilkan kenaikan suhu air yang stabil secara linear per satuan waktu..."
              className="w-full p-4 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-teal-200 focus:border-teal-500 text-xs sm:text-sm outline-hidden leading-relaxed"
            />
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => setActiveStep('ANALYZE')}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs transition-colors"
            >
              Kembali
            </button>
            <button
              onClick={() => setActiveStep('REFLECT')}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-2"
            >
              <span>Lanjut ke Refleksi Mindful</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: REFLECT & SAVE TO PORTFOLIO */}
      {activeStep === 'REFLECT' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="font-display font-bold text-slate-800 text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Tahap 6: Refleksi Bermakna (Reflect) & Portofolio
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Refleksikan makna pembelajaran bagi kehidupan sehari-hari dan simpan karya Anda ke Portofolio Siswa.
            </p>
          </div>

          {/* Reflection input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">
              Refleksi Pembelajaran Mindful & Meaningful:
            </label>
            <textarea
              rows={3}
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="Bagaimana pemahaman tentang perpindahan kalor ini membantu saya memahami efisiensi energi di rumah atau fenomena pemanasan global?..."
              className="w-full p-4 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-amber-200 focus:border-amber-500 text-xs sm:text-sm outline-hidden leading-relaxed"
            />
          </div>

          {/* Portfolio Settings Card */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
              Pengaturan Simpan Portofolio
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-600 font-medium block mb-1">
                  Judul Portofolio:
                </label>
                <input
                  type="text"
                  value={portfolioTitle}
                  onChange={(e) => setPortfolioTitle(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-300 text-xs text-slate-800 font-bold bg-white"
                />
              </div>

              <div>
                <label className="text-xs text-slate-600 font-medium block mb-1">
                  Visibilitas Portofolio:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setVisibility('PRIVATE')}
                    className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                      visibility === 'PRIVATE'
                        ? 'bg-purple-50 border-purple-500 text-purple-900 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <Lock className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold">Pribadi (Private)</div>
                      <div className="text-[11px] text-slate-500">
                        Hanya Anda dan Guru yang dapat melihat laporan ini.
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVisibility('CLASS')}
                    className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                      visibility === 'CLASS'
                        ? 'bg-blue-50 border-blue-500 text-blue-900 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <Globe2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold">Bagikan ke Kelas ({className})</div>
                      <div className="text-[11px] text-slate-500">
                        Dapat dilihat dan diapresiasi oleh teman sekelas Anda.
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Success Feedback or Save Action */}
          {isSavedToPortfolio ? (
            <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="font-display font-bold text-emerald-900 text-base">
                Laporan Berhasil Disimpan ke Portofolio!
              </h3>
              <p className="text-xs text-emerald-700 max-w-md mx-auto">
                Misi 2 telah selesai secara tuntas. XP sebanyak <strong>+150 XP</strong> telah ditambahkan ke profil Anda.
              </p>
              {onClose && (
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors"
                >
                  Kembali ke Dashboard Misi
                </button>
              )}
            </div>
          ) : (
            <div className="pt-4 flex items-center justify-between">
              <button
                onClick={() => setActiveStep('CONCLUDE')}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs transition-colors"
              >
                Kembali
              </button>
              <button
                onClick={handleSaveToPortfolio}
                className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 active:scale-98"
              >
                <span>📁 Simpan ke Portofolio & Selesaikan Misi</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
