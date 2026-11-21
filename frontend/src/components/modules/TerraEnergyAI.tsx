import React from 'react';
import {
  Zap,
  Sun,
  Wind,
  BatteryCharging,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  LineChart,
  Line,
  Bar,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { SITE_ENERGY_DATA } from '../../data/intelligenceData';
import { CandidateSite, Region } from '../../types';

interface TerraEnergyAIProps {
  currentRegion: Region;
  candidateSites: CandidateSite[];
  selectedSiteCode: 'A' | 'B' | 'C';
  onSelectSiteCode: (code: 'A' | 'B' | 'C') => void;
}

export const TerraEnergyAI: React.FC<TerraEnergyAIProps> = ({
  candidateSites,
  selectedSiteCode,
  onSelectSiteCode,
}) => {
  const activeSite = candidateSites.find((s) => s.code === selectedSiteCode) || candidateSites[0];
  const energyData = SITE_ENERGY_DATA[activeSite?.id] || SITE_ENERGY_DATA.site_a;

  return (
    <div className="flex-1 h-full bg-[#07111F] text-[#F1F5F9] overflow-y-auto p-6 space-y-6 select-none font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FBBF24]/20 text-[#FBBF24] border border-[#FBBF24]/40">
              TERRAENERGY AI
            </span>
            <span className="text-xs text-[#94A3B8]">VEDAS Solar Insolation & NIWE Wind Energy Atlas</span>
          </div>
          <h2 className="font-heading font-extrabold text-2xl text-[#F1F5F9] mt-1">
            Renewable Energy & Net-Zero Microgrid
          </h2>
          <p className="text-xs text-[#94A3B8]">
            Solar Global Horizontal Irradiance (GHI), wind power density, 24-hour diurnal load vs generation balancing, and BESS storage capacity.
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
                  ? 'bg-[#17283A] text-[#FBBF24] border border-[#FBBF24]/30 shadow-sm'
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
          <div className="text-[10px] font-mono text-[#94A3B8] uppercase">Solar GHI</div>
          <div className="font-heading font-black text-xl text-[#FBBF24]">{energyData.solarGHIKWhM2Day}</div>
          <div className="text-[10px] text-[#94A3B8] font-mono">kWh/m²/day</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0D1928] border border-white/[0.08] space-y-1">
          <div className="text-[10px] font-mono text-[#94A3B8] uppercase">Solar DNI</div>
          <div className="font-heading font-black text-xl text-[#F59E0B]">{energyData.solarDNIKWhM2Day}</div>
          <div className="text-[10px] text-[#94A3B8] font-mono">Direct Normal</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0D1928] border border-white/[0.08] space-y-1">
          <div className="text-[10px] font-mono text-[#94A3B8] uppercase">Wind Speed (100m)</div>
          <div className="font-heading font-black text-xl text-[#38BDF8]">{energyData.avgWindSpeed100mMs} m/s</div>
          <div className="text-[10px] text-[#94A3B8] font-mono">{energyData.windPowerDensityWM2} W/m² Density</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0D1928] border border-white/[0.08] space-y-1">
          <div className="text-[10px] font-mono text-[#94A3B8] uppercase">Rooftop Solar</div>
          <div className="font-heading font-black text-xl text-[#22D3EE]">{energyData.recommendedRooftopSolarMW} MW</div>
          <div className="text-[10px] text-[#34D399] font-mono">Biophilic Buildings</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0D1928] border border-white/[0.08] space-y-1">
          <div className="text-[10px] font-mono text-[#94A3B8] uppercase">BESS Storage</div>
          <div className="font-heading font-black text-xl text-[#A78BFA]">{energyData.recommendedBESSStorageMWh} MWh</div>
          <div className="text-[10px] text-[#94A3B8] font-mono">Lithium/Flow Battery</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0D1928] border border-white/[0.08] space-y-1">
          <div className="text-[10px] font-mono text-[#94A3B8] uppercase">Net-Zero Offset</div>
          <div className="font-heading font-black text-xl text-[#34D399]">{energyData.cleanEnergyOffsetPct}%</div>
          <div className="text-[10px] text-[#34D399] font-mono">Clean Energy Share</div>
        </div>
      </div>

      {/* Main Charts: Monthly Radiation & Hourly Load Balancing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Monthly Solar Radiation GHI vs DNI */}
        <div className="p-5 rounded-3xl bg-[#0D1928] border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-sm text-[#F1F5F9] flex items-center gap-1.5">
                <Sun className="w-4 h-4 text-[#FBBF24]" />
                <span>Monthly Solar Radiation (GHI & DNI)</span>
              </h3>
              <p className="text-[11px] text-[#94A3B8]">VEDAS SAC Heliosat satellite-derived daily insolation</p>
            </div>
            <span className="text-[10px] font-mono text-[#FBBF24] font-bold">kWh/m²/day</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={energyData.monthlySolarRadiation} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#17283A" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
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
                <Bar dataKey="ghi" name="Global Horizontal (GHI)" fill="#FBBF24" radius={[4, 4, 0, 0]} />
                <Line
                  type="monotone"
                  dataKey="dni"
                  name="Direct Normal (DNI)"
                  stroke="#38BDF8"
                  strokeWidth={2.5}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: 24-Hour Diurnal Demand vs Solar Generation & BESS */}
        <div className="p-5 rounded-3xl bg-[#0D1928] border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-sm text-[#F1F5F9] flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-[#34D399]" />
                <span>Diurnal Grid Balancing: Demand vs Solar & BESS</span>
              </h3>
              <p className="text-[11px] text-[#94A3B8]">Hourly power dispatch for 25,000 population settlement</p>
            </div>
            <span className="text-[10px] font-mono text-[#34D399] font-bold">Megawatts (MW)</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={energyData.dailyDemandVsGeneration} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#17283A" />
                <XAxis dataKey="hour" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111F30',
                    borderColor: '#34D399',
                    borderRadius: '12px',
                    fontSize: '11px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Area
                  type="monotone"
                  dataKey="solarMW"
                  name="Solar Generation MW"
                  fill="#FBBF24"
                  fillOpacity={0.3}
                  stroke="#FBBF24"
                  strokeWidth={2}
                />
                <Bar dataKey="bessDischargeMW" name="BESS Battery MW" fill="#A78BFA" radius={[4, 4, 0, 0]} />
                <Line
                  type="monotone"
                  dataKey="demandMW"
                  name="City Grid Load MW"
                  stroke="#F87171"
                  strokeWidth={2.5}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Clean Energy Guidance Banner */}
      <div className="p-5 rounded-3xl bg-[#0D1928] border border-white/[0.08] space-y-2">
        <div className="flex items-center space-x-2 text-xs font-bold text-[#F1F5F9]">
          <ShieldCheck className="w-4 h-4 text-[#34D399]" />
          <span>Microgrid & Agrivoltaic Master Plan Specification</span>
        </div>
        <p className="text-xs text-[#94A3B8] leading-relaxed">
          Site {selectedSiteCode} enjoys high solar potential ({energyData.solarGHIKWhM2Day} kWh/m²/day). Integrating <b className="text-[#F1F5F9]">{energyData.recommendedUtilitySolarMW} MW</b> of elevated agrivoltaic arrays along the eastern perimeter combined with <b className="text-[#F1F5F9]">{energyData.recommendedBESSStorageMWh} MWh</b> BESS provides 4.2 hours of firm evening peak shaving, enabling an <b className="text-[#34D399]">{energyData.cleanEnergyOffsetPct}% net-zero carbon balance</b>.
        </p>
      </div>
    </div>
  );
};
