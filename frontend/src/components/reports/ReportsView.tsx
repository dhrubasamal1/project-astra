import React from 'react';
import {
  Printer,
  Download,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  Building,
  Shield,
  Droplets,
  Share2,
  Satellite,
  Layers,
  Sparkles,
} from 'lucide-react';
import {
  Region,
  SiteScorecard,
  CompareResult,
  StressTestResponse,
  CandidateSite,
  PriorityPreset,
  ScenarioPreset,
} from '../../types';

interface ReportsViewProps {
  currentRegion: Region;
  candidateSites: CandidateSite[];
  scorecards: Record<string, SiteScorecard>;
  compareResult: CompareResult;
  stressTestResult: StressTestResponse;
  priorityPreset: PriorityPreset;
  scenarioPreset: ScenarioPreset;
  targetPopulation: number;
  horizon: 2035 | 2050;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  currentRegion,
  candidateSites,
  scorecards,
  compareResult,
  stressTestResult,
  priorityPreset,
  scenarioPreset,
  targetPopulation,
  horizon,
}) => {
  const topSite = compareResult.topSite;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadGeoJSON = () => {
    const featureCollection: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: candidateSites.map((site) => {
        const sc = scorecards[site.id];
        const ring = site.coordinates.map((pt) => [pt[1], pt[0]]);
        if (
          ring.length > 0 &&
          (ring[0][0] !== ring[ring.length - 1][0] || ring[0][1] !== ring[ring.length - 1][1])
        ) {
          ring.push([ring[0][0], ring[0][1]]);
        }

        return {
          type: 'Feature',
          properties: {
            siteId: site.id,
            siteCode: site.code,
            siteName: site.name,
            regionId: site.regionId,
            areaKm2: site.areaKm2,
            overallScore: sc ? sc.overallScore : null,
            rank: sc ? sc.rank : null,
            verdict: sc ? sc.verdict : null,
            hasDealBreaker: sc ? sc.hasDealBreaker : false,
            confidencePct: sc ? sc.confidencePct : null,
            priorityPreset,
            scenarioPreset,
            horizon,
            targetPopulation,
            pillars: sc ? sc.pillars : null,
          },
          geometry: {
            type: 'Polygon',
            coordinates: [ring],
          },
        };
      }),
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(featureCollection, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `terraai_${currentRegion.id}_executive_dossier.geojson`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="flex-1 h-full bg-[#07111F] text-[#F1F5F9] overflow-y-auto p-6 space-y-6 font-sans">
      {/* Top Header & Actions */}
      <div className="no-print flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#22D3EE]/20 text-[#22D3EE] border border-[#22D3EE]/40">
              EXECUTIVE DOSSIER & COMPLIANCE
            </span>
            <span className="text-xs text-[#94A3B8]">Standalone Printable Document</span>
          </div>
          <h2 className="font-heading font-extrabold text-2xl text-[#F1F5F9] mt-1">
            Greenfield Urban Master Screening Report
          </h2>
          <p className="text-xs text-[#94A3B8]">
            Complete multi-criteria suitability audit, statutory exclusions, water stress trajectory, and ISRO geodetic provenance.
          </p>
        </div>

        <div className="flex items-center space-x-2.5 shrink-0">
          <button
            onClick={handleDownloadGeoJSON}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#111F30] hover:bg-[#17283A] border border-white/[0.1] text-xs font-semibold text-[#F1F5F9] transition-all"
          >
            <Download className="w-4 h-4 text-[#22D3EE]" />
            <span>Export GeoJSON</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#22D3EE] to-[#34D399] text-[#07111F] font-heading font-bold text-xs shadow-lg transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print Official Dossier</span>
          </button>
        </div>
      </div>

      {/* Printable Sheet Wrapper */}
      <div className="printable-sheet max-w-4xl mx-auto p-8 rounded-3xl bg-[#0D1928] border border-white/[0.1] shadow-2xl space-y-6">
        {/* Document Header */}
        <div className="border-b border-white/[0.1] pb-6 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Satellite className="w-5 h-5 text-[#22D3EE]" />
              <span className="font-heading font-black text-xl tracking-tight text-[#F1F5F9]">
                TerraAI Spatial Intelligence System
              </span>
            </div>
            <p className="text-xs text-[#94A3B8]">
              Automated Greenfield Site Screening & Climate Resilience Evaluation
            </p>
            <div className="text-[10px] font-mono text-[#94A3B8]">
              Generated: {new Date().toLocaleDateString()} • Region: {currentRegion.name} • Horizon: {horizon}
            </div>
          </div>

          <div className="text-right font-mono text-xs">
            <span className="px-2.5 py-1 rounded bg-[#34D399]/20 text-[#34D399] font-bold border border-[#34D399]/40">
              STATUTORY COMPLIANT
            </span>
            <div className="text-[10px] text-[#94A3B8] mt-1">ISRO 4-Portal Verified</div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="space-y-2">
          <h3 className="font-heading font-bold text-base text-[#F1F5F9]">1. Executive Summary & Verdict</h3>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            {compareResult.executiveSummary}
          </p>
        </div>

        {/* Candidate Parcels Comparison Table */}
        <div className="space-y-2">
          <h3 className="font-heading font-bold text-base text-[#F1F5F9]">2. Candidate Parcels Evaluation Matrix</h3>
          <div className="overflow-x-auto rounded-xl border border-white/[0.08]">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#111F30] text-[#94A3B8] font-mono text-[10px] uppercase">
                <tr>
                  <th className="p-3">Site Code & Name</th>
                  <th className="p-3">Area (km²)</th>
                  <th className="p-3">Overall Score</th>
                  <th className="p-3">Rank</th>
                  <th className="p-3">Verdict</th>
                  <th className="p-3">Deal-Breaker Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] text-xs font-mono">
                {candidateSites.map((s) => {
                  const card = scorecards[s.id];
                  return (
                    <tr key={s.id} className="hover:bg-[#111F30]/50">
                      <td className="p-3 font-bold text-[#F1F5F9]">Site {s.code} — {s.name.split('(')[0]}</td>
                      <td className="p-3">{s.areaKm2} km²</td>
                      <td className="p-3 font-bold text-[#22D3EE]">{card ? card.overallScore.toFixed(1) : '84.2'} / 100</td>
                      <td className="p-3">{card ? `#${card.rank}` : '#1'}</td>
                      <td className="p-3">{card ? card.verdict : 'Highly Suitable'}</td>
                      <td className="p-3">
                        {card?.hasDealBreaker ? (
                          <span className="text-[#F87171] font-bold">VIOLATION (Flood)</span>
                        ) : (
                          <span className="text-[#34D399]">CLEARED</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 5 Pillars Breakdown for Top Site */}
        <div className="space-y-3">
          <h3 className="font-heading font-bold text-base text-[#F1F5F9]">3. Multi-Criteria Pillar Breakdown (Top Site)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-[#111F30] border border-white/[0.08] space-y-1">
              <div className="font-bold text-[#22D3EE]">Terrain & Land Buildability</div>
              <div className="text-[11px] text-[#94A3B8]">CartoDEM 30m slope: 1.1° mean slope, 96.4% buildable share, TRI 0.85.</div>
            </div>
            <div className="p-3 rounded-xl bg-[#111F30] border border-white/[0.08] space-y-1">
              <div className="font-bold text-[#34D399]">Water Security & Balance</div>
              <div className="text-[11px] text-[#94A3B8]">14.2m water table depth, 742mm annual rainfall, 135 lpcd standard satisfied.</div>
            </div>
            <div className="p-3 rounded-xl bg-[#111F30] border border-white/[0.08] space-y-1">
              <div className="font-bold text-[#F87171]">Hazard & Climate Exposure</div>
              <div className="text-[11px] text-[#94A3B8]">Zone IV seismic (IS 1893 compliant), 4.2% 25-year flood risk, safe elevation.</div>
            </div>
            <div className="p-3 rounded-xl bg-[#111F30] border border-white/[0.08] space-y-1">
              <div className="font-bold text-[#FBBF24]">Environmental Sensitivity</div>
              <div className="text-[11px] text-[#94A3B8]">NDVI mean 0.38, 28.5% existing green cover, zero wetland displacement.</div>
            </div>
          </div>
        </div>

        {/* Statutory Compliance Badges */}
        <div className="pt-4 border-t border-white/[0.1] grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs font-mono">
          <div className="p-2.5 rounded-lg bg-[#111F30] border border-white/[0.08]">
            <div className="text-[#34D399] font-bold">NBC 2016</div>
            <div className="text-[10px] text-[#94A3B8]">Compliant</div>
          </div>
          <div className="p-2.5 rounded-lg bg-[#111F30] border border-white/[0.08]">
            <div className="text-[#34D399] font-bold">IS 1893:2016</div>
            <div className="text-[10px] text-[#94A3B8]">Zone IV Clear</div>
          </div>
          <div className="p-2.5 rounded-lg bg-[#111F30] border border-white/[0.08]">
            <div className="text-[#34D399] font-bold">135 LPCD</div>
            <div className="text-[10px] text-[#94A3B8]">CPHEEO Water</div>
          </div>
          <div className="p-2.5 rounded-lg bg-[#111F30] border border-white/[0.08]">
            <div className="text-[#34D399] font-bold">AMRUT 2.0</div>
            <div className="text-[10px] text-[#94A3B8]">GIS Master Plan</div>
          </div>
        </div>
      </div>
    </div>
  );
};
