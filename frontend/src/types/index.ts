// TerraCity AI - Domain Type Definitions

export type RegionId = 'up_jewar' | 'dholera';

export type PriorityPreset = 'balanced' | 'climate_resilient' | 'infra_first';

export type ScenarioPreset = 'baseline' | 'high_growth_climate_stressed' | 'green_transition';

export interface Region {
  id: RegionId;
  name: string;
  state: string;
  badge: string;
  center: [number, number]; // [lat, lng]
  zoom: number;
  bbox: [number, number, number, number]; // [minLng, minLat, maxLng, maxLat]
  description: string;
  primaryPortalCoverage: string;
  candidateSites: CandidateSite[];
}

export interface CandidateSite {
  id: string; // 'site_a' | 'site_b' | 'site_c'
  code: 'A' | 'B' | 'C';
  name: string;
  regionId: RegionId;
  color: string;
  coordinates: [number, number][]; // [lat, lng] for Leaflet
  areaKm2: number;
  description: string;
  tag: string;
}

export interface IndicatorSource {
  portal: 'Bhoonidhi' | 'Bhuvan' | 'MOSDAC' | 'VEDAS' | 'OpenStreetMap' | 'BIS / NDMA';
  dataset: string;
  resolution: string;
  vintage: string;
  method: string;
}

export interface IndicatorValue {
  key: string;
  name: string;
  pillar: 'terrain' | 'water' | 'hazards' | 'environment' | 'infrastructure';
  value: number | string;
  displayValue: string;
  unit: string;
  score: number; // 0 - 100
  weight: number; // Percentage contribution
  source: IndicatorSource;
  confidence: 'High' | 'Medium' | 'Low';
  benchmark: string;
}

export interface PillarScore {
  pillar: 'terrain' | 'water' | 'hazards' | 'environment' | 'infrastructure';
  name: string;
  weight: number;
  rawScore: number; // 0 - 100
  weightedScore: number;
  rank: number;
  strengths: string[];
  risks: string[];
}

export interface DealBreaker {
  id: string;
  rule: string;
  triggered: boolean;
  severity: 'HARD_STOP' | 'WARNING';
  threshold: string;
  actualValue: string;
  description: string;
  zoneGeoJson?: GeoJSON.FeatureCollection;
}

export interface SiteScorecard {
  siteId: string;
  siteCode: 'A' | 'B' | 'C';
  siteName: string;
  regionId: RegionId;
  overallScore: number; // 0 - 100
  rank: number;
  verdict: 'Highly Suitable' | 'Moderately Suitable' | 'Constrained' | 'Unviable (Hard Stop)';
  verdictTier: 'A' | 'B' | 'C' | 'D';
  verdictDescription: string;
  confidencePct: number;
  confidenceLabel: 'High' | 'Medium' | 'Low';
  dealBreakers: DealBreaker[];
  hasDealBreaker: boolean;
  pillars: Record<string, PillarScore>;
  radarData: { pillar: string; score: number; fullMark: number }[];
  indicators: IndicatorValue[];
  dealBreakerZones?: GeoJSON.FeatureCollection;
}

export interface CompareResult {
  regionId: RegionId;
  scenario: ScenarioPreset;
  preset: PriorityPreset;
  sites: SiteScorecard[];
  topSite: SiteScorecard;
  runnerUp?: SiteScorecard;
  scoreDelta: number;
  isTie: boolean;
  tieCheckNote?: string;
  top3Drivers: {
    title: string;
    description: string;
    impact: 'positive' | 'negative' | 'neutral';
    delta: string;
  }[];
  executiveSummary: string;
}

export interface WaterStressYear {
  year: number;
  population: number;
  demandMLD: number;
  baseSupplyMLD: number;
  lowSupplyMLD: number;
  highSupplyMLD: number;
  stressIndex: number;
}

export interface StressTestResponse {
  siteId: string;
  siteName: string;
  horizon: 2035 | 2050;
  targetPopulation: number;
  scenario: ScenarioPreset;
  currentDemandMLD: number;
  horizonDemandMLD: number;
  horizonBaseSupplyMLD: number;
  stressIndex: number;
  stressCategory: 'Sustainable' | 'Stressed' | 'Critical Deficit';
  floodStressBadge: {
    category: 'Low' | 'Moderate' | 'Severe';
    label: string;
    drainageCapacity: string;
    residualRisk: string;
  };
  uncertaintyRangeMLD: [number, number];
  timeseries: WaterStressYear[];
  recommendation: string;
}

export interface ProvenanceRecord {
  id: string;
  portal: 'Bhoonidhi' | 'Bhuvan' | 'MOSDAC' | 'VEDAS' | 'OpenStreetMap' | 'BIS / NDMA';
  dataset: string;
  theme: string;
  resolution: string;
  vintage: string;
  updateFrequency: string;
  accessMethod: string;
  coverageStatus: 'Verified 100%' | 'Regional Fallback' | 'Proxy Fallback';
  status: 'active' | 'fallback';
  link: string;
  indicatorsFed: string[];
}

export interface Assumptions {
  pop0: number; // Base population
  targetPop: number; // Horizon population
  lpcd: number; // Litres per capita per day (default: 135)
  catchmentMultiplier: number; // Catchment area multiplier (default: 3.0)
  externalSupplyMLD: number; // External piped supply (default: 15.0)
  yieldGood: number; // 0.20
  yieldModerate: number; // 0.12
  yieldPoor: number; // 0.06
  roadBufferM: number; // 5000
  amenityBufferM: number; // 7500
  substationBufferM: number; // 10000
}

export interface LayerOverlay {
  id: 'terrain' | 'lulc' | 'flood' | 'landslide' | 'water' | 'ndvi';
  name: string;
  portal: string;
  visible: boolean;
  opacity: number;
  color: string;
  legend: { label: string; color: string }[];
}

export interface SmartZoning {
  residential_pct: number;
  residential_ha: number;
  commercial_it_pct: number;
  commercial_it_ha: number;
  sponge_parks_pct: number;
  sponge_parks_ha: number;
  renewable_microgrid_pct: number;
  renewable_microgrid_ha: number;
  transit_civic_pct: number;
  transit_civic_ha: number;
  rationale: string;
}

export interface RoadmapPhase {
  phase: string;
  years: string;
  focus: string;
  key_interventions: string[];
  estimated_capex_share_pct: number;
}

export interface ResilienceItem {
  domain: string;
  threat: string;
  countermeasure: string;
  space_sensor: string;
}

export interface AiReviewResponse {
  status: string;
  model_used: string;
  site_code: string;
  site_name: string;
  overall_score: number;
  verdict: string;
  executive_critique: string;
  key_strengths: string[];
  critical_vulnerabilities: string[];
  recommended_zoning: SmartZoning;
  phased_roadmap: RoadmapPhase[];
  climate_resilience_playbook: ResilienceItem[];
  custom_answer?: string | null;
}

export interface AiReviewRequest {
  region_id: string;
  site_code: string;
  site_name?: string;
  area_km2?: number;
  overall_score?: number;
  verdict?: string;
  has_dealbreaker?: boolean;
  dealbreakers?: string[];
  pillars?: Record<string, any>;
  key_indicators?: Record<string, any>;
  water_stress_index?: number;
  target_population?: number;
  horizon_year?: number;
  user_query?: string;
  api_key?: string;
}
