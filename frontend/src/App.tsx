import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronRight, SlidersHorizontal } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { LeftPanel } from './components/LeftPanel';
import { MapView } from './components/MapView';
import { RightPanel, RightPanelTab } from './components/RightPanel';
import { AssumptionsDrawer } from './components/AssumptionsDrawer';
import {
  Region,
  RegionId,
  PriorityPreset,
  ScenarioPreset,
  CandidateSite,
  SiteScorecard,
  CompareResult,
  StressTestResponse,
  ProvenanceRecord,
  Assumptions,
  LayerOverlay,
} from './types';
import {
  DEMO_REGIONS,
  DEFAULT_ASSUMPTIONS,
  PROVENANCE_RECORDS,
  LAYER_OVERLAYS,
  generateSiteScorecard,
  generateCompareResult,
  generateStressTest,
} from './data/mockData';
import { ApiClient, HealthStatus } from './lib/api';

export function App() {
  // 1. Core State
  const [regions, setRegions] = useState<Region[]>(DEMO_REGIONS);
  const [selectedRegionId, setSelectedRegionId] = useState<RegionId>('up_jewar');
  const currentRegion = regions.find((r) => r.id === selectedRegionId) || regions[0];

  const [candidateSites, setCandidateSites] = useState<CandidateSite[]>(currentRegion.candidateSites);
  const [selectedSiteCode, setSelectedSiteCode] = useState<'A' | 'B' | 'C'>('A');

  const [targetPopulation, setTargetPopulation] = useState<number>(450000);
  const [horizon, setHorizon] = useState<2035 | 2050>(2050);
  const [priorityPreset, setPriorityPreset] = useState<PriorityPreset>('balanced');
  const [scenarioPreset, setScenarioPreset] = useState<ScenarioPreset>('baseline');
  const [assumptions, setAssumptions] = useState<Assumptions>(DEFAULT_ASSUMPTIONS);

  const [layerOverlays, setLayerOverlays] = useState<LayerOverlay[]>(LAYER_OVERLAYS);
  const [activeTab, setActiveTab] = useState<RightPanelTab>('scorecard');
  const [isAssumptionsOpen, setIsAssumptionsOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLeftPanelCollapsed, setIsLeftPanelCollapsed] = useState(false);

  // Health and connection state
  const [health, setHealth] = useState<HealthStatus>({
    status: 'healthy',
    mode: 'offline_fixtures',
    version: '1.0.0',
    fourPortalsConnected: true,
  });

  // Analysis results
  const [scorecards, setScorecards] = useState<Record<string, SiteScorecard>>({});
  const [compareResult, setCompareResult] = useState<CompareResult>(() =>
    generateCompareResult('up_jewar', 'balanced', 'baseline', DEFAULT_ASSUMPTIONS)
  );
  const [stressTestResult, setStressTestResult] = useState<StressTestResponse>(() =>
    generateStressTest('site_a', 'up_jewar', 2050, 450000, 'baseline', DEFAULT_ASSUMPTIONS)
  );
  const [provenanceRecords, setProvenanceRecords] = useState<ProvenanceRecord[]>(PROVENANCE_RECORDS);

  // Check API health on load
  useEffect(() => {
    ApiClient.checkHealth().then((status) => {
      setHealth(status);
    });
  }, []);

  // Track active region ref to avoid stale async state under rapid switching
  const selectedRegionIdRef = useRef(selectedRegionId);
  selectedRegionIdRef.current = selectedRegionId;

  // Recalculate analysis
  const executeAnalysis = useCallback(async (overrideSites?: CandidateSite[]) => {
    const requestRegion = selectedRegionIdRef.current;
    setIsAnalyzing(true);

    try {
      const sitesToUse = overrideSites || candidateSites;
      // Analyze all 3 candidate sites (including any custom drawn areas)
      const siteA = sitesToUse.find((s) => s.code === 'A');
      const siteB = sitesToUse.find((s) => s.code === 'B');
      const siteC = sitesToUse.find((s) => s.code === 'C');

      const cardA = await ApiClient.analyzeSite(requestRegion, 'A', priorityPreset, assumptions, siteA);
      const cardB = await ApiClient.analyzeSite(requestRegion, 'B', priorityPreset, assumptions, siteB);
      const cardC = await ApiClient.analyzeSite(requestRegion, 'C', priorityPreset, assumptions, siteC);

      // Guard against race conditions if user switched regions while requests were in flight
      if (requestRegion !== selectedRegionIdRef.current) return;

      const newScorecards: Record<string, SiteScorecard> = {
        [siteA?.id || 'site_a']: cardA,
        [siteB?.id || 'site_b']: cardB,
        [siteC?.id || 'site_c']: cardC,
        A: cardA,
        B: cardB,
        C: cardC,
      };

      setScorecards(newScorecards);

      // Multi-site comparison with user's active sites
      const comp = await ApiClient.compareSites(requestRegion, priorityPreset, scenarioPreset, assumptions, sitesToUse);
      if (requestRegion !== selectedRegionIdRef.current) return;
      setCompareResult(comp);

      // Water balance stress test for active site
      const activeSite = sitesToUse.find((s) => s.code === selectedSiteCode) || siteA;
      const stress = await ApiClient.runStressTest(
        activeSite?.id || 'site_a',
        requestRegion,
        horizon,
        targetPopulation,
        scenarioPreset,
        assumptions,
        activeSite
      );
      if (requestRegion !== selectedRegionIdRef.current) return;
      setStressTestResult(stress);
    } catch (err) {
      console.error('Analysis execution error:', err);
    } finally {
      setTimeout(() => {
        setIsAnalyzing(false);
      }, 300);
    }
  }, [
    candidateSites,
    selectedSiteCode,
    priorityPreset,
    scenarioPreset,
    assumptions,
    targetPopulation,
    horizon,
  ]);

  // Handle immediate update and instant rescore when user draws on the map
  const handleUpdateCandidateSites = useCallback((updatedSites: CandidateSite[]) => {
    setCandidateSites(updatedSites);
    executeAnalysis(updatedSites);
  }, [executeAnalysis]);

  // Run analysis when parameters change
  useEffect(() => {
    executeAnalysis();
  }, [selectedRegionId, priorityPreset, scenarioPreset, horizon, targetPopulation, assumptions]);

  // Handle region switch
  const handleSelectRegion = (regionId: RegionId) => {
    if (regionId === selectedRegionId) return;
    const newReg = regions.find((r) => r.id === regionId);
    setSelectedRegionId(regionId);
    if (newReg) {
      setCandidateSites(newReg.candidateSites);
      setSelectedSiteCode('A');
      executeAnalysis(newReg.candidateSites);
    }
  };

  // 1-Click Load Preset Sites
  const handleLoadPresetSites = () => {
    const reg = regions.find((r) => r.id === selectedRegionId);
    if (reg) {
      setCandidateSites(reg.candidateSites);
      setSelectedSiteCode('A');
      executeAnalysis();
    }
  };

  // Toggle Layer Overlay Visibility
  const handleToggleLayer = (layerId: LayerOverlay['id']) => {
    setLayerOverlays((prev) =>
      prev.map((l) => (l.id === layerId ? { ...l, visible: !l.visible } : l))
    );
  };

  return (
    <div className="app-container flex flex-col h-screen w-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      {/* Top Navigation Bar */}
      <Navbar
        currentRegion={currentRegion}
        priorityPreset={priorityPreset}
        scenarioPreset={scenarioPreset}
        health={health}
        onOpenAssumptions={() => setIsAssumptionsOpen(true)}
        onOpenReport={() => setActiveTab('report')}
        onOpenAiReview={() => {
          setActiveTab('scorecard');
          setTimeout(() => {
            const el = document.getElementById('gemini-ai-review');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 150);
        }}
      />

      {/* Main 3-Column Layout */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Column: Parameter & Scenario Controls (Collapsible) */}
        <div
          className={`transition-all duration-300 ease-in-out shrink-0 h-full overflow-hidden ${
            isLeftPanelCollapsed ? 'w-0 opacity-0 pointer-events-none' : 'w-80 opacity-100'
          }`}
        >
          <LeftPanel
            isCollapsed={isLeftPanelCollapsed}
            onToggleCollapse={() => setIsLeftPanelCollapsed(!isLeftPanelCollapsed)}
            regions={regions}
            selectedRegionId={selectedRegionId}
            onSelectRegion={handleSelectRegion}
            candidateSites={candidateSites}
            onLoadCandidateSites={handleLoadPresetSites}
            targetPopulation={targetPopulation}
            onChangeTargetPopulation={setTargetPopulation}
            horizon={horizon}
            onChangeHorizon={setHorizon}
            priorityPreset={priorityPreset}
            onChangePriorityPreset={setPriorityPreset}
            scenarioPreset={scenarioPreset}
            onChangeScenarioPreset={setScenarioPreset}
            onRunAnalysis={executeAnalysis}
            isAnalyzing={isAnalyzing}
          />
        </div>

        {/* Center Canvas: Leaflet Map with Geoman Drawing & Overlays */}
        <main className="map-container flex-1 h-full relative overflow-hidden">
          {/* Floating Expand Left Panel Tab Button (When Minimized) */}
          {isLeftPanelCollapsed && (
            <button
              onClick={() => setIsLeftPanelCollapsed(false)}
              className="absolute top-1/2 -translate-y-1/2 left-0 z-30 bg-white/95 backdrop-blur-md border border-slate-200 border-l-0 py-3.5 px-2 rounded-r-2xl shadow-xl hover:bg-blue-50 text-slate-700 hover:text-blue-600 transition-all cursor-pointer flex flex-col items-center gap-1.5 group"
              title="Expand Parameters Panel"
            >
              <ChevronRight className="w-4 h-4 text-blue-600 group-hover:scale-125 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-wider [writing-mode:vertical-rl] text-slate-600 group-hover:text-blue-600">
                Parameters
              </span>
            </button>
          )}

          <MapView
            currentRegion={currentRegion}
            candidateSites={candidateSites}
            onUpdateCandidateSites={handleUpdateCandidateSites}
            selectedSiteCode={selectedSiteCode}
            onSelectSiteCode={setSelectedSiteCode}
            scorecards={scorecards}
            layerOverlays={layerOverlays}
            onToggleLayer={handleToggleLayer}
            isLeftPanelCollapsed={isLeftPanelCollapsed}
          />
        </main>

        {/* Right Column: 5 Tabbed Panes (Scorecard, Compare, Stress Test, Sources, Report) */}
        <RightPanel
          currentRegion={currentRegion}
          candidateSites={candidateSites}
          selectedSiteCode={selectedSiteCode}
          onSelectSiteCode={setSelectedSiteCode}
          scorecards={scorecards}
          compareResult={compareResult}
          stressTestResult={stressTestResult}
          provenanceRecords={provenanceRecords}
          priorityPreset={priorityPreset}
          scenarioPreset={scenarioPreset}
          targetPopulation={targetPopulation}
          horizon={horizon}
          activeTab={activeTab}
          onChangeTab={setActiveTab}
        />
      </div>

      {/* Slide-over Assumptions & Coefficients Drawer */}
      <AssumptionsDrawer
        isOpen={isAssumptionsOpen}
        onClose={() => setIsAssumptionsOpen(false)}
        assumptions={assumptions}
        onUpdateAssumptions={setAssumptions}
      />
    </div>
  );
}

export default App;
