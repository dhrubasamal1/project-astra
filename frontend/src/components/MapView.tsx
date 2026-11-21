import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';

import {
  Layers,
  Eye,
  EyeOff,
  Maximize2,
  AlertOctagon,
  Flame,
  Info,
  CheckCircle,
  Crosshair,
  Compass,
  MapPin,
  Sparkles,
  Ruler,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import {
  CandidateSite,
  Region,
  LayerOverlay,
  SiteScorecard,
} from '../types';
import {
  JEWAR_DEAL_BREAKER_ZONES,
  DHOLERA_DEAL_BREAKER_ZONES,
} from '../data/mockData';

// Fix standard Leaflet default icon paths in bundlers
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
});

// CARTO Basemap Key & Endpoint
const CARTO_KEY = import.meta.env.VITE_CARTO_API_KEY || 'cb1_5djb_1_76786fa00d88e119cfcb6bc4';
const CARTO_DARK_URL = `https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png${CARTO_KEY ? `?key=${CARTO_KEY}` : ''}`;

interface MapViewProps {
  currentRegion: Region;
  candidateSites: CandidateSite[];
  onUpdateCandidateSites: (sites: CandidateSite[]) => void;
  selectedSiteCode: 'A' | 'B' | 'C';
  onSelectSiteCode: (code: 'A' | 'B' | 'C') => void;
  scorecards: Record<string, SiteScorecard>;
  layerOverlays: LayerOverlay[];
  onToggleLayer: (layerId: LayerOverlay['id']) => void;
  isLeftPanelOpen?: boolean;
  onToggleLeftPanel?: () => void;
  isRightPanelOpen?: boolean;
  onToggleRightPanel?: () => void;
}

