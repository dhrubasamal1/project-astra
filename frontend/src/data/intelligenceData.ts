// TerraAI - Intelligence Modules, Master-Plan Zoning, and Future Simulation Data

export interface TerrainIntelligenceData {
  elevationMin: number;
  elevationMax: number;
  elevationMean: number;
  slopeMean: number;
  slopeBuildableShare: number; // % < 2% or < 5%
  roughnessIndexTRI: number;
  dominantGeology: string;
  bearingCapacityKPa: number;
  bedrockDepthM: number;
  elevationProfile: { distanceKm: number; elevationM: number; slopeDeg: number }[];
  slopeDistribution: { range: string; percentage: number; suitability: string }[];
}

export interface SoilIntelligenceData {
  textureClass: string;
  composition: { sand: number; silt: number; clay: number };
  phLevel: number;
  organicCarbonPct: number;
  npkRating: { nitrogen: string; phosphorus: string; potassium: string };
  permeabilityMmHr: number;
  foundationSuitability: string;
  recommendedCrops: string[];
  recommendedUrbanVegetation: string[];
}

export interface WaterIntelligenceData {
  groundwaterDepthM: number;
  aquiferTrend10Yr: number; // m/year (e.g. -0.42 m/yr)
  annualRainfallMm: number;
  rainfallVariabilityCV: number;
  safeRechargeMLD: number;
  currentExtractionMLD: number;
  catchmentYieldPotentialMLD: number;
  harvestingTankCapacityML: number;
  historicalRainfall: { year: number; monsoonMm: number; nonMonsoonMm: number; normalMm: number }[];
  groundwaterTrend: { year: number; preMonsoonDepthM: number; postMonsoonDepthM: number }[];
}

export interface ClimateIntelligenceData {
  tempMeanSummer: number;
  tempMeanWinter: number;
  extremeHeatDaysYr: number;
  floodReturnPeriod25YrRiskPct: number;
  floodReturnPeriod100YrRiskPct: number;
  seismicZone: string;
  peakGroundAccelG: number;
  temperatureTrends: { year: number; observed: number; ssp245: number; ssp585: number }[];
  extremeRainfallEvents: { decade: string; eventsAbove65mm: number; eventsAbove115mm: number }[];
}

export interface EnergyIntelligenceData {
  solarGHIKWhM2Day: number; // Global Horizontal Irradiance
  solarDNIKWhM2Day: number; // Direct Normal Irradiance
  avgWindSpeed100mMs: number;
  windPowerDensityWM2: number;
  annualSolarHours: number;
  recommendedRooftopSolarMW: number;
  recommendedUtilitySolarMW: number;
  recommendedBESSStorageMWh: number;
  cleanEnergyOffsetPct: number;
  monthlySolarRadiation: { month: string; ghi: number; dni: number; tempC: number }[];
  dailyDemandVsGeneration: { hour: string; demandMW: number; solarMW: number; bessDischargeMW: number }[];
}

export interface VegetationIntelligenceData {
  ndviMean: number;
  ndviTrend5Yr: string;
  canopyCoverPct: number;
  greenCoverSharePct: number;
  greenSpacePerCapitaM2: number;
  ecologicalSensitivityIndex: string;
  recommendedCorridorBufferM: number;
  nativeSpecies: { name: string; type: string; waterRequirement: string; carbonSequestrationKgYr: number }[];
  seasonalNDVI: { month: string; ndvi: number; baselineTarget: number }[];
}

export interface MasterPlanZone {
  id: string;
  name: string;
  category: 'residential' | 'commercial' | 'industrial' | 'green' | 'water' | 'civic' | 'solar' | 'transit' | 'waste';
  color: string;
  areaAcres: number;
  areaKm2: number;
  areaPct: number;
  capacityUnits?: number; // e.g. residential population or commercial jobs
  density: 'High' | 'Medium' | 'Low' | 'Passive';
  description: string;
  coordinates: [number, number][]; // [lat, lng]
}

export interface MasterPlanLayout {
  id: string;
  name: string;
  scenario: string;
  totalAreaAcres: number;
  totalPopulation: number;
  greenCoverPct: number;
  renewableSharePct: number;
  transitAccessPct: number;
  waterSelfSufficiencyPct: number;
  zoning: MasterPlanZone[];
  aiSynthesis: string;
}

export interface DecadalSimulationStep {
  year: number;
  horizonLabel: string;
  isSimulated: boolean;
  population: number;
  waterDemandMLD: number;
  waterSupplyMLD: number;
  groundwaterDepthM: number;
  energyDemandMW: number;
  renewableGenerationMW: number;
  wasteTonsDay: number;
  circularRecyclingPct: number;
  greenCoverPct: number;
  urbanHeatIslandReductionC: number;
  infraInvestmentCr: number;
}

