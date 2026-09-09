import React, { useState, useEffect } from 'react';
import {
  Thermometer,
  Sun,
  Droplets,
  Clock,
  Play,
  RotateCcw,
  CheckCircle2,
  Database,
  Info,
  Flame,
  Activity,
  ArrowRight,
} from 'lucide-react';
import { storage } from '../../services/storage';
import { ExperimentSession, ExperimentRow } from '../../types';

interface VirtualLabProps {
  studentId: string;
  missionId?: string;
  onNavigateToMisi2?: () => void;
}

export const VirtualLab: React.FC<VirtualLabProps> = ({
  studentId,
  missionId = 'msn-cls-xii-1-2',
  onNavigateToMisi2,
}) => {
  // Parameters
  const [intensitasCahaya, setIntensitasCahaya] = useState(650); // Lux
  const [suhuAwal, setSuhuAwal] = useState(25.0); // °C
  const [volumeAir, setVolumeAir] = useState(200); // mL
  const [waktuTotal, setWaktuTotal] = useState(20); // Menit (5, 10, 15, 20)

  // Simulation state
  const [isRunning, setIsRunning] = useState(false);
  const [currentMinute, setCurrentMinute] = useState(0);
  const [currentTemp, setCurrentTemp] = useState(suhuAwal);
  const [recordedRows, setRecordedRows] = useState<ExperimentRow[]>([]);
  const [isSaved, setIsSaved] = useState(false);

  // Check if there is already an existing completed session
  useEffect(() => {
    const existing = storage.getStudentExperimentSession(studentId, missionId);
    if (existing) {
      setRecordedRows(existing.rows);
      setIsSaved(true);
      if (existing.rows.length > 0) {
        setCurrentTemp(existing.rows[existing.rows.length - 1].suhuAkhir);
        setCurrentMinute(existing.rows[existing.rows.length - 1].waktu);
      }
    }
  }, [studentId, missionId]);

  // Simulation timer tick
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && currentMinute < waktuTotal) {
      timer = setTimeout(() => {
        const nextMin = currentMinute + 5;
        // Thermal heating formula:
        // Q = m * c * deltaT, P = I * A * efficiency
        // Delta T ~ (intensitas / (volumeAir * 0.4)) * (time/5)
        const delta = (intensitasCahaya / (volumeAir * 0.45)) * 0.6;
        const nextTemp = parseFloat((currentTemp + delta).toFixed(1));

        setCurrentMinute(nextMin);
        setCurrentTemp(nextTemp);

        const newRow: ExperimentRow = {
          waktu: nextMin,
          suhuAwal: suhuAwal,
          intensitasCahaya: intensitasCahaya,
          suhuAkhir: nextTemp,
        };

        setRecordedRows((prev) => {
          const updated = [...prev, newRow];
          if (nextMin >= waktuTotal) {
            setIsRunning(false);
            // Auto save session
            saveSessionToStorage(updated);
          }
          return updated;
        });
      }, 900);
    }
    return () => clearTimeout(timer);
  }, [isRunning, currentMinute, currentTemp, intensitasCahaya, volumeAir, suhuAwal, waktuTotal]);

  const handleStartSimulation = () => {
    setIsSaved(false);
    setCurrentMinute(0);
    setCurrentTemp(suhuAwal);
    const initialRow: ExperimentRow = {
      waktu: 0,
      suhuAwal: suhuAwal,
      intensitasCahaya: intensitasCahaya,
      suhuAkhir: suhuAwal,
    };
    setRecordedRows([initialRow]);
    setIsRunning(true);
  };

  const handleResetSimulation = () => {
    setIsRunning(false);
    setCurrentMinute(0);
    setCurrentTemp(suhuAwal);
    setRecordedRows([]);
    setIsSaved(false);
  };

  const saveSessionToStorage = (rowsToSave: ExperimentRow[]) => {
    const nowIso = new Date().toISOString();
    const session: ExperimentSession = {
      experimentId: `sess-${studentId}-${Date.now()}`,
      studentId,
      missionId,
      startedAt: new Date(Date.now() - waktuTotal * 60000).toISOString(),
      completedAt: nowIso,
      status: 'COMPLETED',
      source: 'SIMULATION',
      readings: rowsToSave.map((row) => ({
        timestamp: Date.now(),
        port1: { temperature: row.suhuAkhir },
        port2: { humidity: 70 },
        port3: { motion: 0 },
        port4: { voltage: 5.0, current: 0.4, conductivity: 300 },
        port5: { light: row.intensitasCahaya },
      })),
      parameters: {
        intensitasCahaya,
        suhuAwal,
        volumeAir,
        waktuPengamatan: waktuTotal,
      },
      rows: rowsToSave,
      recordedAt: nowIso,
    };

    storage.saveExperimentSession(session);
    setIsSaved(true);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur text-xs font-semibold uppercase tracking-wider mb-2">
              <Activity className="w-3.5 h-3.5 text-emerald-200" />
              Sensor & Laboratorium Virtual Fase F
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight">
              Virtual Lab: Termodinamika & Kalor Radiasi
            </h1>
            <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Kumpulkan data saintifik terkalibrasi secara real-time. Data sensor yang terekam di sini akan langsung terhubung ke tabel Misi 2 (Eksplorasi & Eksperimen).
            </p>
          </div>

          {isSaved && onNavigateToMisi2 && (
            <button
              onClick={onNavigateToMisi2}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-emerald-800 hover:bg-emerald-50 font-bold text-xs shadow-md transition-all shrink-0 active:scale-98"
            >
              <span>Buka Misi 2</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Apparatus Simulation (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-slate-800 text-base flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-500" />
                Simulasi Bejana & Radiasi Kalor
              </h2>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                    isRunning
                      ? 'bg-amber-100 text-amber-800 animate-pulse'
                      : isSaved
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isRunning ? 'bg-amber-500' : isSaved ? 'bg-emerald-500' : 'bg-slate-400'
                    }`}
                  />
                  {isRunning ? 'Eksperimen Berjalan...' : isSaved ? 'Data Siap' : 'Siap Diuji'}
                </span>
              </div>
            </div>

            {/* Virtual Apparatus Canvas Visual */}
            <div className="relative h-64 sm:h-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 rounded-2xl border border-slate-700 overflow-hidden flex items-center justify-center p-4">
              {/* Halogen Lamp Light Beam */}
              <div
                className="absolute top-0 w-44 h-44 bg-amber-400/20 rounded-full blur-2xl transition-all duration-500 pointer-events-none"
                style={{
                  opacity: isRunning ? intensitasCahaya / 800 : 0.1,
                  transform: isRunning ? 'scale(1.2)' : 'scale(0.8)',
                }}
              />

              {/* Lamp Apparatus at the top */}
              <div className="absolute top-2 flex flex-col items-center">
                <div className="w-20 h-6 bg-slate-600 rounded-t-md border-b-2 border-amber-400 flex items-center justify-center">
                  <Sun
                    className={`w-4 h-4 ${
                      isRunning ? 'text-amber-300 animate-spin' : 'text-slate-400'
                    }`}
                    style={{ animationDuration: '8s' }}
                  />
                </div>
                <div
                  className="w-0 h-0 border-l-[30px] border-l-transparent border-r-[30px] border-r-transparent border-t-[40px] border-t-amber-300/30 transition-opacity"
                  style={{ opacity: isRunning ? 1 : 0.15 }}
                />
              </div>

              {/* Center Beaker & Liquid */}
              <div className="relative mt-12 flex items-end justify-center">
                {/* Glass Beaker */}
                <div className="w-36 h-40 border-4 border-t-0 border-white/60 rounded-b-2xl backdrop-blur-xs relative overflow-hidden bg-white/5 flex flex-col justify-end">
                  {/* Water inside */}
                  <div
                    className="w-full bg-gradient-to-t from-cyan-600/70 to-blue-400/60 transition-all duration-700 relative"
                    style={{
                      height: `${(volumeAir / 500) * 80}%`,
                    }}
                  >
                    {/* Thermal bubbles / convection effect when running */}
                    {isRunning && (
                      <div className="absolute inset-0 flex justify-around items-end overflow-hidden">
                        <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce delay-100" />
                        <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce delay-300" />
                        <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce delay-500" />
                      </div>
                    )}
                  </div>

                  {/* Volume Graduation ticks */}
                  <div className="absolute left-1 inset-y-2 flex flex-col justify-between text-[8px] text-white/50 font-mono select-none">
                    <span>500mL</span>
                    <span>400mL</span>
                    <span>300mL</span>
                    <span>200mL</span>
                    <span>100mL</span>
                  </div>
                </div>

                {/* Digital Thermometer Probe inserted into water */}
                <div className="absolute right-4 top-2 w-3 h-44 bg-slate-300 rounded-full border border-slate-400 flex flex-col items-center justify-end overflow-hidden shadow-md">
                  {/* Mercury / Alcohol column */}
                  <div
                    className="w-full bg-red-500 transition-all duration-500 rounded-b-full"
                    style={{
                      height: `${Math.min(100, Math.max(10, ((currentTemp - 15) / 45) * 100))}%`,
                    }}
                  />
                </div>
              </div>

              {/* Real-time Digital Telemetry Overlays */}
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md rounded-xl p-2.5 border border-white/10 text-white font-mono text-xs space-y-1">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Waktu: {currentMinute} mnt / {waktuTotal} mnt</span>
                </div>
                <div className="flex items-center gap-2">
                  <Thermometer className="w-3.5 h-3.5 text-red-400" />
                  <span className="font-bold text-amber-300 text-sm">
                    T = {currentTemp.toFixed(1)} °C
                  </span>
                </div>
              </div>

              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md rounded-xl p-2.5 border border-white/10 text-white font-mono text-xs">
                <div className="text-[10px] text-slate-300">Sensor Kalibrasi:</div>
                <div className="text-emerald-400 font-bold">{intensitasCahaya} Lux</div>
              </div>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={handleStartSimulation}
                disabled={isRunning}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{isRunning ? 'Mengukur...' : 'Mulai Eksperimen Sensor'}</span>
              </button>

              <button
                onClick={handleResetSimulation}
                disabled={isRunning}
                className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            {isSaved && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-4 h-4" />
                <span>Tersimpan di Sensor Database</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Parameters & Live Data Log (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Parameter Settings Card */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
            <h3 className="font-display font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
              <Info className="w-4 h-4 text-indigo-600" />
              Variabel Eksperimen
            </h3>

            <div className="space-y-4">
              {/* Intensitas Cahaya */}
              <div>
                <div className="flex justify-between text-xs mb-1 font-medium">
                  <span className="text-slate-600 flex items-center gap-1">
                    <Sun className="w-3.5 h-3.5 text-amber-500" /> Intensitas Radiasi
                  </span>
                  <span className="font-mono font-bold text-slate-800">{intensitasCahaya} Lux</span>
                </div>
                <input
                  type="range"
                  min="300"
                  max="1000"
                  step="50"
                  disabled={isRunning}
                  value={intensitasCahaya}
                  onChange={(e) => setIntensitasCahaya(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              {/* Suhu Awal */}
              <div>
                <div className="flex justify-between text-xs mb-1 font-medium">
                  <span className="text-slate-600 flex items-center gap-1">
                    <Thermometer className="w-3.5 h-3.5 text-blue-500" /> Suhu Awal Air
                  </span>
                  <span className="font-mono font-bold text-slate-800">{suhuAwal} °C</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="35"
                  step="0.5"
                  disabled={isRunning}
                  value={suhuAwal}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setSuhuAwal(val);
                    if (!isRunning && recordedRows.length === 0) setCurrentTemp(val);
                  }}
                  className="w-full accent-blue-500"
                />
              </div>

              {/* Volume Air */}
              <div>
                <div className="flex justify-between text-xs mb-1 font-medium">
                  <span className="text-slate-600 flex items-center gap-1">
                    <Droplets className="w-3.5 h-3.5 text-cyan-500" /> Volume Zat Cair
                  </span>
                  <span className="font-mono font-bold text-slate-800">{volumeAir} mL</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="500"
                  step="50"
                  disabled={isRunning}
                  value={volumeAir}
                  onChange={(e) => setVolumeAir(Number(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>

              {/* Durasi Pengamatan */}
              <div>
                <div className="flex justify-between text-xs mb-1 font-medium">
                  <span className="text-slate-600 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-indigo-500" /> Rentang Waktu
                  </span>
                  <span className="font-mono font-bold text-slate-800">{waktuTotal} Menit</span>
                </div>
                <select
                  value={waktuTotal}
                  disabled={isRunning}
                  onChange={(e) => setWaktuTotal(Number(e.target.value))}
                  className="w-full h-9 px-3 rounded-xl border border-slate-300 text-xs text-slate-800 font-medium focus:ring-2 focus:ring-indigo-100"
                >
                  <option value={10}>10 Menit (3 Pengambilan Data)</option>
                  <option value={15}>15 Menit (4 Pengambilan Data)</option>
                  <option value={20}>20 Menit (5 Pengambilan Data - Rekomendasi)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Real-time Data Table Card */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-bold text-slate-800 text-sm flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-600" />
                Tabel Sensor Laboratorium
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">
                {recordedRows.length} Titik Data
              </span>
            </div>

            {recordedRows.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
                Tekan <strong>Mulai Eksperimen</strong> untuk mencatat data sensor secara otomatis.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100/70 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2 px-2.5">Waktu (mnt)</th>
                      <th className="py-2 px-2.5">T. Awal (°C)</th>
                      <th className="py-2 px-2.5">Intensitas (Lux)</th>
                      <th className="py-2 px-2.5 text-emerald-700">T. Akhir (°C)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {recordedRows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-emerald-50/40 transition-colors">
                        <td className="py-2 px-2.5 font-bold text-slate-700">{row.waktu}</td>
                        <td className="py-2 px-2.5 text-slate-500">{row.suhuAwal.toFixed(1)}</td>
                        <td className="py-2 px-2.5 text-slate-500">{row.intensitasCahaya}</td>
                        <td className="py-2 px-2.5 font-bold text-emerald-600">
                          {row.suhuAkhir.toFixed(1)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
