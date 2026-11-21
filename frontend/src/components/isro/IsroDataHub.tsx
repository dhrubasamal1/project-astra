import React, { useState } from 'react';
import {
  Satellite,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Layers,
  Database,
  Radio,
  Clock,
  Sparkles,
  Search,
  Eye,
  X,
  FileCode,
  Compass,
} from 'lucide-react';
import { ISRO_PORTALS, IsroPortalProfile } from '../../data/intelligenceData';
import { HealthStatus } from '../../lib/api';

interface IsroDataHubProps {
  health: HealthStatus;
}

export const IsroDataHub: React.FC<IsroDataHubProps> = ({ health }) => {
  const [selectedPortal, setSelectedPortal] = useState<IsroPortalProfile | null>(null);

  return (
    <div className="flex-1 h-full bg-[#07111F] text-[#F1F5F9] overflow-y-auto p-6 space-y-6 select-none font-sans">
      {/* 1. Header with Subtle Satellite-Orbit Visual */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0D1928] via-[#111F30] to-[#0D1928] border border-white/[0.1] p-6 shadow-2xl">
        {/* Subtle Orbit Visual in Header */}
        <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full border border-dashed border-[#22D3EE]/25 animate-orbit pointer-events-none">
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#22D3EE] shadow-md shadow-[#22D3EE]/50" />
        </div>
        <div className="absolute top-1/2 right-12 -translate-y-1/2 w-40 h-40 rounded-full border border-[#34D399]/20 animate-orbit-reverse pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#22D3EE]/20 text-[#22D3EE] border border-[#22D3EE]/40 flex items-center gap-1.5">
              <Radio className="w-3 h-3 animate-pulse" />
              <span>ISRO SPACE TELEMETRY CONSOLE</span>
            </span>
            <span className="text-xs text-[#94A3B8]">4 National Earth Observation Nodes</span>
          </div>
          <h2 className="font-heading font-extrabold text-2xl text-[#F1F5F9]">
            ISRO Space Data Hub
          </h2>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            TerraAI enforces authentic space data provenance across India’s four sovereign geoportal systems.
            Every slope, flood risk, rainfall normal, and vegetation index is derived from verified satellite observations.
          </p>

          <div className="pt-2 flex items-center space-x-4 text-xs font-mono text-[#94A3B8]">
            <span className="flex items-center gap-1 text-[#34D399]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>All 4 Portals Synchronized</span>
            </span>
            <span>•</span>
            <span>Engine Mode: {health.mode === 'live_backend' ? 'Live FastAPI Proxy' : 'ISRO Regional Fixture'}</span>
          </div>
        </div>
      </div>

      {/* 2. Four Prominent Data-Source Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ISRO_PORTALS.map((portal) => (
          <div
            key={portal.id}
            className="p-6 rounded-3xl bg-[#0D1928] border border-white/[0.08] hover:border-[#22D3EE]/40 shadow-xl transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#111F30] border border-[#22D3EE]/30 flex items-center justify-center font-heading font-black text-sm text-[#22D3EE]">
                    {portal.name.slice(0, 3)}
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-base text-[#F1F5F9]">{portal.name}</h3>
                    <span className="text-[11px] text-[#94A3B8] block">{portal.agency}</span>
                  </div>
                </div>

                {/* Connection Status Badge */}
                <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-[#34D399]/20 text-[#34D399] border border-[#34D399]/40 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse" />
                  <span>CONNECTED</span>
                </span>
              </div>

              {/* Mission & Overview */}
              <div className="text-xs text-[#94A3B8] space-y-1">
                <div className="text-[11px] font-mono text-[#22D3EE] font-semibold">{portal.mission}</div>
                <p className="leading-relaxed line-clamp-2">{portal.overview}</p>
              </div>

              {/* Dataset Categories */}
              <div className="space-y-1.5 pt-1">
                <div className="text-[10px] font-mono font-bold text-[#94A3B8] uppercase">Active Datasets Fed:</div>
                <div className="flex flex-wrap gap-1.5">
                  {portal.datasets.map((ds, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#111F30] border border-white/[0.08] text-[#F1F5F9]"
                    >
                      {ds}
                    </span>
                  ))}
                </div>
              </div>

              {/* Telemetry Metadata Chips */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/[0.08] text-[11px] font-mono text-[#94A3B8]">
                <div>
                  <span className="text-[#94A3B8]/60 block text-[9px]">RESOLUTION:</span>
                  <span className="text-[#F1F5F9] font-medium">{portal.spatialResolution}</span>
                </div>
                <div>
                  <span className="text-[#94A3B8]/60 block text-[9px]">UPDATE CYCLE:</span>
                  <span className="text-[#F1F5F9] font-medium">{portal.temporalCadence}</span>
                </div>
              </div>
            </div>

            {/* Actions: Data Preview & Open Source */}
            <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between gap-3">
              <button
                onClick={() => setSelectedPortal(portal)}
                className="flex-1 flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-[#111F30] hover:bg-[#17283A] border border-[#22D3EE]/30 text-xs text-[#22D3EE] font-semibold transition-all"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Inspect Telemetry</span>
              </button>

              <a
                href={portal.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-1.5 py-2 px-3 rounded-xl bg-[#07111F] hover:bg-[#111F30] border border-white/[0.1] text-xs text-[#F1F5F9] font-medium transition-all"
              >
                <span>Open Geoportal</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#94A3B8]" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Deep Telemetry Inspector Modal */}
      {selectedPortal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111F30] border border-white/[0.1] rounded-3xl w-full max-w-xl shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#0D1928] border border-[#22D3EE]/30 flex items-center justify-center text-[#22D3EE] font-bold text-xs">
                  {selectedPortal.name.slice(0, 3)}
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-[#F1F5F9]">
                    {selectedPortal.name} Telemetry Inspector
                  </h3>
                  <div className="text-[10px] text-[#94A3B8]">{selectedPortal.agency}</div>
                </div>
              </div>
              <button
                onClick={() => setSelectedPortal(null)}
                className="p-1 rounded-lg text-[#94A3B8] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#94A3B8] leading-relaxed">{selectedPortal.overview}</p>

            {/* Telemetry Metrics Table */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono font-bold text-[#94A3B8] uppercase">
                Observed Sensor & Geodetic Parameters
              </span>
              <div className="divide-y divide-white/[0.06] bg-[#0D1928] rounded-xl border border-white/[0.08] p-3 text-xs font-mono">
                {selectedPortal.sampleTelemetry.map((t, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between first:pt-0 last:pb-0">
                    <span className="text-[#94A3B8]">{t.parameter}</span>
                    <div className="text-right">
                      <span className="text-[#F1F5F9] font-bold block">{t.value}</span>
                      <span className="text-[9px] text-[#34D399]">{t.quality}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-xs">
              <span className="text-[10px] text-[#94A3B8] font-mono">Coverage: {selectedPortal.coverageStatus}</span>
              <button
                onClick={() => setSelectedPortal(null)}
                className="px-4 py-2 rounded-xl bg-[#22D3EE] text-[#07111F] font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