export const SITE_TERRAIN_DATA: Record<string, TerrainIntelligenceData> = {
  site_a: {
    elevationMin: 198.5,
    elevationMax: 206.2,
    elevationMean: 202.4,
    slopeMean: 1.1,
    slopeBuildableShare: 96.4,
    roughnessIndexTRI: 0.85,
    dominantGeology: 'Indo-Gangetic Older Alluvium (Bangar Plain)',
    bearingCapacityKPa: 185,
    bedrockDepthM: 320,
    elevationProfile: [
      { distanceKm: 0.0, elevationM: 204.8, slopeDeg: 0.8 },
      { distanceKm: 1.0, elevationM: 203.9, slopeDeg: 1.0 },
      { distanceKm: 2.0, elevationM: 202.7, slopeDeg: 1.2 },
      { distanceKm: 3.0, elevationM: 201.8, slopeDeg: 0.9 },
      { distanceKm: 4.0, elevationM: 201.2, slopeDeg: 1.3 },
      { distanceKm: 5.0, elevationM: 199.6, slopeDeg: 1.5 },
    ],
    slopeDistribution: [
      { range: '0° - 1.5° (Flat Plain)', percentage: 78.5, suitability: 'Optimal Buildable' },
      { range: '1.5° - 3.0° (Gentle)', percentage: 17.9, suitability: 'Highly Suitable' },
      { range: '3.0° - 5.0° (Moderate)', percentage: 3.2, suitability: 'Grading Required' },
      { range: '> 5.0° (Constrained)', percentage: 0.4, suitability: 'Drainage Buffer' },
    ],
  },
  site_b: {
    elevationMin: 188.2,
    elevationMax: 194.5,
    elevationMean: 190.8,
    slopeMean: 0.6,
    slopeBuildableShare: 42.1,
    roughnessIndexTRI: 0.42,
    dominantGeology: 'Active Yamuna Floodplain Newer Alluvium (Khadar)',
    bearingCapacityKPa: 95,
    bedrockDepthM: 380,
    elevationProfile: [
      { distanceKm: 0.0, elevationM: 193.8, slopeDeg: 0.5 },
      { distanceKm: 1.0, elevationM: 191.2, slopeDeg: 0.7 },
      { distanceKm: 2.0, elevationM: 190.1, slopeDeg: 0.4 },
      { distanceKm: 3.0, elevationM: 189.4, slopeDeg: 0.8 },
      { distanceKm: 4.0, elevationM: 188.7, slopeDeg: 0.6 },
      { distanceKm: 5.0, elevationM: 188.3, slopeDeg: 0.3 },
    ],
    slopeDistribution: [
      { range: '0° - 1.0° (Riparian Flat)', percentage: 92.4, suitability: 'Severe Inundation Risk' },
      { range: '1.0° - 2.5° (Gentle)', percentage: 6.8, suitability: 'Low Drainage Clearance' },
      { range: '> 2.5° (Depressions)', percentage: 0.8, suitability: 'Wetland Basin' },
    ],
  },
  site_c: {
    elevationMin: 201.0,
    elevationMax: 208.5,
    elevationMean: 204.6,
    slopeMean: 1.4,
    slopeBuildableShare: 91.2,
    roughnessIndexTRI: 1.12,
    dominantGeology: 'Indo-Gangetic Older Alluvium with Clayey Loam Mantle',
    bearingCapacityKPa: 165,
    bedrockDepthM: 310,
    elevationProfile: [
      { distanceKm: 0.0, elevationM: 207.5, slopeDeg: 1.2 },
      { distanceKm: 1.0, elevationM: 206.1, slopeDeg: 1.4 },
      { distanceKm: 2.0, elevationM: 205.2, slopeDeg: 1.1 },
      { distanceKm: 3.0, elevationM: 204.0, slopeDeg: 1.6 },
      { distanceKm: 4.0, elevationM: 203.1, slopeDeg: 1.3 },
      { distanceKm: 5.0, elevationM: 201.8, slopeDeg: 1.5 },
    ],
    slopeDistribution: [
      { range: '0° - 1.5° (Flat)', percentage: 71.0, suitability: 'Optimal Buildable' },
      { range: '1.5° - 3.0° (Gentle)', percentage: 20.2, suitability: 'Highly Suitable' },
      { range: '3.0° - 5.0° (Moderate)', percentage: 7.6, suitability: 'Grading Required' },
      { range: '> 5.0° (Micro-relief)', percentage: 1.2, suitability: 'Green Verge' },
    ],
  },
};

export const SITE_SOIL_DATA: Record<string, SoilIntelligenceData> = {
  site_a: {
    textureClass: 'Silty Loam (Indo-Gangetic Alluvial)',
    composition: { sand: 38, silt: 48, clay: 14 },
    phLevel: 7.4,
    organicCarbonPct: 0.58,
    npkRating: { nitrogen: 'Medium', phosphorus: 'High', potassium: 'High' },
    permeabilityMmHr: 16.5,
    foundationSuitability: 'Excellent for Medium-to-High Density Structural Foundations (IS 1904 compliant)',
    recommendedCrops: ['Wheat', 'Mustard', 'Horticulture (Guava, Citrus)', 'Millet'],
    recommendedUrbanVegetation: ['Neem (Azadirachta indica)', 'Peepal (Ficus religiosa)', 'Amaltas (Cassia fistula)', 'Gulmohar'],
  },
  site_b: {
    textureClass: 'Sandy Clay Alluvium (Riparian Hydric)',
    composition: { sand: 52, silt: 26, clay: 22 },
    phLevel: 8.1,
    organicCarbonPct: 0.82,
    npkRating: { nitrogen: 'High', phosphorus: 'Medium', potassium: 'Medium' },
    permeabilityMmHr: 8.2,
    foundationSuitability: 'Poor — High Liquefaction Potential in High Seismic Zone IV, Soil Subsidence Hazard',
    recommendedCrops: ['Paddy', 'Water Caltrop', 'Wetland Grasses'],
    recommendedUrbanVegetation: ['Bamboo', 'Arjun (Terminalia arjuna)', 'Willow', 'Vetiver Grass (for bank stabilization)'],
  },
  site_c: {
    textureClass: 'Clay Loam (Agricultural Plain)',
    composition: { sand: 32, silt: 42, clay: 26 },
    phLevel: 7.2,
    organicCarbonPct: 0.72,
    npkRating: { nitrogen: 'High', phosphorus: 'High', potassium: 'High' },
    permeabilityMmHr: 12.0,
    foundationSuitability: 'Good with Moderate Expansive Clay Pre-treatment / Raft Footing',
    recommendedCrops: ['Sugarcane', 'Wheat', 'Vegetables', 'Pulses'],
    recommendedUrbanVegetation: ['Jamun (Syzygium cumini)', 'Shisham (Dalbergia sissoo)', 'Kadam', 'Gulmohar'],
  },
};

