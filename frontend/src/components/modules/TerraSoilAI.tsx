import React from 'react';
import {
  Layers,
  FlaskConical,
  CheckCircle2,
  Trees,
  Sprout,
  ShieldCheck,
  AlertTriangle,
  Compass,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';
import { SITE_SOIL_DATA } from '../../data/intelligenceData';
import { CandidateSite, Region } from '../../types';

interface TerraSoilAIProps {
  currentRegion: Region;
  candidateSites: CandidateSite[];
  selectedSiteCode: 'A' | 'B' | 'C';
  onSelectSiteCode: (code: 'A' | 'B' | 'C') => void;
}

export const TerraSoilAI: React.FC<TerraSoilAIProps> = ({
  candidateSites,
  selectedSiteCode,
  onSelectSiteCode,
}) => {
  const activeSite = candidateSites.find((s) => s.code === selectedSiteCode) || candidateSites[0];
  const soilData = SITE_SOIL_DATA[activeSite?.id] || SITE_SOIL_DATA.site_a;

  const compositionData = [
    { name: 'Sand %', value: soilData.composition.sand, color: '#FBBF24' },
    { name: 'Silt %', value: soilData.composition.silt, color: '#38BDF8' },
    { name: 'Clay %', value: soilData.composition.clay, color: '#F87171' },
  ];

  return (
    <div className="flex-1 h-full bg-[#07111F] text-[#F1F5F9] overflow-y-auto p-6 space-y-6 select-none font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#34D399]/20 text-[#34D399] border border-[#34D399]/40">
              TERRASOIL AI
            </span>
            <span className="text-xs text-[#94A3B8]">National Bureau of Soil Survey (NBSS&LUP) & Space Soil Engine</span>
          </div>
          <h2 className="font-heading font-extrabold text-2xl text-[#F1F5F9] mt-1">
            Soil Intelligence & Geotechnical Suitability
          </h2>
          <p className="text-xs text-[#94A3B8]">
            Physical grain texture composition, chemical fertility profile (NPK / OC), foundation bearing suitability, and recommended biophilic flora.
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
          <div className="text-[10px] font-mono text-[#94A3B8] uppercase">Texture Class</div>
          <div className="font-heading font-black text-sm text-[#F1F5F9] truncate">{soilData.textureClass.split('(')[0]}</div>
          <div className="text-[10px] text-[#34D399] font-mono">USDA Compliant</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0D1928] border border-white/[0.08] space-y-1">
          <div className="text-[10px] font-mono text-[#94A3B8] uppercase">Soil pH</div>
          <div className="font-heading font-black text-xl text-[#22D3EE]">{soilData.phLevel}</div>
          <div className="text-[10px] text-[#94A3B8] font-mono">Neutral-to-Mild Alkaline</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0D1928] border border-white/[0.08] space-y-1">
          <div className="text-[10px] font-mono text-[#94A3B8] uppercase">Organic Carbon</div>
          <div className="font-heading font-black text-xl text-[#34D399]">{soilData.organicCarbonPct}%</div>
          <div className="text-[10px] text-[#94A3B8] font-mono">Moderate Humus</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0D1928] border border-white/[0.08] space-y-1">
          <div className="text-[10px] font-mono text-[#94A3B8] uppercase">Nitrogen (N)</div>
          <div className="font-heading font-black text-xl text-[#60A5FA]">{soilData.npkRating.nitrogen}</div>
          <div className="text-[10px] text-[#94A3B8] font-mono">Fertility Pillar</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0D1928] border border-white/[0.08] space-y-1">
          <div className="text-[10px] font-mono text-[#94A3B8] uppercase">Phosphorus (P)</div>
          <div className="font-heading font-black text-xl text-[#FBBF24]">{soilData.npkRating.phosphorus}</div>
          <div className="text-[10px] text-[#94A3B8] font-mono">Fertility Pillar</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0D1928] border border-white/[0.08] space-y-1">
          <div className="text-[10px] font-mono text-[#94A3B8] uppercase">Permeability</div>
          <div className="font-heading font-black text-xl text-[#A78BFA]">{soilData.permeabilityMmHr} mm/h</div>
          <div className="text-[10px] text-[#94A3B8] font-mono">Drainage Infiltration</div>
        </div>
      </div>

      {/* Main Charts & Foundation Guidance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Texture Composition Donut */}
        <div className="lg:col-span-5 p-5 rounded-3xl bg-[#0D1928] border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-sm text-[#F1F5F9] flex items-center gap-1.5">
              <FlaskConical className="w-4 h-4 text-[#34D399]" />
              <span>Grain Texture Composition</span>
            </h3>
            <span className="text-[10px] font-mono text-[#34D399] font-bold">100% Total Grain</span>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={compositionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {compositionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111F30',
                    borderColor: '#34D399',
                    borderRadius: '12px',
                    fontSize: '11px',
                  }}
                  formatter={(val: any) => [`${val}%`, 'Composition']}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Structural Foundation & Flora Recommendations */}
        <div className="lg:col-span-7 space-y-4">
          {/* Foundation Suitability */}
          <div className="p-5 rounded-3xl bg-[#0D1928] border border-white/[0.08] space-y-2">
            <div className="flex items-center space-x-2 text-xs font-bold text-[#F1F5F9]">
              <ShieldCheck className="w-4 h-4 text-[#22D3EE]" />
              <span>Foundation Suitability & Engineering Clearance</span>
            </div>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              {soilData.foundationSuitability}
            </p>
          </div>

          {/* Recommended Urban Canopy & Soil-Stabilizing Species */}
          <div className="p-5 rounded-3xl bg-[#0D1928] border border-white/[0.08] space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-[#F1F5F9]">
              <Trees className="w-4 h-4 text-[#34D399]" />
              <span>Recommended Urban Canopy & Native Species</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {soilData.recommendedUrbanVegetation.map((veg, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-[#111F30] border border-white/[0.06] text-[#F1F5F9]">
                  <Sprout className="w-3.5 h-3.5 text-[#34D399] inline mr-1.5" />
                  <span>{veg}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
