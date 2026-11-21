import React from 'react';
import {
  MapPin,
  FolderOpen,
  Users,
  Calendar,
  SlidersHorizontal,
  Compass,
  Play,
  CheckCircle2,
  AlertTriangle,
  Info,
  Droplets,
  Layers,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  MousePointerClick,
} from 'lucide-react';
import {
  Region,
  RegionId,
  PriorityPreset,
  ScenarioPreset,
  CandidateSite,
} from '../types';

interface LeftPanelProps {
  regions: Region[];
  selectedRegionId: RegionId;
  onSelectRegion: (id: RegionId) => void;
  candidateSites: CandidateSite[];
  selectedSiteCode: 'A' | 'B' | 'C';
  onSelectSiteCode: (code: 'A' | 'B' | 'C') => void;
  onLoadCandidateSites: () => void;
  targetPopulation: number;
  onChangeTargetPopulation: (pop: number) => void;
  horizon: 2035 | 2050;
  onChangeHorizon: (h: 2035 | 2050) => void;
  priorityPreset: PriorityPreset;
  onChangePriorityPreset: (p: PriorityPreset) => void;
  scenarioPreset: ScenarioPreset;
  onChangeScenarioPreset: (s: ScenarioPreset) => void;
  onRunAnalysis: () => void;
  isAnalyzing: boolean;
  isOpen?: boolean;
  onToggleOpen?: () => void;
}