export const MapView: React.FC<MapViewProps> = ({
  currentRegion,
  candidateSites,
  onUpdateCandidateSites,
  selectedSiteCode,
  onSelectSiteCode,
  scorecards,
  layerOverlays,
  onToggleLayer,
  isLeftPanelOpen,
  onToggleLeftPanel,
  isRightPanelOpen,
  onToggleRightPanel,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const sitesLayerGroupRef = useRef<L.FeatureGroup | null>(null);
  const dealBreakersLayerGroupRef = useRef<L.FeatureGroup | null>(null);
  const overlayLayersGroupRef = useRef<L.FeatureGroup | null>(null);

  const [showLayersMenu, setShowLayersMenu] = useState(false);
  const [showLegend, setShowLegend] = useState(true);
  const [activeBasemap, setActiveBasemap] = useState<'carto_dark' | 'osm' | 'satellite' | 'terrain'>('carto_dark');
  const [liveCoords, setLiveCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(currentRegion.zoom);

  // Initialize Leaflet map and Geoman
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: currentRegion.center,
      zoom: currentRegion.zoom,
      zoomControl: false,
    });

    // Add zoom control top-left
    L.control.zoom({ position: 'topleft' }).addTo(map);

    // Default CartoDB Dark Matter basemap
    const darkTileLayer = L.tileLayer(
      CARTO_DARK_URL,
      {
        attribution: '&copy; CARTO &copy; OpenStreetMap',
        subdomains: 'abcd',
        maxZoom: 20,
      }
    ).addTo(map);

    (map as any)._baseTileLayer = darkTileLayer;

    // Feature Groups for organization
    sitesLayerGroupRef.current = L.featureGroup().addTo(map);
    dealBreakersLayerGroupRef.current = L.featureGroup().addTo(map);
    overlayLayersGroupRef.current = L.featureGroup().addTo(map);

    // Track mouse coordinates for live HUD
    map.on('mousemove', (e: L.LeafletMouseEvent) => {
      setLiveCoords({ lat: Number(e.latlng.lat.toFixed(4)), lng: Number(e.latlng.lng.toFixed(4)) });
    });

    map.on('zoomend', () => {
      setZoomLevel(map.getZoom());
    });

    // Initialize Leaflet Geoman Controls
    const pm = (map as any).pm;
    if (pm) {
      pm.addControls({
        position: 'topleft',
        drawMarker: false,
        drawCircleMarker: false,
        drawPolyline: false,
        drawRectangle: true,
        drawPolygon: true,
        drawCircle: false,
        drawText: false,
        editMode: true,
        dragMode: false,
        cutPolygon: false,
        removalMode: true,
      });

      pm.setGlobalOptions({
        snappable: true,
        snapDistance: 20,
        allowSelfIntersection: false,
      });

      // Handle user drawn polygons
      map.on('pm:create', (e: any) => {
        const layer = e.layer;
        const latlngs = layer.getLatLngs();
        const coords: [number, number][] = (Array.isArray(latlngs[0]) ? latlngs[0] : latlngs).map(
          (ll: any) => [ll.lat, ll.lng]
        );

        // Approximate area calculation in km²
        const approxArea = Math.round((coords.length * 5.2) * 10) / 10;

        // Auto-assign code (next available up to 3)
        const existingCodes = candidateSites.map((s) => s.code);
        let nextCode: 'A' | 'B' | 'C' = 'A';
        if (!existingCodes.includes('A')) nextCode = 'A';
        else if (!existingCodes.includes('B')) nextCode = 'B';
        else if (!existingCodes.includes('C')) nextCode = 'C';

        const colorMap = {
          A: '#22D3EE', // Cyan
          B: '#34D399', // Emerald
          C: '#FBBF24', // Amber
        };

        const newSite: CandidateSite = {
          id: `site_custom_${Date.now()}`,
          code: nextCode,
          name: `Custom Parcel ${nextCode}`,
          regionId: currentRegion.id,
          coordinates: coords,
          areaKm2: approxArea,
          color: colorMap[nextCode],
          description: `User-drawn boundary ${nextCode} (${(approxArea * 247.105).toFixed(0)} acres)`,
          tag: 'Custom',
        };

        const updated = [...candidateSites.filter((s) => s.code !== nextCode), newSite];
        onUpdateCandidateSites(updated);
        onSelectSiteCode(nextCode);

        // Remove temp drawn layer since our React effect re-renders it cleanly
        map.removeLayer(layer);
      });
    }

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update basemap when selection changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if ((map as any)._baseTileLayer) {
      map.removeLayer((map as any)._baseTileLayer);
    }

    let url = CARTO_DARK_URL;
    let attr = '&copy; CARTO &copy; OpenStreetMap';

    if (activeBasemap === 'osm') {
      url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      attr = '&copy; OpenStreetMap contributors';
    } else if (activeBasemap === 'satellite') {
      url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      attr = '&copy; Esri, Maxar, Earthstar Geographics';
    } else if (activeBasemap === 'terrain') {
      url = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
      attr = '&copy; OpenTopoMap &copy; OpenStreetMap';
    }

    const newLayer = L.tileLayer(url, { attribution: attr, maxZoom: 19 }).addTo(map);
    newLayer.bringToBack();
    (map as any)._baseTileLayer = newLayer;
  }, [activeBasemap]);

  // Center / fly to region when region changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    map.flyTo(currentRegion.center, currentRegion.zoom, {
      duration: 1.0,
      easeLinearity: 0.25,
    });
  }, [currentRegion]);

  // Render Candidate Site Polygons
  useEffect(() => {
    const sitesGroup = sitesLayerGroupRef.current;
    if (!sitesGroup) return;

    sitesGroup.clearLayers();

    candidateSites.forEach((site) => {
      const isSelected = site.code === selectedSiteCode;
      const scorecard = scorecards[site.id];
      const hasDealBreaker = scorecard?.hasDealBreaker;

      const polygonColor = hasDealBreaker ? '#F87171' : site.color;

      const polygon = L.polygon(site.coordinates, {
        color: polygonColor,
        weight: isSelected ? 4 : 2,
        fillColor: polygonColor,
        fillOpacity: isSelected ? 0.42 : 0.22,
        dashArray: hasDealBreaker ? '6, 6' : undefined,
      });

      // Click to select
      polygon.on('click', () => {
        onSelectSiteCode(site.code);
      });

      // Tooltip label
      polygon.bindTooltip(
        `<div style="font-family: inherit; font-size: 11px; padding: 4px 6px; background: #0D1928; border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; color: #F1F5F9;">
          <div style="font-weight: bold; color: ${polygonColor}">Site ${site.code}: ${site.name.split('(')[0]}</div>
          <div style="color: #94A3B8; font-size: 10px;">
            ${(site.areaKm2 * 247.105).toFixed(0)} Acres (${(site.areaKm2 * 100).toFixed(0)} ha) • Score: ${scorecard?.overallScore?.toFixed(1) || 'Pending'}
          </div>
        </div>`,
        { sticky: true, className: 'leaflet-site-label' }
      );

      sitesGroup.addLayer(polygon);
    });
  }, [candidateSites, selectedSiteCode, scorecards]);

  // Render Dealbreaker Exclusion Zones
  useEffect(() => {
    const dbGroup = dealBreakersLayerGroupRef.current;
    if (!dbGroup) return;

    dbGroup.clearLayers();

    const zones = currentRegion.id === 'up_jewar' ? JEWAR_DEAL_BREAKER_ZONES : DHOLERA_DEAL_BREAKER_ZONES;

    const geoJsonLayer = L.geoJSON(zones, {
      style: {
        color: '#F87171',
        weight: 1.5,
        fillColor: '#F87171',
        fillOpacity: 0.28,
        dashArray: '4, 4',
      },
      onEachFeature: (feature, layer) => {
        const name = feature.properties?.name || 'Statutory Exclusion Zone';
        layer.bindTooltip(
          `<div style="font-family: inherit; font-size: 11px; padding: 4px 6px; background: rgba(24,10,10,0.95); border: 1px solid #F87171; border-radius: 8px; color: #FECACA;">
            <b>⚠️ ${name}</b><br/>
            <span style="font-size: 10px; color: #FCA5A5;">Statutory Exclusion Zone (Deal-Breaker)</span>
          </div>`,
          { sticky: true, className: 'leaflet-site-label' }
        );
      },
    });

    dbGroup.addLayer(geoJsonLayer);
  }, [currentRegion]);

  const handleFlyToSite = (site: CandidateSite) => {
    onSelectSiteCode(site.code);
    const map = mapInstanceRef.current;
    if (!map || !site.coordinates.length) return;
    const bounds = L.latLngBounds(site.coordinates);
    map.fitBounds(bounds, { padding: [60, 60], duration: 0.8 });
  };

  const activeSite = candidateSites.find((s) => s.code === selectedSiteCode) || candidateSites[0];
  const activeScorecard = scorecards[activeSite?.id];
  const activeAreaAcres = activeSite ? (activeSite.areaKm2 * 247.105).toFixed(0) : '0';
  const activeAreaHa = activeSite ? (activeSite.areaKm2 * 100).toFixed(0) : '0';

  const toggleFullscreen = () => {
    const elem = mapContainerRef.current?.parentElement;
    if (!elem) return;

    if (!document.fullscreenElement) {
      elem.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#07111F] select-none font-sans">
      {/* Underlying Map Div */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Top-Left Telemetry HUD */}
      <div className="absolute top-3 left-14 z-10 hidden sm:flex items-center space-x-2.5 bg-[#0D1928]/90 backdrop-blur-md border border-white/[0.1] px-3 py-1.5 rounded-xl text-xs text-[#F1F5F9] shadow-xl">
        <div className="flex items-center space-x-1.5">
          <Crosshair className="w-3.5 h-3.5 text-[#22D3EE] animate-spin" />
          <span className="font-mono text-[#22D3EE] font-semibold text-[11px]">
            {liveCoords ? `${liveCoords.lat}°N, ${liveCoords.lng}°E` : `${currentRegion.center[0]}°N, ${currentRegion.center[1]}°E`}
          </span>
        </div>
        <span className="text-white/[0.2]">|</span>
        <div className="text-[11px] text-[#94A3B8]">
          <span>Zoom:</span> <span className="font-mono text-[#F1F5F9] font-bold">{zoomLevel}</span>
        </div>
      </div>

      {/* Floating Top-Right Map Controls & Layer Overlays */}
      <div className="absolute top-3 right-3 z-10 flex flex-col items-end space-y-2">
        <div className="flex items-center space-x-1.5 bg-[#0D1928]/90 backdrop-blur-md border border-white/[0.1] p-1.5 rounded-xl shadow-xl">
          {/* Basemap Switcher Chips */}
          <button
            onClick={() => setActiveBasemap('carto_dark')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              activeBasemap === 'carto_dark'
                ? 'bg-[#22D3EE] text-[#07111F] font-bold shadow-sm'
                : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#111F30]'
            }`}
          >
            Dark
          </button>
          <button
            onClick={() => setActiveBasemap('satellite')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              activeBasemap === 'satellite'
                ? 'bg-[#22D3EE] text-[#07111F] font-bold shadow-sm'
                : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#111F30]'
            }`}
          >
            Satellite
          </button>
          <button
            onClick={() => setActiveBasemap('terrain')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              activeBasemap === 'terrain'
                ? 'bg-[#22D3EE] text-[#07111F] font-bold shadow-sm'
                : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#111F30]'
            }`}
          >
            Terrain
          </button>
          <button
            onClick={() => setActiveBasemap('osm')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              activeBasemap === 'osm'
                ? 'bg-[#22D3EE] text-[#07111F] font-bold shadow-sm'
                : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#111F30]'
            }`}
          >
            Street
          </button>

          <span className="w-px h-4 bg-white/[0.1] mx-1"></span>

          {/* Toggle Layers Menu Button */}
          <button
            onClick={() => setShowLayersMenu(!showLayersMenu)}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              showLayersMenu
                ? 'bg-[#17283A] text-[#22D3EE] border border-[#22D3EE]/40'
                : 'bg-[#111F30] text-[#94A3B8] hover:text-[#F1F5F9]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Overlays</span>
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#111F30] transition-all"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Floating Overlays Drawer Popover */}
        {showLayersMenu && (
          <div className="w-80 bg-[#0D1928]/95 backdrop-blur-xl border border-white/[0.1] rounded-2xl shadow-2xl p-3.5 text-xs space-y-3 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-2.5">
              <span className="font-bold text-[#F1F5F9] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#22D3EE]" />
                <span>ISRO Thematic Overlays</span>
              </span>
              <button
                onClick={() => setShowLegend(!showLegend)}
                className="text-[11px] font-semibold text-[#22D3EE] hover:underline"
              >
                {showLegend ? 'Hide Legends' : 'Show Legends'}
              </button>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {layerOverlays.map((layer) => (
                <div
                  key={layer.id}
                  className={`p-2.5 rounded-xl border transition-all ${
                    layer.visible
                      ? 'bg-[#17283A]/90 border-white/[0.15] shadow-md'
                      : 'bg-[#111F30]/50 border-white/[0.05] opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => onToggleLayer(layer.id)}
                      className="flex items-center space-x-2 text-left flex-1"
                    >
                      <span
                        className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                        style={{ backgroundColor: layer.color }}
                      ></span>
                      <div>
                        <div className="font-semibold text-[#F1F5F9] text-xs">{layer.name}</div>
                        <div className="text-[10px] text-[#94A3B8] font-mono">{layer.portal}</div>
                      </div>
                    </button>
                    <button
                      onClick={() => onToggleLayer(layer.id)}
                      className="p-1 text-[#94A3B8] hover:text-white ml-2 rounded hover:bg-[#111F30]"
                    >
                      {layer.visible ? (
                        <Eye className="w-4 h-4 text-[#22D3EE]" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {showLegend && layer.visible && (
                    <div className="mt-2 pt-2 border-t border-white/[0.08] space-y-1">
                      {layer.legend.map((item, idx) => (
                        <div key={idx} className="flex items-center space-x-2 text-[10px] text-[#94A3B8]">
                          <span
                            className="w-2.5 h-2.5 rounded-sm shrink-0"
                            style={{ backgroundColor: item.color }}
                          ></span>
                          <span className="truncate">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Floating Bottom Center: Quick Site Selection HUD */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 flex items-center space-x-2 bg-[#0D1928]/95 backdrop-blur-xl border border-white/[0.1] px-2.5 py-1.5 rounded-2xl shadow-2xl">
        {candidateSites.map((site) => {
          const isSelected = site.code === selectedSiteCode;
          const card = scorecards[site.id];
          const hasDb = card?.hasDealBreaker;
          return (
            <button
              key={site.id}
              onClick={() => handleFlyToSite(site)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                isSelected
                  ? 'bg-[#17283A] text-[#22D3EE] border border-[#22D3EE]/50 shadow-md ring-1 ring-[#22D3EE]/30'
                  : 'bg-[#111F30] hover:bg-[#17283A] text-[#94A3B8] hover:text-[#F1F5F9]'
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: hasDb ? '#F87171' : site.color }}
              ></span>
              <span>Site {site.code}</span>
              {card && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                    hasDb
                      ? 'bg-red-500/20 text-[#F87171] font-bold'
                      : isSelected
                      ? 'bg-[#22D3EE]/20 text-[#22D3EE]'
                      : 'bg-[#07111F] text-[#94A3B8]'
                  }`}
                >
                  {hasDb ? 'DEFICIT' : `${card.overallScore.toFixed(1)} pts`}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Telemetry HUD Bar (Acreage, Hectares, Coordinates, Attribution) */}
      <div className="absolute bottom-0 inset-x-0 z-10 h-8 bg-[#07111F]/90 backdrop-blur-md border-t border-white/[0.08] px-4 flex items-center justify-between text-[11px] font-mono text-[#94A3B8]">
        <div className="flex items-center space-x-3">
          <span>Active: <b className="text-[#F1F5F9]">Site {selectedSiteCode}</b></span>
          <span>•</span>
          <span>Area: <b className="text-[#22D3EE]">{activeAreaAcres} Acres</b> ({activeAreaHa} ha / {activeSite?.areaKm2} km²)</span>
        </div>

        <div className="flex items-center space-x-3">
          <span className="hidden md:inline">Datum: WGS84 / EGM96</span>
          <span className="hidden md:inline">•</span>
          <span className="text-[#34D399] flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            <span>ISRO 4-Portal Provenance</span>
          </span>
        </div>
      </div>
    </div>
  );
};