export const SITE_WATER_DATA: Record<string, WaterIntelligenceData> = {
  site_a: {
    groundwaterDepthM: 14.2,
    aquiferTrend10Yr: -0.38,
    annualRainfallMm: 742,
    rainfallVariabilityCV: 0.28,
    safeRechargeMLD: 38.5,
    currentExtractionMLD: 24.2,
    catchmentYieldPotentialMLD: 46.8,
    harvestingTankCapacityML: 120,
    historicalRainfall: [
      { year: 2018, monsoonMm: 610, nonMonsoonMm: 95, normalMm: 740 },
      { year: 2019, monsoonMm: 685, nonMonsoonMm: 110, normalMm: 740 },
      { year: 2020, monsoonMm: 740, nonMonsoonMm: 80, normalMm: 740 },
      { year: 2021, monsoonMm: 890, nonMonsoonMm: 140, normalMm: 740 },
      { year: 2022, monsoonMm: 670, nonMonsoonMm: 105, normalMm: 740 },
      { year: 2023, monsoonMm: 720, nonMonsoonMm: 90, normalMm: 740 },
      { year: 2024, monsoonMm: 765, nonMonsoonMm: 115, normalMm: 740 },
    ],
    groundwaterTrend: [
      { year: 2018, preMonsoonDepthM: 12.8, postMonsoonDepthM: 11.2 },
      { year: 2019, preMonsoonDepthM: 13.1, postMonsoonDepthM: 11.6 },
      { year: 2020, preMonsoonDepthM: 13.4, postMonsoonDepthM: 11.9 },
      { year: 2021, preMonsoonDepthM: 13.6, postMonsoonDepthM: 11.8 },
      { year: 2022, preMonsoonDepthM: 13.9, postMonsoonDepthM: 12.3 },
      { year: 2023, preMonsoonDepthM: 14.1, postMonsoonDepthM: 12.5 },
      { year: 2024, preMonsoonDepthM: 14.4, postMonsoonDepthM: 12.7 },
    ],
  },
  site_b: {
    groundwaterDepthM: 3.4,
    aquiferTrend10Yr: -0.05,
    annualRainfallMm: 748,
    rainfallVariabilityCV: 0.31,
    safeRechargeMLD: 52.0,
    currentExtractionMLD: 18.0,
    catchmentYieldPotentialMLD: 58.0,
    harvestingTankCapacityML: 80,
    historicalRainfall: [
      { year: 2018, monsoonMm: 620, nonMonsoonMm: 100, normalMm: 745 },
      { year: 2019, monsoonMm: 690, nonMonsoonMm: 115, normalMm: 745 },
      { year: 2020, monsoonMm: 755, nonMonsoonMm: 85, normalMm: 745 },
      { year: 2021, monsoonMm: 910, nonMonsoonMm: 145, normalMm: 745 },
      { year: 2022, monsoonMm: 680, nonMonsoonMm: 110, normalMm: 745 },
      { year: 2023, monsoonMm: 730, nonMonsoonMm: 95, normalMm: 745 },
      { year: 2024, monsoonMm: 780, nonMonsoonMm: 120, normalMm: 745 },
    ],
    groundwaterTrend: [
      { year: 2018, preMonsoonDepthM: 3.8, postMonsoonDepthM: 2.1 },
      { year: 2019, preMonsoonDepthM: 3.6, postMonsoonDepthM: 2.0 },
      { year: 2020, preMonsoonDepthM: 3.5, postMonsoonDepthM: 1.9 },
      { year: 2021, preMonsoonDepthM: 3.4, postMonsoonDepthM: 1.5 },
      { year: 2022, preMonsoonDepthM: 3.5, postMonsoonDepthM: 2.1 },
      { year: 2023, preMonsoonDepthM: 3.4, postMonsoonDepthM: 2.0 },
      { year: 2024, preMonsoonDepthM: 3.4, postMonsoonDepthM: 1.9 },
    ],
  },
  site_c: {
    groundwaterDepthM: 16.8,
    aquiferTrend10Yr: -0.52,
    annualRainfallMm: 735,
    rainfallVariabilityCV: 0.27,
    safeRechargeMLD: 32.0,
    currentExtractionMLD: 34.5,
    catchmentYieldPotentialMLD: 42.0,
    harvestingTankCapacityML: 140,
    historicalRainfall: [
      { year: 2018, monsoonMm: 605, nonMonsoonMm: 90, normalMm: 735 },
      { year: 2019, monsoonMm: 680, nonMonsoonMm: 105, normalMm: 735 },
      { year: 2020, monsoonMm: 730, nonMonsoonMm: 75, normalMm: 735 },
      { year: 2021, monsoonMm: 875, nonMonsoonMm: 135, normalMm: 735 },
      { year: 2022, monsoonMm: 660, nonMonsoonMm: 100, normalMm: 735 },
      { year: 2023, monsoonMm: 715, nonMonsoonMm: 85, normalMm: 735 },
      { year: 2024, monsoonMm: 755, nonMonsoonMm: 110, normalMm: 735 },
    ],
    groundwaterTrend: [
      { year: 2018, preMonsoonDepthM: 14.5, postMonsoonDepthM: 13.1 },
      { year: 2019, preMonsoonDepthM: 15.0, postMonsoonDepthM: 13.5 },
      { year: 2020, preMonsoonDepthM: 15.4, postMonsoonDepthM: 13.9 },
      { year: 2021, preMonsoonDepthM: 15.8, postMonsoonDepthM: 14.0 },
      { year: 2022, preMonsoonDepthM: 16.2, postMonsoonDepthM: 14.6 },
      { year: 2023, preMonsoonDepthM: 16.5, postMonsoonDepthM: 14.9 },
      { year: 2024, preMonsoonDepthM: 16.8, postMonsoonDepthM: 15.2 },
    ],
  },
};

export const SITE_CLIMATE_DATA: Record<string, ClimateIntelligenceData> = {
  site_a: {
    tempMeanSummer: 41.2,
    tempMeanWinter: 8.5,
    extremeHeatDaysYr: 38,
    floodReturnPeriod25YrRiskPct: 4.2,
    floodReturnPeriod100YrRiskPct: 8.6,
    seismicZone: 'Zone IV (Severe Seismic Intensity, IS 1893:2016)',
    peakGroundAccelG: 0.24,
    temperatureTrends: [
      { year: 2025, observed: 25.8, ssp245: 25.8, ssp585: 25.8 },
      { year: 2030, observed: 26.1, ssp245: 26.2, ssp585: 26.4 },
      { year: 2035, observed: 26.3, ssp245: 26.5, ssp585: 26.9 },
      { year: 2040, observed: 26.5, ssp245: 26.8, ssp585: 27.5 },
      { year: 2045, observed: 26.7, ssp245: 27.1, ssp585: 28.1 },
      { year: 2050, observed: 27.0, ssp245: 27.4, ssp585: 28.8 },
    ],
    extremeRainfallEvents: [
      { decade: '1990-1999', eventsAbove65mm: 4, eventsAbove115mm: 1 },
      { decade: '2000-2009', eventsAbove65mm: 6, eventsAbove115mm: 2 },
      { decade: '2010-2019', eventsAbove65mm: 9, eventsAbove115mm: 3 },
      { decade: '2020-2024', eventsAbove65mm: 6, eventsAbove115mm: 2 },
    ],
  },
  site_b: {
    tempMeanSummer: 40.8,
    tempMeanWinter: 7.9,
    extremeHeatDaysYr: 34,
    floodReturnPeriod25YrRiskPct: 68.4,
    floodReturnPeriod100YrRiskPct: 89.2,
    seismicZone: 'Zone IV (Severe + Liquefaction Risk)',
    peakGroundAccelG: 0.26,
    temperatureTrends: [
      { year: 2025, observed: 25.5, ssp245: 25.5, ssp585: 25.5 },
      { year: 2030, observed: 25.8, ssp245: 25.9, ssp585: 26.1 },
      { year: 2035, observed: 26.0, ssp245: 26.2, ssp585: 26.6 },
      { year: 2040, observed: 26.2, ssp245: 26.5, ssp585: 27.2 },
      { year: 2045, observed: 26.4, ssp245: 26.8, ssp585: 27.8 },
      { year: 2050, observed: 26.6, ssp245: 27.1, ssp585: 28.4 },
    ],
    extremeRainfallEvents: [
      { decade: '1990-1999', eventsAbove65mm: 5, eventsAbove115mm: 2 },
      { decade: '2000-2009', eventsAbove65mm: 7, eventsAbove115mm: 3 },
      { decade: '2010-2019', eventsAbove65mm: 11, eventsAbove115mm: 5 },
      { decade: '2020-2024', eventsAbove65mm: 8, eventsAbove115mm: 3 },
    ],
  },
  site_c: {
    tempMeanSummer: 41.5,
    tempMeanWinter: 8.2,
    extremeHeatDaysYr: 41,
    floodReturnPeriod25YrRiskPct: 6.8,
    floodReturnPeriod100YrRiskPct: 12.4,
    seismicZone: 'Zone IV (Severe Seismic Intensity)',
    peakGroundAccelG: 0.24,
    temperatureTrends: [
      { year: 2025, observed: 26.0, ssp245: 26.0, ssp585: 26.0 },
      { year: 2030, observed: 26.3, ssp245: 26.4, ssp585: 26.6 },
      { year: 2035, observed: 26.5, ssp245: 26.7, ssp585: 27.1 },
      { year: 2040, observed: 26.8, ssp245: 27.0, ssp585: 27.7 },
      { year: 2045, observed: 27.0, ssp245: 27.3, ssp585: 28.3 },
      { year: 2050, observed: 27.3, ssp245: 27.6, ssp585: 29.0 },
    ],
    extremeRainfallEvents: [
      { decade: '1990-1999', eventsAbove65mm: 4, eventsAbove115mm: 1 },
      { decade: '2000-2009', eventsAbove65mm: 6, eventsAbove115mm: 2 },
      { decade: '2010-2019', eventsAbove65mm: 8, eventsAbove115mm: 3 },
      { decade: '2020-2024', eventsAbove65mm: 5, eventsAbove115mm: 2 },
    ],
  },
};

