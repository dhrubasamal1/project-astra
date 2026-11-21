import React from 'react';
import {
  Trees,
  Sprout,
  Leaf,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { SITE_VEGETATION_DATA } from '../../data/intelligenceData';
import { CandidateSite, Region } from '../../types';

interface TerraVegetationAIProps {
  currentRegion: Region;
  candidateSites: CandidateSite[];
  selectedSiteCode: 'A' | 'B' | 'C';
  onSelectSiteCode: (code: 'A' | 'B' | 'C') => void;
}

export const TerraVegetationAI: React.FC<TerraVegetationAIProps> = ({
  candidateSites,
  selectedSiteCode,
  onSelectSiteCode,
}) => {
  const activeSite = candidateSites.find((s) => s.code === selectedSiteCode) || candidateSites[0];
  const vegData = SITE_VEGETATION_DATA[activeSite?.id] || SITE_VEGETATION_DATA.site_a;

  return (
    <div className="flex-1 h-full bg-[#07111F] text-[#F1F5F9] overflow-y-auto p-6 space-y-6 select-none font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#34D399]/20 text-[#34D399] border border-[#34D399]/40">
              TERRAVEGETATION AI
            </span>
            <span className="text-xs text-[#94A3B8]">VEDAS Sentinel-2 MSI 10m Multi-Temporal Biomass Engine</span>
          </div>
          <h2 className="font-heading font-extrabold text-2xl text-[#F1F5F9] mt-1">
            Vegetation Intelligence & Ecological Corridors
          </h2>
          <p className="text-xs text-[#94A3B8]">
            Normalized Difference Vegetation Index (NDVI), canopy density, green space per capita allocation, and native biodiverse reforestation.
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
                  ? 'bg-[#17283A] text-[#34D399] border border-[#34D399]/30 shadow-sm'
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
          <div className="text-[10px] font-mono text-[#94A3B8] uppercase">Mean NDVI</div>
          <div className="font-heading font-black text-xl text-[#34D399]">{vegData.ndviMean}</div>
          <div className="text-[10px] text-[#94A3B8] font-mono">10m Multi-Spectral</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0D1928] border border-white/[0.08] space-y-1">
          <div className="text-[10px] font-mono text-[#94A3B8] uppercase">5-Yr Vigour Trend</div>
          <div className="font-heading font-black text-sm text-[#22D3EE] truncate">{vegData.ndviTrend5Yr.split('(')[0]}</div>
          <div className="text-[10px] text-[#34D399] font-mono">Positive Growth</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0D1928] border border-white/[0.08] space-y-1">
          <div className="text-[10px] font-mono text-[#94A3B8] uppercase">Tree Canopy Cover</div>
          <div className="font-heading font-black text-xl text-[#60A5FA]">{vegData.canopyCoverPct}%</div>
          <div className="text-[10px] text-[#94A3B8] font-mono">Existing Crown</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0D1928] border border-white/[0.08] space-y-1">
          <div className="text-[10px] font-mono text-[#94A3B8] uppercase">Green Space Share</div>
          <div className="font-heading font-black text-xl text-[#34D399]">{vegData.greenCoverSharePct}%</div>
          <div className="text-[10px] text-[#34D399] font-mono">Target &gt; 30%</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0D1928] border border-white/[0.08] space-y-1">
          <div className="text-[10px] font-mono text-[#94A3B8] uppercase">Green per Capita</div>
          <div className="font-heading font-black text-xl text-[#FBBF24]">{vegData.greenSpacePerCapitaM2} m²</div>
          <div className="text-[10px] text-[#34D399] font-mono">2x WHO standard</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0D1928] border border-white/[0.08] space-y-1">
          <div className="text-[10px] font-mono text-[#94A3B8] uppercase">Corridor Buffer</div>
          <div className="font-heading font-black text-xl text-[#A78BFA]">{vegData.recommendedCorridorBufferM} m</div>
          <div className="text-[10px] text-[#94A3B8] font-mono">Ecological Buffer</div>
        </div>
      </div>

      {/* Main Content: Seasonal NDVI & Native Species Carbon Offset */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Seasonal NDVI Vigour Curve */}
        <div className="lg:col-span-6 p-5 rounded-3xl bg-[#0D1928] border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-sm text-[#F1F5F9] flex items-center gap-1.5">
                <Leaf className="w-4 h-4 text-[#34D399]" />
                <span>Seasonal NDVI Biomass Vigour Curve</span>
              </h3>
              <p className="text-[11px] text-[#94A3B8]">VEDAS Sentinel-2 16-day cloud-masked composite readings</p>
            </div>
            <span className="text-[10px] font-mono text-[#34D399] font-bold">NDVI (0 to 1)</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={vegData.seasonalNDVI} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#17283A" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
                <YAxis domain={[0, 1]} stroke="#94A3B8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111F30',
                    borderColor: '#34D399',
                    borderRadius: '12px',
                    fontSize: '11px',
                  }}
                  formatter={(val: any) => [val, 'NDVI Value']}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line
                  type="monotone"
                  dataKey="ndvi"
                  name="Observed Sentinel-2 NDVI"
                  stroke="#34D399"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#34D399' }}
                />
                <Line
                  type="monotone"
                  dataKey="baselineTarget"
                  name="Ecological Baseline"
                  stroke="#22D3EE"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Recommended Native Flora & Carbon Sequestration Table */}
        <div className="lg:col-span-6 p-5 rounded-3xl bg-[#0D1928] border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-sm text-[#F1F5F9] flex items-center gap-1.5">
              <Trees className="w-4 h-4 text-[#22D3EE]" />
              <span>Recommended Native Species & Carbon Yield</span>
            </h3>
            <span className="text-[10px] font-mono text-[#22D3EE] font-bold">kg CO₂ / yr / tree</span>
          </div>

          <div className="divide-y divide-white/[0.06] text-xs">
            {vegData.nativeSpecies.map((tree, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between first:pt-0 last:pb-0">
                <div>
                  <div className="font-bold text-[#F1F5F9]">{tree.name}</div>
                  <div className="text-[11px] text-[#94A3B8]">{tree.type} • {tree.waterRequirement} Water</div>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-[#34D399]">{tree.carbonSequestrationKgYr} kg/yr</span>
                  <span className="text-[9px] text-[#94A3B8] block">Carbon Sequestered</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-[#111F30] border border-white/[0.06] text-xs text-[#94A3B8] flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-[#34D399] shrink-0 mt-0.5" />
            <span>
              Integrating these recommended native species along the {vegData.recommendedCorridorBufferM}m ecological buffer sequesters an estimated 240 tons of CO₂ annually while attenuating microclimatic heat.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
