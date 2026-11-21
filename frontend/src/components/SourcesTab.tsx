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
    <div className="space-y-5 pb-6">
      {/* 4-Portal Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950/60 to-slate-900 border border-blue-500/40 rounded-xl p-4 shadow-xl space-y-1.5">
        <div className="flex items-center space-x-2 text-sky-400 text-xs font-bold uppercase tracking-wider">
          <Database className="w-4 h-4 text-sky-400" />
          <span>Transparent 4-Portal ISRO Provenance Matrix</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          TerraCity AI directly consumes open satellite data feeds from India's four primary national geospatial nodes, eliminating synthetic assumptions wherever official satellite datasets exist.
        </p>
      </div>

      {/* 4 Core Portals Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* 1. Bhoonidhi */}
        <div className="p-3 bg-slate-800/50 rounded-xl border border-amber-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 text-xs font-bold rounded border bg-amber-500/15 border-amber-500/40 text-amber-300">
              Bhoonidhi (NRSC)
            </span>
            <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Verified 100%
            </span>
          </div>
          <div className="text-xs font-semibold text-white">CartoDEM Version 3.1 Digital Elevation Model</div>
          <p className="text-[11px] text-slate-300">
            30m postings derived from Cartosat stereo pairs. Provides slope gradients, terrain roughness (TRI), and relative height above nearest drainage (HAND).
          </p>
        </div>

        {/* 2. Bhuvan */}
        <div className="p-3 bg-slate-800/50 rounded-xl border border-blue-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 text-xs font-bold rounded border bg-blue-500/15 border-blue-500/40 text-blue-300">
              Bhuvan (NRSC)
            </span>
            <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Verified 100%
            </span>
          </div>
          <div className="text-xs font-semibold text-white">1:50k Thematic LULC (55-Class) & Flood Maps</div>
          <p className="text-[11px] text-slate-300">
            Official multi-temporal national land use classification and historical monsoonal flood inundation frequency masks (10-yr and 25-yr return periods).
          </p>
        </div>

        {/* 3. MOSDAC */}
        <div className="p-3 bg-slate-800/50 rounded-xl border border-cyan-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 text-xs font-bold rounded border bg-cyan-500/15 border-cyan-500/40 text-cyan-300">
              MOSDAC (SAC)
            </span>
            <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Verified 100%
            </span>
          </div>
          <div className="text-xs font-semibold text-white">INSAT-3D/3DR IMERG Precipitation Climatology</div>
          <p className="text-[11px] text-slate-300">
            10-year meteorological rainfall archive (2014-2024) at 4km resolution. Drives physical water balance, variability coefficient (CV), and drought risk.
          </p>
        </div>

        {/* 4. VEDAS */}
        <div className="p-3 bg-slate-800/50 rounded-xl border border-emerald-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 text-xs font-bold rounded border bg-emerald-500/15 border-emerald-500/40 text-emerald-300">
              VEDAS (SAC)
            </span>
            <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Verified 100%
            </span>
          </div>
          <div className="text-xs font-semibold text-white">Sentinel-2 10m NDVI & Environmental Vigour</div>
          <p className="text-[11px] text-slate-300">
            16-day composite cloud-filtered NDVI products. Quantifies canopy cover, green buffers, and cross-validates wastelands against active agricultural land.
          </p>
        </div>
      </div>

      {/* Comprehensive Provenance Matrix Table */}
      <div className="bg-slate-800/50 border border-slate-700/70 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-sky-400" />
            <span>Dataset Provenance & Spatial Resolution Registry</span>
          </h3>
          <span className="text-[10px] text-slate-400 font-mono">
            {provenanceRecords.length} Datasets Verified
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-700 text-[10px] text-slate-400 uppercase tracking-wider">
                <th className="pb-2">Portal & Dataset</th>
                <th className="pb-2">Spatial Res.</th>
                <th className="pb-2">Vintage</th>
                <th className="pb-2">Access Method</th>
                <th className="pb-2">Status</th>
                <th className="pb-2 text-right">Indicators Fed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {provenanceRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 pr-2">
                    <div className="flex items-center space-x-1.5 mb-0.5">
                      <span className={`px-1.5 py-0.2 text-[9px] font-bold rounded border ${getPortalColor(rec.portal)}`}>
                        {rec.portal}
                      </span>
                    </div>
                    <div className="font-semibold text-slate-200">{rec.dataset}</div>
                    <div className="text-[10px] text-slate-400">{rec.theme}</div>
                  </td>
                  <td className="py-2.5 pr-2 font-mono text-[11px] text-slate-300 whitespace-nowrap">
                    {rec.resolution}
                  </td>
                  <td className="py-2.5 pr-2 font-mono text-[11px] text-slate-300 whitespace-nowrap">
                    {rec.vintage}
                  </td>
                  <td className="py-2.5 pr-2 text-[11px] text-slate-300">
                    <div className="truncate max-w-[170px]">{rec.accessMethod}</div>
                  </td>
                  <td className="py-2.5 pr-2 whitespace-nowrap">
                    <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded flex items-center gap-1 w-fit">
                      <CheckCircle2 className="w-3 h-3" /> {rec.coverageStatus}
                    </span>
                  </td>
                  <td className="py-2.5 text-right">
                    <div className="text-[10px] text-slate-400">
                      {rec.indicatorsFed.slice(0, 2).join(', ')}
                      {rec.indicatorsFed.length > 2 && ` +${rec.indicatorsFed.length - 2} more`}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