export const SITE_ENERGY_DATA: Record<string, EnergyIntelligenceData> = {
  site_a: {
    solarGHIKWhM2Day: 5.38,
    solarDNIKWhM2Day: 5.12,
    avgWindSpeed100mMs: 5.8,
    windPowerDensityWM2: 245,
    annualSolarHours: 2980,
    recommendedRooftopSolarMW: 125,
    recommendedUtilitySolarMW: 85,
    recommendedBESSStorageMWh: 380,
    cleanEnergyOffsetPct: 88.5,
    monthlySolarRadiation: [
      { month: 'Jan', ghi: 4.1, dni: 4.2, tempC: 14.2 },
      { month: 'Feb', ghi: 4.9, dni: 5.0, tempC: 18.5 },
      { month: 'Mar', ghi: 5.9, dni: 5.8, tempC: 24.8 },
      { month: 'Apr', ghi: 6.8, dni: 6.5, tempC: 31.2 },
      { month: 'May', ghi: 7.2, dni: 6.9, tempC: 36.4 },
      { month: 'Jun', ghi: 6.4, dni: 5.7, tempC: 35.8 },
      { month: 'Jul', ghi: 5.1, dni: 4.2, tempC: 31.5 },
      { month: 'Aug', ghi: 4.8, dni: 4.0, tempC: 30.2 },
      { month: 'Sep', ghi: 5.2, dni: 4.9, tempC: 29.8 },
      { month: 'Oct', ghi: 5.4, dni: 5.5, tempC: 26.4 },
      { month: 'Nov', ghi: 4.6, dni: 4.8, tempC: 20.1 },
      { month: 'Dec', ghi: 3.9, dni: 4.0, tempC: 15.0 },
    ],
    dailyDemandVsGeneration: [
      { hour: '00:00', demandMW: 42, solarMW: 0, bessDischargeMW: 24 },
      { hour: '04:00', demandMW: 38, solarMW: 0, bessDischargeMW: 22 },
      { hour: '08:00', demandMW: 65, solarMW: 38, bessDischargeMW: 10 },
      { hour: '12:00', demandMW: 92, solarMW: 145, bessDischargeMW: 0 },
      { hour: '16:00', demandMW: 84, solarMW: 72, bessDischargeMW: 5 },
      { hour: '20:00', demandMW: 98, solarMW: 0, bessDischargeMW: 58 },
    ],
  },
  site_b: {
    solarGHIKWhM2Day: 5.34,
    solarDNIKWhM2Day: 5.08,
    avgWindSpeed100mMs: 6.2,
    windPowerDensityWM2: 275,
    annualSolarHours: 2950,
    recommendedRooftopSolarMW: 45,
    recommendedUtilitySolarMW: 30,
    recommendedBESSStorageMWh: 180,
    cleanEnergyOffsetPct: 62.0,
    monthlySolarRadiation: [
      { month: 'Jan', ghi: 4.0, dni: 4.1, tempC: 13.8 },
      { month: 'Feb', ghi: 4.8, dni: 4.9, tempC: 18.0 },
      { month: 'Mar', ghi: 5.8, dni: 5.7, tempC: 24.2 },
      { month: 'Apr', ghi: 6.7, dni: 6.4, tempC: 30.8 },
      { month: 'May', ghi: 7.1, dni: 6.8, tempC: 36.0 },
      { month: 'Jun', ghi: 6.3, dni: 5.6, tempC: 35.4 },
      { month: 'Jul', ghi: 5.0, dni: 4.1, tempC: 31.0 },
      { month: 'Aug', ghi: 4.7, dni: 3.9, tempC: 29.8 },
      { month: 'Sep', ghi: 5.1, dni: 4.8, tempC: 29.4 },
      { month: 'Oct', ghi: 5.3, dni: 5.4, tempC: 26.0 },
      { month: 'Nov', ghi: 4.5, dni: 4.7, tempC: 19.8 },
      { month: 'Dec', ghi: 3.8, dni: 3.9, tempC: 14.6 },
    ],
    dailyDemandVsGeneration: [
      { hour: '00:00', demandMW: 32, solarMW: 0, bessDischargeMW: 18 },
      { hour: '04:00', demandMW: 28, solarMW: 0, bessDischargeMW: 15 },
      { hour: '08:00', demandMW: 48, solarMW: 26, bessDischargeMW: 8 },
      { hour: '12:00', demandMW: 70, solarMW: 95, bessDischargeMW: 0 },
      { hour: '16:00', demandMW: 62, solarMW: 48, bessDischargeMW: 4 },
      { hour: '20:00', demandMW: 74, solarMW: 0, bessDischargeMW: 42 },
    ],
  },
  site_c: {
    solarGHIKWhM2Day: 5.42,
    solarDNIKWhM2Day: 5.18,
    avgWindSpeed100mMs: 5.6,
    windPowerDensityWM2: 235,
    annualSolarHours: 3010,
    recommendedRooftopSolarMW: 110,
    recommendedUtilitySolarMW: 75,
    recommendedBESSStorageMWh: 340,
    cleanEnergyOffsetPct: 82.0,
    monthlySolarRadiation: [
      { month: 'Jan', ghi: 4.2, dni: 4.3, tempC: 14.5 },
      { month: 'Feb', ghi: 5.0, dni: 5.1, tempC: 18.8 },
      { month: 'Mar', ghi: 6.0, dni: 5.9, tempC: 25.1 },
      { month: 'Apr', ghi: 6.9, dni: 6.6, tempC: 31.5 },
      { month: 'May', ghi: 7.3, dni: 7.0, tempC: 36.8 },
      { month: 'Jun', ghi: 6.5, dni: 5.8, tempC: 36.1 },
      { month: 'Jul', ghi: 5.2, dni: 4.3, tempC: 31.8 },
      { month: 'Aug', ghi: 4.9, dni: 4.1, tempC: 30.5 },
      { month: 'Sep', ghi: 5.3, dni: 5.0, tempC: 30.1 },
      { month: 'Oct', ghi: 5.5, dni: 5.6, tempC: 26.8 },
      { month: 'Nov', ghi: 4.7, dni: 4.9, tempC: 20.4 },
      { month: 'Dec', ghi: 4.0, dni: 4.1, tempC: 15.3 },
    ],
    dailyDemandVsGeneration: [
      { hour: '00:00', demandMW: 40, solarMW: 0, bessDischargeMW: 22 },
      { hour: '04:00', demandMW: 35, solarMW: 0, bessDischargeMW: 20 },
      { hour: '08:00', demandMW: 60, solarMW: 34, bessDischargeMW: 8 },
      { hour: '12:00', demandMW: 86, solarMW: 132, bessDischargeMW: 0 },
      { hour: '16:00', demandMW: 78, solarMW: 65, bessDischargeMW: 5 },
      { hour: '20:00', demandMW: 90, solarMW: 0, bessDischargeMW: 52 },
    ],
  },
};

