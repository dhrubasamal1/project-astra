import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Droplets,
  Zap,
  Trees,
  Building,
  AlertTriangle,
  ShieldCheck,
  Calendar,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  DECADAL_SIMULATION_DATA,
  DecadalSimulationStep,
} from '../../data/intelligenceData';
import { Region } from '../../types';

interface FutureSimulationDashboardProps {
  currentRegion: Region;
}

export const FutureSimulationDashboard: React.FC<FutureSimulationDashboardProps> = ({ currentRegion }) => {
  const [selectedYearIndex, setSelectedYearIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [scenarioMode, setScenarioMode] = useState<'ssp245' | 'ssp585' | 'green'>('ssp245');

  const currentStep = DECADAL_SIMULATION_DATA[selectedYearIndex];

  // Play / Pause auto slider
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying) {
      interval = setInterval(() => {
        setSelectedYearIndex((prev) => (prev >= DECADAL_SIMULATION_DATA.length - 1 ? 0 : prev + 1));
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const chartData = DECADAL_SIMULATION_DATA.map((step) => {
    const multiplier = scenarioMode === 'ssp585' ? 1.15 : scenarioMode === 'green' ? 0.9 : 1.0;
    return {
      year: step.year,
      label: step.year.toString(),
      population: step.population,
      waterDemandMLD: Math.round(step.waterDemandMLD * multiplier * 10) / 10,
      waterSupplyMLD: Math.round(step.waterSupplyMLD * (scenarioMode === 'ssp585' ? 0.85 : 1.0) * 10) / 10,
      groundwaterDepthM: Math.round(step.groundwaterDepthM * (scenarioMode === 'ssp585' ? 1.12 : 1.0) * 10) / 10,
      energyDemandMW: Math.round(step.energyDemandMW * multiplier),
      renewableGenerationMW: Math.round(step.renewableGenerationMW * (scenarioMode === 'green' ? 1.2 : 1.0)),
      greenCoverPct: step.greenCoverPct,
      urbanHeatIslandReductionC: step.urbanHeatIslandReductionC,
      infraInvestmentCr: step.infraInvestmentCr,
      isSimulated: step.isSimulated,
    };
  });

  return (
    <div className="flex-1 h-full bg-[#07111F] text-[#F1F5F9] overflow-y-auto p-6 space-y-6 select-none font-sans">
      {/* Top Header & Futuristic Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FBBF24]/20 text-[#FBBF24] border border-[#FBBF24]/40">
              ASTRA DECADAL PREDICTOR
            </span>
            <span className="text-xs text-[#94A3B8]">CMIP6 / ISRO Integrated Simulation</span>
          </div>
          <h2 className="font-heading font-extrabold text-2xl text-[#F1F5F9] mt-1">
            Century Horizon Stress Simulation (2026 – 2125)
          </h2>
          <p className="text-xs text-[#94A3B8]">
            Stress-testing population growth, water depletion limits, and clean energy self-sufficiency across multiple decadal milestones.
          </p>
        </div>

        {/* Climate Scenario Switcher */}
        <div className="flex items-center rounded-xl bg-[#0D1928] border border-white/[0.08] p-1">
          <button
            onClick={() => setScenarioMode('ssp245')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              scenarioMode === 'ssp245'
                ? 'bg-[#17283A] text-[#22D3EE] border border-[#22D3EE]/30 shadow-sm'
                : 'text-[#94A3B8] hover:text-[#F1F5F9]'
            }`}
          >
            SSP2-4.5 (Baseline)
          </button>
          <button
            onClick={() => setScenarioMode('ssp585')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              scenarioMode === 'ssp585'
                ? 'bg-[#17283A] text-[#F87171] border border-[#F87171]/30 shadow-sm'
                : 'text-[#94A3B8] hover:text-[#F1F5F9]'
            }`}
          >
            SSP5-8.5 (Stressed)
          </button>
          <button
            onClick={() => setScenarioMode('green')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              scenarioMode === 'green'
                ? 'bg-[#17283A] text-[#34D399] border border-[#34D399]/30 shadow-sm'
                : 'text-[#94A3B8] hover:text-[#F1F5F9]'
            }`}
          >
            Green Transition
          </button>
        </div>
      </div>

      {/* Interactive Time Horizon Controller Slider & Play/Pause */}
      <div className="p-5 rounded-3xl bg-[#0D1928] border border-white/[0.1] shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2.5 rounded-xl bg-[#22D3EE] text-[#07111F] hover:bg-[#38BDF8] font-bold shadow-md transition-all"
              title={isPlaying ? 'Pause Simulation' : 'Auto Play Decades'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>
            <button
              onClick={() => {
                setIsPlaying(false);
                setSelectedYearIndex(0);
              }}
              className="p-2.5 rounded-xl bg-[#111F30] text-[#94A3B8] hover:text-[#F1F5F9] border border-white/[0.08]"
              title="Reset to 2026 Baseline"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <div>
              <div className="font-heading font-black text-xl text-[#F1F5F9] flex items-center gap-2">
                <span>Year {currentStep.year}</span>
                <span className="text-xs font-mono font-normal text-[#94A3B8]">({currentStep.horizonLabel})</span>
              </div>
            </div>
          </div>

          {/* Measured vs Simulated Status Pill */}
          <div className="flex items-center space-x-2">
            {!currentStep.isSimulated ? (
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#34D399]/20 text-[#34D399] border border-[#34D399]/40 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Actual ISRO Measurement</span>
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#22D3EE]/20 text-[#22D3EE] border border-[#22D3EE]/40 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Simulated Projection ({scenarioMode.toUpperCase()})</span>
              </span>
            )}
          </div>
        </div>

        {/* Timeline Slider Track */}
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max={DECADAL_SIMULATION_DATA.length - 1}
            step="1"
            value={selectedYearIndex}
            onChange={(e) => {
              setIsPlaying(false);
              setSelectedYearIndex(Number(e.target.value));
            }}
            className="w-full accent-[#22D3EE] cursor-pointer"
          />

          <div className="flex justify-between text-xs font-mono text-[#94A3B8] pt-1">
            {DECADAL_SIMULATION_DATA.map((step, idx) => (
              <button
                key={step.year}
                onClick={() => {
                  setIsPlaying(false);
                  setSelectedYearIndex(idx);
                }}
                className={`text-center transition-all ${
                  idx === selectedYearIndex ? 'text-[#22D3EE] font-bold scale-110' : 'hover:text-[#F1F5F9]'
                }`}
              >
                <div>{step.year}</div>
                <div className="text-[10px] hidden sm:block">
                  {idx === 0 ? 'Baseline' : idx === 1 ? '10-Yr' : idx === 2 ? '20-Yr' : idx === 3 ? '50-Yr' : '100-Yr'}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Real-time Indicator Cards for the Selected Year */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-2xl bg-[#0D1928] border border-white/[0.08] space-y-1">
          <div className="text-[10px] font-mono text-[#94A3B8] uppercase">Population</div>
          <div className="font-heading font-black text-lg text-[#F1F5F9]">{currentStep.population.toLocaleString()}</div>
          <div className="text-[10px] text-[#22D3EE] font-mono">135 lpcd Base</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0D1928] border border-white/[0.08] space-y-1">
          <div className="text-[10px] font-mono text-[#94A3B8] uppercase">Water Demand</div>
          <div className="font-heading font-black text-lg text-[#60A5FA]">{currentStep.waterDemandMLD} MLD</div>
          <div className="text-[10px] text-[#34D399] font-mono">Supply: {currentStep.waterSupplyMLD} MLD</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0D1928] border border-white/[0.08] space-y-1">
          <div className="text-[10px] font-mono text-[#94A3B8] uppercase">Aquifer Depth</div>
          <div className="font-heading font-black text-lg text-[#FBBF24]">{currentStep.groundwaterDepthM} m</div>
          <div className="text-[10px] text-[#94A3B8] font-mono">bgl safe zone</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0D1928] border border-white/[0.08] space-y-1">
          <div className="text-[10px] font-mono text-[#94A3B8] uppercase">Clean Power</div>
          <div className="font-heading font-black text-lg text-[#34D399]">{currentStep.renewableGenerationMW} MW</div>
          <div className="text-[10px] text-[#94A3B8] font-mono">Load: {currentStep.energyDemandMW} MW</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0D1928] border border-white/[0.08] space-y-1">
          <div className="text-[10px] font-mono text-[#94A3B8] uppercase">Green Canopy</div>
          <div className="font-heading font-black text-lg text-[#22D3EE]">{currentStep.greenCoverPct}%</div>
          <div className="text-[10px] text-[#34D399] font-mono">UHI: -{currentStep.urbanHeatIslandReductionC}°C</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0D1928] border border-white/[0.08] space-y-1">
          <div className="text-[10px] font-mono text-[#94A3B8] uppercase">Infra Capex</div>
          <div className="font-heading font-black text-lg text-[#A78BFA]">₹{currentStep.infraInvestmentCr} Cr</div>
          <div className="text-[10px] text-[#94A3B8] font-mono">Cumulative</div>
        </div>
      </div>

      {/* Recharts Analytics Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Water Balance Trajectory (Demand vs Supply) */}
        <div className="p-5 rounded-3xl bg-[#0D1928] border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-sm text-[#F1F5F9] flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-[#60A5FA]" />
                <span>Municipal Water Demand vs Available Infiltration Supply</span>
              </h3>
              <p className="text-[11px] text-[#94A3B8]">
                Based on INSAT-3D rainfall normals, 135 lpcd municipal standard, and local catchment harvesting
              </p>
            </div>
            <span className="text-[10px] font-mono text-[#60A5FA] font-bold">MLD (Million Litres/Day)</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#17283A" />
                <XAxis dataKey="year" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111F30',
                    borderColor: '#22D3EE',
                    borderRadius: '12px',
                    fontSize: '11px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Area
                  type="monotone"
                  dataKey="waterSupplyMLD"
                  name="Total Safe Water Supply (MLD)"
                  fill="#34D399"
                  fillOpacity={0.25}
                  stroke="#34D399"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="waterDemandMLD"
                  name="Municipal Demand (MLD)"
                  stroke="#60A5FA"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#60A5FA' }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Clean Renewable Generation vs Grid Load */}
        <div className="p-5 rounded-3xl bg-[#0D1928] border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-sm text-[#F1F5F9] flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-[#FBBF24]" />
                <span>Energy Demand Load vs Clean Renewable Generation</span>
              </h3>
              <p className="text-[11px] text-[#94A3B8]">
                Rooftop solar, agrivoltaics, and vertical wind turbines with dedicated battery energy storage
              </p>
            </div>
            <span className="text-[10px] font-mono text-[#FBBF24] font-bold">MW (Megawatts)</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#17283A" />
                <XAxis dataKey="year" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111F30',
                    borderColor: '#FBBF24',
                    borderRadius: '12px',
                    fontSize: '11px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="renewableGenerationMW" name="Clean Energy MW" fill="#FBBF24" radius={[6, 6, 0, 0]} />
                <Line
                  type="monotone"
                  dataKey="energyDemandMW"
                  name="Grid Load Demand MW"
                  stroke="#F87171"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#F87171' }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
