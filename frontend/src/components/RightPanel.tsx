import React, { useState } from 'react';
import {
  Activity,
  GitCompare,
  TrendingUp,
  Database,
  FileText,
  AlertTriangle,
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
      badge: compareResult.isTie ? 'Tie Check' : undefined,
    },
    {
      id: 'stress' as RightPanelTab,
      label: 'Stress Test',
      icon: TrendingUp,
      badge: `${stressTestResult.stressIndex.toFixed(2)}`,
    },
    { id: 'sources' as RightPanelTab, label: 'Sources', icon: Database, badge: '4 Portals' },
    { id: 'report' as RightPanelTab, label: 'Report', icon: FileText },
  ];

  return (
    <aside className="w-[480px] xl:w-[540px] h-full bg-slate-900 border-l border-slate-800 flex flex-col shrink-0 overflow-hidden shadow-2xl z-20">
      {/* Tab Navigation Header */}
      <div className="h-12 bg-slate-900/90 border-b border-slate-800 px-3 flex items-center space-x-1 shrink-0 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-950/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`px-1.5 py-0.2 text-[9px] rounded-full font-mono font-bold ${
                    isActive
                      ? 'bg-sky-800 text-sky-200'
                      : tab.badge === 'Tie Check'
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content Body */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'scorecard' && (
          <ScorecardTab
            scorecards={scorecards}
            candidateSites={candidateSites}
            selectedSiteCode={selectedSiteCode}
            onSelectSiteCode={onSelectSiteCode}
            priorityPreset={priorityPreset}
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
