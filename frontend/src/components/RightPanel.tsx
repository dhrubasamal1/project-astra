import React from 'react';
import {
  Activity,
  GitCompare,
  TrendingUp,
  Database,
  FileText,
} from 'lucide-react';
import {
  SiteScorecard,
  CompareResult,
  StressTestResponse,
  ProvenanceRecord,
  CandidateSite,
  PriorityPreset,
  ScenarioPreset,
  Region,
} from '../types';
import { ScorecardTab } from './ScorecardTab';
import { CompareTab } from './CompareTab';
import { StressTestTab } from './StressTestTab';
import { SourcesTab } from './SourcesTab';
import { ReportTab } from './ReportTab';

export type RightPanelTab = 'scorecard' | 'compare' | 'stress' | 'sources' | 'report';

interface RightPanelProps {
  currentRegion: Region;
  candidateSites: CandidateSite[];
  selectedSiteCode: 'A' | 'B' | 'C';
  onSelectSiteCode: (code: 'A' | 'B' | 'C') => void;
  scorecards: Record<string, SiteScorecard>;
  compareResult: CompareResult;
  stressTestResult: StressTestResponse;
  provenanceRecords: ProvenanceRecord[];
  priorityPreset: PriorityPreset;
  scenarioPreset: ScenarioPreset;
  targetPopulation: number;
  horizon: 2035 | 2050;
  activeTab: RightPanelTab;
  onChangeTab: (tab: RightPanelTab) => void;
}

export const RightPanel: React.FC<RightPanelProps> = ({
  currentRegion,
  candidateSites,
  selectedSiteCode,
  onSelectSiteCode,
  scorecards,
  compareResult,
  stressTestResult,
  provenanceRecords,
  priorityPreset,
  scenarioPreset,
  targetPopulation,
  horizon,
  activeTab,
  onChangeTab,
}) => {
  const tabs = [
    { id: 'scorecard' as RightPanelTab, label: 'Scorecard', icon: Activity },
    {
      id: 'compare' as RightPanelTab,
      label: 'Compare',
      icon: GitCompare,
      hasDot: compareResult.isTie,
      dotTooltip: 'Tie Check: Sites within 1.5 pts',
    },
    { id: 'stress' as RightPanelTab, label: 'Stress', icon: TrendingUp },
    { id: 'sources' as RightPanelTab, label: 'Sources', icon: Database },
    { id: 'report' as RightPanelTab, label: 'Report', icon: FileText },
  ];

  return (
    <aside className="right-panel w-[480px] lg:w-[495px] xl:w-[540px] h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col shrink-0 overflow-hidden shadow-sm z-20">
      {/* Floating Pill Tabs Bar */}
      <div className="right-panel-tabs no-print px-2.5 sm:px-3 py-2.5 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 shrink-0">
        <div className="bg-slate-100/90 dark:bg-slate-800/90 p-1 rounded-full border border-slate-200/80 dark:border-slate-700/80 grid grid-cols-5 gap-1 shadow-xs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onChangeTab(tab.id)}
                className={`w-full flex items-center justify-center gap-1 sm:gap-1.5 py-1.5 px-1 sm:px-1.5 rounded-full text-[11px] xl:text-xs font-bold transition-all cursor-pointer select-none tracking-tight ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700/60 font-semibold'
                }`}
                title={tab.id === 'stress' ? `Stress Test (Water Balance: ${stressTestResult.stressIndex.toFixed(2)} Index)` : tab.label}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{tab.label}</span>
                {tab.hasDot && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      isActive ? 'bg-amber-300' : 'bg-amber-500 animate-pulse'
                    }`}
                    title={tab.dotTooltip}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content Body */}
      <div className="flex-1 overflow-y-auto p-5 bg-slate-50/50 dark:bg-slate-900/50">
        {activeTab === 'scorecard' && (
          <ScorecardTab
            regionId={currentRegion.id}
            scorecards={scorecards}
            candidateSites={candidateSites}
            selectedSiteCode={selectedSiteCode}
            onSelectSiteCode={onSelectSiteCode}
            priorityPreset={priorityPreset}
            waterStressIndex={stressTestResult.stressIndex}
            targetPopulation={targetPopulation}
            horizonYear={horizon}
          />
        )}

        {activeTab === 'compare' && (
          <CompareTab
            compareResult={compareResult}
            priorityPreset={priorityPreset}
            regionId={currentRegion.id}
          />
        )}

        {activeTab === 'stress' && <StressTestTab stressData={stressTestResult} />}

        {activeTab === 'sources' && <SourcesTab provenanceRecords={provenanceRecords} />}

        {activeTab === 'report' && (
          <ReportTab
            currentRegion={currentRegion}
            candidateSites={candidateSites}
            scorecards={scorecards}
            compareResult={compareResult}
            stressTestResult={stressTestResult}
            priorityPreset={priorityPreset}
            scenarioPreset={scenarioPreset}
            targetPopulation={targetPopulation}
            horizon={horizon}
          />
        )}
      </div>
    </aside>
  );
};
