import React from 'react';
import {
  Flame,
  CloudRain,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  Activity,
  Layers,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { SITE_CLIMATE_DATA } from '../../data/intelligenceData';
import { CandidateSite, Region } from '../../types';

interface TerraClimateAIProps {
  currentRegion: Region;
  candidateSites: CandidateSite[];
  selectedSiteCode: 'A' | 'B' | 'C';
  onSelectSiteCode: (code: 'A' | 'B' | 'C') => void;
}

export const TerraClimateAI: React.FC<TerraClimateAIProps> = ({
  candidateSites,
  selectedSiteCode,
  onSelectSiteCode,
}) => {
  const activeSite = candidateSites.find((s) => s.code === selectedSiteCode) || candidateSites[0];
  const climateData = SITE_CLIMATE_DATA[activeSite?.id] || SITE_CLIMATE_DATA.site_a;

  return (
    <div className="flex-1 h-full bg-[#07111F] text-[#F1F5F9] overflow-y-auto p-6 space-y-6 select-none font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#F87171]/20 text-[#F87171] border border-[#F87171]/40">
              TERRACLIMATE AI
            </span>
            <span className="text-xs text-[#94A3B8]">CMIP6 Downscaled Warming & Multi-Hazard Zonation Engine</span>
          </div>
          <h2 className="font-heading font-extrabold text-2xl text-[#F1F5F9] mt-1">
            Climate & Disaster Risk Resilience
          </h2>
          <p className="text-xs text-[#94A3B8]">
            Decadal temperature anomaly trajectories (SSP2-4.5 vs SSP5-8.5), Bhuvan satellite flood return periods, and seismic PGA acceleration.
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
                  ? 'bg-[#17283A] text-[#F87171] border border-[#F87171]/30 shadow-sm'
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
          <div className="text-[10px] font-mono text-[#94A3B8] uppercase">Summer Peak Mean</div>
          <div className="font-heading font-black text-xl text-[#F87171]">{climateData.tempMeanSummer}°C</div>
          <div className="text-[10px] text-[#94A3B8] font-mono">Heatwave Exposure</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0D1928] border border-white/[0.08] space-y-1">
          <div className="text-[10px] font-mono text-[#94A3B8] uppercase">Extreme Heat Days</div>
          <div className="font-heading font-black text-xl text-[#FBBF24]">{climateData.extremeHeatDaysYr} days/yr</div>
          <div className="text-[10px] text-[#94A3B8] font-mono">&gt; 42°C threshold</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0D1928] border border-white/[0.08] space-y-1">
          <div className="text-[10px] font-mono text-[#94A3B8] uppercase">25-Yr Flood Risk</div>
          <div className={`font-heading font-black text-xl ${climateData.floodReturnPeriod25YrRiskPct > 50 ? 'text-[#F87171]' : 'text-[#34D399]'}`}>
            {climateData.floodReturnPeriod25YrRiskPct}%
          </div>
          <div className="text-[10px] text-[#94A3B8] font-mono">Bhuvan Inundation</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0D1928] border border-white/[0.08] space-y-1">
          <div className="text-[10px] font-mono text-[#94A3B8] uppercase">100-Yr Flood Risk</div>
          <div className={`font-heading font-black text-xl ${climateData.floodReturnPeriod100YrRiskPct > 50 ? 'text-[#F87171]' : 'text-[#34D399]'}`}>
            {climateData.floodReturnPeriod100YrRiskPct}%
          </div>
          <div className="text-[10px] text-[#94A3B8] font-mono">Centennial Return</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0D1928] border border-white/[0.08] space-y-1">
          <div className="text-[10px] font-mono text-[#94A3B8] uppercase">Seismic Zone</div>
          <div className="font-heading font-black text-sm text-[#FBBF24] truncate">Zone IV</div>
          <div className="text-[10px] text-[#94A3B8] font-mono">PGA: {climateData.peakGroundAccelG}g</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0D1928] border border-white/[0.08] space-y-1">
          <div className="text-[10px] font-mono text-[#94A3B8] uppercase">Disaster Clearance</div>
          <div className={`font-heading font-black text-sm ${climateData.floodReturnPeriod25YrRiskPct > 50 ? 'text-[#F87171]' : 'text-[#34D399]'}`}>
            {climateData.floodReturnPeriod25YrRiskPct > 50 ? 'DISQUALIFIED' : 'CLEARED'}
          </div>
          <div className="text-[10px] text-[#94A3B8] font-mono">Deal-Breaker Logic</div>
        </div>
      </div>

      {/* Main Charts: Warming Scenarios & Extreme Rainfall */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: CMIP6 Temperature Trajectories */}
        <div className="p-5 rounded-3xl bg-[#0D1928] border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-sm text-[#F1F5F9] flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-[#F87171]" />
                <span>CMIP6 Temperature Anomaly Trajectories (2025–2050)</span>
              </h3>
              <p className="text-[11px] text-[#94A3B8]">Observed mean annual temperature vs SSP2-4.5 vs SSP5-8.5</p>
            </div>
            <span className="text-[10px] font-mono text-[#F87171] font-bold">°Celsius (°C)</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={climateData.temperatureTrends} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#17283A" />
                <XAxis dataKey="year" stroke="#94A3B8" fontSize={11} />
                <YAxis domain={['auto', 'auto']} stroke="#94A3B8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111F30',
                    borderColor: '#F87171',
                    borderRadius: '12px',
                    fontSize: '11px',
                  }}
                  formatter={(val: any) => [`${val} °C`]}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line
                  type="monotone"
                  dataKey="ssp245"
                  name="SSP2-4.5 (Moderate Warming)"
                  stroke="#38BDF8"
                  strokeWidth={2.5}
                />
                <Line
                  type="monotone"
                  dataKey="ssp585"
                  name="SSP5-8.5 (High Emissions)"
                  stroke="#F87171"
                  strokeWidth={2.5}
                  strokeDasharray="4 4"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Decadal Extreme Rainfall Frequency */}
        <div className="p-5 rounded-3xl bg-[#0D1928] border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-sm text-[#F1F5F9] flex items-center gap-1.5">
                <CloudRain className="w-4 h-4 text-[#38BDF8]" />
                <span>Decadal Extreme Rainfall Frequency (IMD / MOSDAC)</span>
              </h3>
              <p className="text-[11px] text-[#94A3B8]">Instances of extreme 24-hr precipitation events per decade</p>
            </div>
            <span className="text-[10px] font-mono text-[#38BDF8] font-bold">Event Count</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={climateData.extremeRainfallEvents} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#17283A" />
                <XAxis dataKey="decade" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111F30',
                    borderColor: '#38BDF8',
                    borderRadius: '12px',
                    fontSize: '11px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="eventsAbove65mm" name="Heavy (>65mm/day)" fill="#38BDF8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="eventsAbove115mm" name="Very Heavy (>115mm/day)" fill="#F87171" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Hazard Verdict Banner */}
      <div className={`p-5 rounded-3xl border space-y-2 ${
        climateData.floodReturnPeriod25YrRiskPct > 50
          ? 'bg-red-950/40 border-red-500/60'
          : 'bg-[#0D1928] border-white/[0.08]'
      }`}>
        <div className="flex items-center space-x-2 text-xs font-bold text-[#F1F5F9]">
          {climateData.floodReturnPeriod25YrRiskPct > 50 ? (
            <AlertTriangle className="w-4 h-4 text-[#F87171]" />
          ) : (
            <ShieldCheck className="w-4 h-4 text-[#34D399]" />
          )}
          <span>Disaster Risk Appraisal & Deal-Breaker Status</span>
        </div>
        <p className="text-xs text-[#94A3B8] leading-relaxed">
          {climateData.floodReturnPeriod25YrRiskPct > 50 ? (
            <span className="text-[#F87171] font-semibold">
              CRITICAL HARD-STOP TRIGGERED: Site {selectedSiteCode} exhibits a {climateData.floodReturnPeriod25YrRiskPct}% spatial overlap with the historical 25-year Bhuvan flood inundation mask. Greenfield master-planning on this parcel is non-compliant with NDMA disaster mitigation standards.
            </span>
          ) : (
            <span className="text-[#34D399]">
              COMPLIANT: Site {selectedSiteCode} is situated on an elevated well-drained plain with only {climateData.floodReturnPeriod25YrRiskPct}% 25-year flood risk. Structural design must follow IS 1893:2016 Zone IV seismic safety standards with peak ground acceleration rating of {climateData.peakGroundAccelG}g.
            </span>
          )}
        </p>
      </div>
    </div>
  );
};
