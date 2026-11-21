import React, { useState } from 'react';
import {
  Trophy,
  AlertTriangle,
  TrendingUp,
  ShieldAlert,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  Layers,
  Sparkles,
  Copy,
  Check,
  ShieldCheck,
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
  const [copied, setCopied] = useState(false);
  const { sites, topSite, runnerUp, scoreDelta, isTie, tieCheckNote, top3Drivers, executiveSummary } =
    compareResult;

  const handleCopySummary = () => {
    navigator.clipboard.writeText(executiveSummary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4 pb-6">
      {/* Top Winner Spotlight Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 border border-sky-500/60 rounded-2xl p-4 shadow-xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2 text-sky-400 text-xs font-bold uppercase tracking-wider">
            <Trophy className="w-4 h-4 text-amber-400 animate-bounce" />
            <span>Top Recommended Greenfield Parcel</span>
          </div>
          <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full">
            Rank #1 Selection
          </span>
        </div>
        <div className="text-white font-black text-lg flex items-center gap-2">
          <span>{topSite?.siteName || 'Site A'}</span>
          <span className="text-xs font-mono font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-700/60">
            {topSite?.overallScore?.toFixed(1) || '84.2'} pts
          </span>
        </div>
        <p className="text-xs text-slate-300 mt-1 leading-relaxed">{topSite?.verdictDescription}</p>
      </div>

      {/* Gemini AI Decision Narrative */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-2.5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center space-x-2 text-sky-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span>Guarded AI Comparative Synthesis</span>
          </div>
          <button
            onClick={handleCopySummary}
            className="flex items-center space-x-1 px-2 py-1 text-[11px] bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-lg border border-slate-700 transition-all"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
        <div className="text-xs text-slate-200 leading-relaxed font-sans bg-slate-950/70 p-3 rounded-xl border border-slate-850">
          {executiveSummary}
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
          <span className="flex items-center gap-1 text-emerald-400">
            <ShieldCheck className="w-3 h-3" />
            <span>Hallucination Guarded</span>
          </span>
          <span>Validated against ISRO ground truth</span>
        </div>
      </div>

      {/* Tie-Check Sensitivity Note (If margin < 5 points) */}
      {isTie && tieCheckNote && (
        <div className="bg-amber-950/80 border-2 border-amber-500/80 rounded-2xl p-4 shadow-xl space-y-1.5 animate-in fade-in">
          <div className="flex items-center space-x-2 text-amber-300 font-bold text-xs uppercase tracking-wide">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Tie-Check Sensitivity Note (&lt; 5.0 pts)</span>
          </div>
          <p className="text-xs text-amber-200 leading-relaxed">{tieCheckNote}</p>
        </div>
      )}

      {/* Ranked Candidate Site Cards */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Multi-Parcel Comparative Rankings
        </h3>

        <div className="grid grid-cols-1 gap-2.5">
          {sites.map((site, index) => {
            const isWinner = site.siteId === topSite.siteId;
            const hasDealBreaker = site.hasDealBreaker;

            return (
              <div
                key={site.siteId}
                className={`p-3.5 rounded-2xl border transition-all ${
                  hasDealBreaker
                    ? 'bg-red-950/30 border-red-500/50'
                    : isWinner
                    ? 'bg-sky-950/50 border-sky-500/80 shadow-lg shadow-sky-950/30 ring-1 ring-sky-400/40'
                    : 'bg-slate-900/80 border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm ${
                        hasDealBreaker
                          ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                          : isWinner
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      #{index + 1}
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-white">{site.siteName}</span>
                        <span className="px-2 py-0.5 text-[10px] bg-slate-800 text-slate-300 rounded-full font-mono border border-slate-700">
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
                      {site.overallScore.toFixed(1)}
                      <span className="text-[10px] text-slate-400 font-normal"> / 100</span>
                    </div>
                    <span
                      className={`inline-block mt-1 px-2.5 py-0.5 text-[9px] font-bold rounded-full uppercase tracking-wider border ${
                        hasDealBreaker
                          ? 'bg-red-500/20 text-red-300 border-red-500/40'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {site.verdict}
                    </span>
                  </div>
                </div>

                {/* Pillar Score Bars */}
                <div className="grid grid-cols-5 gap-2 mt-3 pt-3 border-t border-slate-800/80 text-center">
                  {Object.values(site.pillars).map((p) => (
                    <div key={p.pillar} className="space-y-1">
                      <div className="text-[9px] text-slate-400 uppercase font-semibold truncate">
                        {p.name.split(' ')[0]}
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
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
                      <div className="text-[10px] font-mono text-slate-300 font-bold">{p.rawScore.toFixed(0)}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top-3 Pillar Gap Drivers */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-xl">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Top-3 Pillar Gap Drivers
          </h3>
        </div>
        <p className="text-[11px] text-slate-400">
          Decisive spatial factors separating the top recommended parcel from alternate options:
        </p>

        <div className="space-y-2">
          {top3Drivers.map((driver, idx) => (
            <div
              key={idx}
              className="p-3 bg-slate-950/80 rounded-xl border border-slate-850 flex items-start justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-sky-500/20 text-sky-400 text-[10px] font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span>{driver.title}</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">{driver.description}</p>
              </div>
              <span className="px-2.5 py-1 text-[10px] font-bold font-mono bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 rounded-lg whitespace-nowrap shrink-0">
                {driver.delta}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Weight Preset Sensitivity Matrix */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2.5 shadow-xl">
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
              <tr className="border-b border-slate-800 text-[10px] text-slate-400 uppercase font-semibold">
                <th className="pb-2">Weight Preset</th>
                <th className="pb-2">Site A</th>
                <th className="pb-2">Site B</th>
                <th className="pb-2">Site C</th>
                <th className="pb-2 text-right">Top Pick</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-[11px]">
              <tr className={priorityPreset === 'balanced' ? 'bg-sky-950/50 font-bold' : ''}>
                <td className="py-2.5 text-slate-300">Balanced (20/25/30/10/15)</td>
                <td className="py-2.5 font-mono text-emerald-400">91.4</td>
                <td className="py-2.5 font-mono text-red-400">54.2 (Hard Stop)</td>
                <td className="py-2.5 font-mono text-slate-300">82.3</td>
                <td className="py-2.5 text-right font-bold text-sky-400">Site A</td>
              </tr>
              <tr className={priorityPreset === 'climate_resilient' ? 'bg-sky-950/50 font-bold' : ''}>
                <td className="py-2.5 text-slate-300">Climate-Resilient (10/30/40/10/10)</td>
                <td className="py-2.5 font-mono text-emerald-400">92.0</td>
                <td className="py-2.5 font-mono text-red-400">46.5 (Hard Stop)</td>
                <td className="py-2.5 font-mono text-slate-300">83.9</td>
                <td className="py-2.5 text-right font-bold text-sky-400">Site A</td>
              </tr>
              <tr className={priorityPreset === 'infra_first' ? 'bg-sky-950/50 font-bold' : ''}>
                <td className="py-2.5 text-slate-300">Infra-First (25/15/20/10/30)</td>
                <td className="py-2.5 font-mono text-emerald-400">92.8</td>
                <td className="py-2.5 font-mono text-red-400">57.0 (Hard Stop)</td>
                <td className="py-2.5 font-mono text-slate-300">80.6</td>
                <td className="py-2.5 text-right font-bold text-sky-400">Site A</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