export const SITE_VEGETATION_DATA: Record<string, VegetationIntelligenceData> = {
  site_a: {
    ndviMean: 0.38,
    ndviTrend5Yr: '+4.2% (Moderate Seasonal Cultivation)',
    canopyCoverPct: 8.6,
    greenCoverSharePct: 28.5,
    greenSpacePerCapitaM2: 18.4,
    ecologicalSensitivityIndex: 'Low-to-Moderate (Agricultural Anthropogenic Landscape)',
    recommendedCorridorBufferM: 120,
    nativeSpecies: [
      { name: 'Neem (Azadirachta indica)', type: 'Canopy Tree', waterRequirement: 'Low', carbonSequestrationKgYr: 32 },
      { name: 'Peepal (Ficus religiosa)', type: 'Keystone Tree', waterRequirement: 'Medium', carbonSequestrationKgYr: 48 },
      { name: 'Amaltas (Cassia fistula)', type: 'Flowering Tree', waterRequirement: 'Low', carbonSequestrationKgYr: 18 },
      { name: 'Sheesham (Dalbergia sissoo)', type: 'Hardwood Tree', waterRequirement: 'Medium', carbonSequestrationKgYr: 28 },
    ],
    seasonalNDVI: [
      { month: 'Jan', ndvi: 0.42, baselineTarget: 0.35 },
      { month: 'Mar', ndvi: 0.48, baselineTarget: 0.35 },
      { month: 'May', ndvi: 0.22, baselineTarget: 0.35 },
      { month: 'Jul', ndvi: 0.38, baselineTarget: 0.35 },
      { month: 'Sep', ndvi: 0.58, baselineTarget: 0.35 },
      { month: 'Nov', ndvi: 0.34, baselineTarget: 0.35 },
    ],
  },
  site_b: {
    ndviMean: 0.56,
    ndviTrend5Yr: '+8.1% (Riparian Wetland Vegetation)',
    canopyCoverPct: 22.4,
    greenCoverSharePct: 64.2,
    greenSpacePerCapitaM2: 44.0,
    ecologicalSensitivityIndex: 'CRITICAL HIGH (Yamuna Riverine Wildlife Corridor)',
    recommendedCorridorBufferM: 500,
    nativeSpecies: [
      { name: 'Arjun (Terminalia arjuna)', type: 'Riparian Anchor', waterRequirement: 'High', carbonSequestrationKgYr: 42 },
      { name: 'Jamun (Syzygium cumini)', type: 'Fruit/Canopy', waterRequirement: 'High', carbonSequestrationKgYr: 36 },
      { name: 'Typha / Reed Grasses', type: 'Wetland Filter', waterRequirement: 'Aquatic', carbonSequestrationKgYr: 12 },
    ],
    seasonalNDVI: [
      { month: 'Jan', ndvi: 0.52, baselineTarget: 0.45 },
      { month: 'Mar', ndvi: 0.48, baselineTarget: 0.45 },
      { month: 'May', ndvi: 0.39, baselineTarget: 0.45 },
      { month: 'Jul', ndvi: 0.62, baselineTarget: 0.45 },
      { month: 'Sep', ndvi: 0.74, baselineTarget: 0.45 },
      { month: 'Nov', ndvi: 0.58, baselineTarget: 0.45 },
    ],
  },
  site_c: {
    ndviMean: 0.44,
    ndviTrend5Yr: '+1.8% (Double-Cropped Prime Farmland)',
    canopyCoverPct: 6.2,
    greenCoverSharePct: 78.0,
    greenSpacePerCapitaM2: 12.8,
    ecologicalSensitivityIndex: 'High Agricultural Displacement Sensitivity',
    recommendedCorridorBufferM: 150,
    nativeSpecies: [
      { name: 'Babool (Acacia nilotica)', type: 'Hardy Boundary Tree', waterRequirement: 'Low', carbonSequestrationKgYr: 20 },
      { name: 'Kadam (Neolamarckia cadamba)', type: 'Fast-growing Shade', waterRequirement: 'Medium', carbonSequestrationKgYr: 34 },
      { name: 'Subabul (Leucaena leucocephala)', type: 'Agro-forestry', waterRequirement: 'Low', carbonSequestrationKgYr: 22 },
    ],
    seasonalNDVI: [
      { month: 'Jan', ndvi: 0.54, baselineTarget: 0.40 },
      { month: 'Mar', ndvi: 0.62, baselineTarget: 0.40 },
      { month: 'May', ndvi: 0.18, baselineTarget: 0.40 },
      { month: 'Jul', ndvi: 0.44, baselineTarget: 0.40 },
      { month: 'Sep', ndvi: 0.68, baselineTarget: 0.40 },
      { month: 'Nov', ndvi: 0.36, baselineTarget: 0.40 },
    ],
  },
};

