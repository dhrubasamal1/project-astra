import React from 'react';
import {
  Trophy,
  AlertTriangle,
  TrendingUp,
  ShieldAlert,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  Layers,
} from 'lucide-react';
import { CompareResult, PriorityPreset, RegionId } from '../types';

interface CompareTabProps {
  compareResult: CompareResult;
  priorityPreset: PriorityPreset;
  regionId: RegionId;
}

export const CompareTab: React.FC<CompareTabProps> = ({
  compareResult,
  priorityPreset,
}) => {
  const { sites, topSite, runnerUp, scoreDelta, isTie, tieCheckNote, top3Drivers, executiveSummary } =
    compareResult;

  return (
    <div className="space-y-5 pb-6">
      {/* Executive Ranking Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 border border-sky-600/40 rounded-xl p-4 shadow-xl">
        <div className="flex items-center space-x-2 text-sky-400 text-xs font-bold uppercase tracking-wider mb-1.5">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>Multi-Criteria Decision Analysis Ranking</span>
        </div>
        <p className="text-xs text-slate-200 leading-relaxed">{executiveSummary}</p>
      </div>

      {/* Tie-Check Sensitivity Note (If margin < 5 points) */}
      {isTie && tieCheckNote && (
        <div className="bg-amber-950/70 border-2 border-amber-500/80 rounded-xl p-3.5 shadow-lg space-y-1.5 animate-in fade-in">
          <div className="flex items-center space-x-2 text-amber-300 font-bold text-xs">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="uppercase tracking-wide">Tie-Check Sensitivity Note (&lt; 5.0 pts)</span>
          </div>
          <p className="text-xs text-amber-200/90 leading-relaxed">{tieCheckNote}</p>
        </div>
      )}

      {/* Ranked Candidate Site Cards */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Ranked Candidate Sites
        </h3>

        <div className="grid grid-cols-1 gap-3">
          {sites.map((site, index) => {
            const isWinner = site.siteId === topSite.siteId;
            const hasDealBreaker = site.hasDealBreaker;

            return (
              <div
                key={site.siteId}
                className={`p-4 rounded-xl border transition-all ${
                  hasDealBreaker
                    ? 'bg-red-950/30 border-red-500/50'
                    : isWinner
                    ? 'bg-sky-950/40 border-sky-500/70 shadow-lg shadow-sky-950/30'
                    : 'bg-slate-800/60 border-slate-700/60'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    {/* Rank Badge */}
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                        hasDealBreaker
                          ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                          : isWinner
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      #{index + 1}
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-white">{site.siteName}</span>
                        <span className="px-1.5 py-0.2 text-[10px] bg-slate-700 text-slate-300 rounded font-mono">
                          Site {site.siteCode}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{site.verdictDescription}</p>
                    </div>
                  </div>

                  {/* Score Pill */}
                  <div className="text-right shrink-0">
                    <div
                      className={`text-lg font-black font-mono leading-none ${
                        hasDealBreaker
                          ? 'text-red-400'
                          : isWinner
                          ? 'text-emerald-400'
                          : 'text-slate-200'
                      }`}
                    >
                      {site.overallScore}
                      <span className="text-[10px] text-slate-400 font-normal"> / 100</span>
                    </div>
                    <span
                      className={`inline-block mt-1 px-2 py-0.2 text-[9px] font-bold rounded uppercase tracking-wider ${
                        hasDealBreaker
                          ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                          : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {site.verdict}
                    </span>
                  </div>
                </div>

                {/* Pillar Score Bars */}
                <div className="grid grid-cols-5 gap-2 mt-3 pt-3 border-t border-slate-750/60 text-center">
                  {Object.values(site.pillars).map((p) => (
                    <div key={p.pillar} className="space-y-1">
                      <div className="text-[9px] text-slate-400 uppercase truncate">
                        {p.name.split(' ')[0]}
                      </div>
                      <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            p.rawScore >= 80
                              ? 'bg-emerald-400'
                              : p.rawScore >= 60
                              ? 'bg-amber-400'
                              : 'bg-red-400'
                          }`}
                          style={{ width: `${Math.min(p.rawScore, 100)}%` }}
                        />
                      </div>
                      <div className="text-[10px] font-mono text-slate-300 font-bold">{p.rawScore}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top-3 Pillar Gap Drivers */}
      <div className="bg-slate-800/50 border border-slate-700/70 rounded-xl p-4 space-y-3">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Top-3 Pillar Gap Drivers
          </h3>
        </div>
        <p className="text-[11px] text-slate-400">
          Decisive spatial multi-criteria factors that separate the top recommended site from alternate options.
        </p>

        <div className="space-y-2.5">
          {top3Drivers.map((driver, idx) => (
            <div
              key={idx}
              className="p-3 bg-slate-900/80 rounded-lg border border-slate-800 flex items-start justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-sky-500/20 text-sky-400 text-[10px] font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span>{driver.title}</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">{driver.description}</p>
              </div>
              <span className="px-2 py-1 text-[10px] font-bold font-mono bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 rounded whitespace-nowrap shrink-0">
                {driver.delta}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Weight Preset Sensitivity Matrix */}
      <div className="bg-slate-800/50 border border-slate-700/70 rounded-xl p-4 space-y-2.5">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-purple-400" />
          <span>Preset Rank Sensitivity Cross-Check</span>
        </h3>
        <p className="text-[11px] text-slate-400">
          Simulated outcome across all 3 planner weighting presets:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-700 text-[10px] text-slate-400 uppercase">
                <th className="pb-1.5">Weight Preset</th>
                <th className="pb-1.5">Site A (Hub)</th>
                <th className="pb-1.5">Site B (Floodplain)</th>
                <th className="pb-1.5">Site C (Agricultural)</th>
                <th className="pb-1.5 text-right">Top Pick</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-[11px]">
              <tr className={priorityPreset === 'balanced' ? 'bg-sky-950/40 font-semibold' : ''}>
                <td className="py-2 text-slate-300">Balanced (20/25/30/10/15)</td>
                <td className="py-2 font-mono text-emerald-400">91.4</td>
                <td className="py-2 font-mono text-red-400">54.2 (Hard Stop)</td>
                <td className="py-2 font-mono text-slate-300">82.3</td>
                <td className="py-2 text-right font-bold text-sky-400">Site A</td>
              </tr>
              <tr className={priorityPreset === 'climate_resilient' ? 'bg-sky-950/40 font-semibold' : ''}>
                <td className="py-2 text-slate-300">Climate-Resilient (10/30/40/10/10)</td>
                <td className="py-2 font-mono text-emerald-400">92.0</td>
                <td className="py-2 font-mono text-red-400">46.5 (Hard Stop)</td>
                <td className="py-2 font-mono text-slate-300">83.9</td>
                <td className="py-2 text-right font-bold text-sky-400">Site A</td>
              </tr>
              <tr className={priorityPreset === 'infra_first' ? 'bg-sky-950/40 font-semibold' : ''}>
                <td className="py-2 text-slate-300">Infra-First (25/15/20/10/30)</td>
                <td className="py-2 font-mono text-emerald-400">92.8</td>
                <td className="py-2 font-mono text-red-400">57.0 (Hard Stop)</td>
                <td className="py-2 font-mono text-slate-300">80.6</td>
                <td className="py-2 text-right font-bold text-sky-400">Site A</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
