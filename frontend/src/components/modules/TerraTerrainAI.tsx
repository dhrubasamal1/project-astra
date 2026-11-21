import React from 'react';
import {
  Mountain,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Compass,
  ArrowRight,
  TrendingDown,
  Info,
  ExternalLink,
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
import { SITE_TERRAIN_DATA } from '../../data/intelligenceData';
import { CandidateSite, Region } from '../../types';

interface TerraTerrainAIProps {
  currentRegion: Region;
  candidateSites: CandidateSite[];
  selectedSiteCode: 'A' | 'B' | 'C';
  onSelectSiteCode: (code: 'A' | 'B' | 'C') => void;
}

export const TerraTerrainAI: React.FC<TerraTerrainAIProps> = ({
  currentRegion,
  candidateSites,
  selectedSiteCode,
  onSelectSiteCode,
}) => {
  const activeSite = candidateSites.find((s) => s.code === selectedSiteCode) || candidateSites[0];
  const terrainData = SITE_TERRAIN_DATA[activeSite?.id] || SITE_TERRAIN_DATA.site_a;

  return (
    <div className="flex-1 h-full bg-[#07111F] text-[#F1F5F9] overflow-y-auto p-6 space-y-6 select-none font-sans">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#22D3EE]/20 text-[#22D3EE] border border-[#22D3EE]/40">
              TERRATERRAIN AI
            </span>
            <span className="text-xs text-[#94A3B8]">Bhoonidhi CartoDEM 30m Stereo-Derived Engine</span>
          </div>
          <h2 className="font-heading font-extrabold text-2xl text-[#F1F5F9] mt-1">
            Terrain & Geomorphology Intelligence
          </h2>
          <p className="text-xs text-[#94A3B8]">
            Digital Elevation Model analysis, slope buildability distributions, terrain roughness indices (TRI), and geotechnical bearing suitability.
          </p>
        </div>

        {/* Site Switcher Pills */}
        <div className="flex items-center rounded-xl bg-[#0D1928] border border-white/[0.08] p-1">
          {candidateSites.map((s) => (
            <button
              key={s.id}
              onClick={() => onSelectSiteCode(s.code)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                s.code === selectedSiteCode
                  ? 'bg-[#17283A] text-[#22D3EE] border border-[#22D3EE]/30 shadow-sm'
                  : 'text-[#94A3B8] hover:text-[#F1F5F9]'
              }`}
            >
              Site {s.code}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-2xl bg-[#0D1928] border border-white/[0.08] space-y-1">
          <div className="text-[10px] font-mono text-[#94A3B8] uppercase">Mean Elevation</div>
          <div className="font-heading font-black text-xl text-[#22D3EE]">{terrainData.elevationMean} m</div>
          <div className="text-[10px] text-[#94A3B8] font-mono">Min {terrainData.elevationMin}m • Max {terrainData.elevationMax}m</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0D1928] border border-white/[0.08] space-y-1">
          <div className="text-[10px] font-mono text-[#94A3B8] uppercase">Mean Slope</div>
          <div className="font-heading font-black text-xl text-[#34D399]">{terrainData.slopeMean}°</div>
          <div className="text-[10px] text-[#34D399] font-mono">Optimal Grade (&lt;2°)</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0D1928] border border-white/[0.08] space-y-1">
          <div className="text-[10px] font-mono text-[#94A3B8] uppercase">Buildable Share</div>
          <div className="font-heading font-black text-xl text-[#60A5FA]">{terrainData.slopeBuildableShare}%</div>
          <div className="text-[10px] text-[#94A3B8] font-mono">Slope &lt; 3.0° plain</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0D1928] border border-white/[0.08] space-y-1">
          <div className="text-[10px] font-mono text-[#94A3B8] uppercase">Roughness (TRI)</div>
          <div className="font-heading font-black text-xl text-[#FBBF24]">{terrainData.roughnessIndexTRI}</div>
          <div className="text-[10px] text-[#94A3B8] font-mono">Low Ruggedness</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0D1928] border border-white/[0.08] space-y-1">
          <div className="text-[10px] font-mono text-[#94A3B8] uppercase">Bearing Capacity</div>
          <div className="font-heading font-black text-xl text-[#A78BFA]">{terrainData.bearingCapacityKPa} kPa</div>
          <div className="text-[10px] text-[#34D399] font-mono">Safe for mid-rise</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0D1928] border border-white/[0.08] space-y-1">
          <div className="text-[10px] font-mono text-[#94A3B8] uppercase">Bedrock Depth</div>
          <div className="font-heading font-black text-xl text-[#F1F5F9]">{terrainData.bedrockDepthM} m</div>
          <div className="text-[10px] text-[#94A3B8] font-mono">Alluvial basin mantle</div>
        </div>
      </div>

      {/* Main Charts: Elevation Profile & Slope Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Transect Elevation Profile */}
        <div className="p-5 rounded-3xl bg-[#0D1928] border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-sm text-[#F1F5F9] flex items-center gap-1.5">
                <Mountain className="w-4 h-4 text-[#22D3EE]" />
                <span>Transect Elevation Cross-Section Profile</span>
              </h3>
              <p className="text-[11px] text-[#94A3B8]">5km West-to-East continuous surface elevation from CartoDEM 30m</p>
            </div>
            <span className="text-[10px] font-mono text-[#22D3EE] font-bold">Meters (EGM96)</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={terrainData.elevationProfile} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#17283A" />
                <XAxis dataKey="distanceKm" stroke="#94A3B8" fontSize={11} tickFormatter={(v) => `${v} km`} />
                <YAxis domain={['auto', 'auto']} stroke="#94A3B8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111F30',
                    borderColor: '#22D3EE',
                    borderRadius: '12px',
                    fontSize: '11px',
                  }}
                  formatter={(val: any) => [`${val} m`, 'Elevation']}
                />
                <Line
                  type="monotone"
                  dataKey="elevationM"
                  name="Elevation (m)"
                  stroke="#22D3EE"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#22D3EE' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Slope Distribution & Construction Suitability */}
        <div className="p-5 rounded-3xl bg-[#0D1928] border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-sm text-[#F1F5F9] flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#34D399]" />
                <span>Slope Angle Distribution & Grading Suitability</span>
              </h3>
              <p className="text-[11px] text-[#94A3B8]">Zonal distribution of slope grades across parcel footprint</p>
            </div>
            <span className="text-[10px] font-mono text-[#34D399] font-bold">Area Share %</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={terrainData.slopeDistribution} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#17283A" />
                <XAxis dataKey="range" stroke="#94A3B8" fontSize={10} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111F30',
                    borderColor: '#34D399',
                    borderRadius: '12px',
                    fontSize: '11px',
                  }}
                  formatter={(val: any) => [`${val}%`, 'Parcel Share']}
                />
                <Bar dataKey="percentage" fill="#34D399" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Geotechnical Synthesis Card */}
      <div className="p-5 rounded-3xl bg-[#0D1928] border border-white/[0.08] space-y-2">
        <div className="flex items-center space-x-2 text-xs font-bold text-[#F1F5F9]">
          <Compass className="w-4 h-4 text-[#22D3EE]" />
          <span>Regional Geological Context & Foundation Engineering Guidance</span>
        </div>
        <p className="text-xs text-[#94A3B8] leading-relaxed">
          <b className="text-[#F1F5F9]">{terrainData.dominantGeology}</b>. Ground conditions exhibit adequate bearing capacity ({terrainData.bearingCapacityKPa} kPa) for typical institutional, residential, and commercial developments without extensive deep caisson piling. Minor grading required only in peripheral drainage buffers.
        </p>
      </div>
    </div>
  );
};
