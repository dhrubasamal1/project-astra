import React from 'react';
import { X, RotateCcw, Sliders, Info, ShieldAlert } from 'lucide-react';
import { Assumptions } from '../types';
import { DEFAULT_ASSUMPTIONS } from '../data/mockData';

interface AssumptionsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  assumptions: Assumptions;
  onUpdateAssumptions: (updated: Assumptions) => void;
}

export const AssumptionsDrawer: React.FC<AssumptionsDrawerProps> = ({
  isOpen,
  onClose,
  assumptions,
  onUpdateAssumptions,
}) => {
  if (!isOpen) return null;

  const handleChange = (key: keyof Assumptions, value: number) => {
    onUpdateAssumptions({
      ...assumptions,
      [key]: value,
    });
  };

  const handleReset = () => {
    onUpdateAssumptions({ ...DEFAULT_ASSUMPTIONS });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end animate-in fade-in">
      <div className="w-full max-w-md h-full bg-slate-900 border-l border-slate-700 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right-4 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-850">
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-sky-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Simulation Assumptions & Coefficients
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informative Default Disclaimer */}
        <div className="p-3 bg-amber-950/40 border-b border-amber-500/30 text-amber-200 text-xs flex items-start space-x-2">
          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-snug">
            <strong>Illustrative Default Note:</strong> All baseline coefficients are pre-calibrated against CPHEEO Indian municipal engineering standards and CGWB water guidelines.
          </p>
        </div>

        {/* Scrollable Coefficients List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
          {/* Water Demand Coefficients */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] flex items-center justify-between border-b border-slate-800 pb-1">
              <span>Water Demand Calibration</span>
              <span className="text-[10px] text-sky-400 font-mono">CPHEEO Standard</span>
            </h3>

            {/* lpcd */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-slate-300 font-medium">Per Capita Consumption (lpcd)</label>
                <span className="font-mono font-bold text-sky-400">{assumptions.lpcd} L/capita/day</span>
              </div>
              <input
                type="range"
                min={90}
                max={200}
                step={5}
                value={assumptions.lpcd}
                onChange={(e) => handleChange('lpcd', Number(e.target.value))}
                className="w-full accent-sky-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
              />
              <span className="text-[10px] text-slate-400">Illustrative default: 135 lpcd</span>
            </div>

            {/* externalSupplyMLD */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-slate-300 font-medium">External Piped Canal Supply</label>
                <span className="font-mono font-bold text-sky-400">{assumptions.externalSupplyMLD} MLD</span>
              </div>
              <input
                type="range"
                min={0}
                max={50}
                step={1}
                value={assumptions.externalSupplyMLD}
                onChange={(e) => handleChange('externalSupplyMLD', Number(e.target.value))}
                className="w-full accent-sky-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
              />
              <span className="text-[10px] text-slate-400">Illustrative default: 15.0 MLD allocation</span>
            </div>

            {/* catchmentMultiplier */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-slate-300 font-medium">Catchment Area Multiplier</label>
                <span className="font-mono font-bold text-sky-400">{assumptions.catchmentMultiplier}x</span>
              </div>
              <input
                type="range"
                min={1.0}
                max={6.0}
                step={0.5}
                value={assumptions.catchmentMultiplier}
                onChange={(e) => handleChange('catchmentMultiplier', Number(e.target.value))}
                className="w-full accent-sky-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
              />
              <span className="text-[10px] text-slate-400">Illustrative default: 3.0x site footprint</span>
            </div>
          </div>

          {/* Infrastructure Buffer Distances */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] flex items-center justify-between border-b border-slate-800 pb-1">
              <span>Proximity & Service Buffers</span>
              <span className="text-[10px] text-emerald-400 font-mono">URDPFI Norms</span>
            </h3>

            {/* Road Buffer */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-slate-300 font-medium">Primary Arterial Road Buffer</label>
                <span className="font-mono font-bold text-emerald-400">{assumptions.roadBufferM} m</span>
              </div>
              <input
                type="range"
                min={1000}
                max={15000}
                step={500}
                value={assumptions.roadBufferM}
                onChange={(e) => handleChange('roadBufferM', Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
              />
              <span className="text-[10px] text-slate-400">Illustrative default: 5,000 m (5.0 km)</span>
            </div>

            {/* Amenity Buffer */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-slate-300 font-medium">Hospital & Education Service Radius</label>
                <span className="font-mono font-bold text-emerald-400">{assumptions.amenityBufferM} m</span>
              </div>
              <input
                type="range"
                min={2000}
                max={20000}
                step={500}
                value={assumptions.amenityBufferM}
                onChange={(e) => handleChange('amenityBufferM', Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
              />
              <span className="text-[10px] text-slate-400">Illustrative default: 7,500 m (7.5 km)</span>
            </div>

            {/* Substation Buffer */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-slate-300 font-medium">High-Voltage Substation Radius</label>
                <span className="font-mono font-bold text-emerald-400">{assumptions.substationBufferM} m</span>
              </div>
              <input
                type="range"
                min={2000}
                max={25000}
                step={1000}
                value={assumptions.substationBufferM}
                onChange={(e) => handleChange('substationBufferM', Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
              />
              <span className="text-[10px] text-slate-400">Illustrative default: 10,000 m (10.0 km)</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-850 flex items-center justify-between">
          <button
            onClick={handleReset}
            className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Illustrative Defaults</span>
          </button>

          <button
            onClick={onClose}
            className="py-1.5 px-4 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs rounded-md shadow-md transition-colors"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
