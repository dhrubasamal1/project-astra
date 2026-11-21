import React from 'react';
import {
  Satellite,
  Sliders,
  Printer,
  ShieldCheck,
  MapPin,
  Sparkles,
  Layers,
} from 'lucide-react';
import { Region, PriorityPreset, ScenarioPreset } from '../types';
import { HealthStatus } from '../lib/api';

interface NavbarProps {
  currentRegion: Region;
  priorityPreset: PriorityPreset;
  scenarioPreset: ScenarioPreset;
  health: HealthStatus;
  onOpenAssumptions: () => void;
  onOpenReport: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRegion,
  priorityPreset,
  scenarioPreset,
  health,
  onOpenAssumptions,
  onOpenReport,
}) => {
  const getPresetLabel = (preset: PriorityPreset) => {
    switch (preset) {
      case 'balanced':
        return 'Balanced';
      case 'climate_resilient':
        return 'Climate-Resilient';
      case 'infra_first':
        return 'Infra-First';
    }
  };

  const getScenarioLabel = (scenario: ScenarioPreset) => {
    switch (scenario) {
      case 'baseline':
        return 'SSP2-4.5 (Baseline)';
      case 'high_growth_climate_stressed':
        return 'SSP5-8.5 (Stressed)';
      case 'green_transition':
        return 'Green Transition';
    }
  };

  return (
    <header className="h-14 bg-slate-900/95 border-b border-slate-800 px-4 flex items-center justify-between z-30 shrink-0 backdrop-blur sticky top-0 shadow-lg">
      {/* Brand & Mission Title */}
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-sky-600 via-blue-600 to-amber-500 flex items-center justify-center shadow-md shadow-blue-500/20">
          <Satellite className="w-5 h-5 text-white animate-pulse" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
              <span>TerraCity</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400">AI</span>
            </h1>
            <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded">
              ISRO 4-Portal
            </span>
          </div>
          <p className="text-[10px] text-slate-400 leading-none">
            Spatial Decision Support for Greenfield Urban Expansion
          </p>
        </div>
      </div>

      {/* Center Context Indicators */}
      <div className="hidden lg:flex items-center space-x-3 text-xs">
        {/* Active Region */}
        <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-slate-800/80 border border-slate-700/80 rounded-md text-slate-200">
          <MapPin className="w-3.5 h-3.5 text-sky-400" />
          <span className="font-medium">{currentRegion.name.split(' ')[0]}</span>
          <span className="text-slate-400 text-[11px]">({currentRegion.state.split(' ')[0]})</span>
        </div>

        {/* Priority Preset */}
        <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-slate-800/80 border border-slate-700/80 rounded-md text-slate-200">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-slate-400">Weight:</span>
          <span className="font-medium text-amber-300">{getPresetLabel(priorityPreset)}</span>
        </div>

        {/* Scenario */}
        <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-slate-800/80 border border-slate-700/80 rounded-md text-slate-200">
          <Layers className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-slate-400">Climate:</span>
          <span className="font-medium text-blue-300">{getScenarioLabel(scenarioPreset)}</span>
        </div>

        {/* Backend & Fixture Status */}
        <div className="flex items-center space-x-1.5 px-2 py-1 rounded-md text-[11px] bg-slate-800/60 border border-slate-700/60 text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-emerald-400/30 animate-pulse"></span>
          <span>{health.mode === 'live_backend' ? 'FastAPI Live' : 'ISRO Offline Cache'}</span>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-2">
        {/* Assumptions Drawer Trigger */}
        <button
          onClick={onOpenAssumptions}
          className="flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-md text-slate-200 transition-colors shadow-sm"
          title="Inspect and edit simulation assumptions"
        >
          <Sliders className="w-3.5 h-3.5 text-sky-400" />
          <span>Assumptions</span>
        </button>

        {/* Report / Print Button */}
        <button
          onClick={onOpenReport}
          className="flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-medium bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white rounded-md transition-all shadow-sm shadow-blue-500/20"
          title="Open printable executive report & GeoJSON export"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Report & Export</span>
        </button>
      </div>
    </header>
  );
};
