import React, { useState, useEffect, useRef } from 'react';
import {
  Thermometer,
  Droplets,
  Footprints,
  Zap,
  Sun,
  Play,
  Square,
  RefreshCw,
  Globe,
  Cpu,
  CheckCircle2,
  Table,
  LineChart,
  ArrowRight,
  Clock,
  Sparkles,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { sensorManager } from '../../services/sensor/SensorManager';
import { SensorReading, ExperimentSession, ExperimentRow } from '../../types';
import { storage } from '../../services/storage';

interface DeviceCenterProps {
  studentId: string;
  missionId?: string;
  onNavigateToMisi2?: () => void;
}

export const DeviceCenter: React.FC<DeviceCenterProps> = ({
  studentId,
  missionId = 'msn-cls-xii-1-2',
  onNavigateToMisi2,
}) => {
  // Live Internet connectivity state
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Experiment & Simulation States
  const [isExperimentRunning, setIsExperimentRunning] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [sessionStartTime, setSessionStartTime] = useState<string | null>(null);
  const [sessionEndTime, setSessionEndTime] = useState<string | null>(null);

  // Live sensor readings (Default realistic preview)
  const [currentReading, setCurrentReading] = useState<SensorReading>({
    timestamp: Date.now(),
    port1: { temperature: 28.5 },
    port2: { humidity: 72 },
    port3: { motion: 0 },
    port4: { voltage: 5.1, current: 0.42, conductivity: 320 },
    port5: { light: 450 },
  });

  // Recorded stream of data during active experiment
  const [collectedReadings, setCollectedReadings] = useState<SensorReading[]>([]);
  const [completedSession, setCompletedSession] = useState<ExperimentSession | null>(null);

  // Interval reference for continuous live polling
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load existing session on mount if already completed
  useEffect(() => {
    const existing = storage.getStudentExperimentSession(studentId, missionId);
    if (existing) {
      setCompletedSession(existing);
      if (existing.readings && existing.readings.length > 0) {
        setCollectedReadings(existing.readings);
        setCurrentReading(existing.readings[existing.readings.length - 1]);
      }
      setSessionStartTime(existing.startedAt);
      setSessionEndTime(existing.completedAt);
    }
  }, [studentId, missionId]);

  // Handle Start Experiment
  const handleStartExperiment = () => {
    const nowIso = new Date().toISOString();
    setSessionStartTime(nowIso);
    setSessionEndTime(null);
    setTimerSeconds(0);
    setCollectedReadings([]);
    setCompletedSession(null);
    setIsExperimentRunning(true);

    // Initial immediate read
    sensorManager.readSensors().then((initial) => {
      setCurrentReading(initial);
      setCollectedReadings([initial]);
    });

    // Start timer increment
    timerRef.current = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);

    // Polling sensor readings periodically (every 1 second)
    intervalRef.current = setInterval(async () => {
      const reading = await sensorManager.readSensors();
      setCurrentReading(reading);
      setCollectedReadings((prev) => [...prev, reading]);
    }, 1000);
  };

  // Handle Stop / Selesaikan Eksperimen
  const handleStopExperiment = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timerRef.current) clearInterval(timerRef.current);

    const nowIso = new Date().toISOString();
    setIsExperimentRunning(false);
    setSessionEndTime(nowIso);

    // Convert collected readings to standardized table rows
    const rows: ExperimentRow[] = collectedReadings.map((r, index) => ({
      waktu: index * 2, // representatif interval waktu 2 detik/satuan
      suhuAwal: collectedReadings[0]?.port1.temperature || 28.5,
      intensitasCahaya: r.port5.light,
      suhuAkhir: r.port1.temperature,
      kelembaban: r.port2.humidity,
      tegangan: r.port4.voltage,
      arus: r.port4.current,
      gerak: r.port3.motion,
    }));

    const newSession: ExperimentSession = {
      experimentId: `exp-sim-${studentId}-${Date.now()}`,
      studentId,
      missionId,
      startedAt: sessionStartTime || new Date(Date.now() - timerSeconds * 1000).toISOString(),
      completedAt: nowIso,
      status: 'COMPLETED',
      source: 'SIMULATION',
      readings: collectedReadings,
      rows: rows.length > 0 ? rows : [
        { waktu: 0, suhuAwal: 28.5, intensitasCahaya: 450, suhuAkhir: 28.5 },
      ],
      parameters: {
        intensitasCahaya: currentReading.port5.light,
        suhuAwal: collectedReadings[0]?.port1.temperature || 28.5,
        volumeAir: 200,
        waktuPengamatan: Math.max(1, Math.round(timerSeconds / 60) || 5),
      },
      recordedAt: nowIso,
    };

    // Save to durable client storage
    storage.saveExperimentSession(newSession);
    setCompletedSession(newSession);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Format seconds to mm:ss
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleResetData = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    setIsExperimentRunning(false);
    setTimerSeconds(0);
    setCollectedReadings([]);
    setCompletedSession(null);
    setSessionStartTime(null);
    setSessionEndTime(null);
  };

  // Pre-calculated rows to display in table
  const displayRows: ExperimentRow[] =
    completedSession?.rows && completedSession.rows.length > 0
      ? completedSession.rows
      : collectedReadings.map((r, idx) => ({
          waktu: idx * 2,
          suhuAwal: collectedReadings[0]?.port1.temperature || 28.5,
          intensitasCahaya: r.port5.light,
          suhuAkhir: r.port1.temperature,
          kelembaban: r.port2.humidity,
          tegangan: r.port4.voltage,
          arus: r.port4.current,
          gerak: r.port3.motion,
        }));

  return (
    <div id="device-center-page" className="space-y-6 max-w-5xl mx-auto pb-20 sm:pb-16">
      {/* 1. Header & Title */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 rounded-3xl p-6 sm:p-7 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>MODE PERANGKAT: SIMULASI WEBSITE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight flex items-center gap-2.5">
              <span>🔬 DEVICE CENTER</span>
            </h1>
            <p className="text-indigo-200/90 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Device Center adalah tempat simulasi eksperimen sensor pada website. Eksplorasi lima port sensor secara real-time untuk menghasilkan data saintifik terukur.
            </p>
          </div>

          {/* Device Status Bar */}
          <div className="flex flex-wrap items-center gap-2.5 bg-slate-800/80 backdrop-blur p-2.5 rounded-2xl border border-slate-700/80 text-xs">
            {/* Internet Status */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700">
              <Globe className={`w-3.5 h-3.5 ${isOnline ? 'text-emerald-400' : 'text-rose-400'}`} />
              <span className="text-slate-300">Internet:</span>
              <span className={`font-bold ${isOnline ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isOnline ? 'ONLINE' : 'OFFLINE'}
              </span>
            </div>

            {/* Device Center Simulation Status */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-slate-300">Device Center:</span>
              <span className="font-bold text-indigo-300">SIMULATION</span>
            </div>
          </div>
        </div>

        {/* Informative Note */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-start gap-2.5 text-xs text-indigo-200/80">
          <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <blockquote className="italic">
            “Saat ini Device Center berjalan dalam mode simulasi. Data sensor dibuat oleh simulator untuk keperluan pengembangan dan pembelajaran.”
          </blockquote>
        </div>
      </div>

      {/* 2. Lima Port Sensor (Live Cards) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <span>5 Port Sensor Laboratorium</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700">
              Tepat 5 Port
            </span>
          </h2>
          {isExperimentRunning && (
            <div className="flex items-center gap-2 text-xs font-bold text-rose-600 animate-pulse">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
              <span>🔴 EKSPERIMEN BERLANGSUNG ({formatTime(timerSeconds)})</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Port 1 - Suhu Air (DS18B20 - Simulation) */}
          <div
            id="sensor-port-1"
            className={`p-4 rounded-2xl border transition-all ${
              isExperimentRunning
                ? 'bg-rose-50/70 border-rose-200 shadow-sm'
                : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-slate-500 uppercase tracking-wider">PORT 1</span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-100 text-rose-700">
                DS18B20 - Simulation
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <Thermometer className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-display font-extrabold text-slate-800 font-mono">
                  {currentReading.port1.temperature.toFixed(1)}°C
                </div>
                <p className="text-[11px] text-slate-700 font-semibold">Port 1 - Suhu Air (DS18B20 - Simulation)</p>
              </div>
            </div>
          </div>

          {/* Port 2 - Suhu Lingkungan (DHT22 - Simulation) */}
          <div
            id="sensor-port-2"
            className={`p-4 rounded-2xl border transition-all ${
              isExperimentRunning
                ? 'bg-blue-50/70 border-blue-200 shadow-sm'
                : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-slate-500 uppercase tracking-wider">PORT 2</span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 text-blue-700">
                DHT22 - Simulation
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <Thermometer className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-display font-extrabold text-slate-800 font-mono">
                  {(currentReading.port1.temperature - 1.5).toFixed(1)}°C
                </div>
                <p className="text-[11px] text-slate-700 font-semibold">Port 2 - Suhu Lingkungan (DHT22 - Simulation)</p>
              </div>
            </div>
          </div>

          {/* Port 3 - Kelembaban (DHT22 - Simulation) */}
          <div
            id="sensor-port-3"
            className={`p-4 rounded-2xl border transition-all ${
              isExperimentRunning
                ? 'bg-cyan-50/70 border-cyan-200 shadow-sm'
                : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-slate-500 uppercase tracking-wider">PORT 3</span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-cyan-100 text-cyan-700">
                DHT22 - Simulation
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center shrink-0">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-display font-extrabold text-slate-800 font-mono">
                  {currentReading.port2.humidity}%
                </div>
                <p className="text-[11px] text-slate-700 font-semibold">Port 3 - Kelembaban (DHT22 - Simulation)</p>
              </div>
            </div>
          </div>

          {/* Port 4 - Intensitas Cahaya (LDR - Simulation) */}
          <div
            id="sensor-port-4"
            className={`p-4 rounded-2xl border transition-all ${
              isExperimentRunning
                ? 'bg-yellow-50/70 border-yellow-200 shadow-sm'
                : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-slate-500 uppercase tracking-wider">PORT 4</span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-yellow-100 text-yellow-700">
                LDR - Simulation
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-100 text-yellow-600 flex items-center justify-center shrink-0">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-display font-extrabold text-slate-800 font-mono">
                  {currentReading.port5.light} Lux
                </div>
                <p className="text-[11px] text-slate-700 font-semibold">Port 4 - Intensitas Cahaya (LDR - Simulation)</p>
              </div>
            </div>
          </div>

          {/* Port 5 - Tegangan Solar Cell (Simulation) */}
          <div
            id="sensor-port-5"
            className={`p-4 rounded-2xl border sm:col-span-2 lg:col-span-2 transition-all ${
              isExperimentRunning
                ? 'bg-indigo-50/70 border-indigo-200 shadow-sm'
                : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-slate-500 uppercase tracking-wider">PORT 5</span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-100 text-indigo-700">
                Simulation
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div className="grid grid-cols-3 gap-3 w-full">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Port 5 - Tegangan Solar Cell (Simulation)</span>
                  <span className="text-lg font-display font-extrabold text-slate-800 font-mono">
                    {currentReading.port4.voltage.toFixed(2)} V
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Arus Output</span>
                  <span className="text-lg font-display font-extrabold text-slate-800 font-mono">
                    {currentReading.port4.current.toFixed(2)} A
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Daya Output</span>
                  <span className="text-lg font-display font-extrabold text-slate-800 font-mono">
                    {(currentReading.port4.voltage * currentReading.port4.current).toFixed(2)} W
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Tombol Aksi: Mulai Simulasi Eksperimen, Hentikan Simulasi Eksperimen, Reset Data */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 uppercase font-bold">Status Simulasi</div>
            <div className={`text-sm font-bold font-mono px-2 py-0.5 rounded-md inline-block ${
              isExperimentRunning ? 'bg-rose-100 text-rose-700 animate-pulse' : 'bg-emerald-100 text-emerald-700'
            }`}>
              {isExperimentRunning ? 'BERJALAN' : (completedSession ? 'SELESAI' : 'BERJALAN / SELESAI (SIAP)')}
            </div>
          </div>
          <div className="h-8 w-px bg-slate-200 mx-2" />
          <div>
            <div className="text-xs text-slate-400 uppercase font-bold">Waktu Simulasi</div>
            <div className="text-xl font-bold font-mono text-slate-800">
              {formatTime(timerSeconds)}
            </div>
          </div>
          <div className="h-8 w-px bg-slate-200 mx-2" />
          <div>
            <div className="text-xs text-slate-400 uppercase font-bold">Data Terkumpul</div>
            <div className="text-xl font-bold font-mono text-indigo-600">
              {collectedReadings.length} Titik
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {!isExperimentRunning ? (
            <button
              id="btn-start-experiment"
              onClick={handleStartExperiment}
              className="flex-1 sm:flex-none px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Mulai Simulasi Eksperimen</span>
            </button>
          ) : (
            <button
              id="btn-stop-experiment"
              onClick={handleStopExperiment}
              className="flex-1 sm:flex-none px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 animate-pulse"
            >
              <Square className="w-4 h-4 fill-white" />
              <span>Hentikan Simulasi Eksperimen</span>
            </button>
          )}

          <button
            id="btn-reset-data"
            onClick={handleResetData}
            title="Reset Data Eksperimen"
            className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Data</span>
          </button>
        </div>
      </div>

      {/* 4. HASIL EKSPERIMEN (Setelah Eksperimen Selesai / Tersimpan) */}
      {(completedSession || collectedReadings.length > 0) && (
        <div id="section-experiment-results" className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                STATUS: SELESAI • SUMBER: SIMULATION
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900">
                📊 HASIL EKSPERIMEN
              </h2>
            </div>

            {/* Tombol Kirim ke Misi 2 */}
            {onNavigateToMisi2 && (
              <button
                id="btn-use-for-misi-2"
                onClick={onNavigateToMisi2}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 shrink-0"
              >
                <span>Kirim ke Misi 2</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Ringkasan Parameter & Waktu */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Jumlah Data</span>
              <span className="font-bold text-slate-800 text-sm font-mono">
                {displayRows.length} Titik Pengamatan
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Waktu Mulai</span>
              <span className="font-bold text-slate-800 text-sm font-mono">
                {sessionStartTime ? new Date(sessionStartTime).toLocaleTimeString() : '-'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Waktu Selesai</span>
              <span className="font-bold text-slate-800 text-sm font-mono">
                {sessionEndTime ? new Date(sessionEndTime).toLocaleTimeString() : '-'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Sumber Data</span>
              <span className="font-bold text-emerald-600 text-sm font-mono">
                SIMULATION
              </span>
            </div>
          </div>

          {/* Dynamic SVG Graph (X=Waktu, Y=Suhu Akhir Probe) */}
          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-bold flex items-center gap-1.5 text-emerald-400">
                <LineChart className="w-4 h-4" />
                Grafik Dinamis: Perubahan Suhu Probe (°C) vs Waktu Pengamatan (s)
              </span>
              <span className="font-mono text-[11px] text-slate-400">
                Mode: SIMULATION (Aktual Dinamis)
              </span>
            </div>

            <div className="h-44 w-full relative">
              <svg className="w-full h-full" viewBox="0 0 500 160" preserveAspectRatio="none">
                {/* Horizontal Grid lines */}
                {[20, 60, 100, 140].map((y) => (
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
                <line x1="40" y1="140" x2="480" y2="140" stroke="#94a3b8" strokeWidth="2" />
                <line x1="40" y1="20" x2="40" y2="140" stroke="#94a3b8" strokeWidth="2" />

                {/* Polyline */}
                {displayRows.length > 1 && (
                  <polyline
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                    points={displayRows
                      .map((r, i) => {
                        const x = 50 + (i / (displayRows.length - 1)) * 420;
                        const minTemp = 20;
                        const maxTemp = 50;
                        const clamped = Math.min(maxTemp, Math.max(minTemp, r.suhuAkhir));
                        const y = 140 - ((clamped - minTemp) / (maxTemp - minTemp)) * 115;
                        return `${x},${y}`;
                      })
                      .join(' ')}
                  />
                )}

                {/* Data point dots */}
                {displayRows.map((r, i) => {
                  const x = 50 + (i / (Math.max(1, displayRows.length - 1))) * 420;
                  const minTemp = 20;
                  const maxTemp = 50;
                  const clamped = Math.min(maxTemp, Math.max(minTemp, r.suhuAkhir));
                  const y = 140 - ((clamped - minTemp) / (maxTemp - minTemp)) * 115;
                  return (
                    <g key={i}>
                      <circle cx={x} cy={y} r="4" fill="#34d399" stroke="#065f46" strokeWidth="1.5" />
                    </g>
                  );
                })}
              </svg>
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-mono px-8">
              <span>Mulai (t=0)</span>
              <span>Parameter Dinamis Terukur Sesuai Interval Sensor</span>
              <span>Selesai (t={displayRows.length * 2}s)</span>
            </div>
          </div>

          {/* Tabel Hasil Eksperimen */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Table className="w-4 h-4 text-indigo-600" />
              Tabel Rekapitulasi Data Sensor (5 Port)
            </h3>
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">No</th>
                    <th className="py-2.5 px-3">Waktu (s)</th>
                    <th className="py-2.5 px-3 text-rose-700">Port 1: Suhu (°C)</th>
                    <th className="py-2.5 px-3 text-cyan-700">Port 2: Lembab (%)</th>
                    <th className="py-2.5 px-3 text-amber-700">Port 3: Gerak</th>
                    <th className="py-2.5 px-3 text-indigo-700">Port 4: V / I / Cond</th>
                    <th className="py-2.5 px-3 text-yellow-700">Port 5: Cahaya (Lux)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {displayRows.map((r, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2 px-3 text-slate-400">{idx + 1}</td>
                      <td className="py-2 px-3 font-bold text-slate-700">{r.waktu}</td>
                      <td className="py-2 px-3 font-bold text-rose-600">{r.suhuAkhir.toFixed(1)}°C</td>
                      <td className="py-2 px-3 text-cyan-600">{r.kelembaban || 72}%</td>
                      <td className="py-2 px-3 text-amber-600">{r.gerak === 1 ? 'Aktif (1)' : 'Tenang (0)'}</td>
                      <td className="py-2 px-3 text-indigo-600">
                        {r.tegangan ? `${r.tegangan}V | ${r.arus}A` : '5.10V | 0.42A'}
                      </td>
                      <td className="py-2 px-3 text-yellow-600">{r.intensitasCahaya} lux</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
