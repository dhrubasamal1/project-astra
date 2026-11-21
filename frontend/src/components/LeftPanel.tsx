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
}

export const LeftPanel: React.FC<LeftPanelProps> = ({
  regions,
  selectedRegionId,
  onSelectRegion,
  candidateSites,
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
}) => {
  const currentRegion = regions.find((r) => r.id === selectedRegionId) || regions[0];
  const waterDemandMLD = ((targetPopulation * 135) / 1000000).toFixed(1);

  return (
    <aside className="w-80 h-full bg-slate-950/90 backdrop-blur-xl border-r border-slate-800/80 flex flex-col shrink-0 overflow-y-auto z-20 shadow-xl">
      <div className="p-4 space-y-4">
        {/* 1. Target Region Selector */}
        <div>
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-sky-400" />
              <span>Target Region</span>
            </span>
            <span className="text-[10px] text-slate-500 font-mono">2 REGIONS CALIBRATED</span>
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
                      ? 'bg-sky-950/70 border-sky-500/80 shadow-lg shadow-sky-900/30 ring-1 ring-sky-500/40'
                      : 'bg-slate-900/80 border-slate-800/80 hover:bg-slate-850 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${isSelected ? 'text-sky-300' : 'text-slate-200'}`}>
                      {region.name}
                    </span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{region.badge}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Candidate Sites (A, B, C) */}
        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/80 space-y-2.5 shadow-inner">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>Candidate Parcels</span>
            </span>
            <span className="px-2 py-0.5 text-[10px] bg-slate-800 text-slate-300 rounded-full font-mono border border-slate-700">
              {candidateSites.length}/3 Sites
            </span>
          </div>

          <button
            onClick={onLoadCandidateSites}
            className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold rounded-lg shadow-md shadow-emerald-900/30 transition-all active:scale-95"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Reset Demo Sites (A, B, C)</span>
          </button>

          {/* Quick list of sites */}
          <div className="space-y-1.5 pt-1">
            {candidateSites.map((site) => (
              <div
                key={site.id}
                className="flex items-center justify-between text-xs px-2.5 py-1.5 bg-slate-950/70 rounded-lg border border-slate-850 hover:border-slate-750 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shadow-sm"
                    style={{ backgroundColor: site.color }}
                  ></span>
                  <span className="font-bold text-slate-200">Site {site.code}</span>
                  <span className="text-[11px] text-slate-400 truncate max-w-[120px]">
                    {site.name.split('(')[0]}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">{site.areaKm2} km²</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Target Population & Water Demand HUD */}
        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-blue-400" />
              <span>Target Population</span>
            </label>
            <span className="text-xs font-mono font-bold text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/50">
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
            className="w-full accent-sky-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/60 font-mono">
            <span className="flex items-center gap-1 text-cyan-400">
              <Droplets className="w-3 h-3" />
              <span>{waterDemandMLD} MLD</span>
            </span>
            <span className="text-[10px] text-slate-500">135 lpcd standard</span>
          </div>
        </div>

        {/* 4. Planning Horizon Selector */}
        <div>
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>Planning Horizon</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[2035, 2050].map((yr) => {
              const isSelected = horizon === yr;
              return (
                <button
                  key={yr}
                  onClick={() => onChangeHorizon(yr as 2035 | 2050)}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-500/80 text-amber-300 shadow-sm ring-1 ring-amber-500/30'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850'
                  }`}
                >
                  Horizon {yr}
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. Priority Weight Presets */}
        <div>
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
            <span>Pillar Weight Preset</span>
          </label>
          <div className="space-y-1.5">
            {[
              {
                id: 'balanced' as PriorityPreset,
                name: 'Balanced Masterplan',
                weights: 'Terrain 20 • Water 25 • Hazard 30 • Env 10 • Infra 15',
              },
              {
                id: 'climate_resilient' as PriorityPreset,
                name: 'Climate-Resilient (Water/Flood)',
                weights: 'Terrain 10 • Water 30 • Hazard 40 • Env 10 • Infra 10',
              },
              {
                id: 'infra_first' as PriorityPreset,
                name: 'Infra-First Greenfield Growth',
                weights: 'Terrain 25 • Water 15 • Hazard 20 • Env 10 • Infra 30',
              },
            ].map((preset) => {
              const isSelected = priorityPreset === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => onChangePriorityPreset(preset.id)}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-emerald-950/60 border-emerald-500/70 text-emerald-200 shadow-sm ring-1 ring-emerald-500/30'
                      : 'bg-slate-900/80 border-slate-800 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${isSelected ? 'text-emerald-300' : 'text-slate-200'}`}>
                      {preset.name}
                    </span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">{preset.weights}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 6. Scenario Preset Selector */}
        <div>
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-purple-400" />
            <span>Climate / Growth Scenario</span>
          </label>
          <div className="space-y-1.5">
            {[
              {
                id: 'baseline' as ScenarioPreset,
                name: 'SSP2-4.5 (Baseline)',
                badge: 'Normal monsoons • Target CAGR',
              },
              {
                id: 'high_growth_climate_stressed' as ScenarioPreset,
                name: 'SSP5-8.5 (Stressed)',
                badge: '+12% demand • 2-yr dry spell drought',
              },
              {
                id: 'green_transition' as ScenarioPreset,
                name: 'Green Transition',
                badge: '18% circular water reuse mandate',
              },
            ].map((scen) => {
              const isSelected = scenarioPreset === scen.id;
              return (
                <button
                  key={scen.id}
                  onClick={() => onChangeScenarioPreset(scen.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl border text-xs transition-all ${
                    isSelected
                      ? 'bg-purple-950/60 border-purple-500/70 text-purple-200 shadow-sm ring-1 ring-purple-500/30 font-bold'
                      : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{scen.name}</span>
                    {isSelected && <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>}
                  </div>
                  <p className="text-[10px] text-slate-400 font-normal mt-0.5">{scen.badge}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* 7. Primary Analyse Action Button */}
        <div className="pt-2">
          <button
            onClick={onRunAnalysis}
            disabled={isAnalyzing}
            className="w-full relative group overflow-hidden py-3 px-4 bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-xl shadow-blue-900/40 transition-all flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer active:scale-95"
          >
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Computing Spatial Zonal Grids...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Run Autonomous Spatial Screening</span>
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};