export const LeftPanel: React.FC<LeftPanelProps> = ({
  regions,
  selectedRegionId,
  onSelectRegion,
  candidateSites,
  selectedSiteCode,
  onSelectSiteCode,
  onLoadCandidateSites,
  targetPopulation,
  onChangeTargetPopulation,
  horizon,
  onChangeHorizon,
  priorityPreset,
  onChangePriorityPreset,
  scenarioPreset,
  onChangeScenarioPreset,
  onRunAnalysis,
  isAnalyzing,
  isOpen = true,
  onToggleOpen,
}) => {
  const currentRegion = regions.find((r) => r.id === selectedRegionId) || regions[0];
  const waterDemandMLD = ((targetPopulation * 135) / 1000000).toFixed(1);

  if (!isOpen) {
    return (
      <div className="no-print h-full bg-[#07111F] border-r border-white/[0.08] flex flex-col items-center py-4 px-1 z-20">
        <button
          onClick={onToggleOpen}
          className="p-2 rounded-xl bg-[#0D1928] hover:bg-[#111F30] border border-white/[0.08] text-[#22D3EE] transition-all"
          title="Expand Parameters"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <aside className="left-panel no-print w-80 h-full bg-[#07111F] border-r border-white/[0.08] flex flex-col shrink-0 overflow-y-auto z-20 shadow-xl font-sans">
      <div className="p-4 space-y-4">
        {/* Header with Collapse Button */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
          <span className="text-xs font-bold text-[#F1F5F9] flex items-center gap-1.5 font-heading">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#22D3EE]" />
            <span>Screening Parameters</span>
          </span>
          {onToggleOpen && (
            <button
              onClick={onToggleOpen}
              className="p-1 rounded text-[#94A3B8] hover:text-[#F1F5F9]"
              title="Collapse Panel"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* 1. Target Region Selector */}
        <div>
          <label className="text-xs font-bold text-[#F1F5F9] uppercase tracking-wider mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#22D3EE]" />
              <span>Target Region</span>
            </span>
            <span className="text-[10px] text-[#94A3B8] font-mono">2 REGIONS</span>
          </label>
          <div className="space-y-2">
            {regions.map((region) => {
              const isSelected = region.id === selectedRegionId;
              return (
                <button
                  key={region.id}
                  onClick={() => onSelectRegion(region.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-[#17283A] border-[#22D3EE]/60 shadow-lg ring-1 ring-[#22D3EE]/30'
                      : 'bg-[#0D1928] border-white/[0.08] hover:bg-[#111F30]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${isSelected ? 'text-[#22D3EE]' : 'text-[#F1F5F9]'}`}>
                      {region.name}
                    </span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-[#22D3EE] shrink-0" />}
                  </div>
                  <p className="text-[11px] text-[#94A3B8] mt-1 line-clamp-1">{region.badge}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Interactive Candidate Sites Selector (A, B, C) */}
        <div className="bg-[#0D1928] p-3 rounded-xl border border-white/[0.08] space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#F1F5F9] flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#34D399]" />
              <span>Candidate Parcels</span>
            </span>
            <span className="px-2 py-0.5 text-[10px] bg-[#111F30] text-[#22D3EE] rounded-full font-mono border border-white/[0.08]">
              Active: Site {selectedSiteCode}
            </span>
          </div>

          {/* Clickable Sites List */}
          <div className="space-y-1.5 pt-1">
            {candidateSites.map((site) => {
              const isSelected = site.code === selectedSiteCode;
              return (
                <button
                  key={site.id}
                  onClick={() => onSelectSiteCode(site.code)}
                  className={`w-full flex items-center justify-between text-xs px-3 py-2 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-[#17283A] border-[#22D3EE] shadow-md ring-1 ring-[#22D3EE]/40'
                      : 'bg-[#07111F] border-white/[0.08] hover:bg-[#111F30] hover:border-white/[0.18]'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <span
                      className={`w-3 h-3 rounded-full shadow-sm shrink-0 ${isSelected ? 'animate-pulse' : ''}`}
                      style={{ backgroundColor: site.color }}
                    ></span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className={`font-bold ${isSelected ? 'text-[#22D3EE]' : 'text-[#F1F5F9]'}`}>
                          Site {site.code}
                        </span>
                        {isSelected && (
                          <span className="text-[9px] font-mono px-1 rounded bg-[#22D3EE]/20 text-[#22D3EE] font-bold">
                            SELECTED
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-[#94A3B8] truncate max-w-[130px]">
                        {site.name.split('(')[0]}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] font-mono text-[#F1F5F9] font-semibold block">
                      {(site.areaKm2 * 247.105).toFixed(0)} ac
                    </span>
                    <span className="text-[9px] text-[#94A3B8] font-mono">
                      {site.areaKm2} km²
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <button
            onClick={onLoadCandidateSites}
            className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-[#111F30] hover:bg-[#17283A] border border-[#34D399]/40 text-[#34D399] text-xs font-semibold rounded-lg shadow-sm transition-all"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Reset Demo Sites (A, B, C)</span>
          </button>
        </div>

        {/* 3. Target Population & Water Demand HUD */}
        <div className="bg-[#0D1928] p-3 rounded-xl border border-white/[0.08] space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#F1F5F9] flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#60A5FA]" />
              <span>Target Population</span>
            </label>
            <span className="text-xs font-mono font-bold text-[#22D3EE] bg-[#111F30] px-2 py-0.5 rounded border border-[#22D3EE]/30">
              {targetPopulation.toLocaleString()} cap
            </span>
          </div>

          <input
            type="range"
            min={100000}
            max={1000000}
            step={25000}
            value={targetPopulation}
            onChange={(e) => onChangeTargetPopulation(Number(e.target.value))}
            className="w-full accent-[#22D3EE] cursor-pointer h-1.5 bg-[#07111F] rounded-lg"
          />

          <div className="flex items-center justify-between text-[11px] text-[#94A3B8] pt-1 border-t border-white/[0.06] font-mono">
            <span className="flex items-center gap-1 text-[#22D3EE]">
              <Droplets className="w-3 h-3" />
              <span>{waterDemandMLD} MLD</span>
            </span>
            <span className="text-[10px] text-[#94A3B8]">135 lpcd standard</span>
          </div>
        </div>

        {/* 4. Planning Horizon Selector */}
        <div>
          <label className="text-xs font-bold text-[#F1F5F9] uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#FBBF24]" />
            <span>Planning Horizon</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[2035, 2050].map((h) => (
              <button
                key={h}
                onClick={() => onChangeHorizon(h as 2035 | 2050)}
                className={`py-2 px-3 text-xs font-semibold rounded-xl border text-center transition-all ${
                  horizon === h
                    ? 'bg-[#17283A] border-[#FBBF24]/60 text-[#FBBF24] shadow-sm'
                    : 'bg-[#0D1928] border-white/[0.08] text-[#94A3B8] hover:text-[#F1F5F9]'
                }`}
              >
                <div className="font-mono text-sm font-bold">{h}</div>
                <div className="text-[10px] opacity-80">{h === 2035 ? 'Phase-1 Core' : 'Full Scale'}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 5. Priority Presets */}
        <div>
          <label className="text-xs font-bold text-[#F1F5F9] uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-[#34D399]" />
            <span>Planner Priority Preset</span>
          </label>
          <div className="space-y-1.5">
            {[
              { id: 'balanced', label: 'Balanced Suitability', desc: 'Equal weight across 5 pillars' },
              { id: 'climate_resilient', label: 'Climate-Resilient', desc: 'Emphasizes flood & water security' },
              { id: 'infra_first', label: 'Infra-First', desc: 'Prioritizes highway & power access' },
            ].map((preset) => {
              const isSelected = priorityPreset === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => onChangePriorityPreset(preset.id as PriorityPreset)}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-[#17283A] border-[#34D399]/60 shadow-sm'
                      : 'bg-[#0D1928] border-white/[0.08] hover:bg-[#111F30]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${isSelected ? 'text-[#34D399]' : 'text-[#F1F5F9]'}`}>
                      {preset.label}
                    </span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399]" />}
                  </div>
                  <div className="text-[10px] text-[#94A3B8] mt-0.5">{preset.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 6. Run Spatial Screening Action */}
        <div className="pt-2">
          <button
            onClick={onRunAnalysis}
            disabled={isAnalyzing}
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#22D3EE] via-[#06B6D4] to-[#34D399] hover:from-[#38BDF8] hover:to-[#22D3EE] text-[#07111F] text-xs font-heading font-extrabold shadow-lg shadow-[#22D3EE]/20 transition-all active:scale-95 disabled:opacity-50"
          >
            <Play className={`w-4 h-4 fill-current ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'Extracting ISRO Zonal Grids...' : 'Run Spatial Screening'}</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
