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

  return (
    <aside className="w-80 h-full bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 overflow-y-auto">
      <div className="p-4 space-y-5">
        {/* 1. Region Selector */}
        <div>
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-sky-400" />
            <span>Target Region</span>
          </label>
          <div className="space-y-1.5">
            {regions.map((region) => {
              const isSelected = region.id === selectedRegionId;
              return (
                <button
                  key={region.id}
                  onClick={() => onSelectRegion(region.id)}
                  className={`w-full text-left p-2.5 rounded-lg border transition-all ${
                    isSelected
                      ? 'bg-sky-950/60 border-sky-500/60 shadow-md shadow-sky-900/20'
                      : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-semibold ${isSelected ? 'text-sky-300' : 'text-slate-200'}`}>
                      {region.name}
                    </span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{region.badge}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Load Candidate Sites (1-Click Action) */}
        <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/70 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-300">Candidate Sites (A, B, C)</span>
            <span className="px-1.5 py-0.2 text-[10px] bg-slate-700 text-slate-300 rounded font-mono">
              {candidateSites.length}/3 Sites
            </span>
          </div>

          <button
            onClick={onLoadCandidateSites}
            className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold rounded-md shadow-md shadow-emerald-900/30 transition-all"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Load Preset Sites (A, B, C)</span>
          </button>

          {/* Quick list of sites */}
          <div className="space-y-1.5 pt-1">
            {candidateSites.map((site) => (
              <div
                key={site.id}
                className="flex items-center justify-between text-xs px-2 py-1.5 bg-slate-900/80 rounded border border-slate-800"
              >
                <div className="flex items-center space-x-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: site.color }}
                  ></span>
                  <span className="font-medium text-slate-200">Site {site.code}</span>
                  <span className="text-[11px] text-slate-400 truncate max-w-[130px]">
                    {site.name.split('(')[0]}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">{site.areaKm2} km²</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Target Population */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-blue-400" />
              <span>Target Population</span>
            </label>
            <span className="text-xs font-mono font-bold text-sky-400">
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
            className="w-full accent-sky-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
            <span>100k</span>
            <span>Default: 150k (2026) / 450k (2050)</span>
            <span>1M</span>
          </div>
        </div>

        {/* 4. Planning Horizon Selector */}
        <div>
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>Horizon Year</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[2035, 2050].map((yr) => {
              const isSelected = horizon === yr;
              return (
                <button
                  key={yr}
                  onClick={() => onChangeHorizon(yr as 2035 | 2050)}
                  className={`py-2 text-xs font-semibold rounded-md border transition-all ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 shadow-sm'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
                  }`}
                >
                  Horizon {yr}
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. Planner Priority Weight Presets */}
        <div>
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
            <span>Priority Weight Preset</span>
          </label>
          <div className="space-y-1.5">
            {[
              {
                id: 'balanced' as PriorityPreset,
                name: 'Balanced Plan',
                weights: 'Terrain 20 • Water 25 • Hazard 30 • Env 10 • Infra 15',
                desc: 'Equitable standard sustainable urban development.',
              },
              {
                id: 'climate_resilient' as PriorityPreset,
                name: 'Climate-Resilient',
                weights: 'Terrain 10 • Water 30 • Hazard 40 • Env 10 • Infra 10',
                desc: 'Prioritizes flood safety and long-term water balance.',
              },
              {
                id: 'infra_first' as PriorityPreset,
                name: 'Infra-First Growth',
                weights: 'Terrain 25 • Water 15 • Hazard 20 • Env 10 • Infra 30',
                desc: 'Prioritizes rapid connectivity and buildable terrain.',
              },
            ].map((preset) => {
              const isSelected = priorityPreset === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => onChangePriorityPreset(preset.id)}
                  className={`w-full text-left p-2.5 rounded-lg border transition-all ${
                    isSelected
                      ? 'bg-emerald-950/60 border-emerald-500/60 shadow-sm'
                      : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-semibold ${isSelected ? 'text-emerald-300' : 'text-slate-200'}`}>
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
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
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
                  className={`w-full text-left px-2.5 py-2 rounded-md border text-xs transition-all ${
                    isSelected
                      ? 'bg-purple-950/60 border-purple-500/60 text-purple-200 shadow-sm font-semibold'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{scen.name}</span>
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>}
                  </div>
                  <p className="text-[10px] text-slate-400 font-normal">{scen.badge}</p>
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
            className="w-full relative group overflow-hidden py-3 px-4 bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-xs rounded-lg shadow-lg shadow-blue-900/40 transition-all flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer"
          >
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Extracting ISRO Zonal Grids...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Analyse Candidate Sites</span>
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};
