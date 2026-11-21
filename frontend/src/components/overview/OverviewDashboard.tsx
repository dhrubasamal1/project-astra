import React from 'react';
import {
  LayoutDashboard,
  MapPin,
  Building2,
  TrendingUp,
  Satellite,
  FileText,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Droplets,
  Zap,
  Trees,
  Compass,
  Layers,
  Sparkles,
} from 'lucide-react';
import { CandidateSite, Region, SiteScorecard } from '../../types';
import { NavPageId } from '../layout/AppSidebar';

interface OverviewDashboardProps {
  currentRegion: Region;
  candidateSites: CandidateSite[];
  selectedSiteCode: 'A' | 'B' | 'C';
  onSelectSiteCode: (code: 'A' | 'B' | 'C') => void;
  onNavigate: (page: NavPageId) => void;
  scorecards: Record<string, SiteScorecard>;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  currentRegion,
  candidateSites,
  selectedSiteCode,
  onSelectSiteCode,
  onNavigate,
  scorecards,
}) => {
  const topSite = candidateSites.find((s) => s.code === 'A') || candidateSites[0];
  const dealBreakerSite = candidateSites.find((s) => s.code === 'B');

  return (
    <div className="flex-1 h-full bg-[#07111F] text-[#F1F5F9] overflow-y-auto p-6 space-y-6 select-none font-sans">
      {/* 1. Hero Executive Status Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0D1928] via-[#111F30] to-[#0D1928] border border-white/[0.1] p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#22D3EE]/20 text-[#22D3EE] border border-[#22D3EE]/40 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#22D3EE]" />
              <span>ACTIVE SPATIAL SCREENING MISSION</span>
            </span>
            <span className="text-xs text-[#94A3B8] font-mono">{currentRegion.state}</span>
          </div>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#F1F5F9]">
            {currentRegion.name}
          </h2>
          <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
            {currentRegion.description}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-mono text-[#94A3B8]">
            <span className="flex items-center gap-1 text-[#34D399]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>ISRO 4-Portals Live</span>
            </span>
            <span>•</span>
            <span>3 Candidate Parcels</span>
            <span>•</span>
            <span className="text-[#22D3EE]">Zonal Clipping &lt; 150ms</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0 w-full sm:w-auto">
          <button
            onClick={() => onNavigate('site_selection')}
            className="flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#22D3EE] to-[#34D399] text-[#07111F] font-heading font-bold text-xs shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
          >
            <span>Open Interactive GIS Map</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onNavigate('city_designer')}
            className="flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-[#17283A] hover:bg-[#1E3A5F] border border-[#22D3EE]/30 text-[#F1F5F9] font-semibold text-xs transition-all"
          >
            <Building2 className="w-4 h-4 text-[#22D3EE]" />
            <span>Launch AI City Designer</span>
          </button>
        </div>
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#0D1928] border border-white/[0.08] space-y-1">
          <div className="text-[10px] font-mono text-[#94A3B8] uppercase">Top Recommended Site</div>
          <div className="font-heading font-black text-xl text-[#34D399]">Site A (Jewar North)</div>
          <div className="text-[11px] text-[#94A3B8]">Composite Suitability: <b className="text-[#34D399]">84.2/100</b></div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0D1928] border border-white/[0.08] space-y-1">
          <div className="text-[10px] font-mono text-[#94A3B8] uppercase">Deal-Breaker Status</div>
          <div className="font-heading font-black text-xl text-[#F87171]">1 Hard-Stop (Site B)</div>
          <div className="text-[11px] text-[#94A3B8]">53.4% Bhuvan flood overlap</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0D1928] border border-white/[0.08] space-y-1">
          <div className="text-[10px] font-mono text-[#94A3B8] uppercase">Municipal Water Balance</div>
          <div className="font-heading font-black text-xl text-[#22D3EE]">88% Self-Sufficient</div>
          <div className="text-[11px] text-[#94A3B8]">135 lpcd standard met</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0D1928] border border-white/[0.08] space-y-1">
          <div className="text-[10px] font-mono text-[#94A3B8] uppercase">Clean Energy Yield</div>
          <div className="font-heading font-black text-xl text-[#FBBF24]">92% Net-Zero</div>
          <div className="text-[11px] text-[#94A3B8]">Solar & Agrivoltaics</div>
        </div>
      </div>

      {/* 3. Candidate Parcels Side-by-Side Status */}
      <div className="p-6 rounded-3xl bg-[#0D1928] border border-white/[0.08] space-y-4">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <div>
            <h3 className="font-heading font-bold text-base text-[#F1F5F9]">Candidate Parcels Evaluated</h3>
            <p className="text-xs text-[#94A3B8]">Click any parcel to inspect its geospatial scorecard and spatial overlays</p>
          </div>
          <button
            onClick={() => onNavigate('site_selection')}
            className="text-xs font-mono text-[#22D3EE] hover:underline flex items-center gap-1"
          >
            <span>View Full GIS Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {candidateSites.map((site) => {
            const isRank1 = site.code === 'A';
            const isDisqualified = site.code === 'B';

            return (
              <div
                key={site.id}
                onClick={() => {
                  onSelectSiteCode(site.code);
                  onNavigate('site_selection');
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 flex flex-col justify-between ${
                  isDisqualified
                    ? 'bg-[#111F30] border-[#F87171]/40 hover:border-[#F87171]'
                    : isRank1
                    ? 'bg-[#111F30] border-[#34D399]/40 hover:border-[#34D399]'
                    : 'bg-[#111F30] border-white/[0.08] hover:border-[#22D3EE]/40'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        isDisqualified
                          ? 'bg-[#F87171]/20 text-[#F87171] border border-[#F87171]/40'
                          : isRank1
                          ? 'bg-[#34D399]/20 text-[#34D399] border border-[#34D399]/40'
                          : 'bg-[#60A5FA]/20 text-[#60A5FA] border border-[#60A5FA]/40'
                      }`}
                    >
                      SITE {site.code} • {isDisqualified ? 'DISQUALIFIED' : isRank1 ? 'RANK #1' : 'RANK #2'}
                    </span>
                    <span className="font-mono text-xs font-bold text-[#F1F5F9]">
                      {isDisqualified ? '41.5' : isRank1 ? '84.2' : '76.8'} pts
                    </span>
                  </div>

                  <h4 className="font-heading font-bold text-sm text-[#F1F5F9]">{site.name}</h4>
                  <p className="text-xs text-[#94A3B8] leading-relaxed line-clamp-2">{site.description}</p>
                </div>

                <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-[#94A3B8]">
                  <span>Area: {site.areaKm2} km²</span>
                  <span className="text-[#22D3EE] font-medium flex items-center gap-1">
                    <span>Inspect</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Quick Intelligence Exploration Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <button
          onClick={() => onNavigate('terrain')}
          className="p-3.5 rounded-2xl bg-[#0D1928] hover:bg-[#111F30] border border-white/[0.08] hover:border-[#22D3EE]/40 text-left transition-all space-y-1.5"
        >
          <Layers className="w-4 h-4 text-[#22D3EE]" />
          <div className="text-xs font-bold text-[#F1F5F9]">Terrain & Geology</div>
          <div className="text-[10px] text-[#94A3B8]">CartoDEM 30m Slope</div>
        </button>

        <button
          onClick={() => onNavigate('soil')}
          className="p-3.5 rounded-2xl bg-[#0D1928] hover:bg-[#111F30] border border-white/[0.08] hover:border-[#34D399]/40 text-left transition-all space-y-1.5"
        >
          <Compass className="w-4 h-4 text-[#34D399]" />
          <div className="text-xs font-bold text-[#F1F5F9]">Soil Intelligence</div>
          <div className="text-[10px] text-[#94A3B8]">Texture & Bearing kPa</div>
        </button>

        <button
          onClick={() => onNavigate('water')}
          className="p-3.5 rounded-2xl bg-[#0D1928] hover:bg-[#111F30] border border-white/[0.08] hover:border-[#60A5FA]/40 text-left transition-all space-y-1.5"
        >
          <Droplets className="w-4 h-4 text-[#60A5FA]" />
          <div className="text-xs font-bold text-[#F1F5F9]">Water Intelligence</div>
          <div className="text-[10px] text-[#94A3B8]">135 lpcd Demand/Supply</div>
        </button>

        <button
          onClick={() => onNavigate('climate')}
          className="p-3.5 rounded-2xl bg-[#0D1928] hover:bg-[#111F30] border border-white/[0.08] hover:border-[#F87171]/40 text-left transition-all space-y-1.5"
        >
          <AlertTriangle className="w-4 h-4 text-[#F87171]" />
          <div className="text-xs font-bold text-[#F1F5F9]">Climate & Disaster</div>
          <div className="text-[10px] text-[#94A3B8]">Bhuvan Flood Zonation</div>
        </button>

        <button
          onClick={() => onNavigate('energy')}
          className="p-3.5 rounded-2xl bg-[#0D1928] hover:bg-[#111F30] border border-white/[0.08] hover:border-[#FBBF24]/40 text-left transition-all space-y-1.5"
        >
          <Zap className="w-4 h-4 text-[#FBBF24]" />
          <div className="text-xs font-bold text-[#F1F5F9]">Renewable Energy</div>
          <div className="text-[10px] text-[#94A3B8]">Solar GHI & BESS MWh</div>
        </button>

        <button
          onClick={() => onNavigate('vegetation')}
          className="p-3.5 rounded-2xl bg-[#0D1928] hover:bg-[#111F30] border border-white/[0.08] hover:border-[#34D399]/40 text-left transition-all space-y-1.5"
        >
          <Trees className="w-4 h-4 text-[#34D399]" />
          <div className="text-xs font-bold text-[#F1F5F9]">Vegetation (NDVI)</div>
          <div className="text-[10px] text-[#94A3B8]">Sentinel-2 10m Biomass</div>
        </button>
      </div>
    </div>
  );
};
