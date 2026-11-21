import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  Layers,
  Milestone,
  ShieldCheck,
  Send,
  Loader2,
  RefreshCw,
  Building2,
  Trees,
  Sun,
  Bus,
  AlertTriangle,
  CheckCircle2,
  Compass,
} from 'lucide-react';
import {
  AiReviewRequest,
  AiReviewResponse,
  CandidateSite,
  SiteScorecard,
} from '../types';
import { ApiClient } from '../lib/api';

interface AiReviewSectionProps {
  regionId: string;
  activeSite: CandidateSite;
  scorecard?: SiteScorecard;
  waterStressIndex?: number;
  targetPopulation?: number;
  horizonYear?: number;
}

export const AiReviewSection: React.FC<AiReviewSectionProps> = ({
  regionId,
  activeSite,
  scorecard,
  waterStressIndex = 0.65,
  targetPopulation = 450000,
  horizonYear = 2050,
}) => {
  const [review, setReview] = useState<AiReviewResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userQuery, setUserQuery] = useState('');
  const [customAnswer, setCustomAnswer] = useState<string | null>(null);
  const [isQuerying, setIsQuerying] = useState(false);

  const handleRunReview = async (queryOverride?: string) => {
    setIsLoading(true);
    try {
      const payload: AiReviewRequest = {
        region_id: regionId,
        site_code: activeSite.code,
        site_name: activeSite.name,
        area_km2: activeSite.areaKm2,
        overall_score: scorecard?.overallScore ?? 85.0,
        verdict: scorecard?.verdict ?? 'Suitable',
        has_dealbreaker: scorecard?.hasDealBreaker ?? false,
        dealbreakers: scorecard?.dealBreakers?.filter((d) => d.triggered).map((d) => d.description) ?? [],
        water_stress_index: waterStressIndex,
        target_population: targetPopulation,
        horizon_year: horizonYear,
        user_query: queryOverride || undefined,
      };

      const res = await ApiClient.requestAiReview(payload);
      setReview(res);
      if (res.custom_answer) {
        setCustomAnswer(res.custom_answer);
      }
    } catch (err) {
      console.error('Failed to run AI review:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim() || isQuerying) return;
    setIsQuerying(true);
    try {
      const payload: AiReviewRequest = {
        region_id: regionId,
        site_code: activeSite.code,
        site_name: activeSite.name,
        area_km2: activeSite.areaKm2,
        overall_score: scorecard?.overallScore ?? 85.0,
        verdict: scorecard?.verdict ?? 'Suitable',
        has_dealbreaker: scorecard?.hasDealBreaker ?? false,
        dealbreakers: scorecard?.dealBreakers?.filter((d) => d.triggered).map((d) => d.description) ?? [],
        water_stress_index: waterStressIndex,
        target_population: targetPopulation,
        horizon_year: horizonYear,
        user_query: userQuery.trim(),
      };
      const res = await ApiClient.requestAiReview(payload);
      setCustomAnswer(res.custom_answer || 'No specific advisory returned.');
      if (!review) setReview(res);
    } catch (err) {
      console.error('AI question failed:', err);
    } finally {
      setIsQuerying(false);
    }
  };

  const quickPrompts = [
    'Can we build a 50,000-seat multi-modal stadium?',
    'How do we mitigate monsoon flood risk?',
    'What is the clean energy microgrid potential?',
  ];

  return (
    <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-5 border border-indigo-500/30 shadow-xl space-y-5">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-white tracking-wide">Gemini Urban AI Review</h3>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 flex items-center gap-1">
                <Bot className="w-2.5 h-2.5" />
                <span>Gemini 2.5 Flash</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              Autonomous Masterplan Synthesis & Strategic Space-Data Audit
            </p>
          </div>
        </div>

        <button
          onClick={() => handleRunReview()}
          disabled={isLoading}
          className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-md shadow-indigo-500/30 transition-all cursor-pointer disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Analyzing with Gemini...</span>
            </>
          ) : review ? (
            <>
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Re-analyze Site {activeSite.code}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Review Site {activeSite.code} with Gemini</span>
            </>
          )}
        </button>
      </div>

      {/* When Review Not Yet Run: Teaser Prompt */}
      {!review && !isLoading && (
        <div className="p-6 text-center rounded-2xl bg-white/5 border border-white/10 space-y-3">
          <p className="text-xs text-slate-300 max-w-md mx-auto">
            Click <strong>"Review Site {activeSite.code} with Gemini"</strong> to generate an intelligent planning critique,
            custom AI smart zoning distribution (hectares), a 3-phase infrastructure CapEx roadmap, and climate resilience interventions.
          </p>
        </div>
      )}

      {/* Review Results */}
      {review && (
        <div className="space-y-5 animate-in fade-in duration-300">
          {/* 1. Executive Critique */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-blue-400" />
                <span>Executive Planning Critique</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">Model: {review.model_used}</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line font-normal">
              {review.executive_critique}
            </p>

            {/* Strengths & Vulnerabilities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-2">
              <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 space-y-1">
                <div className="text-[10px] font-extrabold uppercase text-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Key Strategic Strengths</span>
                </div>
                <ul className="text-[10px] text-slate-300 space-y-0.5 list-disc list-inside">
                  {review.key_strengths.map((str, idx) => (
                    <li key={idx} className="line-clamp-2">{str}</li>
                  ))}
                </ul>
              </div>

              <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/30 space-y-1">
                <div className="text-[10px] font-extrabold uppercase text-rose-300 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-rose-400" />
                  <span>Critical Vulnerabilities</span>
                </div>
                <ul className="text-[10px] text-slate-300 space-y-0.5 list-disc list-inside">
                  {review.critical_vulnerabilities.map((vuln, idx) => (
                    <li key={idx} className="line-clamp-2">{vuln}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* 2. Something Extra #1: Smart City Land-Use Zoning Breakdown */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-purple-400" />
                <span>Autonomous AI Zoning Allocation ({activeSite.areaKm2} km² / {(activeSite.areaKm2 * 100).toFixed(0)} ha)</span>
              </span>
              <span className="text-[10px] font-bold text-slate-400">Smart Masterplan</span>
            </div>

            {/* Visual Segmented Progress Bar */}
            <div className="h-4 rounded-full overflow-hidden flex bg-slate-800 border border-white/10">
              <div
                style={{ width: `${review.recommended_zoning.residential_pct}%` }}
                className="bg-indigo-500 hover:bg-indigo-400 transition-all"
                title={`Residential: ${review.recommended_zoning.residential_pct}%`}
              ></div>
              <div
                style={{ width: `${review.recommended_zoning.commercial_it_pct}%` }}
                className="bg-sky-500 hover:bg-sky-400 transition-all"
                title={`Commercial/Tech: ${review.recommended_zoning.commercial_it_pct}%`}
              ></div>
              <div
                style={{ width: `${review.recommended_zoning.sponge_parks_pct}%` }}
                className="bg-emerald-500 hover:bg-emerald-400 transition-all"
                title={`Sponge Parks: ${review.recommended_zoning.sponge_parks_pct}%`}
              ></div>
              <div
                style={{ width: `${review.recommended_zoning.renewable_microgrid_pct}%` }}
                className="bg-amber-500 hover:bg-amber-400 transition-all"
                title={`Clean Microgrid: ${review.recommended_zoning.renewable_microgrid_pct}%`}
              ></div>
              <div
                style={{ width: `${review.recommended_zoning.transit_civic_pct}%` }}
                className="bg-purple-500 hover:bg-purple-400 transition-all"
                title={`Transit/Civic: ${review.recommended_zoning.transit_civic_pct}%`}
              ></div>
            </div>

            {/* Segment Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
              <div className="p-2 rounded-xl bg-indigo-950/60 border border-indigo-500/30">
                <div className="flex items-center justify-center gap-1 text-[10px] text-indigo-300 font-bold">
                  <Building2 className="w-3 h-3 text-indigo-400" />
                  <span>Residential</span>
                </div>
                <div className="text-sm font-black text-white mt-0.5">{review.recommended_zoning.residential_pct}%</div>
                <div className="text-[9px] text-indigo-300 font-mono">{review.recommended_zoning.residential_ha} ha</div>
              </div>

              <div className="p-2 rounded-xl bg-sky-950/60 border border-sky-500/30">
                <div className="flex items-center justify-center gap-1 text-[10px] text-sky-300 font-bold">
                  <Building2 className="w-3 h-3 text-sky-400" />
                  <span>Commercial/IT</span>
                </div>
                <div className="text-sm font-black text-white mt-0.5">{review.recommended_zoning.commercial_it_pct}%</div>
                <div className="text-[9px] text-sky-300 font-mono">{review.recommended_zoning.commercial_it_ha} ha</div>
              </div>

              <div className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-500/30">
                <div className="flex items-center justify-center gap-1 text-[10px] text-emerald-300 font-bold">
                  <Trees className="w-3 h-3 text-emerald-400" />
                  <span>Sponge Parks</span>
                </div>
                <div className="text-sm font-black text-white mt-0.5">{review.recommended_zoning.sponge_parks_pct}%</div>
                <div className="text-[9px] text-emerald-300 font-mono">{review.recommended_zoning.sponge_parks_ha} ha</div>
              </div>

              <div className="p-2 rounded-xl bg-amber-950/60 border border-amber-500/30">
                <div className="flex items-center justify-center gap-1 text-[10px] text-amber-300 font-bold">
                  <Sun className="w-3 h-3 text-amber-400" />
                  <span>Solar Microgrid</span>
                </div>
                <div className="text-sm font-black text-white mt-0.5">{review.recommended_zoning.renewable_microgrid_pct}%</div>
                <div className="text-[9px] text-amber-300 font-mono">{review.recommended_zoning.renewable_microgrid_ha} ha</div>
              </div>

              <div className="p-2 rounded-xl bg-purple-950/60 border border-purple-500/30">
                <div className="flex items-center justify-center gap-1 text-[10px] text-purple-300 font-bold">
                  <Bus className="w-3 h-3 text-purple-400" />
                  <span>Transit & Civic</span>
                </div>
                <div className="text-sm font-black text-white mt-0.5">{review.recommended_zoning.transit_civic_pct}%</div>
                <div className="text-[9px] text-purple-300 font-mono">{review.recommended_zoning.transit_civic_ha} ha</div>
              </div>
            </div>

            <p className="text-[11px] text-slate-300 italic bg-white/5 p-2.5 rounded-xl border border-white/5">
              "{review.recommended_zoning.rationale}"
            </p>
          </div>

          {/* 3. Something Extra #2: Phased CapEx Infrastructure Roadmap */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              <Milestone className="w-3.5 h-3.5 text-amber-400" />
              <span>Phased Infrastructure CapEx Roadmap (2026 – 2050)</span>
            </span>

            <div className="space-y-2.5">
              {review.phased_roadmap.map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-800/80 border border-white/10 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-600/60 text-[10px] font-black flex items-center justify-center text-blue-200">
                        {idx + 1}
                      </span>
                      <span>{item.phase}</span>
                    </span>
                    <span className="text-[10px] font-mono text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/30">
                      {item.years} ({item.estimated_capex_share_pct}% CapEx)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300">{item.focus}</p>
                  <ul className="text-[10px] text-slate-400 space-y-0.5 list-disc list-inside">
                    {item.key_interventions.map((act, actIdx) => (
                      <li key={actIdx}>{act}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Something Extra #3: Space-Grounded Climate Resilience */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Space-Sensor Climate Resilience Countermeasures</span>
            </span>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {review.climate_resilience_playbook.map((resItem, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-800/80 border border-white/10 space-y-1">
                  <div className="text-[10px] font-bold text-emerald-300">{resItem.domain}</div>
                  <div className="text-[9.5px] text-rose-300 font-semibold line-clamp-2">Threat: {resItem.threat}</div>
                  <div className="text-[9.5px] text-slate-200 line-clamp-3">Plan: {resItem.countermeasure}</div>
                  <div className="text-[8.5px] text-cyan-400 font-mono pt-1">Sensor: {resItem.space_sensor}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. Something Extra #4: Interactive Copilot QA / Ask Gemini */}
      <div className="p-4 rounded-2xl bg-indigo-950/60 border border-indigo-500/30 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black uppercase tracking-wider text-blue-300 flex items-center gap-1.5">
            <Bot className="w-3.5 h-3.5 text-blue-400" />
            <span>Ask Gemini About Site {activeSite.code}</span>
          </span>
          <span className="text-[9px] text-slate-400">Grounded in ISRO Space Portals</span>
        </div>

        {/* Quick Prompts */}
        <div className="flex flex-wrap gap-1.5">
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => {
                setUserQuery(q);
                handleRunReview(q);
              }}
              className="text-[10px] px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer border border-white/10"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={handleAskQuestion} className="flex gap-2">
          <input
            type="text"
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            placeholder={`Ask a strategic planning question for Site ${activeSite.code}...`}
            className="flex-1 bg-slate-900/90 border border-indigo-500/40 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isQuerying || !userQuery.trim()}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
          >
            {isQuerying ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            <span>Ask</span>
          </button>
        </form>

        {/* Custom Answer Output */}
        {customAnswer && (
          <div className="p-3 rounded-xl bg-slate-900/90 border border-blue-500/40 text-xs text-slate-200 leading-relaxed animate-in fade-in">
            <span className="font-bold text-blue-400 block mb-1">Gemini Planning Advisory:</span>
            {customAnswer}
          </div>
        )}
      </div>
    </div>
  );
};