// Generative Master Plan Layout Presets
export const DEMO_MASTER_PLANS: Record<string, MasterPlanLayout> = {
  layout_a: {
    id: 'layout_a',
    name: 'Layout Alpha — Transit-Oriented Eco-Metropolis',
    scenario: 'Optimized for high pedestrian transit access, 100% renewable generation, and centralized retention lakes.',
    totalAreaAcres: 500,
    totalPopulation: 25000,
    greenCoverPct: 34.5,
    renewableSharePct: 92.0,
    transitAccessPct: 94.2,
    waterSelfSufficiencyPct: 88.0,
    zoning: [
      {
        id: 'z1',
        name: 'Sector 1 — Eco-Residential Quarter',
        category: 'residential',
        color: '#60A5FA', // Soft Blue
        areaAcres: 165,
        areaKm2: 0.67,
        areaPct: 33.0,
        capacityUnits: 18000,
        density: 'Medium',
        description: 'Biophilic multi-family residential clusters with passive cooling courtyards and rooftop solar arrays.',
        coordinates: [
          [28.205, 77.565],
          [28.205, 77.595],
          [28.190, 77.595],
          [28.190, 77.565],
        ],
      },
      {
        id: 'z2',
        name: 'Sector 2 — Innovation & Commercial Core',
        category: 'commercial',
        color: '#22D3EE', // Cyan
        areaAcres: 85,
        areaKm2: 0.34,
        areaPct: 17.0,
        capacityUnits: 14000,
        density: 'High',
        description: 'Mixed-use smart tech offices, co-working incubators, retail arcades centered on rapid transit spine.',
        coordinates: [
          [28.205, 77.595],
          [28.205, 77.608],
          [28.190, 77.608],
          [28.190, 77.595],
        ],
      },
      {
        id: 'z3',
        name: 'Sector 3 — Central Ecological Park & Urban Forest',
        category: 'green',
        color: '#34D399', // Emerald
        areaAcres: 120,
        areaKm2: 0.49,
        areaPct: 24.0,
        density: 'Passive',
        description: 'Native botanical reserve, biodiversity corridor, continuous walking/cycling trails, and microclimate sink.',
        coordinates: [
          [28.190, 77.565],
          [28.190, 77.590],
          [28.178, 77.590],
          [28.178, 77.565],
        ],
      },
      {
        id: 'z4',
        name: 'Sector 4 — Bioswale Wetland & Water Retention Basin',
        category: 'water',
        color: '#38BDF8', // Sky Blue
        areaAcres: 45,
        areaKm2: 0.18,
        areaPct: 9.0,
        density: 'Passive',
        description: 'Engineered stormwater detention lake with integrated floating reed-bed bio-filtration for urban recharge.',
        coordinates: [
          [28.190, 77.590],
          [28.190, 77.608],
          [28.180, 77.608],
          [28.180, 77.590],
        ],
      },
      {
        id: 'z5',
        name: 'Sector 5 — Clean Energy & Agrivoltaic Microgrid',
        category: 'solar',
        color: '#FBBF24', // Amber
        areaAcres: 45,
        areaKm2: 0.18,
        areaPct: 9.0,
        density: 'Low',
        description: '45MW bifacial solar farm elevated over organic shade-grown community crops with 120MWh BESS storage.',
        coordinates: [
          [28.180, 77.590],
          [28.180, 77.608],
          [28.175, 77.608],
          [28.175, 77.590],
        ],
      },
      {
        id: 'z6',
        name: 'Sector 6 — Healthcare, Civic & Academic Campus',
        category: 'civic',
        color: '#A78BFA', // Soft Purple
        areaAcres: 25,
        areaKm2: 0.10,
        areaPct: 5.0,
        capacityUnits: 3500,
        density: 'Medium',
        description: 'District hospital with emergency helipad, primary school, community resilience disaster shelter.',
        coordinates: [
          [28.178, 77.565],
          [28.178, 77.585],
          [28.175, 77.585],
          [28.175, 77.565],
        ],
      },
      {
        id: 'z7',
        name: 'Sector 7 — Circular Resource & Waste Recovery Hub',
        category: 'waste',
        color: '#94A3B8', // Slate
        areaAcres: 15,
        areaKm2: 0.06,
        areaPct: 3.0,
        density: 'Low',
        description: 'Zero-landfill automated material sorting, aerobic composting facility, and greywater recycling station.',
        coordinates: [
          [28.178, 77.585],
          [28.178, 77.590],
          [28.175, 77.590],
          [28.175, 77.585],
        ],
      },
    ],
    aiSynthesis:
      'Layout Alpha maximizes ecological resilience by positioning high-density commercial blocks along the eastern expressway feeder while dedicating 34.5% of parcel footprint to continuous green corridors and flood buffering.',
  },
  layout_b: {
    id: 'layout_b',
    name: 'Layout Beta — High-Density Circular Agro-City',
    scenario: 'Emphasizes agricultural buffer preservation, urban farming perimeters, and decentralized microgrids.',
    totalAreaAcres: 500,
    totalPopulation: 20000,
    greenCoverPct: 42.0,
    renewableSharePct: 96.5,
    transitAccessPct: 88.0,
    waterSelfSufficiencyPct: 94.0,
    zoning: [
      {
        id: 'z1_b',
        name: 'Sector 1 — Compact Solar-Ready Living Hub',
        category: 'residential',
        color: '#60A5FA',
        areaAcres: 135,
        areaKm2: 0.55,
        areaPct: 27.0,
        capacityUnits: 15000,
        density: 'High',
        description: 'High-density compact residential towers preserving open space.',
        coordinates: [
          [28.205, 77.570],
          [28.205, 77.595],
          [28.192, 77.595],
          [28.192, 77.570],
        ],
      },
      {
        id: 'z2_b',
        name: 'Sector 2 — Clean Agri-Tech & Commerce',
        category: 'commercial',
        color: '#22D3EE',
        areaAcres: 65,
        areaKm2: 0.26,
        areaPct: 13.0,
        capacityUnits: 8500,
        density: 'Medium',
        description: 'Agri-logistics, food labs, research incubators.',
        coordinates: [
          [28.205, 77.595],
          [28.205, 77.608],
          [28.192, 77.608],
          [28.192, 77.595],
        ],
      },
      {
        id: 'z3_b',
        name: 'Sector 3 — Community Agro-Forestry & Green Belt',
        category: 'green',
        color: '#34D399',
        areaAcres: 155,
        areaKm2: 0.63,
        areaPct: 31.0,
        density: 'Passive',
        description: 'Perimeter protective greenbelt reducing urban heat island effect by 3.2°C.',
        coordinates: [
          [28.192, 77.565],
          [28.192, 77.595],
          [28.175, 77.595],
          [28.175, 77.565],
        ],
      },
      {
        id: 'z4_b',
        name: 'Sector 4 — Cascade Retention Ponds & Aquifer Injection',
        category: 'water',
        color: '#38BDF8',
        areaAcres: 55,
        areaKm2: 0.22,
        areaPct: 11.0,
        density: 'Passive',
        description: 'Cascade of four shallow retention lakes recharging alluvial aquifer.',
        coordinates: [
          [28.192, 77.595],
          [28.192, 77.608],
          [28.180, 77.608],
          [28.180, 77.595],
        ],
      },
      {
        id: 'z5_b',
        name: 'Sector 5 — Solar & Wind Distributed Substation',
        category: 'solar',
        color: '#FBBF24',
        areaAcres: 60,
        areaKm2: 0.24,
        areaPct: 12.0,
        density: 'Low',
        description: 'Integrated solar PV and vertical-axis wind turbine park.',
        coordinates: [
          [28.180, 77.595],
          [28.180, 77.608],
          [28.175, 77.608],
          [28.175, 77.595],
        ],
      },
      {
        id: 'z6_b',
        name: 'Sector 6 — Civic Poly-Clinic & Green Schools',
        category: 'civic',
        color: '#A78BFA',
        areaAcres: 30,
        areaKm2: 0.12,
        areaPct: 6.0,
        capacityUnits: 3000,
        density: 'Medium',
        description: 'LEED Platinum certified civic institutions.',
        coordinates: [
          [28.205, 77.565],
          [28.205, 77.570],
          [28.192, 77.570],
          [28.192, 77.565],
        ],
      },
    ],
    aiSynthesis:
      'Layout Beta shifts emphasis onto food and water sovereignty by allocating 42% total green and agricultural space, resulting in higher water self-sufficiency (94%) at a slightly reduced population capacity.',
  },
};

