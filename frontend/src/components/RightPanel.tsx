import React from 'react';
import {
  Activity,
  GitCompare,
  TrendingUp,
  Database,
  FileText,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
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
  isOpen?: boolean;
  onToggleOpen?: () => void;
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
  isOpen = true,
  onToggleOpen,
}) => {
  const tabs = [
    { id: 'scorecard' as RightPanelTab, label: 'Scorecard', icon: Activity },
    {
      id: 'compare' as RightPanelTab,
      label: 'Compare',
      icon: GitCompare,
      badge: compareResult.isTie ? 'Tie' : undefined,
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

  if (!isOpen) {
    return (
      <div className="no-print h-full bg-[#07111F] border-l border-white/[0.08] flex flex-col items-center py-4 px-1 z-20">
        <button
          onClick={onToggleOpen}
          className="p-2 rounded-xl bg-[#0D1928] hover:bg-[#111F30] border border-white/[0.08] text-[#22D3EE] transition-all"
          title="Expand Analytics"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <aside className="right-panel w-[480px] xl:w-[540px] h-full bg-[#07111F] border-l border-white/[0.08] flex flex-col shrink-0 overflow-hidden shadow-2xl z-20 font-sans">
      {/* Tab Navigation Header with Collapse button */}
      <div className="right-panel-tabs no-print h-12 bg-[#0D1928] border-b border-white/[0.08] px-3 flex items-center justify-between shrink-0 overflow-x-auto">
        <div className="flex items-center space-x-1 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onChangeTab(tab.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#17283A] text-[#22D3EE] border border-[#22D3EE]/30 shadow-sm'
                    : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#111F30]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`px-1.5 py-0.2 text-[9px] rounded-full font-mono font-bold ${
                      isActive
                        ? 'bg-[#22D3EE]/20 text-[#22D3EE]'
                        : 'bg-[#111F30] text-[#94A3B8]'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {onToggleOpen && (
          <button
            onClick={onToggleOpen}
            className="p-1 rounded text-[#94A3B8] hover:text-[#F1F5F9] ml-2 shrink-0"
            title="Collapse Panel"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Tab Content Body */}
      <div className="flex-1 overflow-y-auto p-4 bg-[#07111F]">
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
