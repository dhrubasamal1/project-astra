import React, { useState } from 'react';
import {
  Satellite,
  Sliders,
  Printer,
  ShieldCheck,
  MapPin,
  Sparkles,
  Layers,
  Server,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  X,
} from 'lucide-react';
import { Region, PriorityPreset, ScenarioPreset } from '../types';
import { HealthStatus, getApiBase } from '../lib/api';

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
  const [showBackendModal, setShowBackendModal] = useState(false);
  const [customApiUrl, setCustomApiUrl] = useState(() => {
    return localStorage.getItem('TERRA_API_BASE') || '';
  });

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

  const handleSaveApiUrl = () => {
    if (customApiUrl.trim()) {
      localStorage.setItem('TERRA_API_BASE', customApiUrl.trim());
    } else {
      localStorage.removeItem('TERRA_API_BASE');
    }
    window.location.reload();
  };

  return (
    <>
      <header className="no-print h-14 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 px-4 flex items-center justify-between z-30 shrink-0 sticky top-0 shadow-2xl">
        {/* Brand & Mission Title */}
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center">
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-sky-500 via-indigo-500 to-emerald-500 opacity-60 blur-sm animate-pulse"></div>
            <div className="relative w-9 h-9 rounded-lg bg-slate-900 border border-slate-700/80 flex items-center justify-center shadow-lg">
              <Satellite className="w-5 h-5 text-sky-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-extrabold text-base tracking-tight text-white flex items-center gap-1">
                <span>TerraCity</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-teal-300 to-emerald-400">
                  AI
                </span>
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 rounded-full shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>ISRO 4-PORTAL</span>
              </span>
            </div>
            <p className="text-[10px] text-slate-400 leading-none">
              Greenfield Urban Site Screening & 2026–2050 Climate Stress Engine
            </p>
          </div>
        </div>

        {/* Center Context Indicators */}
        <div className="hidden lg:flex items-center space-x-2.5 text-xs">
          {/* Active Region */}
          <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-slate-900/90 border border-slate-800 rounded-lg text-slate-200 shadow-inner">
            <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="font-semibold text-slate-100">{currentRegion.name.split(' ')[0]}</span>
            <span className="text-slate-400 text-[11px]">({currentRegion.state.split(' ')[0]})</span>
          </div>

          {/* Priority Preset */}
          <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-slate-900/90 border border-slate-800 rounded-lg text-slate-200 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="text-slate-400">Weight:</span>
            <span className="font-semibold text-amber-300">{getPresetLabel(priorityPreset)}</span>
          </div>

          {/* Scenario */}
          <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-slate-900/90 border border-slate-800 rounded-lg text-slate-200 shadow-inner">
            <Layers className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="text-slate-400">Climate:</span>
            <span className="font-semibold text-blue-300">{getScenarioLabel(scenarioPreset)}</span>
          </div>

          {/* Backend Connection Status Pill (Clickable) */}
          <button
            onClick={() => setShowBackendModal(true)}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-[11px] bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-300 transition-all cursor-pointer shadow-sm group"
            title="Click to view or connect live cloud backend"
          >
            <span
              className={`w-2 h-2 rounded-full ring-2 ${
                health.mode === 'live_backend'
                  ? 'bg-emerald-400 ring-emerald-400/30'
                  : 'bg-amber-400 ring-amber-400/30'
              } animate-pulse`}
            ></span>
            <span className="font-medium group-hover:text-white">
              {health.mode === 'live_backend' ? 'Live Cloud API' : 'Calibrated Cache'}
            </span>
            <Server className="w-3 h-3 text-slate-400 group-hover:text-sky-400" />
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2">
          {/* Assumptions Drawer Trigger */}
          <button
            onClick={onOpenAssumptions}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 rounded-lg text-slate-200 transition-all shadow-sm active:scale-95"
            title="Inspect and edit simulation assumptions"
          >
            <Sliders className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Assumptions</span>
          </button>

          {/* Report / Print Button */}
          <button
            onClick={onOpenReport}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-semibold bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-blue-500 text-white rounded-lg transition-all shadow-lg shadow-blue-500/25 active:scale-95"
            title="Open printable executive report & GeoJSON export"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Executive Dossier</span>
          </button>
        </div>
      </header>

      {/* Backend Connection Modal */}
      {showBackendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Server className="w-5 h-5 text-sky-400" />
                <h3 className="font-bold text-slate-100 text-sm">TerraCity Backend Configuration</h3>
              </div>
              <button
                onClick={() => setShowBackendModal(false)}
                className="text-slate-400 hover:text-white rounded-md p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1">
                <div className="text-slate-400 font-semibold">Active Backend Mode:</div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      health.mode === 'live_backend' ? 'bg-emerald-400' : 'bg-amber-400'
                    }`}
                  ></span>
                  <span className="font-bold text-white capitalize">
                    {health.mode === 'live_backend'
                      ? 'Live Cloud / Local Backend'
                      : 'Offline Calibrated Spatial Fixtures'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 pt-1">
                  Active Endpoint: <code className="text-sky-300">{getApiBase()}</code>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-200 mb-1">
                  Custom Live Backend URL (Render / Railway / Localhost):
                </label>
                <input
                  type="text"
                  placeholder="https://your-service.onrender.com/api"
                  value={customApiUrl}
                  onChange={(e) => setCustomApiUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 text-xs focus:outline-none focus:border-sky-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Leave blank to use default auto-detection (<code className="text-slate-300">localhost:8000/api</code> or container origin).
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowBackendModal(false)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveApiUrl}
                className="px-4 py-1.5 text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white rounded-lg shadow-md"
              >
                Apply & Connect
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