// Decadal Future Simulation Steps (2026 - 2125)
export const DECADAL_SIMULATION_DATA: DecadalSimulationStep[] = [
  {
    year: 2026,
    horizonLabel: 'Current Baseline (ISRO Measured)',
    isSimulated: false,
    population: 25000,
    waterDemandMLD: 3.38,
    waterSupplyMLD: 4.80,
    groundwaterDepthM: 14.2,
    energyDemandMW: 12.5,
    renewableGenerationMW: 14.8,
    wasteTonsDay: 11.2,
    circularRecyclingPct: 45.0,
    greenCoverPct: 28.5,
    urbanHeatIslandReductionC: 0.8,
    infraInvestmentCr: 450,
  },
  {
    year: 2035,
    horizonLabel: '10-Year Horizon (Phase 1 Maturity)',
    isSimulated: true,
    population: 85000,
    waterDemandMLD: 11.48,
    waterSupplyMLD: 13.80,
    groundwaterDepthM: 14.8,
    energyDemandMW: 38.0,
    renewableGenerationMW: 42.5,
    wasteTonsDay: 38.0,
    circularRecyclingPct: 68.0,
    greenCoverPct: 32.0,
    urbanHeatIslandReductionC: 1.6,
    infraInvestmentCr: 1280,
  },
  {
    year: 2045,
    horizonLabel: '20-Year Horizon (Full Scale Greenfield)',
    isSimulated: true,
    population: 220000,
    waterDemandMLD: 29.70,
    waterSupplyMLD: 32.50,
    groundwaterDepthM: 15.6,
    energyDemandMW: 92.0,
    renewableGenerationMW: 98.0,
    wasteTonsDay: 96.0,
    circularRecyclingPct: 82.0,
    greenCoverPct: 35.0,
    urbanHeatIslandReductionC: 2.3,
    infraInvestmentCr: 2850,
  },
  {
    year: 2075,
    horizonLabel: '50-Year Horizon (Autonomous Circular Urbanism)',
    isSimulated: true,
    population: 450000,
    waterDemandMLD: 60.75,
    waterSupplyMLD: 64.20,
    groundwaterDepthM: 16.4,
    energyDemandMW: 185.0,
    renewableGenerationMW: 210.0,
    wasteTonsDay: 195.0,
    circularRecyclingPct: 95.0,
    greenCoverPct: 38.0,
    urbanHeatIslandReductionC: 3.1,
    infraInvestmentCr: 5400,
  },
  {
    year: 2125,
    horizonLabel: '100-Year Century Projection (Net-Zero Resilient Arc)',
    isSimulated: true,
    population: 620000,
    waterDemandMLD: 83.70,
    waterSupplyMLD: 88.00,
    groundwaterDepthM: 16.1,
    energyDemandMW: 240.0,
    renewableGenerationMW: 295.0,
    wasteTonsDay: 260.0,
    circularRecyclingPct: 98.5,
    greenCoverPct: 41.5,
    urbanHeatIslandReductionC: 3.8,
    infraInvestmentCr: 9200,
  },
];

// ISRO Portal Live Telemetry Profiles
export interface IsroPortalProfile {
  id: 'bhoonidhi' | 'bhuvan' | 'mosdac' | 'vedas';
  name: string;
  agency: string;
  mission: string;
  datasets: string[];
  connectionStatus: 'connected' | 'syncing' | 'offline';
  lastPing: string;
  spatialResolution: string;
  temporalCadence: string;
  spectralBands: string[];
  coverageStatus: string;
  url: string;
  overview: string;
  sampleTelemetry: { parameter: string; value: string; quality: string }[];
}

