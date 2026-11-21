import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  Droplets,
  AlertOctagon,
  ShieldAlert,
  ShieldCheck,
  TrendingDown,
  Info,
  Waves,
  Sparkles,
} from 'lucide-react';
import { StressTestResponse } from '../types';

interface StressTestTabProps {
  stressData: StressTestResponse;
}

export const StressTestTab: React.FC<StressTestTabProps> = ({ stressData }) => {
  const {
    horizon,
    targetPopulation,
    currentDemandMLD,
    horizonDemandMLD,
    horizonBaseSupplyMLD,
    stressIndex,
    stressCategory,
    floodStressBadge,
    timeseries,
    recommendation,
  } = stressData;

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Sustainable':
        return 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300';
      case 'Stressed':
        return 'bg-amber-500/20 border-amber-500/60 text-amber-300';
      case 'Critical Deficit':
        return 'bg-red-500/20 border-red-500/60 text-red-300';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-4 pb-6">
      {/* Top Banner: Water Stress Index Gauge */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center space-x-2 text-sky-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Droplets className="w-4 h-4 text-sky-400" />
            <span>Horizon {horizon} Water Balance Stress Index</span>
          </div>
          <p className="text-xs text-slate-300">
            Physical water balance model based on MOSDAC INSAT-3D rainfall, calibrated catchment yield & 135 lpcd consumption.
          </p>
        </div>

        {/* Index Pill & Status */}
        <div className="flex items-center space-x-3 shrink-0">
          <div className="text-right">
            <div className="text-2xl font-black font-mono text-white leading-none">
              {stressIndex.toFixed(2)}
            </div>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
              Demand / Supply
            </span>
          </div>
          <span
            className={`px-3 py-1.5 text-xs font-black rounded-full uppercase tracking-wider border shadow-sm ${getCategoryColor(
              stressCategory
            )}`}
          >
            {stressCategory}
          </span>
        </div>
      </div>

      {/* Flood Stress Badge Callout */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-xl">
        <div className="flex items-center space-x-2.5">
          <Waves className="w-4 h-4 text-cyan-400" />
          <div>
            <div className="text-xs font-bold text-slate-100">100-Year Climate Flood Hazard Exposure</div>
            <div className="text-[11px] text-slate-400">Based on Bhuvan flood zonation & 30m HAND terrain elevation</div>
          </div>
        </div>
        <span className="px-3 py-1 text-xs font-bold font-mono bg-cyan-950/80 border border-cyan-700/60 text-cyan-300 rounded-full">
          {floodStressBadge?.label || floodStressBadge?.category || 'Low Exposure'}
        </span>
      </div>

      {/* 2026-2050 Water Demand vs Sustainable Supply Timeseries Chart */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Droplets className="w-3.5 h-3.5 text-sky-400" />
            <span>2026–{horizon} Physical Supply vs Demand Trajectory (MLD)</span>
          </h3>
          <span className="text-[10px] text-slate-400 font-mono">CPHEEO 135 lpcd</span>
        </div>

        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={timeseries} margin={{ top: 10, right: 15, bottom: 0, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="year" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)',
                  fontSize: '11px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Area
                type="monotone"
                dataKey="baseSupplyMLD"
                name="Catchment + External Supply"
                fill="#0ea5e9"
                fillOpacity={0.2}
                stroke="#0ea5e9"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="demandMLD"
                name="Projected Water Demand (MLD)"
                stroke="#f43f5e"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#f43f5e' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Mitigation & Infrastructure Engineering Recommendation */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-2">
        <div className="flex items-center space-x-2 text-sky-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-sky-400" />
          <span>Resilience Recommendation</span>
        </div>
        <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/70 p-3 rounded-xl border border-slate-850">
          {recommendation}
        </p>
      </div>
    </div>
  );
};
