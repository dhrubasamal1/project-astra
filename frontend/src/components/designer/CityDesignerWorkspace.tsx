import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Building2,
  Sparkles,
  Sliders,
  RotateCcw,
  RotateCw,
  GitCompare,
  Download,
  Save,
  CheckCircle2,
  Layers,
  MapPin,
  TrendingUp,
  Droplets,
  Zap,
  Trees,
  Send,
  X,
  Plus,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Info,
  Check,
  AlertCircle,
} from 'lucide-react';
import {
  MasterPlanLayout,
  MasterPlanZone,
  DEMO_MASTER_PLANS,
} from '../../data/intelligenceData';
import { CandidateSite, Region } from '../../types';

interface CityDesignerWorkspaceProps {
  currentRegion: Region;
  candidateSites: CandidateSite[];
  selectedSiteCode: 'A' | 'B' | 'C';
  onSelectSiteCode: (code: 'A' | 'B' | 'C') => void;
}

export const CityDesignerWorkspace: React.FC<CityDesignerWorkspaceProps> = ({
  currentRegion,
  candidateSites,
  selectedSiteCode,
  onSelectSiteCode,
}) => {
  // Master plan state
  const [activeLayout, setActiveLayout] = useState<MasterPlanLayout>(DEMO_MASTER_PLANS.layout_a);
  const [layoutHistory, setLayoutHistory] = useState<MasterPlanLayout[]>([DEMO_MASTER_PLANS.layout_a]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Configuration inputs
  const [totalAreaAcres, setTotalAreaAcres] = useState<number>(500);
  const [targetPopulation, setTargetPopulation] = useState<number>(25000);
  const [developmentType, setDevelopmentType] = useState<string>('Eco-Tech Hub');
  const [priorityNetZero, setPriorityNetZero] = useState(true);
  const [priorityWaterNeutral, setPriorityWaterNeutral] = useState(true);
  const [priorityTransitOriented, setPriorityTransitOriented] = useState(true);

  // UI state
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [showConfigPanel, setShowConfigPanel] = useState(true);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  // AI Assistant Chat State
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiStreamingText, setAiStreamingText] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [aiMessages, setAiMessages] = useState<
    { role: 'user' | 'assistant'; text: string; timestamp: string }[]
  >([
    {
      role: 'assistant',
      text: 'TerraAdvisor Master-Plan Engine ready. I have initialized Layout Alpha for 500 acres with 34.5% biophilic green cover and 92% clean energy microgrid. What design parameters would you like to refine?',
      timestamp: 'Just now',
    },
  ]);

  // Leaflet map reference
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const zoningLayerGroupRef = useRef<L.FeatureGroup | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const activeSite = candidateSites.find((s) => s.code === selectedSiteCode) || candidateSites[0];
    const center = activeSite?.coordinates?.[0] || currentRegion.center;

    const map = L.map(mapContainerRef.current, {
      center: center,
      zoom: 14,
      zoomControl: false,
    });

    L.control.zoom({ position: 'topleft' }).addTo(map);

    // Dark Matter basemap
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; CARTO &copy; OpenStreetMap',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    zoningLayerGroupRef.current = L.featureGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Fly to site when site changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const activeSite = candidateSites.find((s) => s.code === selectedSiteCode);
    if (activeSite && activeSite.coordinates?.length) {
      const bounds = L.latLngBounds(activeSite.coordinates);
      map.fitBounds(bounds, { padding: [50, 50], duration: 0.8 });
    }
  }, [selectedSiteCode, candidateSites]);

  // Update map polygons when activeLayout or selectedZoneId changes
  useEffect(() => {
    if (!mapInstanceRef.current || !zoningLayerGroupRef.current) return;

    const group = zoningLayerGroupRef.current;
    group.clearLayers();

    activeLayout.zoning.forEach((zone) => {
      const isSelected = zone.id === selectedZoneId;
      const poly = L.polygon(zone.coordinates, {
        color: zone.color,
        weight: isSelected ? 3 : 1.5,
        fillColor: zone.color,
        fillOpacity: isSelected ? 0.65 : 0.4,
        dashArray: isSelected ? undefined : '4, 4',
      });

      // Tooltip
      poly.bindTooltip(
        `<div style="font-family: inherit; font-size: 11px;">
          <b style="color: ${zone.color};">${zone.name}</b><br/>
          <span>${zone.areaAcres} Acres (${zone.areaPct}%) • ${zone.density} Density</span>
        </div>`,
        { sticky: true, className: 'leaflet-site-label' }
      );

      poly.on('click', () => {
        setSelectedZoneId(zone.id);
      });

      poly.addTo(group);
    });

    if (activeLayout.zoning.length > 0 && group.getLayers().length > 0) {
      try {
        mapInstanceRef.current.fitBounds(group.getBounds(), { padding: [40, 40] });
      } catch {
        // bounds fit fallback
      }
    }
  }, [activeLayout, selectedZoneId]);

  // Push new layout to history
  const updateLayout = (newLayout: MasterPlanLayout) => {
    const updatedHistory = layoutHistory.slice(0, historyIndex + 1);
    updatedHistory.push(newLayout);
    setLayoutHistory(updatedHistory);
    setHistoryIndex(updatedHistory.length - 1);
    setActiveLayout(newLayout);
  };

  // Undo / Redo
  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setActiveLayout(layoutHistory[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < layoutHistory.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setActiveLayout(layoutHistory[historyIndex + 1]);
    }
  };

  // Generate / Regenerate Master Plan
  const handleGenerate = (customPrompt?: string) => {
    setIsGenerating(true);
    setTimeout(() => {
      // Toggle or synthesize layout variation
      const base = activeLayout.id === 'layout_a' ? DEMO_MASTER_PLANS.layout_b : DEMO_MASTER_PLANS.layout_a;
      const revised: MasterPlanLayout = {
        ...base,
        totalAreaAcres,
        totalPopulation: targetPopulation,
        id: `layout_${Date.now()}`,
        name: customPrompt ? `Adaptive Plan (${customPrompt.slice(0, 24)}...)` : base.name,
      };

      updateLayout(revised);
      setIsGenerating(false);
    }, 700);
  };

  // Handle AI Prompt Submission
  const handleAiSubmit = (e?: React.FormEvent, presetPrompt?: string) => {
    if (e) e.preventDefault();
    const promptText = presetPrompt || aiPrompt;
    if (!promptText.trim()) return;

    const userMsg = {
      role: 'user' as const,
      text: promptText,
      timestamp: 'Now',
    };

    setAiMessages((prev) => [...prev, userMsg]);
    setAiPrompt('');
    setIsAiThinking(true);

    // AI Streaming simulation
    let responseText = '';
    if (promptText.toLowerCase().includes('green')) {
      responseText =
        'Optimizing spatial allocation: Expanding Sector 3 Central Urban Forest by 35 acres (+7.0%) while streamlining the arterial road corridor footprint. Flood retention buffer along eastern edge increased to 150m. Water self-sufficiency raised to 94%.';
    } else if (promptText.toLowerCase().includes('solar') || promptText.toLowerCase().includes('energy')) {
      responseText =
        'Reconfiguring clean energy microgrid: Increased agrivoltaic capacity by 15MW and allocated a dedicated 120MWh Battery Energy Storage System (BESS) along the southern utility corridor. Net-zero balance now at 96.5%.';
    } else {
      responseText = `Synthesizing generative master plan responding to: "${promptText}". Rebalancing residential, commercial, and civic zoning layers to satisfy NBC 2016 and AMRUT 2.0 greenfield standards.`;
    }

    setTimeout(() => {
      setIsAiThinking(false);
      setAiMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: responseText,
          timestamp: 'Just now',
        },
      ]);
      handleGenerate(promptText);
    }, 900);
  };

  // Save Project
  const handleSave = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  // Export Plan to GeoJSON
  const handleExport = () => {
    const geojson = {
      type: 'FeatureCollection',
      properties: {
        projectName: activeLayout.name,
        totalAreaAcres: activeLayout.totalAreaAcres,
        totalPopulation: activeLayout.totalPopulation,
        greenCoverPct: activeLayout.greenCoverPct,
        renewableSharePct: activeLayout.renewableSharePct,
      },
      features: activeLayout.zoning.map((z) => ({
        type: 'Feature',
        properties: {
          id: z.id,
          name: z.name,
          category: z.category,
          areaAcres: z.areaAcres,
          areaPct: z.areaPct,
          density: z.density,
          description: z.description,
        },
        geometry: {
          type: 'Polygon',
          coordinates: [z.coordinates.map((pt) => [pt[1], pt[0]])],
        },
      })),
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(geojson, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${activeLayout.id}_master_plan.geojson`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const selectedZone = activeLayout.zoning.find((z) => z.id === selectedZoneId);

  return (
    <div className="flex flex-col h-full w-full bg-[#07111F] text-[#F1F5F9] overflow-hidden select-none relative">
      {/* 1. Top Action Toolbar & KPI Ribbon */}
      <div className="h-14 bg-[#0D1928] border-b border-white/[0.08] px-4 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-[#111F30] border border-[#22D3EE]/40 flex items-center justify-center text-[#22D3EE]">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-heading font-bold text-sm text-[#F1F5F9]">{activeLayout.name}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#22D3EE]/15 text-[#22D3EE] font-bold border border-[#22D3EE]/30">
                {activeLayout.totalAreaAcres} ACRES
              </span>
            </div>
            <p className="text-[10px] text-[#94A3B8] hidden sm:block truncate max-w-md">
              {activeLayout.scenario}
            </p>
          </div>
        </div>

        {/* Live KPI Badges */}
        <div className="hidden lg:flex items-center space-x-4 text-xs font-mono">
          <div className="px-2.5 py-1 rounded-lg bg-[#111F30] border border-white/[0.08]">
            <span className="text-[#94A3B8] mr-1.5 text-[10px]">POP:</span>
            <span className="text-[#F1F5F9] font-bold">{activeLayout.totalPopulation.toLocaleString()}</span>
          </div>
          <div className="px-2.5 py-1 rounded-lg bg-[#111F30] border border-[#34D399]/30">
            <span className="text-[#34D399] mr-1.5 text-[10px]">GREEN:</span>
            <span className="text-[#34D399] font-bold">{activeLayout.greenCoverPct}%</span>
          </div>
          <div className="px-2.5 py-1 rounded-lg bg-[#111F30] border border-[#FBBF24]/30">
            <span className="text-[#FBBF24] mr-1.5 text-[10px]">CLEAN:</span>
            <span className="text-[#FBBF24] font-bold">{activeLayout.renewableSharePct}%</span>
          </div>
          <div className="px-2.5 py-1 rounded-lg bg-[#111F30] border border-[#22D3EE]/30">
            <span className="text-[#22D3EE] mr-1.5 text-[10px]">WATER:</span>
            <span className="text-[#22D3EE] font-bold">{activeLayout.waterSelfSufficiencyPct}%</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          {/* Candidate Parcel Switcher */}
          <div className="flex items-center space-x-1 bg-[#111F30] border border-white/[0.08] p-1 rounded-xl">
            <span className="text-[10px] font-mono text-[#94A3B8] px-1 font-bold">PARCEL:</span>
            {candidateSites.map((site) => {
              const isSelected = site.code === selectedSiteCode;
              return (
                <button
                  key={site.id}
                  onClick={() => onSelectSiteCode(site.code)}
                  className={`px-2 py-0.5 rounded-lg text-xs font-mono font-bold transition-all ${
                    isSelected
                      ? 'bg-[#17283A] text-[#22D3EE] border border-[#22D3EE]/50 shadow-sm'
                      : 'text-[#94A3B8] hover:text-[#F1F5F9]'
                  }`}
                  title={`${site.name} (${(site.areaKm2 * 247.105).toFixed(0)} acres)`}
                >
                  Site {site.code}
                </button>
              );
            })}
          </div>

          {/* Undo / Redo */}
          <div className="flex items-center rounded-lg bg-[#111F30] border border-white/[0.08] p-0.5">
            <button
              onClick={handleUndo}
              disabled={historyIndex === 0}
              className="p-1.5 rounded text-[#94A3B8] hover:text-[#F1F5F9] disabled:opacity-30 disabled:hover:text-[#94A3B8]"
              title="Undo"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIndex >= layoutHistory.length - 1}
              className="p-1.5 rounded text-[#94A3B8] hover:text-[#F1F5F9] disabled:opacity-30 disabled:hover:text-[#94A3B8]"
              title="Redo"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Regenerate Button */}
          <button
            onClick={() => handleGenerate()}
            disabled={isGenerating}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#111F30] hover:bg-[#17283A] border border-[#22D3EE]/40 text-xs font-semibold text-[#22D3EE] transition-all"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Regenerate</span>
          </button>

          {/* Compare Layouts */}
          <button
            onClick={() => setShowCompareModal(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#111F30] hover:bg-[#17283A] border border-white/[0.08] text-xs font-medium text-[#F1F5F9] transition-all"
          >
            <GitCompare className="w-3.5 h-3.5 text-[#34D399]" />
            <span className="hidden sm:inline">Compare</span>
          </button>

          {/* Save */}
          <button
            onClick={handleSave}
            className="p-2 rounded-lg bg-[#111F30] hover:bg-[#17283A] border border-white/[0.08] text-[#94A3B8] hover:text-[#F1F5F9] transition-all"
            title="Save Project"
          >
            <Save className="w-4 h-4" />
          </button>

          {/* Export */}
          <button
            onClick={handleExport}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-[#22D3EE] hover:bg-[#38BDF8] text-[#07111F] text-xs font-heading font-bold shadow-sm transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export GeoJSON</span>
          </button>
        </div>
      </div>

      {/* Save Toast Notification */}
      {saveToast && (
        <div className="absolute top-16 right-4 z-50 p-3 rounded-xl bg-[#111F30] border border-[#34D399] shadow-2xl flex items-center space-x-2 animate-in fade-in zoom-in-95">
          <CheckCircle2 className="w-4 h-4 text-[#34D399]" />
          <span className="text-xs font-semibold text-[#F1F5F9]">Project layout saved successfully!</span>
        </div>
      )}

      {/* 2. Main Workspace (Left Config Drawer + Center Canvas + Floating Assistant) */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left: Configuration & Zoning Palette Panel */}
        <aside
          className={`h-full bg-[#0D1928] border-r border-white/[0.08] flex flex-col shrink-0 transition-all duration-300 z-10 ${
            showConfigPanel ? 'w-80' : 'w-10'
          }`}
        >
          {showConfigPanel ? (
            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
                <span className="text-xs font-bold text-[#F1F5F9] flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-[#22D3EE]" />
                  <span>Planning Parameters</span>
                </span>
                <button
                  onClick={() => setShowConfigPanel(false)}
                  className="p-1 rounded text-[#94A3B8] hover:text-[#F1F5F9]"
                  title="Collapse panel"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>

              {/* Sliders: Area & Population */}
              <div className="space-y-3 bg-[#111F30] p-3 rounded-xl border border-white/[0.08]">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-[#94A3B8]">Total Site Area</span>
                    <span className="font-mono font-bold text-[#22D3EE]">{totalAreaAcres} Acres</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="1500"
                    step="50"
                    value={totalAreaAcres}
                    onChange={(e) => setTotalAreaAcres(Number(e.target.value))}
                    className="w-full accent-[#22D3EE] cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-[#94A3B8]">Target Population</span>
                    <span className="font-mono font-bold text-[#34D399]">{targetPopulation.toLocaleString()} Res.</span>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="100000"
                    step="5000"
                    value={targetPopulation}
                    onChange={(e) => setTargetPopulation(Number(e.target.value))}
                    className="w-full accent-[#34D399] cursor-pointer"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-[#94A3B8] block mb-1">Development Archetype</label>
                  <select
                    value={developmentType}
                    onChange={(e) => setDevelopmentType(e.target.value)}
                    className="w-full bg-[#07111F] border border-white/[0.1] rounded-lg px-2.5 py-1.5 text-xs text-[#F1F5F9] focus:outline-none"
                  >
                    <option value="Eco-Tech Hub">Eco-Tech Innovation Hub</option>
                    <option value="High-Density Smart City">High-Density Biophilic City</option>
                    <option value="Agri-Urban Township">Agri-Urban Sustainable Township</option>
                    <option value="Logistics Corridor">Clean Logistics & Freight Hub</option>
                  </select>
                </div>
              </div>

              {/* Sustainability Priorities */}
              <div className="space-y-2 bg-[#111F30] p-3 rounded-xl border border-white/[0.08]">
                <span className="text-xs font-bold text-[#F1F5F9] block mb-1">Sustainability Priorities</span>
                <label className="flex items-center justify-between text-xs cursor-pointer">
                  <span className="text-[#94A3B8]">100% Renewable Microgrid</span>
                  <input
                    type="checkbox"
                    checked={priorityNetZero}
                    onChange={(e) => setPriorityNetZero(e.target.checked)}
                    className="accent-[#22D3EE] rounded"
                  />
                </label>
                <label className="flex items-center justify-between text-xs cursor-pointer">
                  <span className="text-[#94A3B8]">Water Neutral (135 lpcd)</span>
                  <input
                    type="checkbox"
                    checked={priorityWaterNeutral}
                    onChange={(e) => setPriorityWaterNeutral(e.target.checked)}
                    className="accent-[#22D3EE] rounded"
                  />
                </label>
                <label className="flex items-center justify-between text-xs cursor-pointer">
                  <span className="text-[#94A3B8]">Transit-Oriented Corridor</span>
                  <input
                    type="checkbox"
                    checked={priorityTransitOriented}
                    onChange={(e) => setPriorityTransitOriented(e.target.checked)}
                    className="accent-[#22D3EE] rounded"
                  />
                </label>
              </div>

              {/* Zoning Palette List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-[#F1F5F9]">
                  <span>Editable Master Plan Zones</span>
                  <span className="text-[10px] font-mono text-[#94A3B8]">{activeLayout.zoning.length} Sectors</span>
                </div>

                <div className="space-y-1.5">
                  {activeLayout.zoning.map((zone) => {
                    const isSelected = zone.id === selectedZoneId;
                    return (
                      <button
                        key={zone.id}
                        onClick={() => setSelectedZoneId(zone.id)}
                        className={`w-full text-left p-2.5 rounded-xl border transition-all text-xs flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#17283A] border-[#22D3EE] shadow-sm'
                            : 'bg-[#111F30] border-white/[0.06] hover:bg-[#17283A]/60'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <span
                            className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                            style={{ backgroundColor: zone.color }}
                          />
                          <div>
                            <div className="font-bold text-[#F1F5F9] truncate max-w-[140px]">{zone.name}</div>
                            <div className="text-[10px] text-[#94A3B8]">{zone.density} Density</div>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-mono font-bold text-[#F1F5F9]">{zone.areaAcres} ac</span>
                          <span className="text-[10px] text-[#94A3B8] block">{zone.areaPct}%</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-4 flex flex-col items-center">
              <button
                onClick={() => setShowConfigPanel(true)}
                className="p-2 rounded text-[#94A3B8] hover:text-[#22D3EE]"
                title="Expand Parameters"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </aside>

        {/* Center: Interactive Map Canvas */}
        <main className="flex-1 h-full relative overflow-hidden">
          <div ref={mapContainerRef} className="w-full h-full" />

          {/* Selected Zone Inspector Overlay (Top Right of Map) */}
          {selectedZone && (
            <div className="absolute top-4 right-4 z-20 w-80 p-4 rounded-2xl bg-[#0D1928]/95 border border-white/[0.12] backdrop-blur-xl shadow-2xl space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedZone.color }} />
                  <span className="font-heading font-bold text-xs text-[#F1F5F9] truncate max-w-[180px]">
                    {selectedZone.name}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedZoneId(null)}
                  className="p-1 rounded text-[#94A3B8] hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-[11px] text-[#94A3B8] leading-relaxed">{selectedZone.description}</p>

              <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-center text-xs">
                <div className="p-2 rounded-lg bg-[#111F30]">
                  <div className="text-[9px] text-[#94A3B8]">ACRES</div>
                  <div className="font-bold text-[#22D3EE]">{selectedZone.areaAcres}</div>
                </div>
                <div className="p-2 rounded-lg bg-[#111F30]">
                  <div className="text-[9px] text-[#94A3B8]">SHARE</div>
                  <div className="font-bold text-[#34D399]">{selectedZone.areaPct}%</div>
                </div>
                <div className="p-2 rounded-lg bg-[#111F30]">
                  <div className="text-[9px] text-[#94A3B8]">SQ KM</div>
                  <div className="font-bold text-[#FBBF24]">{selectedZone.areaKm2}</div>
                </div>
              </div>
            </div>
          )}

          {/* Floating AI Assistant Panel (TerraAdvisor) */}
          <div className="absolute bottom-4 right-4 z-20 w-96 max-w-[90vw] rounded-2xl bg-[#0D1928]/95 border border-[#22D3EE]/30 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="px-3.5 py-2.5 bg-[#111F30] border-b border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#22D3EE] animate-pulse" />
                <span className="font-heading font-bold text-xs text-[#F1F5F9]">TerraAdvisor Master-Plan AI</span>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-[#34D399]/20 text-[#34D399] font-bold">
                Active
              </span>
            </div>

            {/* Messages Body */}
            <div className="p-3 max-h-48 overflow-y-auto space-y-2 text-xs">
              {aiMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`p-2.5 rounded-xl ${
                    msg.role === 'user'
                      ? 'bg-[#17283A] text-[#F1F5F9] ml-6 border border-white/[0.08]'
                      : 'bg-[#111F30] text-[#94A3B8] mr-4 border border-[#22D3EE]/20'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-[#94A3B8]/70 mb-1 font-mono">
                    <span>{msg.role === 'user' ? 'Planner' : 'TerraAdvisor'}</span>
                    <span>{msg.timestamp}</span>
                  </div>
                  <p className="leading-relaxed text-[#F1F5F9]">{msg.text}</p>
                </div>
              ))}
              {isAiThinking && (
                <div className="p-2.5 rounded-xl bg-[#111F30] text-xs text-[#22D3EE] flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing zoning trade-offs...</span>
                </div>
              )}
            </div>

            {/* Quick Suggestion Chips */}
            <div className="px-3 py-1.5 border-t border-white/[0.06] bg-[#07111F]/50 flex items-center space-x-1.5 overflow-x-auto">
              <button
                onClick={() => handleAiSubmit(undefined, 'Increase green cover and reduce road area')}
                className="px-2 py-0.5 rounded-md text-[10px] bg-[#111F30] hover:bg-[#17283A] text-[#22D3EE] border border-[#22D3EE]/30 whitespace-nowrap"
              >
                + Expand Green Cover
              </button>
              <button
                onClick={() => handleAiSubmit(undefined, 'Buffer water retention lakes by 150m')}
                className="px-2 py-0.5 rounded-md text-[10px] bg-[#111F30] hover:bg-[#17283A] text-[#34D399] border border-[#34D399]/30 whitespace-nowrap"
              >
                + Water Retention Buffer
              </button>
              <button
                onClick={() => handleAiSubmit(undefined, 'Maximize clean solar microgrid')}
                className="px-2 py-0.5 rounded-md text-[10px] bg-[#111F30] hover:bg-[#17283A] text-[#FBBF24] border border-[#FBBF24]/30 whitespace-nowrap"
              >
                + 100% Net-Zero
              </button>
            </div>

            {/* Prompt Input */}
            <form onSubmit={handleAiSubmit} className="p-2 bg-[#111F30] border-t border-white/[0.08] flex items-center space-x-2">
              <input
                type="text"
                placeholder="Ask AI to revise layout (e.g. increase park buffer)..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="flex-1 bg-[#07111F] border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-xs text-[#F1F5F9] placeholder-[#94A3B8]/60 focus:outline-none focus:border-[#22D3EE]/60"
              />
              <button
                type="submit"
                disabled={!aiPrompt.trim() || isAiThinking}
                className="p-1.5 rounded-lg bg-[#22D3EE] text-[#07111F] font-bold disabled:opacity-40 hover:bg-[#38BDF8] transition-all"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </main>
      </div>

      {/* 3. Layout Compare Modal */}
      {showCompareModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111F30] border border-white/[0.1] rounded-3xl w-full max-w-4xl shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center space-x-2">
                <GitCompare className="w-5 h-5 text-[#22D3EE]" />
                <h3 className="font-heading font-bold text-lg text-[#F1F5F9]">
                  Master Plan Layout Comparison Matrix
                </h3>
              </div>
              <button
                onClick={() => setShowCompareModal(false)}
                className="p-1 rounded-lg text-[#94A3B8] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Side-by-Side Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Layout Alpha */}
              <div className="p-5 rounded-2xl bg-[#0D1928] border border-[#22D3EE]/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-heading font-bold text-sm text-[#22D3EE]">
                    Layout Alpha — Transit-Oriented
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-[#22D3EE]/20 text-[#22D3EE] font-bold">
                    Active Layout
                  </span>
                </div>
                <p className="text-xs text-[#94A3B8]">{DEMO_MASTER_PLANS.layout_a.scenario}</p>

                <div className="space-y-1.5 text-xs font-mono pt-2 border-t border-white/[0.08]">
                  <div className="flex justify-between">
                    <span className="text-[#94A3B8]">Population Capacity:</span>
                    <span className="text-[#F1F5F9] font-bold">25,000 People</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#94A3B8]">Green Canopy Cover:</span>
                    <span className="text-[#34D399] font-bold">34.5% (172.5 ac)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#94A3B8]">Clean Energy Generation:</span>
                    <span className="text-[#FBBF24] font-bold">92.0% Net-Zero</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#94A3B8]">Water Self-Sufficiency:</span>
                    <span className="text-[#22D3EE] font-bold">88.0%</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActiveLayout(DEMO_MASTER_PLANS.layout_a);
                    setShowCompareModal(false);
                  }}
                  className="w-full py-2 rounded-xl bg-[#22D3EE]/20 hover:bg-[#22D3EE]/30 border border-[#22D3EE]/40 text-[#22D3EE] font-bold text-xs transition-all"
                >
                  Select Layout Alpha
                </button>
              </div>

              {/* Layout Beta */}
              <div className="p-5 rounded-2xl bg-[#0D1928] border border-[#34D399]/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-heading font-bold text-sm text-[#34D399]">
                    Layout Beta — Agro-Forestry Sovereign
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-[#34D399]/20 text-[#34D399] font-bold">
                    Alternative
                  </span>
                </div>
                <p className="text-xs text-[#94A3B8]">{DEMO_MASTER_PLANS.layout_b.scenario}</p>

                <div className="space-y-1.5 text-xs font-mono pt-2 border-t border-white/[0.08]">
                  <div className="flex justify-between">
                    <span className="text-[#94A3B8]">Population Capacity:</span>
                    <span className="text-[#F1F5F9] font-bold">20,000 People</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#94A3B8]">Green Canopy Cover:</span>
                    <span className="text-[#34D399] font-bold">42.0% (210 ac)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#94A3B8]">Clean Energy Generation:</span>
                    <span className="text-[#FBBF24] font-bold">96.5% Net-Zero</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#94A3B8]">Water Self-Sufficiency:</span>
                    <span className="text-[#22D3EE] font-bold">94.0%</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActiveLayout(DEMO_MASTER_PLANS.layout_b);
                    setShowCompareModal(false);
                  }}
                  className="w-full py-2 rounded-xl bg-[#34D399]/20 hover:bg-[#34D399]/30 border border-[#34D399]/40 text-[#34D399] font-bold text-xs transition-all"
                >
                  Select Layout Beta
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs text-[#94A3B8]">
              <span>Synthesis: Layout Beta yields higher resilience with +7.5% green cover and +6.0% water self-sufficiency.</span>
              <button
                onClick={() => setShowCompareModal(false)}
                className="px-4 py-2 rounded-xl bg-[#17283A] text-white hover:bg-[#22D3EE] hover:text-[#07111F] font-bold transition-all"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
