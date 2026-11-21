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
      <div className="p-8 text-center text-slate-400">
        <p>No scorecard data available. Click "Analyse Candidate Sites" to extract regional indicators.</p>
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

  const circumference = 2 * Math.PI * 40; // r=40
  const strokeDashoffset = circumference - (scorecard.overallScore / 100) * circumference;

  return (
    <div className="space-y-5 pb-6">
      {/* Site Selector Pills */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
        {candidateSites.map((site) => {
          const isSelected = site.code === selectedSiteCode;
          const siteCard = scorecards[site.id];
          return (
            <button
              key={site.id}
              onClick={() => onSelectSiteCode(site.code)}
              className={`flex-1 py-2 px-3 rounded-lg border text-left transition-all ${
                isSelected
                  ? 'bg-sky-950/70 border-sky-500 shadow-md shadow-sky-950/40'
                  : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">Site {site.code}</span>
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: site.color }}
                ></span>
              </div>
              <div className="text-[11px] font-mono mt-0.5 truncate text-slate-300">
                {siteCard ? (
                  <span className={siteCard.hasDealBreaker ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                    {siteCard.overallScore} pts
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
      <div className="bg-slate-800/50 border border-slate-700/70 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-5">
        {/* Animated Circular Score Gauge */}
        <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background Track */}
            <circle
              cx="50"
              cy="50"
              r="40"
              className="stroke-slate-700"
              strokeWidth="9"
              fill="transparent"
            />
            {/* Value Arc */}
            <circle
              cx="50"
              cy="50"
              r="40"
              className={`transition-all duration-1000 ease-out ${getScoreColor(scorecard.overallScore, scorecard.hasDealBreaker)}`}
              strokeWidth="9"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-black font-mono text-white leading-none">
              {scorecard.overallScore}
            </span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mt-0.5">
              / 100
            </span>
          </div>
        </div>

        {/* Verdict Band Details */}
        <div className="flex-1 space-y-1.5 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span
              className={`px-2.5 py-0.5 text-xs font-bold rounded-full uppercase tracking-wide border ${
                scorecard.hasDealBreaker
                  ? 'bg-red-500/20 border-red-500/60 text-red-300'
                  : scorecard.overallScore >= 80
                  ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300'
                  : 'bg-amber-500/20 border-amber-500/60 text-amber-300'
              }`}
            >
              {scorecard.verdict}
            </span>
            <span className="px-2 py-0.5 text-[10px] bg-slate-700/80 text-slate-300 rounded font-mono">
              Tier {scorecard.verdictTier} • Rank #{scorecard.rank}
            </span>
            <span className="px-2 py-0.5 text-[10px] bg-sky-900/40 border border-sky-700/50 text-sky-300 rounded font-mono">
              {scorecard.confidencePct}% ISRO Confidence
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">{scorecard.verdictDescription}</p>
        </div>
      </div>

      {/* Deal-Breaker Banner */}
      {scorecard.hasDealBreaker ? (
        <div className="bg-red-950/80 border-2 border-red-500/80 rounded-xl p-3.5 shadow-xl space-y-2">
          <div className="flex items-center space-x-2 text-red-300 font-bold text-xs uppercase tracking-wide">
            <AlertOctagon className="w-4 h-4 text-red-400 animate-pulse" />
            <span>Hard-Stop Spatial Deal-Breaker Triggered</span>
          </div>
          {scorecard.dealBreakers
            .filter((db) => db.triggered)
            .map((db) => (
              <div key={db.id} className="text-xs bg-red-900/40 p-2.5 rounded-lg border border-red-700/50 space-y-1">
                <div className="flex items-center justify-between font-semibold text-white">
                  <span>{db.rule}</span>
                  <span className="px-1.5 py-0.5 bg-red-600 text-white rounded text-[10px] font-mono">
                    {db.actualValue}
                  </span>
                </div>
                <p className="text-[11px] text-red-200">{db.description}</p>
              </div>
            ))}
        </div>
      ) : (
        <div className="bg-emerald-950/50 border border-emerald-500/50 rounded-xl p-3 flex items-center space-x-2.5 text-xs text-emerald-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>Zero Hard-Stop Constraints:</strong> Site complies with Bhuvan flood safety, CartoDEM slope, and statutory wetland conservation boundaries.
          </span>
        </div>
      )}

      {/* 5-Pillar Recharts Radar Chart */}
      <div className="bg-slate-800/50 border border-slate-700/70 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            5-Pillar Multi-Criteria Radar Profile
          </h3>
          <span className="text-[10px] text-slate-400">Scale: 0-100</span>
        </div>

        <div className="w-full h-60">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={scorecard.radarData} margin={{ top: 10, right: 25, bottom: 10, left: 25 }}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis
                dataKey="pillar"
                stroke="#94a3b8"
                tick={{ fill: '#cbd5e1', fontSize: 11, fontWeight: 600 }}
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
                fillOpacity={0.4}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Pillar Mini-Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
          {Object.values(scorecard.pillars).map((p) => (
            <div
              key={p.pillar}
              className="bg-slate-900/80 p-2 rounded-lg border border-slate-800 text-center"
            >
              <div className="text-[10px] text-slate-400 font-medium truncate">{p.name.split(' ')[0]}</div>
              <div className="text-sm font-bold font-mono text-white mt-0.5">{p.rawScore}</div>
              <div className="text-[9px] text-slate-400">Wt: {p.weight}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Indicator Table with 4-Portal Badges */}
      <div className="bg-slate-800/50 border border-slate-700/70 rounded-xl p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-sky-400" />
              <span>Extracted Indicators & Provenance</span>
            </h3>
            <p className="text-[10px] text-slate-400">
              Direct zonal extraction across Bhoonidhi, Bhuvan, MOSDAC, and VEDAS
            </p>
          </div>

          {/* Search & Pillar Filter Controls */}
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-36">
              <Search className="w-3 h-3 absolute left-2 top-2 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-slate-200 pl-6 pr-2 py-1 text-[11px] rounded outline-none"
              />
            </div>
            <select
              value={selectedPillarFilter}
              onChange={(e) => setSelectedPillarFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 px-2 py-1 text-[11px] rounded outline-none"
            >
              <option value="all">All Pillars</option>
              <option value="terrain">Terrain</option>
              <option value="water">Water</option>
              <option value="hazards">Hazards</option>
              <option value="environment">Environment</option>
              <option value="infrastructure">Infrastructure</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-700 text-[10px] text-slate-400 uppercase tracking-wider">
                <th className="pb-2 font-semibold">Indicator</th>
                <th className="pb-2 font-semibold">Value</th>
                <th className="pb-2 font-semibold">Score</th>
                <th className="pb-2 font-semibold">ISRO Provenance Badge</th>
                <th className="pb-2 font-semibold text-right">Conf.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredIndicators.map((ind) => (
                <tr key={ind.key} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 pr-2">
                    <div className="font-medium text-slate-200">{ind.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono capitalize">{ind.pillar}</div>
                  </td>
                  <td className="py-2.5 pr-2 whitespace-nowrap">
                    <span className="font-mono font-bold text-white">{ind.displayValue}</span>
                  </td>
                  <td className="py-2.5 pr-2 whitespace-nowrap">
                    <div className="flex items-center space-x-1.5">
                      <div className="w-12 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-sky-400 rounded-full"
                          style={{ width: `${Math.min(ind.score, 100)}%` }}
                        />
                      </div>
                      <span className="font-mono text-[10px] text-slate-300">{ind.score}</span>
                    </div>
                  </td>
                  <td className="py-2.5 pr-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-1.5">
                        <span
                          className={`px-1.5 py-0.2 text-[9px] font-bold rounded border ${getPortalBadgeColor(
                            ind.source.portal
                          )}`}
                        >
                          {ind.source.portal}
                        </span>
                        <span className="text-[10px] text-slate-300 font-medium truncate max-w-[150px]">
                          {ind.source.dataset}
                        </span>
                      </div>
                      <div className="text-[9px] text-slate-400">
                        {ind.source.resolution} • {ind.source.vintage} • {ind.source.method}
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 text-right whitespace-nowrap">
                    <span
                      className={`px-1.5 py-0.5 text-[9px] font-semibold rounded ${
                        ind.confidence === 'High'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : ind.confidence === 'Medium'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-red-500/20 text-red-300'
                      }`}
                    >
                      {ind.confidence}
                    </span>
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
