import React from 'react';
import {
  Droplets,
  CloudRain,
  TrendingDown,
  CheckCircle2,
  AlertTriangle,
  Waves,
  ShieldCheck,
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  LineChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { SITE_WATER_DATA } from '../../data/intelligenceData';
import { CandidateSite, Region } from '../../types';

interface TerraWaterAIProps {
  currentRegion: Region;
  candidateSites: CandidateSite[];
  selectedSiteCode: 'A' | 'B' | 'C';
  onSelectSiteCode: (code: 'A' | 'B' | 'C') => void;
}

export const TerraWaterAI: React.FC<TerraWaterAIProps> = ({
  candidateSites,
  selectedSiteCode,
  onSelectSiteCode,
}) => {
  const activeSite = candidateSites.find((s) => s.code === selectedSiteCode) || candidateSites[0];
  const waterData = SITE_WATER_DATA[activeSite?.id] || SITE_WATER_DATA.site_a;

  return (
    <div className="flex-1 h-full bg-[#07111F] text-[#F1F5F9] overflow-y-auto p-6 space-y-6 select-none font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#60A5FA]/20 text-[#60A5FA] border border-[#60A5FA]/40">
              TERRAWATER AI
            </span>
            <span className="text-xs text-[#94A3B8]">MOSDAC INSAT-3D IMERG & CGWB Hydrologic Model</span>
          </div>
          <h2 className="font-heading font-extrabold text-2xl text-[#F1F5F9] mt-1">
            Water Intelligence & Aquifer Security
          </h2>
          <p className="text-xs text-[#94A3B8]">
            Physical water balance accounting for 135 lpcd municipal consumption, decadal monsoonal rainfall, and local catchment harvesting potential.
          </p>
        </div>

        {/* Site Switcher */}
        <div className="flex items-center rounded-xl bg-[#0D1928] border border-white/[0.08] p-1">
          {candidateSites.map((s) => (
            <button
              key={s.id}
              onClick={() => onSelectSiteCode(s.code)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                s.code === selectedSiteCode
                  ? 'bg-[#17283A] text-[#60A5FA] border border-[#60A5FA]/30 shadow-sm'
                  : 'text-[#94A3B8] hover:text-[#F1F5F9]'
              }`}
            >
              Site {s.code}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-2xl bg-[#0D1928] border border-white/[0.08] space-y-1">
          <div className="text-[10px] font-mono text-[#94A3B8] uppercase">Groundwater Depth</div>
          <div className="font-heading font-black text-xl text-[#60A5FA]">{waterData.groundwaterDepthM} m</div>
          <div className="text-[10px] text-[#94A3B8] font-mono">bgl depth</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0D1928] border border-white/[0.08] space-y-1">
          <div className="text-[10px] font-mono text-[#94A3B8] uppercase">10-Yr Aquifer Trend</div>
          <div className="font-heading font-black text-xl text-[#FBBF24]">{waterData.aquiferTrend10Yr} m/yr</div>
          <div className="text-[10px] text-[#FBBF24] font-mono">Mild Depletion Rate</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0D1928] border border-white/[0.08] space-y-1">
          <div className="text-[10px] font-mono text-[#94A3B8] uppercase">Annual Rainfall</div>
          <div className="font-heading font-black text-xl text-[#34D399]">{waterData.annualRainfallMm} mm</div>
          <div className="text-[10px] text-[#94A3B8] font-mono">CV: {waterData.rainfallVariabilityCV}</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0D1928] border border-white/[0.08] space-y-1">
          <div className="text-[10px] font-mono text-[#94A3B8] uppercase">Safe Recharge</div>
          <div className="font-heading font-black text-xl text-[#22D3EE]">{waterData.safeRechargeMLD} MLD</div>
          <div className="text-[10px] text-[#34D399] font-mono">Infiltration Capacity</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0D1928] border border-white/[0.08] space-y-1">
          <div className="text-[10px] font-mono text-[#94A3B8] uppercase">Catchment Yield</div>
          <div className="font-heading font-black text-xl text-[#A78BFA]">{waterData.catchmentYieldPotentialMLD} MLD</div>
          <div className="text-[10px] text-[#94A3B8] font-mono">Harvesting Ceiling</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0D1928] border border-white/[0.08] space-y-1">
          <div className="text-[10px] font-mono text-[#94A3B8] uppercase">Tank Sizing</div>
          <div className="font-heading font-black text-xl text-[#F1F5F9]">{waterData.harvestingTankCapacityML} ML</div>
          <div className="text-[10px] text-[#34D399] font-mono">Retention Capacity</div>
        </div>
      </div>

      {/* Main Charts: Rainfall History & Groundwater Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Historical Rainfall vs Normal */}
        <div className="p-5 rounded-3xl bg-[#0D1928] border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-sm text-[#F1F5F9] flex items-center gap-1.5">
                <CloudRain className="w-4 h-4 text-[#60A5FA]" />
                <span>Monsoonal & Non-Monsoonal Precipitation (2018–2024)</span>
              </h3>
              <p className="text-[11px] text-[#94A3B8]">MOSDAC INSAT-3D Hydro-Estimator 4km surface data</p>
            </div>
            <span className="text-[10px] font-mono text-[#60A5FA] font-bold">Millimeters (mm)</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={waterData.historicalRainfall} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#17283A" />
                <XAxis dataKey="year" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111F30',
                    borderColor: '#60A5FA',
                    borderRadius: '12px',
                    fontSize: '11px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="monsoonMm" name="Monsoon Rain (mm)" fill="#38BDF8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="nonMonsoonMm" name="Winter/Pre-Monsoon" fill="#34D399" radius={[4, 4, 0, 0]} />
                <Line
                  type="monotone"
                  dataKey="normalMm"
                  name="Normal Baseline (740mm)"
                  stroke="#FBBF24"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Pre-Monsoon vs Post-Monsoon Groundwater Depth */}
        <div className="p-5 rounded-3xl bg-[#0D1928] border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-sm text-[#F1F5F9] flex items-center gap-1.5">
                <Waves className="w-4 h-4 text-[#22D3EE]" />
                <span>Aquifer Water Table Depth (Pre- vs Post-Monsoon)</span>
              </h3>
              <p className="text-[11px] text-[#94A3B8]">Meters below ground level (lower value = shallower water table)</p>
            </div>
            <span className="text-[10px] font-mono text-[#22D3EE] font-bold">Meters bgl</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={waterData.groundwaterTrend} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#17283A" />
                <XAxis dataKey="year" stroke="#94A3B8" fontSize={11} />
                <YAxis reversed domain={['auto', 'auto']} stroke="#94A3B8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111F30',
                    borderColor: '#22D3EE',
                    borderRadius: '12px',
                    fontSize: '11px',
                  }}
                  formatter={(val: any) => [`${val} m bgl`]}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line
                  type="monotone"
                  dataKey="preMonsoonDepthM"
                  name="Pre-Monsoon Depth (m)"
                  stroke="#F87171"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#F87171' }}
                />
                <Line
                  type="monotone"
                  dataKey="postMonsoonDepthM"
                  name="Post-Monsoon Recharged (m)"
                  stroke="#34D399"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#34D399' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recommendations Banner */}
      <div className="p-5 rounded-3xl bg-[#0D1928] border border-white/[0.08] space-y-2">
        <div className="flex items-center space-x-2 text-xs font-bold text-[#F1F5F9]">
          <ShieldCheck className="w-4 h-4 text-[#34D399]" />
          <span>Rainwater Harvesting & Sustainable Extraction Mandate</span>
        </div>
        <p className="text-xs text-[#94A3B8] leading-relaxed">
          To maintain aquifer neutrality, all new developments within Site {selectedSiteCode} must integrate rooftop rainwater harvesting structures with a minimum cumulative storage of <b className="text-[#F1F5F9]">{waterData.harvestingTankCapacityML} ML</b>. Bioswale retention ponds ensure 88% municipal self-sufficiency without triggering critical groundwater drawdown.
        </p>
      </div>
    </div>
  );
};
