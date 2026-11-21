import React, { useState, useEffect, useCallback } from 'react';
import { AppNavbar } from './components/layout/AppNavbar';
import { AppSidebar, NavPageId } from './components/layout/AppSidebar';
import { LandingPage } from './components/landing/LandingPage';
import { OverviewDashboard } from './components/overview/OverviewDashboard';
import { LeftPanel } from './components/LeftPanel';
import { MapView } from './components/MapView';
import { RightPanel, RightPanelTab } from './components/RightPanel';
import { CityDesignerWorkspace } from './components/designer/CityDesignerWorkspace';
import { FutureSimulationDashboard } from './components/simulation/FutureSimulationDashboard';
import { IsroDataHub } from './components/isro/IsroDataHub';
import { TerraTerrainAI } from './components/modules/TerraTerrainAI';
import { TerraSoilAI } from './components/modules/TerraSoilAI';
import { TerraWaterAI } from './components/modules/TerraWaterAI';
import { TerraClimateAI } from './components/modules/TerraClimateAI';
import { TerraEnergyAI } from './components/modules/TerraEnergyAI';
import { TerraVegetationAI } from './components/modules/TerraVegetationAI';
import { TerraAdvisorChat } from './components/assistant/TerraAdvisorChat';
import { ReportsView } from './components/reports/ReportsView';
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
  // Navigation & View State
  const [viewMode, setViewMode] = useState<'landing' | 'app'>('landing');
  const [activePage, setActivePage] = useState<NavPageId>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
  const [isAssumptionsOpen, setIsAssumptionsOpen] = useState(false);

  // GIS Map Panel Toggles
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);

  // Core Spatial State
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
  const [activeRightTab, setActiveRightTab] = useState<RightPanelTab>('scorecard');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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

  // Sync theme with document element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Recalculate analysis
  const executeAnalysis = useCallback(async () => {
    setIsAnalyzing(true);

    try {
      // Analyze all 3 candidate sites
      const cardA = await ApiClient.analyzeSite(selectedRegionId, 'A', priorityPreset, assumptions);
      const cardB = await ApiClient.analyzeSite(selectedRegionId, 'B', priorityPreset, assumptions);
      const cardC = await ApiClient.analyzeSite(selectedRegionId, 'C', priorityPreset, assumptions);

      const newScorecards: Record<string, SiteScorecard> = {
        [candidateSites.find((s) => s.code === 'A')?.id || 'site_a']: cardA,
        [candidateSites.find((s) => s.code === 'B')?.id || 'site_b']: cardB,
        [candidateSites.find((s) => s.code === 'C')?.id || 'site_c']: cardC,
      };

      setScorecards(newScorecards);

      // Multi-site comparison
      const comp = await ApiClient.compareSites(selectedRegionId, priorityPreset, scenarioPreset, assumptions);
      setCompareResult(comp);

      // Water balance stress test for active site
      const activeSiteId = candidateSites.find((s) => s.code === selectedSiteCode)?.id || 'site_a';
      const stress = await ApiClient.runStressTest(
        activeSiteId,
        selectedRegionId,
        horizon,
        targetPopulation,
        scenarioPreset,
        assumptions
      );
      setStressTestResult(stress);
    } catch (err) {
      console.error('Analysis execution error:', err);
    } finally {
      setTimeout(() => {
        setIsAnalyzing(false);
      }, 300);
    }
  }, [
    selectedRegionId,
    candidateSites,
    selectedSiteCode,
    priorityPreset,
    scenarioPreset,
    assumptions,
    targetPopulation,
    horizon,
  ]);

  // Run analysis when parameters change
  useEffect(() => {
    executeAnalysis();
  }, [selectedRegionId, priorityPreset, scenarioPreset, horizon, targetPopulation, assumptions]);

  // Handle region switch
  const handleSelectRegion = (regionId: RegionId) => {
    if (regionId === selectedRegionId) return;
    setSelectedRegionId(regionId);
    const newReg = regions.find((r) => r.id === regionId);
    if (newReg) {
      setCandidateSites(newReg.candidateSites);
      setSelectedSiteCode('A');
    }
  };

  // Reset Demo Sites
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

  // Navigate helper
  const handleNavigate = (page: NavPageId) => {
    setViewMode('app');
    setActivePage(page);
  };

  // If in Landing Page mode, render Landing Page
  if (viewMode === 'landing') {
    return (
      <LandingPage
        onStartPlanning={() => {
          setViewMode('app');
          setActivePage('overview');
        }}
        onExploreModule={(mod) => {
          setViewMode('app');
          setActivePage(mod as NavPageId);
        }}
      />
    );
  }

  return (
    <div className="app-container flex flex-col h-screen w-screen bg-[#07111F] text-[#F1F5F9] overflow-hidden font-sans select-none">
      {/* 1. Top Navigation Bar */}
      <AppNavbar
        currentRegion={currentRegion}
        regions={regions}
        onSelectRegion={handleSelectRegion}
        candidateSites={candidateSites}
        selectedSiteCode={selectedSiteCode}
        onSelectSiteCode={setSelectedSiteCode}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        onOpenLanding={() => setViewMode('landing')}
        onOpenAdvisor={() => setIsAdvisorOpen(true)}
        onOpenAssumptions={() => setIsAssumptionsOpen(true)}
        health={health}
        activePage={activePage}
      />

      {/* 2. Main Body with Sidebar + Active Page Canvas */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Global App Sidebar */}
        <AppSidebar
          activePage={activePage}
          onSelectPage={setActivePage}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Page Content View Router */}
        <div className="flex-1 h-full overflow-hidden relative flex">
          {/* Overview Dashboard */}
          {activePage === 'overview' && (
            <OverviewDashboard
              currentRegion={currentRegion}
              candidateSites={candidateSites}
              selectedSiteCode={selectedSiteCode}
              onSelectSiteCode={setSelectedSiteCode}
              onNavigate={handleNavigate}
              scorecards={scorecards}
            />
          )}

          {/* Site Selection: Full Interactive GIS Map Experience */}
          {activePage === 'site_selection' && (
            <div className="flex flex-1 h-full w-full overflow-hidden relative">
              {/* Collapsible Left Parameter Panel */}
              <LeftPanel
                regions={regions}
                selectedRegionId={selectedRegionId}
                onSelectRegion={handleSelectRegion}
                candidateSites={candidateSites}
                selectedSiteCode={selectedSiteCode}
                onSelectSiteCode={setSelectedSiteCode}
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
                isOpen={isLeftPanelOpen}
                onToggleOpen={() => setIsLeftPanelOpen(!isLeftPanelOpen)}
              />

              {/* Center Interactive Map Canvas */}
              <main className="map-container flex-1 h-full relative overflow-hidden">
                <MapView
                  currentRegion={currentRegion}
                  candidateSites={candidateSites}
                  onUpdateCandidateSites={setCandidateSites}
                  selectedSiteCode={selectedSiteCode}
                  onSelectSiteCode={setSelectedSiteCode}
                  scorecards={scorecards}
                  layerOverlays={layerOverlays}
                  onToggleLayer={handleToggleLayer}
                  isLeftPanelOpen={isLeftPanelOpen}
                  onToggleLeftPanel={() => setIsLeftPanelOpen(!isLeftPanelOpen)}
                  isRightPanelOpen={isRightPanelOpen}
                  onToggleRightPanel={() => setIsRightPanelOpen(!isRightPanelOpen)}
                />
              </main>

              {/* Collapsible Right Analysis Panel */}
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
                activeTab={activeRightTab}
                onChangeTab={setActiveRightTab}
                isOpen={isRightPanelOpen}
                onToggleOpen={() => setIsRightPanelOpen(!isRightPanelOpen)}
              />
            </div>
          )}

          {/* AI City Master-Plan Designer (Signature Page) */}
          {activePage === 'city_designer' && (
            <CityDesignerWorkspace
              currentRegion={currentRegion}
              candidateSites={candidateSites}
              selectedSiteCode={selectedSiteCode}
              onSelectSiteCode={setSelectedSiteCode}
            />
          )}

          {/* Future Decadal Simulation */}
          {activePage === 'simulation' && (
            <FutureSimulationDashboard currentRegion={currentRegion} />
          )}

          {/* ISRO Space Data Hub */}
          {activePage === 'isro_hub' && <IsroDataHub health={health} />}

          {/* Specialized Intelligence Modules */}
          {activePage === 'terrain' && (
            <TerraTerrainAI
              currentRegion={currentRegion}
              candidateSites={candidateSites}
              selectedSiteCode={selectedSiteCode}
              onSelectSiteCode={setSelectedSiteCode}
            />
          )}

          {activePage === 'soil' && (
            <TerraSoilAI
              currentRegion={currentRegion}
              candidateSites={candidateSites}
              selectedSiteCode={selectedSiteCode}
              onSelectSiteCode={setSelectedSiteCode}
            />
          )}

          {activePage === 'water' && (
            <TerraWaterAI
              currentRegion={currentRegion}
              candidateSites={candidateSites}
              selectedSiteCode={selectedSiteCode}
              onSelectSiteCode={setSelectedSiteCode}
            />
          )}

          {activePage === 'climate' && (
            <TerraClimateAI
              currentRegion={currentRegion}
              candidateSites={candidateSites}
              selectedSiteCode={selectedSiteCode}
              onSelectSiteCode={setSelectedSiteCode}
            />
          )}

          {activePage === 'energy' && (
            <TerraEnergyAI
              currentRegion={currentRegion}
              candidateSites={candidateSites}
              selectedSiteCode={selectedSiteCode}
              onSelectSiteCode={setSelectedSiteCode}
            />
          )}

          {activePage === 'vegetation' && (
            <TerraVegetationAI
              currentRegion={currentRegion}
              candidateSites={candidateSites}
              selectedSiteCode={selectedSiteCode}
              onSelectSiteCode={setSelectedSiteCode}
            />
          )}

          {/* Reports & Export View */}
          {activePage === 'reports' && (
            <ReportsView
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

          {/* Dedicated Assistant Page */}
          {activePage === 'assistant' && (
            <TerraAdvisorChat
              currentRegion={currentRegion}
              onNavigate={handleNavigate}
            />
          )}
        </div>
      </div>

      {/* Floating TerraAdvisor Drawer (available anywhere) */}
      {isAdvisorOpen && (
        <TerraAdvisorChat
          currentRegion={currentRegion}
          isFloating={true}
          onClose={() => setIsAdvisorOpen(false)}
          onNavigate={(page) => {
            handleNavigate(page);
            setIsAdvisorOpen(false);
          }}
        />
      )}

      {/* Slide-over Modeling Assumptions Drawer */}
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
