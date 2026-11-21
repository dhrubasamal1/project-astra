import React, { useState } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import {
  AlertOctagon,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Database,
  ExternalLink,
  Search,
  Filter,
  Layers,
  Mountain,
  Droplets,
  Trees,
  Compass,
  Zap,
} from 'lucide-react';
import { SiteScorecard, CandidateSite, PriorityPreset } from '../types';

interface ScorecardTabProps {
  scorecards: Record<string, SiteScorecard>;
  candidateSites: CandidateSite[];
  selectedSiteCode: 'A' | 'B' | 'C';
  onSelectSiteCode: (code: 'A' | 'B' | 'C') => void;
  priorityPreset: PriorityPreset;
}

export const ScorecardTab: React.FC<ScorecardTabProps> = ({
  scorecards,
  candidateSites,
  selectedSiteCode,
  onSelectSiteCode,
}) => {
  const [selectedPillarFilter, setSelectedPillarFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const activeSite = candidateSites.find((s) => s.code === selectedSiteCode) || candidateSites[0];
  const scorecard = scorecards[activeSite?.id] || Object.values(scorecards)[0];

  if (!scorecard) {
    return (
      <div className="p-8 text-center text-slate-400 space-y-2">
        <p className="font-semibold text-slate-300">Extracting ISRO Zonal Grids...</p>
        <p className="text-xs">Click "Run Autonomous Spatial Screening" to calculate multi-criteria indicators.</p>
      </div>
    );
  }

  // Filter indicators
  const filteredIndicators = scorecard.indicators.filter((ind) => {
    const matchesPillar = selectedPillarFilter === 'all' || ind.pillar === selectedPillarFilter;
    const matchesSearch =
      ind.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ind.source.dataset.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ind.source.portal.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPillar && matchesSearch;
  });

  // Score color helper
  const getScoreColor = (score: number, hasDb: boolean) => {
    if (hasDb) return 'text-red-400 stroke-red-500';
    if (score >= 80) return 'text-emerald-400 stroke-emerald-500';
    if (score >= 60) return 'text-amber-400 stroke-amber-500';
    return 'text-orange-400 stroke-orange-500';
  };

  const getPortalBadgeColor = (portal: string) => {
    switch (portal) {
      case 'Bhoonidhi':
        return 'bg-amber-500/15 border-amber-500/40 text-amber-300';
      case 'Bhuvan':
        return 'bg-blue-500/15 border-blue-500/40 text-blue-300';
      case 'MOSDAC':
        return 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300';
      case 'VEDAS':
        return 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300';
      default:
        return 'bg-slate-700/40 border-slate-600/40 text-slate-300';
    }
  };

  const getPillarIcon = (name: string) => {
    if (name.includes('Terrain')) return <Mountain className="w-3.5 h-3.5 text-emerald-400" />;
    if (name.includes('Water')) return <Droplets className="w-3.5 h-3.5 text-cyan-400" />;
    if (name.includes('Hazard')) return <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />;
    if (name.includes('Environment')) return <Trees className="w-3.5 h-3.5 text-lime-400" />;
    return <Zap className="w-3.5 h-3.5 text-violet-400" />;
  };

  const circumference = 2 * Math.PI * 42; // r=42
  const strokeDashoffset = circumference - (scorecard.overallScore / 100) * circumference;

  return (
    <div className="space-y-4 pb-6">
      {/* Site Selector Pills */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
        {candidateSites.map((site) => {
          const isSelected = site.code === selectedSiteCode;
          const siteCard = scorecards[site.id];
          return (
            <button
              key={site.id}
              onClick={() => onSelectSiteCode(site.code)}
              className={`flex-1 py-2.5 px-3 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-sky-950/80 border-sky-500/80 shadow-lg shadow-sky-950/40 ring-1 ring-sky-400/40'
                  : 'bg-slate-900/80 border-slate-800 hover:bg-slate-850'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">Site {site.code}</span>
                <span
                  className="w-2.5 h-2.5 rounded-full shadow-sm"
                  style={{ backgroundColor: site.color }}
                ></span>
              </div>
              <div className="text-[11px] font-mono mt-1 truncate text-slate-300">
                {siteCard ? (
                  <span className={siteCard.hasDealBreaker ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                    {siteCard.hasDealBreaker ? 'STATUTORY EXCLUSION' : `${siteCard.overallScore.toFixed(1)} pts`}
                  </span>
                ) : (
                  'Pending'
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Score Gauge & Verdict Band Hero */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-5 shadow-xl">
        {/* Animated Circular Score Gauge */}
        <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background Track */}
            <circle
              cx="50"
              cy="50"
              r="42"
              className="stroke-slate-800"
              strokeWidth="8"
              fill="transparent"
            />
            {/* Value Arc */}
            <circle
              cx="50"
              cy="50"
              r="42"
              className={`transition-all duration-1000 ease-out ${getScoreColor(scorecard.overallScore, scorecard.hasDealBreaker)}`}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-black font-mono text-white leading-none">
              {scorecard.overallScore.toFixed(1)}
            </span>
            <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold mt-1">
              MCA INDEX
            </span>
          </div>
        </div>

        {/* Verdict Band Details */}
        <div className="flex-1 space-y-2 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
            <span
              className={`px-3 py-1 text-xs font-black rounded-full uppercase tracking-wider border shadow-sm ${
                scorecard.hasDealBreaker
                  ? 'bg-red-500/20 border-red-500/80 text-red-300'
                  : scorecard.overallScore >= 80
                  ? 'bg-emerald-500/20 border-emerald-500/80 text-emerald-300'
                  : 'bg-amber-500/20 border-amber-500/80 text-amber-300'
              }`}
            >
              {scorecard.verdict}
            </span>
            <span className="px-2.5 py-0.5 text-[10px] bg-slate-800 text-slate-300 rounded-full font-mono border border-slate-700">
              Rank #{scorecard.rank}
            </span>
            <span className="px-2.5 py-0.5 text-[10px] bg-sky-950/60 border border-sky-700/60 text-sky-300 rounded-full font-mono">
              {scorecard.confidencePct}% ISRO Ground-Truth
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">{scorecard.verdictDescription}</p>
        </div>
      </div>

      {/* Deal-Breaker Banner */}
      {scorecard.hasDealBreaker ? (
        <div className="bg-red-950/80 border-2 border-red-500/80 rounded-2xl p-4 shadow-xl space-y-2 animate-in fade-in">
          <div className="flex items-center space-x-2 text-red-300 font-bold text-xs uppercase tracking-wide">
            <AlertOctagon className="w-4 h-4 text-red-400 animate-pulse" />
            <span>Hard-Stop Spatial Deal-Breaker Triggered</span>
          </div>
          {scorecard.dealBreakers
            .filter((db) => db.triggered)
            .map((db) => (
              <div key={db.id} className="text-xs bg-red-900/40 p-3 rounded-xl border border-red-700/60 space-y-1">
                <div className="flex items-center justify-between font-bold text-white">
                  <span>{db.rule}</span>
                  <span className="px-2 py-0.5 bg-red-600 text-white rounded text-[10px] font-mono">
                    {db.actualValue}
                  </span>
                </div>
                <p className="text-[11px] text-red-200">{db.description}</p>
              </div>
            ))}
        </div>
      ) : (
        <div className="bg-emerald-950/40 border border-emerald-500/50 rounded-2xl p-3.5 flex items-center space-x-2.5 text-xs text-emerald-300 shadow-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>Zero Hard-Stop Dealbreakers:</strong> Parcel clears all Bhuvan flood zones, CartoDEM slope thresholds, and CRZ/wetland boundaries.
          </span>
        </div>
      )}

      {/* 5-Pillar Recharts Radar Chart & Mini-Tiles */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-sky-400" />
            <span>5-Pillar Spatial Profile</span>
          </h3>
          <span className="text-[10px] text-slate-400 font-mono">Normalized 0–100 Scale</span>
        </div>

        <div className="w-full h-56">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={scorecard.radarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis
                dataKey="pillar"
                stroke="#94a3b8"
                tick={{ fill: '#cbd5e1', fontSize: 10, fontWeight: 700 }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                stroke="#475569"
                tick={{ fill: '#64748b', fontSize: 9 }}
              />
              <Radar
                name={scorecard.siteName}
                dataKey="score"
                stroke={scorecard.hasDealBreaker ? '#ef4444' : '#0ea5e9'}
                fill={scorecard.hasDealBreaker ? '#ef4444' : '#0ea5e9'}
                fillOpacity={0.45}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* 5 Pillar Mini Tiles with Glowing Bars */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
          {Object.values(scorecard.pillars).map((p) => (
            <div
              key={p.pillar}
              className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-850 text-center hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 font-semibold mb-1">
                {getPillarIcon(p.name)}
                <span className="truncate">{p.name.split(' ')[0]}</span>
              </div>
              <div className="text-sm font-black font-mono text-white">{p.rawScore.toFixed(1)}</div>
              <div className="text-[9px] text-slate-500 font-mono">Weight: {p.weight}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Extracted Indicators Table with 4-Portal Badges */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
          <div>
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-sky-400" />
              <span>Extracted Zonal Indicators</span>
            </h3>
            <p className="text-[10px] text-slate-400">
              Direct zonal extraction across Bhoonidhi, Bhuvan, MOSDAC, and VEDAS
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-44">
            <Search className="w-3 h-3 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search metrics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-750 text-slate-200 pl-7 pr-2.5 py-1.5 text-xs rounded-lg outline-none focus:border-sky-500"
            />
          </div>
        </div>

        {/* Indicators List */}
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {filteredIndicators.map((ind) => (
            <div
              key={ind.key}
              className="p-3 bg-slate-950/80 rounded-xl border border-slate-850 hover:border-slate-700 transition-all space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">{ind.name}</span>
                <span className="font-mono text-xs font-bold text-sky-300">
                  {typeof ind.value === 'number' ? ind.value.toLocaleString() : ind.value} {ind.unit}
                </span>
              </div>

              <div className="flex items-center justify-between text-[10px]">
                <span className={`px-2 py-0.5 rounded-full font-mono font-semibold border ${getPortalBadgeColor(ind.source.portal)}`}>
                  {ind.source.portal}
                </span>
                <span className="text-slate-400 font-mono">
                  {ind.source.dataset} ({ind.source.vintage})
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
