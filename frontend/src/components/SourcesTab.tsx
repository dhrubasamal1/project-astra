import React from 'react';
import {
  Database,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  Layers,
  Sparkles,
  Satellite,
} from 'lucide-react';
import { ProvenanceRecord } from '../types';

interface SourcesTabProps {
  provenanceRecords: ProvenanceRecord[];
}

export const SourcesTab: React.FC<SourcesTabProps> = ({ provenanceRecords }) => {
  const getPortalColor = (portal: string) => {
    switch (portal) {
      case 'Bhoonidhi':
        return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
      case 'Bhuvan':
        return 'text-blue-400 border-blue-500/40 bg-blue-500/10';
      case 'MOSDAC':
        return 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10';
      case 'VEDAS':
        return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
      default:
        return 'text-slate-300 border-slate-600/40 bg-slate-800/40';
    }
  };

  return (
    <div className="space-y-4 pb-6">
      {/* 4-Portal Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950/60 to-slate-900 border border-sky-500/40 rounded-2xl p-4 shadow-xl space-y-1.5">
        <div className="flex items-center space-x-2 text-sky-400 text-xs font-bold uppercase tracking-wider">
          <Satellite className="w-4 h-4 text-sky-400" />
          <span>ISRO 4-Portal Spatial Provenance Matrix</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          TerraCity AI directly consumes open satellite data feeds from India's four primary national geospatial nodes, eliminating synthetic assumptions wherever official satellite datasets exist.
        </p>
      </div>

      {/* 4 Core Portals Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* 1. Bhoonidhi */}
        <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-amber-500/30 space-y-2 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full border bg-amber-500/15 border-amber-500/40 text-amber-300">
              Bhoonidhi (NRSC)
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Live Auth
            </span>
          </div>
          <div className="text-xs font-bold text-white">CartoDEM Version 3.1 Digital Elevation Model</div>
          <p className="text-[11px] text-slate-300">
            30m postings derived from Cartosat stereo pairs. Provides slope gradients, terrain roughness (TRI), and relative height above nearest drainage (HAND).
          </p>
        </div>

        {/* 2. Bhuvan */}
        <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-blue-500/30 space-y-2 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full border bg-blue-500/15 border-blue-500/40 text-blue-300">
              Bhuvan (NRSC)
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Verified 100%
            </span>
          </div>
          <div className="text-xs font-bold text-white">LULC 1:50,000 & Flood Hazard Zonation</div>
          <p className="text-[11px] text-slate-300">
            High-resolution land use classification (agricultural, wasteland, waterbody) combined with historical multi-year flood inundation boundaries.
          </p>
        </div>

        {/* 3. MOSDAC */}
        <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-cyan-500/30 space-y-2 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full border bg-cyan-500/15 border-cyan-500/40 text-cyan-300">
              MOSDAC (SAC)
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Climatology Active
            </span>
          </div>
          <div className="text-xs font-bold text-white">INSAT-3D/3DR Hydro-Estimator Precipitation</div>
          <p className="text-[11px] text-slate-300">
            Decadal rainfall statistics, coefficient of rainfall variation, dry season duration, and drought vulnerability indices.
          </p>
        </div>

        {/* 4. VEDAS */}
        <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-emerald-500/30 space-y-2 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full border bg-emerald-500/15 border-emerald-500/40 text-emerald-300">
              VEDAS (SAC)
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Key Proxied
            </span>
          </div>
          <div className="text-xs font-bold text-white">Land Degradation & Desertification Atlas</div>
          <p className="text-[11px] text-slate-300">
            Salinity risk, soil erosion vulnerability, and solar insolation (GHI kWh/m²/day) for renewable township planning.
          </p>
        </div>
      </div>

      {/* Provenance Audit Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-sky-400" />
            <span>Dataset Provenance Records</span>
          </h3>
          <span className="text-[10px] text-slate-400 font-mono">
            {provenanceRecords.length} Layers Audited
          </span>
        </div>

        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {provenanceRecords.map((rec) => (
            <div
              key={rec.id}
              className="p-3 bg-slate-950/80 rounded-xl border border-slate-850 hover:border-slate-750 transition-colors space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{rec.dataset}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${getPortalColor(rec.portal)}`}>
                  {rec.portal}
                </span>
              </div>
              <div className="text-[11px] text-slate-300 flex items-center justify-between">
                <span>Theme: {rec.theme}</span>
                <span className="font-mono text-slate-400">Vintage: {rec.vintage}</span>
              </div>
              <div className="text-[10px] text-slate-500 font-mono truncate">
                Method: {rec.accessMethod} • Status: {rec.coverageStatus}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
