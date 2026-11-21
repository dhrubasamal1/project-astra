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

interface MapViewProps {
  currentRegion: Region;
  candidateSites: CandidateSite[];
  onUpdateCandidateSites: (sites: CandidateSite[]) => void;
  selectedSiteCode: 'A' | 'B' | 'C';
  onSelectSiteCode: (code: 'A' | 'B' | 'C') => void;
  scorecards: Record<string, SiteScorecard>;
  layerOverlays: LayerOverlay[];
  onToggleLayer: (layerId: LayerOverlay['id']) => void;
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
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const sitesLayerGroupRef = useRef<L.FeatureGroup | null>(null);
  const dealBreakersLayerGroupRef = useRef<L.FeatureGroup | null>(null);
  const overlayLayersGroupRef = useRef<L.FeatureGroup | null>(null);

  const [showLayersMenu, setShowLayersMenu] = useState(false);
  const [showLegend, setShowLegend] = useState(true);
  const [activeBasemap, setActiveBasemap] = useState<'carto_dark' | 'osm' | 'satellite'>('carto_dark');

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
      'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
        maxZoom: 19,
      }
    ).addTo(map);

    (map as any)._baseTileLayer = darkTileLayer;

    // Feature Groups for organization
    sitesLayerGroupRef.current = L.featureGroup().addTo(map);
    dealBreakersLayerGroupRef.current = L.featureGroup().addTo(map);
    overlayLayersGroupRef.current = L.featureGroup().addTo(map);

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
        else nextCode = 'C';

        const newSite: CandidateSite = {
          id: `site_${nextCode.toLowerCase()}_custom`,
          code: nextCode,
          name: `User Drawn Site ${nextCode}`,
          regionId: currentRegion.id,
          color: nextCode === 'A' ? '#10b981' : nextCode === 'B' ? '#f59e0b' : '#8b5cf6',
          coordinates: coords,
          areaKm2: approxArea || 22.0,
          description: 'Custom user-delineated site polygon created via Geoman freehand tool.',
          tag: 'User Custom Delineation',
        };

        // Remove the temporary geoman raw layer since we render via state
        map.removeLayer(layer);

        const updated = candidateSites.filter((s) => s.code !== nextCode);
        onUpdateCandidateSites([...updated, newSite]);
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

    let url = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    let attr = '&copy; CARTO &copy; OpenStreetMap';

    if (activeBasemap === 'osm') {
      url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      attr = '&copy; OpenStreetMap contributors';
    } else if (activeBasemap === 'satellite') {
      url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      attr = '&copy; Esri, Maxar, Earthstar Geographics';
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

      const polygonColor = hasDealBreaker ? '#ef4444' : site.color;

      const polygon = L.polygon(site.coordinates, {
        color: polygonColor,
        weight: isSelected ? 3.5 : 2,
        fillColor: polygonColor,
        fillOpacity: isSelected ? 0.35 : 0.22,
        dashArray: hasDealBreaker ? '6, 6' : undefined,
      });

      // Click to select
      polygon.on('click', () => {
        onSelectSiteCode(site.code);
      });

      // Tooltip label
      polygon.bindTooltip(
        `<div class="px-2 py-1 text-xs font-bold text-slate-900 bg-white/95 rounded shadow-lg border border-slate-300">
          <div class="flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full" style="background-color: ${polygonColor}"></span>
            <span>Site ${site.code}: ${site.name.split('(')[0]}</span>
          </div>
          <div class="text-[10px] text-slate-600 font-normal mt-0.5">
            ${site.areaKm2} km² • ${scorecard ? `Score: ${scorecard.overallScore}/100` : 'Ready to analyze'}
            ${hasDealBreaker ? '<span class="text-red-600 font-bold ml-1">• HARD STOP</span>' : ''}
          </div>
        </div>`,
        { permanent: true, direction: 'center', className: 'leaflet-site-label' }
      );

      sitesGroup.addLayer(polygon);
    });
  }, [candidateSites, selectedSiteCode, scorecards]);

  // Render Spatial Deal-Breaker Sub-Polygons (Translucent Red Overlay inside sites)
  useEffect(() => {
    const dbGroup = dealBreakersLayerGroupRef.current;
    if (!dbGroup) return;

    dbGroup.clearLayers();

    // Check if any site in the region has deal-breaker zones
    const dealBreakerData =
      currentRegion.id === 'up_jewar' ? JEWAR_DEAL_BREAKER_ZONES : DHOLERA_DEAL_BREAKER_ZONES;

    dealBreakerData.features.forEach((feature: any) => {
      const coords = feature.geometry.coordinates[0].map((pt: [number, number]) => [pt[1], pt[0]]);

      const dbPolygon = L.polygon(coords, {
        color: '#dc2626',
        weight: 2.5,
        dashArray: '4, 4',
        fillColor: '#ef4444',
        fillOpacity: 0.65, // Prominent translucent red highlight
      });

      dbPolygon.bindTooltip(
        `<div class="p-2 text-xs font-bold text-white bg-red-900/95 rounded shadow-xl border border-red-500 max-w-[240px]">
          <div class="flex items-center gap-1.5 text-red-200">
            <span class="text-sm">⚠️</span>
            <span>SPATIAL DEAL-BREAKER ZONE</span>
          </div>
          <p class="text-[11px] font-semibold text-white mt-1">${feature.properties.name}</p>
          <p class="text-[10px] text-red-200 mt-0.5">Rule: ${feature.properties.rule}</p>
          <p class="text-[10px] text-red-300 font-mono mt-0.5">Area Inundated: ${feature.properties.areaPct}% (Threshold: &lt;50%)</p>
        </div>`,
        { sticky: true }
      );

      dbGroup.addLayer(dbPolygon);
    });
  }, [currentRegion]);

  // Render Synthetic Thematic Layer Overlays
  useEffect(() => {
    const overlaysGroup = overlayLayersGroupRef.current;
    if (!overlaysGroup) return;

    overlaysGroup.clearLayers();

    layerOverlays.forEach((layer) => {
      if (!layer.visible) return;

      const center = currentRegion.center;

      // Realistic spatial thematic rings/swatches for demo visualization
      if (layer.id === 'terrain') {
        const contour = L.circle(center, {
          radius: 8000,
          color: layer.color,
          weight: 1,
          fillColor: layer.color,
          fillOpacity: 0.08,
          dashArray: '3, 6',
        });
        overlaysGroup.addLayer(contour);
      }

      if (layer.id === 'flood') {
        const floodBuffer = L.circle([center[0] - 0.03, center[1] - 0.05], {
          radius: 5000,
          color: '#ef4444',
          weight: 1.5,
          fillColor: '#ef4444',
          fillOpacity: 0.15,
        });
        overlaysGroup.addLayer(floodBuffer);
      }

      if (layer.id === 'water') {
        const waterBuffer = L.circle([center[0] + 0.02, center[1] - 0.04], {
          radius: 6500,
          color: '#0284c7',
          weight: 1.5,
          fillColor: '#0284c7',
          fillOpacity: 0.12,
        });
        overlaysGroup.addLayer(waterBuffer);
      }

      if (layer.id === 'ndvi') {
        const ndviCircle = L.circle([center[0] + 0.04, center[1] + 0.05], {
          radius: 6000,
          color: '#22c55e',
          weight: 1,
          fillColor: '#22c55e',
          fillOpacity: 0.12,
        });
        overlaysGroup.addLayer(ndviCircle);
      }
    });
  }, [layerOverlays, currentRegion]);

  // Reset / Fit bounds helper
  const handleFitBounds = () => {
    const map = mapInstanceRef.current;
    const sitesGroup = sitesLayerGroupRef.current;
    if (!map || !sitesGroup || candidateSites.length === 0) return;

    const bounds = sitesGroup.getBounds();
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 14 });
    }
  };

  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden">
      {/* Leaflet Map Div */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Top-Right Toolbars: Layer Switcher & Basemap & Fit */}
      <div className="absolute top-3 right-3 z-10 flex flex-col items-end space-y-2">
        {/* Quick Toolbar */}
        <div className="flex items-center space-x-1.5 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-1 rounded-lg shadow-xl">
          {/* Fit Bounds */}
          <button
            onClick={handleFitBounds}
            className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded transition-colors"
            title="Fit view to all candidate sites"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          {/* Toggle Layers Menu */}
          <button
            onClick={() => setShowLayersMenu(!showLayersMenu)}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-semibold rounded transition-all ${
              showLayersMenu
                ? 'bg-sky-600 text-white shadow-md'
                : 'text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Overlays ({layerOverlays.filter((l) => l.visible).length})</span>
          </button>

          {/* Basemap Switcher */}
          <select
            value={activeBasemap}
            onChange={(e) => setActiveBasemap(e.target.value as any)}
            className="text-xs bg-slate-800 border border-slate-700 text-slate-200 rounded px-2 py-1 outline-none"
          >
            <option value="carto_dark">Carto Light</option>
            <option value="osm">OpenStreetMap</option>
            <option value="satellite">Satellite Imagery</option>
          </select>
        </div>

        {/* Floating Overlays Drawer Popover */}
        {showLayersMenu && (
          <div className="w-72 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-lg shadow-2xl p-3 text-xs space-y-2.5 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-semibold text-slate-200 uppercase tracking-wider text-[11px]">
                Thematic ISRO Overlays
              </span>
              <button
                onClick={() => setShowLegend(!showLegend)}
                className="text-[11px] text-sky-400 hover:underline"
              >
                {showLegend ? 'Hide Legends' : 'Show Legends'}
              </button>
            </div>

            <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
              {layerOverlays.map((layer) => (
                <div
                  key={layer.id}
                  className={`p-2 rounded border transition-all ${
                    layer.visible
                      ? 'bg-slate-800/80 border-slate-600'
                      : 'bg-slate-850/50 border-slate-800 opacity-70'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => onToggleLayer(layer.id)}
                      className="flex items-center space-x-2 text-left flex-1"
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: layer.color }}
                      ></span>
                      <div>
                        <div className="font-medium text-slate-200">{layer.name}</div>
                        <div className="text-[10px] text-slate-400">{layer.portal}</div>
                      </div>
                    </button>
                    <button
                      onClick={() => onToggleLayer(layer.id)}
                      className="text-slate-400 hover:text-white ml-2"
                    >
                      {layer.visible ? (
                        <Eye className="w-3.5 h-3.5 text-sky-400" />
                      ) : (
                        <EyeOff className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {showLegend && layer.visible && (
                    <div className="mt-2 pt-1.5 border-t border-slate-750 space-y-1">
                      {layer.legend.map((item, idx) => (
                        <div key={idx} className="flex items-center space-x-1.5 text-[10px] text-slate-300">
                          <span
                            className="w-2 h-2 rounded-sm shrink-0"
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

      {/* Floating Bottom-Left Deal-Breaker Warning Banner (if Yamuna/Dholera deal-breaker active) */}
      <div className="absolute bottom-4 left-4 z-10 max-w-sm pointer-events-none">
        <div className="bg-red-950/90 backdrop-blur-md border border-red-500/70 p-3 rounded-lg shadow-2xl text-xs space-y-1.5 pointer-events-auto">
          <div className="flex items-center space-x-2 text-red-300 font-bold">
            <AlertOctagon className="w-4 h-4 text-red-400 animate-bounce" />
            <span>Spatial Deal-Breaker Overlay Active</span>
          </div>
          <p className="text-[11px] text-red-200 leading-snug">
            Offending sub-polygons exceeding statutory safety thresholds are shaded in{' '}
            <strong className="text-red-300 underline">translucent red with dashed borders</strong>.
            Site B is flagged for automatic exclusion.
          </p>
        </div>
      </div>

      {/* Floating Geoman Instructions Pill */}
      <div className="absolute top-3 left-14 z-10 hidden sm:flex items-center space-x-2 bg-slate-900/85 backdrop-blur-sm border border-slate-700/80 px-2.5 py-1 rounded-md text-[11px] text-slate-300">
        <Info className="w-3.5 h-3.5 text-sky-400" />
        <span>Use top-left toolbar to draw or edit site boundary polygons</span>
      </div>
    </div>
  );
};