export const ISRO_PORTALS: IsroPortalProfile[] = [
  {
    id: 'bhoonidhi',
    name: 'BHOONIDHI',
    agency: 'NRSC (National Remote Sensing Centre)',
    mission: 'Cartosat-1 Stereo PAN / Cartosat-2/3 Missions',
    datasets: [
      'CartoDEM Version 3.1 R1 (30m Elevation)',
      'Slope Angle & Aspect Grids',
      'Terrain Ruggedness Index (TRI)',
      'HAND (Height Above Nearest Drainage)',
    ],
    connectionStatus: 'connected',
    lastPing: '2 mins ago (Live Token API)',
    spatialResolution: '30m postings (0.0002778° geodetic)',
    temporalCadence: 'Annual Re-baseline / On-Demand Ortho',
    spectralBands: ['Panchromatic (0.50 - 0.75 µm)', 'Stereo Fore/Aft 2.5m Ground Postings'],
    coverageStatus: '100% Pan-India Geodetic Coverage',
    url: 'https://bhoonidhi.nrsc.gov.in',
    overview:
      'Bhoonidhi is ISRO NRSC’s open earth observation data dissemination hub, providing CartoDEM stereo-derived elevation models, slope rasters, and terrain geomorphology.',
    sampleTelemetry: [
      { parameter: 'Elevation Datum', value: 'WGS84 EGM96 Geoid', quality: 'Statutory ISRO Calibration' },
      { parameter: 'Mean RMSE Vertical', value: '±2.85 meters', quality: 'Sub-3m High Precision' },
      { parameter: 'Void Filling Mask', value: 'Stereo Pair Auto-Correlation', quality: 'Complete 0% Gaps' },
      { parameter: 'Zonal Projection', value: 'UTM Zone 43N / EPSG:32643', quality: 'Standard Metric' },
    ],
  },
  {
    id: 'bhuvan',
    name: 'BHUVAN',
    agency: 'NRSC (National Remote Sensing Centre)',
    mission: 'Resourcesat-2/2A (LISS-III / LISS-IV) & Multi-Mission Optical',
    datasets: [
      '1:50,000 Thematic LULC (55 Classification Codes)',
      'Historical Multi-Year Flood Hazard Inundation Zonation',
      'Groundwater Prospects & Geomorphology Layers',
      'Wasteland & Agricultural Atlas Boundaries',
    ],
    connectionStatus: 'connected',
    lastPing: '1 min ago (OGC WMS / Tile Server)',
    spatialResolution: '1:50,000 scale equivalent (~15m-23m)',
    temporalCadence: 'Biennial Cycle (2022-2023 Current)',
    spectralBands: ['Green (B2)', 'Red (B3)', 'NIR (B4)', 'SWIR (B5)'],
    coverageStatus: '100% Verified Regional Coverage',
    url: 'https://bhuvan.nrsc.gov.in',
    overview:
      'Bhuvan is India’s flagship national geoportal delivering validated thematic mapping products, land use / land cover classifications, and multi-temporal satellite flood inundation records.',
    sampleTelemetry: [
      { parameter: 'LULC Accuracy', value: '91.4% Overall Thematic Accuracy', quality: 'Ground-Truthed' },
      { parameter: 'Flood Frequency Vintage', value: '1998-2023 Multi-Year Recurrence', quality: '25-Year Empirical' },
      { parameter: 'Aquifer Yield Prospect', value: 'Yield Class II: 50-100 LPM', quality: 'Hydro-Geological' },
      { parameter: 'Protocol', value: 'OGC WMS 1.3.0 & REST GeoPackage', quality: 'Standard Web GIS' },
    ],
  },
  {
    id: 'mosdac',
    name: 'MOSDAC',
    agency: 'SAC (Space Applications Centre, Ahmedabad)',
    mission: 'INSAT-3D & INSAT-3DR Geostationary Imager & Sounder',
    datasets: [
      'Hydro-Estimator (HEM) Daily Rainfall Climatology',
      '10-Year Precipitation Normals (2014-2024)',
      'Rainfall Variability Coefficient of Variation (CV)',
      'Consecutive Dry-Month Drought Exposure Index',
    ],
    connectionStatus: 'connected',
    lastPing: '4 mins ago (NetCDF4 / SAC API)',
    spatialResolution: '4km x 4km Gridded Meteorological Surface',
    temporalCadence: 'Half-Hourly Synoptic / Daily Aggregated',
    spectralBands: ['Visible (0.55-0.75 µm)', 'Thermal IR-1 (10.3-11.3 µm)', 'Water Vapour (6.5-7.1 µm)'],
    coverageStatus: '100% Full Indian Subcontinent & Oceanic Disc',
    url: 'https://mosdac.gov.in',
    overview:
      'MOSDAC is the meteorological and oceanographic satellite data archival centre at SAC ISRO, streaming geostationary meteorological indices, calibrated precipitation, and monsoonal climatology.',
    sampleTelemetry: [
      { parameter: 'Rainfall Cross-Val', value: 'IMD Rain-Gauge Calibrated', quality: 'r = 0.88 Correlation' },
      { parameter: 'Synoptic Update', value: 'Every 30 Minutes UTC', quality: 'Real-time Atmospheric' },
      { parameter: 'Drought Monitor', value: 'Standardized Precipitation Index (SPI)', quality: '3-Month Rolling' },
      { parameter: 'Archive Depth', value: 'Continuous since 2013 launch', quality: 'Complete Decadal' },
    ],
  },
  {
    id: 'vedas',
    name: 'VEDAS',
    agency: 'SAC (Space Applications Centre, Ahmedabad)',
    mission: 'Sentinel-2 MSI (ISRO SAC National Mirror) & Cartosat Optical',
    datasets: [
      'Multi-Temporal 10m NDVI Biomass Composite',
      'Vegetation Health & Vigor Anomaly Index',
      'Urban Boundary Sprawl & Impervious Surface Ratio',
      'Surface Solar Insolation & Global Horizontal Irradiance',
    ],
    connectionStatus: 'connected',
    lastPing: '3 mins ago (SAC Cloud Mirror)',
    spatialResolution: '10m Multi-Spectral Pixels',
    temporalCadence: '16-Day Cloud-Masked Composites',
    spectralBands: ['13 Spectral Bands (B2-Blue, B3-Green, B4-Red, B8-NIR, B11-SWIR)'],
    coverageStatus: '100% Regional Mirror Active',
    url: 'https://vedas.sac.gov.in',
    overview:
      'VEDAS (Visualisation of Earth observation Data and Archival System) offers interactive environmental, renewable energy, and vegetation indices derived from high-resolution multi-spectral satellites.',
    sampleTelemetry: [
      { parameter: 'NDVI Formula', value: '(NIR - Red) / (NIR + Red) 10m', quality: 'Atmosphere Corrected' },
      { parameter: 'Cloud Clearing', value: 'S2cloudless Probabilistic Masking', quality: '< 5% Cloud Residue' },
      { parameter: 'Solar GHI Model', value: 'Heliosat-Derived Climatology', quality: '±4.2% Pyranometer Error' },
      { parameter: 'Urban Impervious', value: 'Normalized Difference Built-up Index (NDBI)', quality: 'Automated Zonation' },
    ],
  },
];
