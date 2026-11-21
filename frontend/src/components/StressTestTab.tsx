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
        return 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300';
      case 'Stressed':
        return 'bg-amber-500/20 border-amber-500/50 text-amber-300';
      case 'Critical Deficit':
        return 'bg-red-500/20 border-red-500/50 text-red-300';
      default:
        return 'bg-slate-700 text-slate-300';
    }
  };

  return (
    <div className="space-y-5 pb-6">
      {/* Top Banner: Water Stress Index Gauge */}
      <div className="bg-slate-800/50 border border-slate-700/70 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
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
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">
              Demand / Supply
            </div>
          </div>
          <div
            className={`px-3 py-1.5 rounded-lg border text-xs font-bold uppercase tracking-wider ${getCategoryColor(
              stressCategory
            )}`}
          >
            {stressCategory}
          </div>
        </div>
      </div>

      {/* 2026-2050 Water Demand vs Supply Area Chart */}
      <div className="bg-slate-800/50 border border-slate-700/70 rounded-xl p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <span>2026–2050 Water Demand vs Supply Trajectory</span>
          </h3>
          <span className="text-[10px] text-slate-400 font-mono">
            Uncertainty Band: -28% Drought to +25% Wet Monsoon
          </span>
        </div>

        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={timeseries} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
              <defs>
                <linearGradient id="demandGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
              <XAxis dataKey="year" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <YAxis
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 10 }}
                unit=" MLD"
                domain={[0, 'dataMax + 15']}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '0.5rem',
                  fontSize: '11px',
                }}
                formatter={(val: any, name: any) => [`${val} MLD`, name]}
                labelFormatter={(year) => `Year ${year}`}
              />
              <Legend
                wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                iconType="circle"
              />
              {/* Demand Area */}
              <Area
                type="monotone"
                dataKey="demandMLD"
                name="Daily Demand (MLD)"
                stroke="#0284c7"
                strokeWidth={2.5}
                fill="url(#demandGradient)"
              />
              {/* Baseline Supply Line */}
              <Line
                type="monotone"
                dataKey="baseSupplyMLD"
                name="Base Supply (MLD)"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={false}
              />
              {/* Low Supply (Drought Uncertainty) Line */}
              <Line
                type="monotone"
                dataKey="lowSupplyMLD"
                name="Low Supply (Drought Uncertainty)"
                stroke="#ef4444"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
              />
              {/* High Supply (Wet Year) Line */}
              <Line
                type="monotone"
                dataKey="highSupplyMLD"
                name="High Supply (Monsoonal Peak)"
                stroke="#34d399"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Timeseries Key Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-750">
          <div className="bg-slate-900/80 p-2 rounded border border-slate-800 text-center">
            <div className="text-[10px] text-slate-400">Current Demand (2026)</div>
            <div className="text-xs font-mono font-bold text-white mt-0.5">{currentDemandMLD} MLD</div>
            <div className="text-[9px] text-slate-400">150,000 cap</div>
          </div>
          <div className="bg-slate-900/80 p-2 rounded border border-slate-800 text-center">
            <div className="text-[10px] text-slate-400">{horizon} Demand</div>
            <div className="text-xs font-mono font-bold text-sky-400 mt-0.5">{horizonDemandMLD} MLD</div>
            <div className="text-[9px] text-slate-400">{targetPopulation.toLocaleString()} cap</div>
          </div>
          <div className="bg-slate-900/80 p-2 rounded border border-slate-800 text-center">
            <div className="text-[10px] text-slate-400">{horizon} Base Supply</div>
            <div className="text-xs font-mono font-bold text-emerald-400 mt-0.5">
              {horizonBaseSupplyMLD} MLD
            </div>
            <div className="text-[9px] text-slate-400">Catchment + Canal</div>
          </div>
          <div className="bg-slate-900/80 p-2 rounded border border-slate-800 text-center">
            <div className="text-[10px] text-slate-400">Deficit Threshold</div>
            <div
              className={`text-xs font-mono font-bold mt-0.5 ${
                stressIndex >= 1.0 ? 'text-red-400' : 'text-emerald-400'
              }`}
            >
              {stressIndex >= 1.0 ? 'Crossed 1.0' : 'Safe (<1.0)'}
            </div>
            <div className="text-[9px] text-slate-400">Sustainable Margin</div>
          </div>
        </div>
      </div>

      {/* Qualitative Flood Stress Badge */}
      <div className="bg-slate-800/50 border border-slate-700/70 rounded-xl p-4 space-y-2.5">
        <div className="flex items-center space-x-2">
          <Waves className="w-4 h-4 text-blue-400" />
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Qualitative Flood Hazard & Drainage Stress Badge
          </h3>
        </div>

        <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white">{floodStressBadge.label}</span>
            <span
              className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider ${
                floodStressBadge.category === 'Low'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}
            >
              {floodStressBadge.category} Stress
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-800">
            <div>
              <span className="text-[10px] text-slate-400 block">Infiltration & Drainage Capacity:</span>
              <span className="text-slate-200 font-medium">{floodStressBadge.drainageCapacity}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Residual Flood Inundation Risk:</span>
              <span className="text-slate-200 font-medium">{floodStressBadge.residualRisk}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Policy & Strategic Recommendation Banner */}
      <div className="bg-slate-900/90 border border-slate-700 rounded-xl p-4 space-y-1.5">
        <div className="flex items-center space-x-2 text-xs font-bold text-sky-400 uppercase tracking-wider">
          <Info className="w-3.5 h-3.5" />
          <span>Strategic Infrastructure Recommendation</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">{recommendation}</p>
      </div>
    </div>
  );
};
