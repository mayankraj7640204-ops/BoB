import React, { useState, useEffect, useRef } from 'react';
import {
  Activity,
  Cpu,
  Wifi,
  AlertTriangle,
  Radio,
  Zap,
  Play,
  Square,
  Flame,
  ShieldAlert,
  Terminal,
  Sliders,
  Layers,
  Eye,
  CheckCircle2,
  Clock,
  Database,
  TrendingUp,
  Server,
  Share2,
  HardDrive,
  RefreshCw,
  Gauge,
  Thermometer,
  Droplets,
  ExternalLink,
  ChevronRight,
  Maximize2,
  Minimize2,
  Power,
  RotateCcw,
} from 'lucide-react';
import bobDataRaw from '../data/bobLabsData.json';
import { BobLabsData, DeviceNode } from '../types';
import { AboutDossierView } from '../components/AboutDossierView';

const bobData = bobDataRaw as unknown as BobLabsData;

interface BobLabsDashboardProps {
  currentTab: string;
  onNavigateTab: (tab: string) => void;
  isDarkMode: boolean;
  onOpenRotunda: () => void;
  onOpenAbout?: () => void;
}

export const BobLabsDashboard: React.FC<BobLabsDashboardProps> = ({
  currentTab,
  onNavigateTab,
  isDarkMode,
  onOpenRotunda,
  onOpenAbout,
}) => {
  // HUD Diagnostics State (Carter Ogunsola HUD Bar)
  const [hudTime, setHudTime] = useState<string>('');
  const [hudFps, setHudFps] = useState<number>(60.0);
  const [hudMem, setHudMem] = useState<number>(42.4);

  // Simulation Settings State
  const [deviceCount, setDeviceCount] = useState<number>(5);
  const [pubInterval, setPubInterval] = useState<number>(2);
  const [minTemp, setMinTemp] = useState<number>(16);
  const [maxTemp, setMaxTemp] = useState<number>(32);
  const [minHum, setMinHum] = useState<number>(25);
  const [maxHum, setMaxHum] = useState<number>(75);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [pid, setPid] = useState<number | null>(48219);
  const [simUptime, setSimUptime] = useState<number>(142);

  // Live sensor fleet state with 5 rich nodes
  const [sensors, setSensors] = useState<DeviceNode[]>(bobData.deviceFleet);
  const [deliveredCount, setDeliveredCount] = useState<number>(1090);
  const [selectedSensorId, setSelectedSensorId] = useState<string>('sensor_002');
  const [targetedSensors, setTargetedSensors] = useState<string[]>([
    'sensor_001',
    'sensor_002',
    'sensor_003',
  ]);

  // Failure testing / Chaos state
  const [selectedFailure, setSelectedFailure] = useState<string>('device-offline');
  const [failureDuration, setFailureDuration] = useState<number>(30);
  const [isInjecting, setIsInjecting] = useState<boolean>(false);
  const [injectionCountdown, setInjectionCountdown] = useState<number>(0);
  const [activeFailureNotice, setActiveFailureNotice] = useState<string | null>(null);
  const [failureStats, setFailureStats] = useState({
    delayed: 18,
    released: 14,
    dropped: 6,
    skipped: 2,
    mttd: '142ms',
    mttr: '1.8s',
    resilienceScore: 97.4,
  });

  // Chaos Console Log
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '[SYSTEM] BOB Labs IoT runtime initialized on 127.0.0.1:1883',
    '[MQTT] Broker handshakes verified. Transport: WebSocket/TCP dual stack',
    '[FLEET] 5 virtual devices registered on topic bob-labs/devices/#',
    '[TELEMETRY] Sensor heartbeat cadence locked at 1.00 Hz',
    '[CHAOS] Fault injector engine armed. Ready for scenario trigger',
  ]);

  // Live temperature trend points
  const [trendPoints, setTrendPoints] = useState<number[]>([
    21.8, 22.4, 21.6, 23.1, 21.9, 22.8, 21.83, 22.0, 21.83, 22.1, 21.9, 22.4, 21.83,
  ]);

  // Live telemetry message stream table
  const [telemetryLogs, setTelemetryLogs] = useState<
    Array<{
      id: string;
      topic: string;
      device: string;
      temp: number;
      hum: number;
      status: string;
      time: string;
      latency: number;
    }>
  >([
    {
      id: 'log-1',
      topic: 'bob-labs/devices/sensor_002/telemetry',
      device: 'sensor_002',
      temp: 21.83,
      hum: 46.87,
      status: 'active',
      time: '12:52:11 PM',
      latency: 14,
    },
    {
      id: 'log-2',
      topic: 'bob-labs/devices/sensor_001/telemetry',
      device: 'sensor_001',
      temp: 22.21,
      hum: 51.33,
      status: 'active',
      time: '12:52:09 PM',
      latency: 18,
    },
    {
      id: 'log-3',
      topic: 'bob-labs/devices/sensor_003/telemetry',
      device: 'sensor_003',
      temp: 28.4,
      hum: 62.0,
      status: 'active',
      time: '12:52:08 PM',
      latency: 22,
    },
  ]);

  // External Integration state
  const [newAppName, setNewAppName] = useState('');
  const [newEndpoint, setNewEndpoint] = useState('');
  const [integrationSuccess, setIntegrationSuccess] = useState(false);
  const [webhookDelivered, setWebhookDelivered] = useState(1090);

  // HUD Clock & Live Diagnostics effect (Carter Ogunsola Signature)
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const ms = String(now.getMilliseconds()).padStart(3, '0');
      setHudTime(`${now.toTimeString().split(' ')[0]}.${ms}`);
      setHudMem(+(42.0 + Math.random() * 1.5).toFixed(1));
      setHudFps(+(59.5 + Math.random() * 0.9).toFixed(1));
      if (isSimulating) {
        setSimUptime((u) => u + 1);
      }
    }, 100);
    return () => clearInterval(timer);
  }, [isSimulating]);

  // Simulation tick loop
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setSensors((prev) =>
        prev.map((s) => {
          const deltaT = (Math.random() - 0.48) * 0.35;
          const deltaH = (Math.random() - 0.48) * 0.55;
          const newT = +(s.temperature + deltaT).toFixed(2);
          const newH = +(s.humidity + deltaH).toFixed(2);
          return {
            ...s,
            temperature: Math.min(maxTemp, Math.max(minTemp, newT)),
            humidity: Math.min(maxHum, Math.max(minHum, newH)),
            messages: s.messages + 1,
            lastReading: 'Just now',
          };
        })
      );

      setDeliveredCount((c) => c + deviceCount);
      setWebhookDelivered((c) => c + 1);

      const nowStr = new Date().toLocaleTimeString();
      const devList = ['sensor_001', 'sensor_002', 'sensor_003', 'sensor_004', 'sensor_005'];
      const chosenDev = devList[Math.floor(Math.random() * devList.length)];
      const tVal = +(21 + Math.random() * 2.2).toFixed(2);
      const hVal = +(46 + Math.random() * 6.5).toFixed(2);

      setTelemetryLogs((prev) => [
        {
          id: `log-${Date.now()}-${Math.random()}`,
          topic: `bob-labs/devices/${chosenDev}/telemetry`,
          device: chosenDev,
          temp: tVal,
          hum: hVal,
          status: 'streaming',
          time: nowStr,
          latency: Math.floor(12 + Math.random() * 14),
        },
        ...prev.slice(0, 19),
      ]);

      setTrendPoints((prev) => [...prev.slice(1), tVal]);
    }, pubInterval * 1000);

    return () => clearInterval(interval);
  }, [isSimulating, pubInterval, minTemp, maxTemp, minHum, maxHum, deviceCount]);

  // Countdown timer for active injection
  useEffect(() => {
    if (!isInjecting || injectionCountdown <= 0) return;
    const t = setInterval(() => {
      setInjectionCountdown((c) => {
        if (c <= 1) {
          setIsInjecting(false);
          setActiveFailureNotice(null);
          setTerminalLogs((l) => [
            `[${new Date().toLocaleTimeString()}] [CHAOS] Scenario concluded. Target fleet auto-healed.`,
            ...l.slice(0, 30),
          ]);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [isInjecting, injectionCountdown]);

  const handleStartSimulation = () => {
    setIsSimulating(true);
    setPid(Math.floor(10000 + Math.random() * 90000));
    setTerminalLogs((l) => [
      `[${new Date().toLocaleTimeString()}] [RUNTIME] Simulator process spawned with PID ${pid || 48219}`,
      `[${new Date().toLocaleTimeString()}] [RUNTIME] 5 virtual edge workers active on interval ${pubInterval}s`,
      ...l.slice(0, 30),
    ]);
  };

  const handleStopSimulation = () => {
    setIsSimulating(false);
    setPid(null);
    setTerminalLogs((l) => [
      `[${new Date().toLocaleTimeString()}] [RUNTIME] Simulator process stopped by user.`,
      ...l.slice(0, 30),
    ]);
  };

  const handleInjectFailure = () => {
    setIsInjecting(true);
    setInjectionCountdown(failureDuration);
    const notice = `Chaos scenario [${selectedFailure.toUpperCase()}] injected on [${targetedSensors.join(
      ', '
    )}] for ${failureDuration}s.`;
    setActiveFailureNotice(notice);

    setFailureStats((prev) => ({
      ...prev,
      dropped: prev.dropped + Math.floor(Math.random() * 12 + 4),
      delayed: prev.delayed + Math.floor(Math.random() * 15 + 8),
      skipped: prev.skipped + Math.floor(Math.random() * 5 + 1),
      resilienceScore: +(prev.resilienceScore - (Math.random() * 1.5 + 0.5)).toFixed(1),
    }));

    setTerminalLogs((l) => [
      `[${new Date().toLocaleTimeString()}] [CHAOS INJECTION] Triggered fault: ${selectedFailure.toUpperCase()}`,
      `[${new Date().toLocaleTimeString()}] [CHAOS] Target nodes: ${targetedSensors.join(', ')}`,
      `[${new Date().toLocaleTimeString()}] [FAULT] Injecting simulated packet drop & socket delay for ${failureDuration}s`,
      ...l.slice(0, 30),
    ]);
  };

  const toggleTargetSensor = (id: string) => {
    setTargetedSensors((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCreateIntegration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppName || !newEndpoint) return;
    setIntegrationSuccess(true);
    setTerminalLogs((l) => [
      `[${new Date().toLocaleTimeString()}] [CONNECTOR] New webhook profile created: ${newAppName}`,
      `[${new Date().toLocaleTimeString()}] [CONNECTOR] Validating endpoint handshake with ${newEndpoint}... OK (200)`,
      ...l.slice(0, 30),
    ]);
    setTimeout(() => {
      setIntegrationSuccess(false);
      setNewAppName('');
      setNewEndpoint('');
    }, 3000);
  };

  const activeSensor = sensors.find((s) => s.id === selectedSensorId) || sensors[0];

  return (
    <div
      className={`min-h-[calc(100vh-58px)] font-sans transition-colors relative selection:bg-indigo-600 selection:text-white ${
        isDarkMode
          ? 'bg-[#06080d] text-[#f1f5f9]'
          : 'bg-[#f4f7fc] text-[#0f172a]'
      }`}
    >
      {/* Carter Ogunsola Signature Ambient Backdrop Glow & Technical Dot-Matrix */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div
          className={`absolute -top-40 left-1/2 -translate-x-1/2 w-[1200px] h-[550px] rounded-full blur-[140px] opacity-25 ${
            isDarkMode
              ? 'bg-gradient-to-b from-indigo-500 via-purple-600 to-transparent'
              : 'bg-gradient-to-b from-indigo-300 via-sky-200 to-transparent opacity-40'
          }`}
        />
        <div
          className={`absolute inset-0 ${
            isDarkMode
              ? 'bg-[radial-gradient(#ffffff0d_1px,transparent_1px)]'
              : 'bg-[radial-gradient(#0000000a_1px,transparent_1px)]'
          } [background-size:24px_24px]` }
        />
      </div>

      {/* =========================================================================
          CARTER OGUNSOLA LIVE DEVELOPER HUD STATUS BAR
         ========================================================================= */}
      <div
        className={`relative z-20 border-b backdrop-blur-md px-4 md:px-8 py-2 font-mono text-[11px] transition-colors ${
          isDarkMode
            ? 'bg-[#090d16]/90 border-white/10 text-slate-400'
            : 'bg-white/90 border-slate-200 text-slate-600'
        }`}
      >
        <div className="max-w-[1700px] mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Left: Telemetry HUD Indicators */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1.5 text-indigo-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
              <span>SYS_TIME: {hudTime || '17:28:00.000'}</span>
            </div>
            <span className="opacity-30">|</span>
            <div className="hidden sm:flex items-center space-x-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>FPS: {hudFps}</span>
            </div>
            <span className="hidden sm:inline opacity-30">|</span>
            <div className="hidden md:flex items-center space-x-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>HEAP: {hudMem} MB</span>
            </div>
            <span className="hidden md:inline opacity-30">|</span>
            <div className="hidden lg:flex items-center space-x-1.5 text-amber-400">
              <Radio className="w-3.5 h-3.5" />
              <span>BROKER: 127.0.0.1:1883</span>
            </div>
          </div>

          {/* Right: Quick Action Pill & Open 3D Rotunda */}
          <div className="flex items-center space-x-3">
            <span className="hidden xl:inline text-[10px] text-slate-500 tracking-wider uppercase">
              BITS2WAVE • TEAM AURA 999+
            </span>
            <button
              onClick={onOpenRotunda}
              className={`px-3 py-1 rounded-md border font-mono text-[10px] font-bold tracking-wider uppercase flex items-center space-x-1.5 transition-all shadow-xs ${
                isDarkMode
                  ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40 hover:bg-indigo-600 hover:text-white'
                  : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-600 hover:text-white'
              }`}
            >
              <span>🏛️</span>
              <span>Open 3D Lab Tour</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Dashboard Container */}
      <div className="relative z-10 max-w-[1700px] mx-auto px-4 md:px-8 py-6 space-y-6">
        {/* =========================================================================
            FEATURE 1: OVERVIEW & MISSION CONTROL
           ========================================================================= */}
        {currentTab === 'overview' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Top Mission Control Banner */}
            <div
              className={`relative overflow-hidden p-6 md:p-8 rounded-2xl border backdrop-blur-xl ${
                isDarkMode
                  ? 'bg-[#0d121f]/90 border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]'
                  : 'bg-white/95 border-slate-200 shadow-md'
              }`}
            >
              {/* Corner crosshairs */}
              <div className="absolute top-2 left-2 font-mono text-[9px] text-slate-600 select-none">+</div>
              <div className="absolute top-2 right-2 font-mono text-[9px] text-slate-600 select-none">+</div>
              <div className="absolute bottom-2 left-2 font-mono text-[9px] text-slate-600 select-none">+</div>
              <div className="absolute bottom-2 right-2 font-mono text-[9px] text-slate-600 select-none">+</div>

              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-mono text-xs uppercase tracking-widest text-emerald-500 font-bold">
                      SYSTEM STATUS: FULLY OPERATIONAL
                    </span>
                  </div>
                  <h1 className={`text-2xl md:text-4xl font-extrabold tracking-tight mt-1 font-sans ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    BOB Labs Mission Control
                  </h1>
                  <p className={`text-sm mt-1 max-w-2xl font-sans ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Real-time hardware emulation harness, multi-topic MQTT pub/sub streaming, and
                    continuous chaos verification for IoT edge nodes.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div
                    className={`p-3 rounded-xl border font-mono text-xs ${
                      isDarkMode ? 'bg-[#090d16] border-white/10' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <span className="text-[10px] text-slate-500 uppercase block">ACTIVE THREADS</span>
                    <span className={`text-lg font-bold ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>{sensors.length} Nodes</span>
                  </div>

                  <div
                    className={`p-3 rounded-xl border font-mono text-xs ${
                      isDarkMode ? 'bg-[#090d16] border-white/10' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <span className="text-[10px] text-slate-500 uppercase block">DELIVERED TELEMETRY</span>
                    <span className={`text-lg font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>{deliveredCount.toLocaleString()} pkts</span>
                  </div>

                  <button
                    onClick={isSimulating ? handleStopSimulation : handleStartSimulation}
                    className={`px-5 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition-all shadow-md ${
                      isSimulating
                        ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/30'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30'
                    }`}
                  >
                    {isSimulating ? <Square className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
                    <span>{isSimulating ? 'Stop Simulator' : 'Start Simulator'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 5 Hardware Fleet Cards with Real Photos & Telemetry */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400">
                  CONNECTED HARDWARE FLEET (5 ACTIVE NODES)
                </span>
                <span className="text-[11px] font-mono text-indigo-400">● 100% Online</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {sensors.map((s, idx) => {
                  const photos = [
                    '/images/bob-labs/temp-humidity-sensor.png',
                    '/images/bob-labs/arduino-controller.jpg',
                    '/images/bob-labs/smart-agriculture-node.jpg',
                    '/images/bob-labs/smart-city-traffic.jpg',
                    '/images/bob-labs/predictive-maintenance.jpg',
                  ];
                  return (
                    <div
                      key={s.id}
                      onClick={() => setSelectedSensorId(s.id)}
                      data-cursor="inspect"
                      onMouseMove={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
                        e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
                        const rotX = ((y / rect.height) - 0.5) * -10;
                        const rotY = ((x / rect.width) - 0.5) * 10;
                        e.currentTarget.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)';
                      }}
                      className={`cyera-tilt-card relative p-5 rounded-2xl border transition-all cursor-pointer backdrop-blur-md group overflow-hidden ${
                        selectedSensorId === s.id
                          ? 'border-indigo-500 bg-indigo-500/10 shadow-[0_0_25px_rgba(99,102,241,0.25)]'
                          : isDarkMode
                          ? 'bg-[#0d121f]/80 border-white/10 hover:border-white/20'
                          : 'bg-white border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      {/* Dynamic cursor-following sheen */}
                      <div
                        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                        style={{
                          background: 'radial-gradient(280px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(99, 102, 241, 0.12), transparent 70%)',
                        }}
                      />
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <img
                            src={photos[idx % photos.length]}
                            alt={s.name}
                            className={`w-11 h-11 rounded-xl object-cover border ${isDarkMode ? 'border-white/10 bg-slate-900' : 'border-slate-200 bg-slate-100'}`}
                          />
                          <div>
                            <span className={`font-mono text-xs font-bold block ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{s.name}</span>
                            <span className="text-[11px] text-slate-400 block">{s.type}</span>
                          </div>
                        </div>

                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          ● Active
                        </span>
                      </div>

                      <div className={`grid grid-cols-2 gap-3 mt-4 pt-3 border-t font-mono text-xs ${isDarkMode ? 'border-white/5' : 'border-slate-200'}`}>
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase block">TEMPERATURE</span>
                          <span className="text-base font-bold text-amber-400">{s.temperature} °C</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase block">HUMIDITY</span>
                          <span className="text-base font-bold text-cyan-400">{s.humidity} %</span>
                        </div>
                      </div>

                      <div className="mt-3 text-[10px] font-mono text-slate-500 flex justify-between">
                        <span>TOPIC: {s.topic.split('/').slice(-2).join('/')}</span>
                        <span>{s.messages} msgs</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Row: Wave Monitor & Terminal Log */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Telemetry Wave Monitor */}
              <div
                className={`lg:col-span-2 p-6 rounded-2xl border backdrop-blur-xl ${
                  isDarkMode ? 'bg-[#0d121f]/90 border-white/10' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-500 tracking-wider">
                      TIME-SERIES TELEMETRY STREAM
                    </span>
                    <h3 className="text-lg font-bold font-sans">
                      {activeSensor.name} — Temperature & Signal Waveform
                    </h3>
                  </div>
                  <span className="font-mono text-xs px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-400 font-bold">
                    {activeSensor.temperature} °C
                  </span>
                </div>

                <div className="h-44 w-full relative mt-4">
                  <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="waveGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <polyline
                      fill="none"
                      stroke="#6366f1"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={trendPoints
                        .map((pt, i) => {
                          const x = (i / (trendPoints.length - 1)) * 700;
                          const y = 135 - (pt - 18) * 16;
                          return `${x},${y}`;
                        })
                        .join(' ')}
                    />
                  </svg>
                  <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-2">
                    <span>T - 30 SECONDS</span>
                    <span>REAL-TIME STREAM (1 HZ)</span>
                  </div>
                </div>
              </div>

              {/* Terminal Console Feed */}
              <div
                className={`p-6 rounded-2xl border backdrop-blur-xl flex flex-col ${
                  isDarkMode ? 'bg-[#090d16] border-white/10' : 'bg-slate-900 text-white border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                  <div className="flex items-center space-x-2">
                    <Terminal className="w-4 h-4 text-indigo-400" />
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-300">
                      Live Lab Terminal
                    </span>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 font-mono text-[11px] text-slate-400 leading-relaxed max-h-48 pr-1">
                  {terminalLogs.slice(0, 8).map((log, i) => (
                    <div key={i} className="truncate hover:text-white transition-colors">
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            FEATURE 2: SIMULATION CONTROL & RUNTIME
           ========================================================================= */}
        {currentTab === 'simulation' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 Cols: Simulation Configuration Controls */}
              <div
                className={`lg:col-span-2 p-6 md:p-8 rounded-2xl border backdrop-blur-xl relative ${
                  isDarkMode ? 'bg-[#0d121f]/90 border-white/10' : 'bg-white border-slate-200'
                }`}
              >
                <div className={`flex items-center justify-between pb-4 border-b mb-6 ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold">
                      VIRTUAL DEVICE RUNTIME
                    </span>
                    <h2 className="text-xl md:text-2xl font-bold font-sans mt-0.5">
                      Simulation Settings & Engine Parameters
                    </h2>
                  </div>
                  <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
                    <Sliders className="w-5 h-5" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-sans">
                  {/* Device Count Stepper */}
                  <div className={`p-4 rounded-xl border ${isDarkMode ? 'border-white/5 bg-slate-900/30' : 'border-slate-200 bg-slate-50'}`}>
                    <label className={`block font-bold mb-1 font-mono ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>
                      Virtual Device Count
                    </label>
                    <div className="flex items-center space-x-3 mt-2">
                      <button
                        onClick={() => setDeviceCount((c) => Math.max(1, c - 1))}
                        className={`w-9 h-9 rounded-lg border text-lg font-bold flex items-center justify-center transition-colors ${
                          isDarkMode
                            ? 'border-white/10 bg-slate-800 text-white hover:bg-slate-700'
                            : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-100 shadow-2xs'
                        }`}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        max="50"
                        value={deviceCount}
                        onChange={(e) => setDeviceCount(Math.max(1, parseInt(e.target.value) || 1))}
                        className={`w-24 text-center py-1.5 rounded-lg border text-base font-bold font-mono ${
                          isDarkMode
                            ? 'border-white/10 bg-slate-900 text-indigo-400'
                            : 'border-slate-300 bg-white text-indigo-600 shadow-2xs'
                        }`}
                      />
                      <button
                        onClick={() => setDeviceCount((c) => Math.min(50, c + 1))}
                        className={`w-9 h-9 rounded-lg border text-lg font-bold flex items-center justify-center transition-colors ${
                          isDarkMode
                            ? 'border-white/10 bg-slate-800 text-white hover:bg-slate-700'
                            : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-100 shadow-2xs'
                        }`}
                      >
                        +
                      </button>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono mt-2 block">
                      Range: 1 to 50 simulated edge workers.
                    </span>
                  </div>

                  {/* Publishing Interval */}
                  <div className={`p-4 rounded-xl border ${isDarkMode ? 'border-white/5 bg-slate-900/30' : 'border-slate-200 bg-slate-50'}`}>
                    <label className={`block font-bold mb-1 font-mono ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>
                      Publishing Interval (Cadence)
                    </label>
                    <div className="flex items-center space-x-3 mt-2">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={pubInterval}
                        onChange={(e) => setPubInterval(parseInt(e.target.value) || 2)}
                        className="w-full accent-indigo-500"
                      />
                      <span className="font-mono text-base font-bold text-indigo-500 w-12 text-right">
                        {pubInterval}s
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono mt-2 block">
                      Cadence frequency: {(1 / pubInterval).toFixed(2)} Hz
                    </span>
                  </div>

                  {/* Temperature Boundaries */}
                  <div className={`p-4 rounded-xl border ${isDarkMode ? 'border-white/5 bg-slate-900/30' : 'border-slate-200 bg-slate-50'}`}>
                    <label className={`block font-bold mb-2 font-mono flex items-center space-x-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>
                      <Thermometer className="w-4 h-4 text-amber-500" />
                      <span>Environmental Temp Range</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-[10px] text-slate-400 font-mono block">MIN TEMP</span>
                        <input
                          type="number"
                          value={minTemp}
                          onChange={(e) => setMinTemp(parseInt(e.target.value) || 0)}
                          className={`w-full px-3 py-1.5 rounded-lg border font-mono text-sm font-bold text-amber-500 ${
                            isDarkMode ? 'border-white/10 bg-slate-900' : 'border-slate-300 bg-white shadow-2xs'
                          }`}
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-mono block">MAX TEMP</span>
                        <input
                          type="number"
                          value={maxTemp}
                          onChange={(e) => setMaxTemp(parseInt(e.target.value) || 40)}
                          className={`w-full px-3 py-1.5 rounded-lg border font-mono text-sm font-bold text-amber-500 ${
                            isDarkMode ? 'border-white/10 bg-slate-900' : 'border-slate-300 bg-white shadow-2xs'
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Humidity Boundaries */}
                  <div className={`p-4 rounded-xl border ${isDarkMode ? 'border-white/5 bg-slate-900/30' : 'border-slate-200 bg-slate-50'}`}>
                    <label className={`block font-bold mb-2 font-mono flex items-center space-x-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>
                      <Droplets className="w-4 h-4 text-cyan-500" />
                      <span>Relative Humidity Range</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-[10px] text-slate-400 font-mono block">MIN HUMIDITY</span>
                        <input
                          type="number"
                          value={minHum}
                          onChange={(e) => setMinHum(parseInt(e.target.value) || 0)}
                          className={`w-full px-3 py-1.5 rounded-lg border font-mono text-sm font-bold text-cyan-500 ${
                            isDarkMode ? 'border-white/10 bg-slate-900' : 'border-slate-300 bg-white shadow-2xs'
                          }`}
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-mono block">MAX HUMIDITY</span>
                        <input
                          type="number"
                          value={maxHum}
                          onChange={(e) => setMaxHum(parseInt(e.target.value) || 100)}
                          className={`w-full px-3 py-1.5 rounded-lg border font-mono text-sm font-bold text-cyan-500 ${
                            isDarkMode ? 'border-white/10 bg-slate-900' : 'border-slate-300 bg-white shadow-2xs'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Simulation Action Controls */}
                <div className={`mt-6 pt-6 border-t flex flex-wrap items-center justify-between gap-4 ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
                  <div className="flex items-center space-x-3 font-mono text-xs">
                    <span
                      className={`w-3 h-3 rounded-full ${
                        isSimulating ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'
                      }`}
                    />
                    <span className="font-bold">
                      {isSimulating ? `Simulator Active (PID ${pid})` : 'Simulator Stopped'}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleStartSimulation}
                      disabled={isSimulating}
                      className={`px-6 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-md ${
                        isSimulating
                          ? 'opacity-50 cursor-not-allowed bg-slate-800 text-slate-500'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30'
                      }`}
                    >
                      Start Simulation
                    </button>
                    <button
                      onClick={handleStopSimulation}
                      disabled={!isSimulating}
                      className={`px-6 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all ${
                        !isSimulating
                          ? 'opacity-50 cursor-not-allowed bg-slate-800 text-slate-500'
                          : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/30'
                      }`}
                    >
                      Stop Simulation
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Col: Backend Engine Diagnostics */}
              <div
                className={`p-6 md:p-8 rounded-2xl border backdrop-blur-xl ${
                  isDarkMode ? 'bg-[#0d121f]/90 border-white/10' : 'bg-white border-slate-200'
                }`}
              >
                <div className={`flex items-center justify-between pb-3 border-b mb-4 ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400">
                    BACKEND ENGINE STATUS
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-500">
                    FastAPI
                  </span>
                </div>

                <div className="space-y-4 font-mono text-xs">
                  <div className={`p-3.5 rounded-xl border ${isDarkMode ? 'bg-slate-900/60 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                    <span className="text-[10px] text-slate-500 uppercase block">SIMULATOR PROCESS ID</span>
                    <span className="text-base font-bold text-indigo-500">{pid ? `PID #${pid}` : 'None'}</span>
                  </div>

                  <div className={`p-3.5 rounded-xl border ${isDarkMode ? 'bg-slate-900/60 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                    <span className="text-[10px] text-slate-500 uppercase block">ENGINE UPTIME</span>
                    <span className="text-base font-bold text-emerald-500">{simUptime} seconds</span>
                  </div>

                  <div className={`p-3.5 rounded-xl border ${isDarkMode ? 'bg-slate-900/60 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                    <span className="text-[10px] text-slate-500 uppercase block">MQTT INGRESS BUFFER</span>
                    <span className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>100% (Zero Drops)</span>
                  </div>

                  <div className={`p-3.5 rounded-xl border ${isDarkMode ? 'bg-slate-900/60 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                    <span className="text-[10px] text-slate-500 uppercase block">TRANSPORT LAYER</span>
                    <span className="text-sm font-bold text-cyan-500">TCP / TLS 1.3 / WebSocket</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            FEATURE 3: DEVICE FLEET (Full Hardware Photos & Node Diagnostics)
           ========================================================================= */}
        {currentTab === 'fleet' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold">
                  CONNECTED HARDWARE INVENTORY
                </span>
                <h2 className="text-2xl font-bold font-sans mt-0.5">Device Fleet & Edge Telemetry</h2>
              </div>
              <span className="font-mono text-xs text-slate-400">5 Devices Active • Local Testing Mode</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                {
                  id: 'sensor_001',
                  name: 'sensor_001',
                  title: 'Ambient Weather Station',
                  img: '/images/bob-labs/temp-humidity-sensor.png',
                  temp: '22.21 °C',
                  hum: '51.33 %',
                  rssi: '-54 dBm',
                  battery: '94%',
                  topic: 'bob-labs/devices/sensor_001/telemetry',
                },
                {
                  id: 'sensor_002',
                  name: 'sensor_002',
                  title: 'Precision Laboratory Node',
                  img: '/images/bob-labs/arduino-controller.jpg',
                  temp: '21.83 °C',
                  hum: '46.87 %',
                  rssi: '-48 dBm',
                  battery: 'AC Powered',
                  topic: 'bob-labs/devices/sensor_002/telemetry',
                },
                {
                  id: 'sensor_003',
                  name: 'sensor_003',
                  title: 'Smart Agriculture Soil Station',
                  img: '/images/bob-labs/smart-agriculture-node.jpg',
                  temp: '28.40 °C',
                  hum: '62.00 %',
                  rssi: '-68 dBm',
                  battery: 'Solar 88%',
                  topic: 'bob-labs/devices/sensor_003/telemetry',
                },
                {
                  id: 'sensor_004',
                  name: 'sensor_004',
                  title: 'Smart City Urban Mobility Node',
                  img: '/images/bob-labs/smart-city-traffic.jpg',
                  temp: '26.50 °C',
                  hum: '55.20 %',
                  rssi: '-52 dBm',
                  battery: 'Grid 100%',
                  topic: 'bob-labs/devices/sensor_004/telemetry',
                },
                {
                  id: 'sensor_005',
                  name: 'sensor_005',
                  title: 'Predictive Motor Transducer',
                  img: '/images/bob-labs/predictive-maintenance.jpg',
                  temp: '42.30 °C',
                  hum: '38.60 %',
                  rssi: '-44 dBm',
                  battery: 'Induction 98%',
                  topic: 'bob-labs/devices/sensor_005/telemetry',
                },
              ].map((dev) => (
                <div
                  key={dev.id}
                  data-cursor="inspect"
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
                    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
                    const rotX = ((y / rect.height) - 0.5) * -10;
                    const rotY = ((x / rect.width) - 0.5) * 10;
                    e.currentTarget.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)';
                  }}
                  className={`cyera-tilt-card p-6 rounded-2xl border backdrop-blur-xl relative group overflow-hidden ${
                    isDarkMode ? 'bg-[#0d121f]/90 border-white/10' : 'bg-white border-slate-200'
                  }`}
                >
                  {/* Dynamic cursor sheen */}
                  <div
                    className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                    style={{
                      background: 'radial-gradient(280px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(99, 102, 241, 0.12), transparent 70%)',
                    }}
                  />
                  <div className="flex items-center space-x-3.5 mb-4">
                    <img
                      src={dev.img}
                      alt={dev.name}
                      className={`w-14 h-14 rounded-xl object-cover border ${isDarkMode ? 'border-white/10 bg-slate-950' : 'border-slate-200 bg-slate-100'}`}
                    />
                    <div>
                      <span className={`font-mono text-sm font-bold block ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{dev.name}</span>
                      <span className="text-xs text-slate-400 block">{dev.title}</span>
                      <span className="text-[10px] font-mono text-emerald-500 mt-0.5 block">● Online (MQTT)</span>
                    </div>
                  </div>

                  <div className={`grid grid-cols-2 gap-3 p-3 rounded-xl border font-mono text-xs ${
                    isDarkMode ? 'bg-slate-900/60 border-white/5' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">TEMP</span>
                      <span className="text-base font-bold text-amber-500">{dev.temp}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">HUMIDITY</span>
                      <span className="text-base font-bold text-cyan-500">{dev.hum}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">SIGNAL</span>
                      <span className="font-semibold text-emerald-500">{dev.rssi}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">POWER</span>
                      <span className="font-semibold text-indigo-500">{dev.battery}</span>
                    </div>
                  </div>

                  <div className={`mt-4 pt-3 border-t flex justify-between items-center text-[10px] font-mono ${
                    isDarkMode ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-500'
                  }`}>
                    <span className="truncate max-w-[180px]">{dev.topic}</span>
                    <button
                      onClick={() => onNavigateTab('telemetry')}
                      className="text-indigo-400 hover:text-white font-bold"
                    >
                      Inspect →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            FEATURE 4: LIVE TELEMETRY & CHARTS
           ========================================================================= */}
        {currentTab === 'telemetry' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Top Metrics Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div
                className={`p-5 rounded-2xl border backdrop-blur-xl ${
                  isDarkMode ? 'bg-[#0d121f]/90 border-white/10' : 'bg-white border-slate-200'
                }`}
              >
                <span className="text-[10px] font-mono uppercase text-slate-500 block">SELECTED NODE</span>
                <span className={`text-lg font-bold font-mono mt-1 block ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{activeSensor.name}</span>
                <span className="text-[10px] text-emerald-500 font-mono">● 1.0 Hz Ingress Rate</span>
              </div>

              <div
                className={`p-5 rounded-2xl border backdrop-blur-xl ${
                  isDarkMode ? 'bg-[#0d121f]/90 border-white/10' : 'bg-white border-slate-200'
                }`}
              >
                <span className="text-[10px] font-mono uppercase text-slate-500 block">STREAM READING</span>
                <span className="text-xl font-bold font-mono text-amber-400 mt-1 block">
                  {activeSensor.temperature} °C
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Calibrated Range 16°–32°C</span>
              </div>

              <div
                className={`p-5 rounded-2xl border backdrop-blur-xl ${
                  isDarkMode ? 'bg-[#0d121f]/90 border-white/10' : 'bg-white border-slate-200'
                }`}
              >
                <span className="text-[10px] font-mono uppercase text-slate-500 block">HUMIDITY</span>
                <span className="text-xl font-bold font-mono text-cyan-400 mt-1 block">
                  {activeSensor.humidity} %
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Polymer Capacitive Sensor</span>
              </div>

              <div
                className={`p-5 rounded-2xl border backdrop-blur-xl ${
                  isDarkMode ? 'bg-[#0d121f]/90 border-white/10' : 'bg-white border-slate-200'
                }`}
              >
                <span className="text-[10px] font-mono uppercase text-slate-500 block">NETWORK LATENCY</span>
                <span className="text-xl font-bold font-mono text-emerald-400 mt-1 block">14 ms RTT</span>
                <span className="text-[10px] text-slate-400 font-mono">MQTT QoS 1 Local</span>
              </div>
            </div>

            {/* Middle Grid: Main Wave Chart */}
            <div
              className={`p-6 md:p-8 rounded-2xl border backdrop-blur-xl ${
                isDarkMode ? 'bg-[#0d121f]/90 border-white/10' : 'bg-white border-slate-200'
              }`}
            >
              <div className={`flex flex-wrap items-center justify-between pb-4 border-b mb-4 gap-3 ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold">
                    HIGH-RESOLUTION OSCILLOSCOPE
                  </span>
                  <h3 className="text-xl font-bold font-sans mt-0.5">
                    Live Telemetry Trend Waveform
                  </h3>
                </div>
                <div className="flex items-center space-x-2 text-xs font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-400 font-bold">LIVE TELEMETRY STREAM</span>
                </div>
              </div>

              <div className="h-52 w-full relative mt-4">
                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="telemetryGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <polyline
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={trendPoints
                      .map((pt, i) => {
                        const x = (i / (trendPoints.length - 1)) * 900;
                        const y = 145 - (pt - 18) * 16;
                        return `${x},${y}`;
                      })
                      .join(' ')}
                  />
                </svg>
                <div className={`flex justify-between text-[11px] font-mono mt-3 pt-2 border-t ${isDarkMode ? 'text-slate-500 border-white/5' : 'text-slate-500 border-slate-200'}`}>
                  <span>-30s Historical Window</span>
                  <span>Topic: {activeSensor.topic}</span>
                  <span>Latest: {activeSensor.temperature} °C</span>
                </div>
              </div>
            </div>

            {/* Telemetry Message Stream Table */}
            <div
              className={`p-6 rounded-2xl border backdrop-blur-xl ${
                isDarkMode ? 'bg-[#0d121f]/90 border-white/10' : 'bg-white border-slate-200'
              }`}
            >
              <div className={`flex items-center justify-between pb-3 border-b mb-4 ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-500 tracking-wider">
                    PAYLOAD INGESTION FEED
                  </span>
                  <h3 className={`text-base font-bold font-sans ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Live MQTT Telemetry Stream</h3>
                </div>
                <span className={`text-xs font-mono px-2.5 py-1 rounded font-bold ${
                  isDarkMode ? 'bg-slate-800 text-indigo-400' : 'bg-slate-100 text-indigo-600 border border-slate-200'
                }`}>
                  {telemetryLogs.length} Packets Captured
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className={`w-full text-left text-xs font-mono ${isDarkMode ? '' : 'text-slate-800'}`}>
                  <thead>
                    <tr className={`border-b text-[11px] ${
                      isDarkMode ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-600 bg-slate-50/80'
                    }`}>
                      <th className="py-2.5 px-3">TOPIC</th>
                      <th className="py-2.5 px-3">NODE ID</th>
                      <th className="py-2.5 px-3">TEMP (°C)</th>
                      <th className="py-2.5 px-3">HUMIDITY (%)</th>
                      <th className="py-2.5 px-3">STATUS</th>
                      <th className="py-2.5 px-3">LATENCY</th>
                      <th className="py-2.5 px-3">TIMESTAMP</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDarkMode ? 'divide-white/5' : 'divide-slate-200'}`}>
                    {telemetryLogs.map((log) => (
                      <tr key={log.id} className={`transition-colors ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}>
                        <td className="py-2.5 px-3 text-indigo-500 font-semibold">{log.topic}</td>
                        <td className={`py-2.5 px-3 font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{log.device}</td>
                        <td className="py-2.5 px-3 font-bold text-amber-400">{log.temp} °C</td>
                        <td className="py-2.5 px-3 font-bold text-cyan-400">{log.hum} %</td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            ● {log.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-400">{log.latency} ms</td>
                        <td className="py-2.5 px-3 text-slate-500">{log.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            FEATURE 5: CARTER OGUNSOLA CHAOS TESTING & FAULT INJECTION LAB
           ========================================================================= */}
        {currentTab === 'failure' && (
          <div className="space-y-6 animate-fadeIn">
            {/* High-Craft Header Banner */}
            <div
              className={`relative overflow-hidden p-6 md:p-8 rounded-2xl border backdrop-blur-xl ${
                isDarkMode
                  ? 'bg-[#0d121f]/90 border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="absolute top-2 left-2 font-mono text-[9px] text-slate-600 select-none">+</div>
              <div className="absolute top-2 right-2 font-mono text-[9px] text-slate-600 select-none">+</div>
              <div className="absolute bottom-2 left-2 font-mono text-[9px] text-slate-600 select-none">+</div>
              <div className="absolute bottom-2 right-2 font-mono text-[9px] text-slate-600 select-none">+</div>

              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <Flame className="w-4 h-4 text-rose-500" />
                    <span className="font-mono text-xs uppercase tracking-widest text-rose-400 font-bold">
                      CHAOS MONKEY & FAULT INJECTION SUITE
                    </span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1 font-sans">
                    IoT Edge Resilience & Failure Testing
                  </h1>
                  <p className="text-sm text-slate-400 mt-1 max-w-2xl font-sans">
                    Inject controlled telemetry degradation, network partitions, packet corruption,
                    and thermal spikes into virtual IoT devices to evaluate auto-healing algorithms.
                  </p>
                </div>

                {isInjecting && (
                  <div className="flex items-center space-x-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 font-mono text-xs animate-pulse">
                    <AlertTriangle className="w-5 h-5 text-rose-500" />
                    <div>
                      <span className="font-bold block">CHAOS ACTIVE — {injectionCountdown}s REMAINING</span>
                      <span className="text-[10px] text-slate-400">Target fleet degraded in real-time</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Main Interactive Chaos Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 Cols: Configure & Inject Chaos */}
              <div
                className={`lg:col-span-2 p-6 md:p-8 rounded-2xl border backdrop-blur-xl relative ${
                  isDarkMode ? 'bg-[#0d121f]/90 border-white/10' : 'bg-white border-slate-200'
                }`}
              >
                <div className={`flex items-center justify-between pb-4 border-b mb-6 ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold">
                      FAULT CATALOG
                    </span>
                    <h3 className="text-xl font-bold font-sans mt-0.5">Select Chaos Scenario</h3>
                  </div>
                  <span className="font-mono text-xs text-slate-400">4 Scenarios Ready</span>
                </div>

                {/* 4 Interactive Tactical Scenario Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    {
                      id: 'device-offline',
                      title: 'Device Offline / Partition',
                      desc: 'Cut TCP socket to simulate sudden power outage or edge gateway disconnect.',
                      badge: 'SEV-1 OUTAGE',
                      badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
                      icon: <ShieldAlert className="w-5 h-5 text-rose-400" />,
                    },
                    {
                      id: 'temp-spike',
                      title: 'Thermal Overheat Spike',
                      desc: 'Override sensor telemetry to 98°C to trigger safety thermal shutdown thresholds.',
                      badge: 'CRITICAL OVERHEAT',
                      badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
                      icon: <Flame className="w-5 h-5 text-amber-400" />,
                    },
                    {
                      id: 'missing-msgs',
                      title: 'Packet Drop (Cadence Loss)',
                      desc: 'Simulate 60% packet drop rate over LoRaWAN/Cellular interference corridors.',
                      badge: 'CORRUPTED INGRESS',
                      badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
                      icon: <Radio className="w-5 h-5 text-cyan-400" />,
                    },
                    {
                      id: 'message-delay',
                      title: 'Buffer Delay & Jitter',
                      desc: 'Queue telemetry in buffer for +450ms to stress-test async ingestion queues.',
                      badge: 'LATENCY JITTER',
                      badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
                      icon: <Clock className="w-5 h-5 text-purple-400" />,
                    },
                  ].map((sc) => {
                    const isSelected = selectedFailure === sc.id;
                    return (
                      <div
                        key={sc.id}
                        onClick={() => setSelectedFailure(sc.id)}
                        className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                          isSelected
                            ? 'border-indigo-500 bg-indigo-500/10 shadow-[0_0_30px_rgba(99,102,241,0.25)]'
                            : isDarkMode
                            ? 'bg-[#090d16]/80 border-white/10 hover:border-white/20'
                            : 'bg-slate-50 border-slate-200 hover:border-slate-400'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2.5">
                            <div className={`p-2 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-2xs'}`}>
                              {sc.icon}
                            </div>
                            <span className={`font-bold text-sm font-sans ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{sc.title}</span>
                          </div>
                        </div>

                        <p className={`text-xs mt-2 font-sans leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                          {sc.desc}
                        </p>

                        <div className={`mt-4 pt-3 border-t flex items-center justify-between ${isDarkMode ? 'border-white/5' : 'border-slate-200'}`}>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${sc.badgeColor}`}
                          >
                            {sc.badge}
                          </span>
                          <span
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isSelected
                                ? 'border-indigo-500 bg-indigo-500'
                                : isDarkMode ? 'border-white/20 bg-transparent' : 'border-slate-300 bg-transparent'
                            }`}
                          >
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Duration Slider with Presets */}
                <div className={`mt-8 p-5 rounded-2xl border ${isDarkMode ? 'border-white/5 bg-[#090d16]/60' : 'border-slate-200 bg-slate-50'}`}>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <label className={`font-mono text-xs font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>
                      Injection Duration & Recovery Window
                    </label>
                    <span className="font-mono text-sm font-bold text-indigo-500 px-3 py-1 rounded bg-indigo-500/10 border border-indigo-500/20">
                      {failureDuration} SECONDS
                    </span>
                  </div>

                  <input
                    type="range"
                    min="5"
                    max="180"
                    step="5"
                    value={failureDuration}
                    onChange={(e) => setFailureDuration(parseInt(e.target.value) || 30)}
                    className="w-full h-2 rounded-lg bg-slate-700 accent-indigo-500 cursor-pointer mt-2"
                  />

                  {/* Preset Pills */}
                  <div className={`flex flex-wrap gap-2 mt-4 pt-3 border-t font-mono text-[11px] ${isDarkMode ? 'border-white/5' : 'border-slate-200'}`}>
                    <span className="text-slate-500 self-center mr-1">Presets:</span>
                    {[10, 30, 60, 120, 180].map((sec) => (
                      <button
                        key={sec}
                        onClick={() => setFailureDuration(sec)}
                        className={`px-2.5 py-1 rounded-md border transition-all ${
                          failureDuration === sec
                            ? 'bg-indigo-600 text-white border-indigo-500 font-bold shadow-xs'
                            : isDarkMode
                            ? 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
                            : 'bg-white text-slate-700 border-slate-300 hover:text-slate-900 shadow-2xs'
                        }`}
                      >
                        {sec}s
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interactive Target Fleet Selector */}
                <div className={`mt-6 p-5 rounded-2xl border ${isDarkMode ? 'border-white/5 bg-[#090d16]/60' : 'border-slate-200 bg-slate-50'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`font-mono text-xs font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>
                      Target Devices ({targetedSensors.length} of {sensors.length} selected)
                    </span>
                    <button
                      onClick={() =>
                        setTargetedSensors(
                          targetedSensors.length === sensors.length ? ['sensor_001'] : sensors.map((s) => s.id)
                        )
                      }
                      className="text-[11px] font-mono text-indigo-500 hover:text-indigo-700 font-semibold"
                    >
                      {targetedSensors.length === sensors.length ? 'Deselect All' : 'Select All Fleet'}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {sensors.map((s) => {
                      const isTargeted = targetedSensors.includes(s.id);
                      return (
                        <div
                          key={s.id}
                          onClick={() => toggleTargetSensor(s.id)}
                          className={`p-3 rounded-xl border font-mono text-xs cursor-pointer transition-all flex items-center justify-between ${
                            isTargeted
                              ? isDarkMode
                                ? 'bg-rose-500/10 border-rose-500/40 text-white'
                                : 'bg-rose-50 border-rose-300 text-rose-900 shadow-2xs'
                              : isDarkMode
                              ? 'bg-white/5 border-white/10 text-slate-400 opacity-60'
                              : 'bg-white border-slate-200 text-slate-700 opacity-80 shadow-2xs'
                          }`}
                        >
                          <div className="flex items-center space-x-2 truncate">
                            <span className="text-sm">📟</span>
                            <div className="truncate">
                              <span className="font-bold block truncate">{s.name}</span>
                              <span className="text-[10px] text-slate-400 block">{s.temperature}°C</span>
                            </div>
                          </div>
                          <span
                            className={`w-3.5 h-3.5 rounded-md border flex items-center justify-center ${
                              isTargeted ? 'bg-rose-500 border-rose-500' : isDarkMode ? 'border-white/20' : 'border-slate-300'
                            }`}
                          >
                            {isTargeted && <CheckCircle2 className="w-3 h-3 text-white" />}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Inject Trigger Button */}
                <div className="mt-8 flex items-center space-x-4">
                  <button
                    onClick={handleInjectFailure}
                    disabled={isInjecting}
                    className={`flex-1 py-4 rounded-xl font-mono text-sm font-bold uppercase tracking-widest flex items-center justify-center space-x-3 transition-all shadow-xl ${
                      isInjecting
                        ? 'bg-rose-900/60 text-rose-300 border border-rose-500/40 cursor-not-allowed animate-pulse'
                        : 'bg-gradient-to-r from-rose-600 via-indigo-600 to-indigo-700 hover:from-rose-500 hover:to-indigo-600 text-white shadow-indigo-600/30 hover:scale-[1.01]'
                    }`}
                  >
                    <Zap className="w-5 h-5 fill-white" />
                    <span>
                      {isInjecting
                        ? `Injecting Chaos (${injectionCountdown}s Remaining)...`
                        : '⚡ Inject Chaos Scenario Now'}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setIsInjecting(false);
                      setInjectionCountdown(0);
                      setActiveFailureNotice(null);
                    }}
                    className={`px-4 py-4 rounded-xl border font-mono text-xs font-bold transition-colors ${
                      isDarkMode
                        ? 'border-white/10 hover:bg-white/5 text-slate-400 hover:text-white'
                        : 'border-slate-300 hover:bg-slate-100 text-slate-600 hover:text-slate-900 shadow-2xs'
                    }`}
                    title="Reset faults"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Right Col: Observed Outcomes & Live Resilience Analytics */}
              <div className="space-y-6">
                {/* Resilience Score Gauge */}
                <div
                  className={`p-6 rounded-2xl border backdrop-blur-xl ${
                    isDarkMode ? 'bg-[#0d121f]/90 border-white/10' : 'bg-white border-slate-200'
                  }`}
                >
                  <div className={`flex items-center justify-between pb-3 border-b mb-4 ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400">
                      SYSTEM RESILIENCE
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-500">
                      GRADE A+
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div>
                      <span className={`text-3xl font-extrabold font-mono ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        {failureStats.resilienceScore}%
                      </span>
                      <span className="text-xs text-slate-400 block mt-0.5">Automated Recovery Index</span>
                    </div>

                    <div className="w-16 h-16 relative flex items-center justify-center">
                      <svg className="w-full h-full -rotate-90">
                        <circle
                          cx="32"
                          cy="32"
                          r="26"
                          stroke="currentColor"
                          strokeWidth="5"
                          className={isDarkMode ? "text-slate-800" : "text-slate-200"}
                          fill="none"
                        />
                        <circle
                          cx="32"
                          cy="32"
                          r="26"
                          stroke="currentColor"
                          strokeWidth="5"
                          className="text-indigo-500"
                          fill="none"
                          strokeDasharray="163"
                          strokeDashoffset={163 - (163 * failureStats.resilienceScore) / 100}
                          strokeLinecap="round"
                        />
                      </svg>
                      <Gauge className="w-6 h-6 text-indigo-500 absolute" />
                    </div>
                  </div>
                </div>

                {/* Packet Failure Stats Box */}
                <div
                  className={`p-6 rounded-2xl border backdrop-blur-xl ${
                    isDarkMode ? 'bg-[#0d121f]/90 border-white/10' : 'bg-white border-slate-200'
                  }`}
                >
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400 block mb-4">
                    Observed Telemetry Metrics
                  </span>

                  <div className="space-y-3 font-mono text-xs">
                    <div className={`p-3 rounded-xl border flex justify-between items-center ${
                      isDarkMode ? 'bg-slate-900/60 border-white/5' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <span className={isDarkMode ? "text-slate-400" : "text-slate-600"}>Delayed Telemetry</span>
                      <span className="font-bold text-amber-500">{failureStats.delayed} pkts</span>
                    </div>

                    <div className={`p-3 rounded-xl border flex justify-between items-center ${
                      isDarkMode ? 'bg-slate-900/60 border-white/5' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <span className={isDarkMode ? "text-slate-400" : "text-slate-600"}>Recovered / Released</span>
                      <span className="font-bold text-emerald-500">{failureStats.released} pkts</span>
                    </div>

                    <div className={`p-3 rounded-xl border flex justify-between items-center ${
                      isDarkMode ? 'bg-slate-900/60 border-white/5' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <span className={isDarkMode ? "text-slate-400" : "text-slate-600"}>Dropped Ingress</span>
                      <span className="font-bold text-rose-500">{failureStats.dropped} pkts</span>
                    </div>

                    <div className={`p-3 rounded-xl border flex justify-between items-center ${
                      isDarkMode ? 'bg-slate-900/60 border-white/5' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <span className={isDarkMode ? "text-slate-400" : "text-slate-600"}>Mean Time to Detect (MTTD)</span>
                      <span className="font-bold text-cyan-500">{failureStats.mttd}</span>
                    </div>

                    <div className={`p-3 rounded-xl border flex justify-between items-center ${
                      isDarkMode ? 'bg-slate-900/60 border-white/5' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <span className={isDarkMode ? "text-slate-400" : "text-slate-600"}>Mean Time to Recover (MTTR)</span>
                      <span className="font-bold text-purple-500">{failureStats.mttr}</span>
                    </div>
                  </div>
                </div>

                {/* Chaos Terminal Log Feed */}
                <div
                  className={`p-6 rounded-2xl border backdrop-blur-xl font-mono text-[11px] ${
                    isDarkMode ? 'bg-[#090d16] border-white/10 text-slate-400' : 'bg-slate-900 text-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-2 pb-2.5 border-b border-white/10 mb-3">
                    <Terminal className="w-3.5 h-3.5 text-rose-400" />
                    <span className="font-bold text-xs uppercase tracking-wider text-slate-300">
                      Chaos Injector Log
                    </span>
                  </div>

                  <div className="space-y-1.5 max-h-44 overflow-y-auto">
                    {terminalLogs.slice(0, 6).map((line, idx) => (
                      <div key={idx} className="leading-relaxed hover:text-white truncate">
                        {line}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            FEATURE 6: EXTERNAL APP INTEGRATION & CONNECTORS
           ========================================================================= */}
        {currentTab === 'integration' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Application Profiles */}
              <div
                className={`lg:col-span-2 p-6 md:p-8 rounded-2xl border backdrop-blur-xl ${
                  isDarkMode ? 'bg-[#0d121f]/90 border-white/10' : 'bg-white border-slate-200'
                }`}
              >
                <div className={`flex items-center justify-between pb-4 border-b mb-6 ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold">
                      APPLICATION PROFILES & WEBHOOKS
                    </span>
                    <h3 className={`text-xl font-bold font-sans mt-0.5 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Active Connectors</h3>
                  </div>
                  <button className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-xs font-bold transition-all shadow-xs">
                    + New Integration
                  </button>
                </div>

                {/* Smart Agriculture Demo Profile Card */}
                <div className={`p-6 rounded-2xl border relative overflow-hidden ${
                  isDarkMode ? 'border-white/10 bg-slate-900/60' : 'border-slate-200 bg-slate-50'
                }`}>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl ${
                        isDarkMode ? 'bg-indigo-500/20 border border-indigo-500/40 text-indigo-400' : 'bg-indigo-100 border border-indigo-200 text-indigo-700'
                      }`}>
                        S
                      </div>
                      <div>
                        <h4 className={`font-bold text-base font-sans ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                          Smart Agriculture Demo
                        </h4>
                        <span className={`font-mono text-xs block mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          http://127.0.0.1:9000/api/telemetry
                        </span>
                      </div>
                    </div>

                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-500 border border-emerald-500/30">
                      ● Active & Healthy
                    </span>
                  </div>

                  <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-4 border-t font-mono text-xs ${
                    isDarkMode ? 'border-white/10' : 'border-slate-200'
                  }`}>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block">DELIVERED</span>
                      <span className="text-base font-bold text-emerald-500">{webhookDelivered}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block">FAILED</span>
                      <span className={`text-base font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>0</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block">DROPPED</span>
                      <span className={`text-base font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>0</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block">AVG LATENCY</span>
                      <span className="text-base font-bold text-indigo-500">32 ms</span>
                    </div>
                  </div>
                </div>

                {/* Create an Integration Form */}
                <form
                  onSubmit={handleCreateIntegration}
                  className={`mt-8 pt-6 border-t space-y-4 text-xs font-sans ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}
                >
                  <h4 className={`font-bold text-sm uppercase tracking-wider font-mono ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                    Create New Telemetry Bridge
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block font-mono mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Application Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Operations Grafana Bridge"
                        value={newAppName}
                        onChange={(e) => setNewAppName(e.target.value)}
                        className={`w-full px-3.5 py-2.5 rounded-xl border font-mono text-xs focus:ring-2 focus:ring-indigo-500 ${
                          isDarkMode
                            ? 'border-white/10 bg-slate-900 text-white placeholder-slate-500'
                            : 'border-slate-300 bg-white text-slate-900 placeholder-slate-400 shadow-2xs'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block font-mono mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>HTTP / Webhook Target</label>
                      <input
                        type="url"
                        placeholder="https://analytics.example.com/api/v1/stream"
                        value={newEndpoint}
                        onChange={(e) => setNewEndpoint(e.target.value)}
                        className={`w-full px-3.5 py-2.5 rounded-xl border font-mono text-xs focus:ring-2 focus:ring-indigo-500 ${
                          isDarkMode
                            ? 'border-white/10 bg-slate-900 text-white placeholder-slate-500'
                            : 'border-slate-300 bg-white text-slate-900 placeholder-slate-400 shadow-2xs'
                        }`}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-xs font-bold transition-all shadow-md"
                  >
                    Save & Test Integration
                  </button>
                  {integrationSuccess && (
                    <span className="text-emerald-500 font-mono text-xs ml-4">
                      ✓ Integration verified and saved successfully!
                    </span>
                  )}
                </form>
              </div>

              {/* Right Col: Webhook Delivery Monitor */}
              <div
                className={`p-6 md:p-8 rounded-2xl border backdrop-blur-xl ${
                  isDarkMode ? 'bg-[#0d121f]/90 border-white/10' : 'bg-white border-slate-200'
                }`}
              >
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400 block mb-4">
                  Delivery Verification Pipeline
                </span>

                <div className="space-y-4 font-mono text-xs">
                  <div className={`p-4 rounded-xl border ${
                    isDarkMode ? 'bg-slate-900/60 border-white/5' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <span className="text-[10px] text-slate-500 uppercase block">NETWORK SECURITY</span>
                    <span className="font-bold text-emerald-500 mt-1 block">TLS 1.3 / HMAC-SHA256</span>
                  </div>

                  <div className={`p-4 rounded-xl border ${
                    isDarkMode ? 'bg-slate-900/60 border-white/5' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <span className="text-[10px] text-slate-500 uppercase block">RETRY POLICY</span>
                    <span className={`font-bold mt-1 block ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Exponential Backoff (3x)</span>
                  </div>

                  <div className={`p-4 rounded-xl border ${
                    isDarkMode ? 'bg-slate-900/60 border-white/5' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <span className="text-[10px] text-slate-500 uppercase block">DELIVERY HISTOGRAM</span>
                    <div className="flex items-end space-x-1 h-16 mt-3 pt-2">
                      {[40, 65, 30, 85, 95, 75, 90, 60, 100, 80, 90, 95].map((val, i) => (
                        <div
                          key={i}
                          style={{ height: `${val}%` }}
                          className={`flex-1 rounded-t transition-colors ${
                            isDarkMode ? 'bg-indigo-500/40 hover:bg-indigo-400' : 'bg-indigo-400/60 hover:bg-indigo-500'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            FEATURE 7: CARTER OGUNSOLA ABOUT DOSSIER & LAB TOY
           ========================================================================= */}
        {currentTab === 'about' && (
          <div className="space-y-6 animate-fadeIn">
            <AboutDossierView
              isDarkMode={isDarkMode}
              onOpenRotunda={onOpenRotunda}
              onNavigateTab={onNavigateTab}
            />
          </div>
        )}
      </div>
    </div>
  );
};
