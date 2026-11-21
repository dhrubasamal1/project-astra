import React, { useState } from 'react';
import {
  Satellite,
  ArrowRight,
  ShieldCheck,
  Globe,
  Sparkles,
  Layers,
  TrendingUp,
  Droplets,
  Zap,
  Building2,
  Compass,
  CheckCircle2,
  AlertTriangle,
  FileText,
  MapPin,
  ExternalLink,
  ChevronRight,
  BarChart3,
  Sliders,
} from 'lucide-react';
import { ISRO_PORTALS } from '../../data/intelligenceData';

interface LandingPageProps {
  onStartPlanning: () => void;
  onExploreModule?: (moduleId: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartPlanning }) => {
  const [activeTab, setActiveTab] = useState<'how' | 'portals' | 'designer'>('how');

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#07111F] text-[#F1F5F9] font-sans selection:bg-[#22D3EE]/30 selection:text-[#22D3EE] overflow-y-auto overflow-x-hidden">
      {/* 1. Header Navigation */}
      <header className="sticky top-0 z-40 bg-[#07111F]/85 backdrop-blur-xl border-b border-white/[0.08] px-6 lg:px-12 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center">
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-[#22D3EE] via-[#38BDF8] to-[#34D399] opacity-50 blur-sm"></div>
            <div className="relative w-9 h-9 rounded-lg bg-[#0D1928] border border-white/[0.12] flex items-center justify-center shadow-lg">
              <Satellite className="w-5 h-5 text-[#22D3EE] animate-pulse" />
            </div>
          </div>
          <div>
            <span className="font-heading font-extrabold text-lg tracking-tight text-[#F1F5F9]">
              Terra<span className="text-[#22D3EE]">AI</span>
            </span>
            <span className="text-[10px] text-[#94A3B8] block leading-none font-mono">
              Intelligence for Tomorrow
            </span>
          </div>
        </div>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center space-x-8 text-xs font-medium text-[#94A3B8]">
          <button onClick={() => scrollToSection('how-it-works')} className="hover:text-[#F1F5F9] transition-colors">
            How It Works
          </button>
          <button onClick={() => scrollToSection('site-selection')} className="hover:text-[#F1F5F9] transition-colors">
            Site Screening
          </button>
          <button onClick={() => scrollToSection('city-designer')} className="hover:text-[#F1F5F9] transition-colors">
            AI City Designer
          </button>
          <button onClick={() => scrollToSection('simulation')} className="hover:text-[#F1F5F9] transition-colors">
            2026–2050 Simulation
          </button>
          <button onClick={() => scrollToSection('isro-portals')} className="hover:text-[#F1F5F9] transition-colors">
            ISRO Data
          </button>
        </nav>

        {/* CTA Launch App */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onStartPlanning}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#22D3EE] via-[#06B6D4] to-[#34D399] text-[#07111F] font-heading font-bold text-xs shadow-lg shadow-[#22D3EE]/20 hover:shadow-[#22D3EE]/40 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <span>Launch Platform</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. Hero Section with 3D Geospatial Illustration & Orbit */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-6 lg:px-12 py-16 overflow-hidden">
        {/* Background Topographic Contour Grid */}
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="topoGrid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(34, 211, 238, 0.4)" strokeWidth="0.5" />
                <circle cx="30" cy="30" r="1.5" fill="rgba(52, 211, 153, 0.4)" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#topoGrid)" />
          </svg>
        </div>

        {/* Radial ambient lighting */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-[#22D3EE]/10 via-[#34D399]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#111F30] border border-[#22D3EE]/40 text-[#22D3EE] text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-[#22D3EE] animate-ping" />
              <span>EARTH OBSERVATION AI PLATFORM • ASTRA 2026</span>
            </div>

            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[#F1F5F9] tracking-tight leading-[1.1]">
              Plan the Cities <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22D3EE] via-[#38BDF8] to-[#34D399]">
                of Tomorrow.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#94A3B8] leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
              Transform satellite intelligence, geospatial data and artificial intelligence into sustainable urban master
              plans. Screen candidate land parcels, stress-test climate resilience, and generate generative zoning with ISRO
              earth observation data.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onStartPlanning}
                className="w-full sm:w-auto flex items-center justify-center space-x-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#22D3EE] to-[#34D399] text-[#07111F] font-heading font-bold text-sm shadow-xl shadow-[#22D3EE]/25 hover:shadow-[#22D3EE]/45 hover:scale-[1.02] active:scale-95 transition-all"
              >
                <span>Start Planning</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => scrollToSection('how-it-works')}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-[#111F30] hover:bg-[#17283A] border border-white/[0.12] text-[#F1F5F9] font-medium text-sm transition-all"
              >
                <span>Explore Platform</span>
                <ChevronRight className="w-4 h-4 text-[#94A3B8]" />
              </button>
            </div>

            {/* Micro Data Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/[0.08] max-w-lg mx-auto lg:mx-0 text-left">
              <div>
                <div className="text-xs font-mono font-bold text-[#22D3EE]">4 OFFICIAL</div>
                <div className="text-[11px] text-[#94A3B8]">ISRO Geoportals</div>
              </div>
              <div>
                <div className="text-xs font-mono font-bold text-[#34D399]">&lt; 150 ms</div>
                <div className="text-[11px] text-[#94A3B8]">Zonal Clipping</div>
              </div>
              <div>
                <div className="text-xs font-mono font-bold text-[#FBBF24]">2026–2050</div>
                <div className="text-[11px] text-[#94A3B8]">Water Stress Sim</div>
              </div>
            </div>
          </div>

          {/* Right Visual Column: Interactive 3D Geospatial Illustration with Animated Orbit */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full max-w-[420px] aspect-square rounded-3xl bg-gradient-to-b from-[#111F30] to-[#0D1928] border border-white/[0.12] shadow-2xl p-6 flex flex-col justify-between overflow-hidden">
              {/* Animated Satellite Orbit Ring 1 */}
              <div className="absolute inset-4 rounded-full border border-dashed border-[#22D3EE]/30 animate-orbit pointer-events-none">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#0D1928] border border-[#22D3EE] flex items-center justify-center shadow-lg shadow-[#22D3EE]/50">
                  <Satellite className="w-3.5 h-3.5 text-[#22D3EE]" />
                </div>
              </div>

              {/* Animated Orbit Ring 2 */}
              <div className="absolute inset-16 rounded-full border border-[#34D399]/20 animate-orbit-reverse pointer-events-none">
                <div className="absolute -bottom-2 right-1/4 w-4 h-4 rounded-full bg-[#34D399] shadow-md shadow-[#34D399]/50" />
              </div>

              {/* Central Isometric Smart City Schematic */}
              <div className="relative z-10 flex flex-col items-center justify-center flex-1 my-6 text-center">
                <div className="relative w-48 h-36 flex items-center justify-center">
                  {/* Topographic Elevation Curves (SVG) */}
                  <svg className="w-full h-full" viewBox="0 0 200 150" fill="none">
                    {/* Elevation contour slices */}
                    <path
                      d="M 20 110 C 60 70, 140 70, 180 110 L 170 130 C 130 90, 70 90, 30 130 Z"
                      fill="rgba(34, 211, 238, 0.15)"
                      stroke="#22D3EE"
                      strokeWidth="1.2"
                    />
                    <path
                      d="M 40 90 C 75 55, 125 55, 160 90 L 150 105 C 120 75, 80 75, 50 105 Z"
                      fill="rgba(52, 211, 153, 0.2)"
                      stroke="#34D399"
                      strokeWidth="1.2"
                    />
                    <path
                      d="M 65 70 C 85 45, 115 45, 135 70 L 125 80 C 110 60, 90 60, 75 80 Z"
                      fill="rgba(34, 211, 238, 0.3)"
                      stroke="#22D3EE"
                      strokeWidth="1.5"
                    />
                    {/* City Masterplan Zoning Blocks */}
                    <rect x="75" y="40" width="16" height="24" rx="2" fill="#60A5FA" opacity="0.9" />
                    <rect x="95" y="32" width="20" height="32" rx="2" fill="#22D3EE" opacity="0.9" />
                    <rect x="119" y="44" width="14" height="20" rx="2" fill="#34D399" opacity="0.9" />
                    {/* Beacons */}
                    <circle cx="105" cy="28" r="3" fill="#FBBF24" className="animate-ping" />
                  </svg>
                </div>

                <div className="font-heading font-bold text-sm text-[#F1F5F9] mt-2">
                  Greater Jewar Greenfield Plain
                </div>
                <div className="text-[11px] text-[#22D3EE] font-mono mt-0.5">
                  Sector 28-32 • Composite Suitability 84.2/100
                </div>
              </div>

              {/* Bottom HUD Floating Telemetry Card */}
              <div className="relative z-10 p-3 rounded-xl bg-[#0D1928]/90 border border-white/[0.1] backdrop-blur-md flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-[#34D399]" />
                  <span className="text-[11px] font-mono text-[#94A3B8]">ISRO 4-Portal Synchronized</span>
                </div>
                <span className="font-mono text-[11px] text-[#34D399] font-bold">100% Coverage</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Section 1: How TerraAI Works */}
      <section id="how-it-works" className="py-20 px-6 lg:px-12 bg-[#0D1928]/50 border-t border-white/[0.08]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#22D3EE]/10 text-[#22D3EE] border border-[#22D3EE]/30">
              END-TO-END PIPELINE
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#F1F5F9]">
              How TerraAI Works
            </h2>
            <p className="text-sm text-[#94A3B8]">
              A scientific, explainable decision pipeline linking raw Indian earth observation data to generative urban design.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="p-5 rounded-2xl bg-[#111F30] border border-white/[0.08] hover:border-[#22D3EE]/40 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#17283A] border border-[#22D3EE]/30 flex items-center justify-center text-[#22D3EE] font-mono font-bold">
                01
              </div>
              <h3 className="font-heading font-bold text-base text-[#F1F5F9]">Satellite Ingestion</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Connects directly to Bhoonidhi (CartoDEM 30m), Bhuvan (LULC & flood maps), MOSDAC (rainfall), and VEDAS (NDVI).
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-5 rounded-2xl bg-[#111F30] border border-white/[0.08] hover:border-[#22D3EE]/40 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#17283A] border border-[#34D399]/30 flex items-center justify-center text-[#34D399] font-mono font-bold">
                02
              </div>
              <h3 className="font-heading font-bold text-base text-[#F1F5F9]">Spatial Screening</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Clips multi-criteria zonal rasters in &lt;150ms. Flags automatic deal-breakers (wetland overlap, high slope, 1-in-25yr flood).
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-5 rounded-2xl bg-[#111F30] border border-white/[0.08] hover:border-[#22D3EE]/40 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#17283A] border border-[#60A5FA]/30 flex items-center justify-center text-[#60A5FA] font-mono font-bold">
                03
              </div>
              <h3 className="font-heading font-bold text-base text-[#F1F5F9]">AI Master-Planning</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Generative AI workspace drafts biophilic zoning, road networks, clean energy microgrids, and water retention lakes.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-5 rounded-2xl bg-[#111F30] border border-white/[0.08] hover:border-[#22D3EE]/40 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#17283A] border border-[#FBBF24]/30 flex items-center justify-center text-[#FBBF24] font-mono font-bold">
                04
              </div>
              <h3 className="font-heading font-bold text-base text-[#F1F5F9]">Decadal Simulation</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Stress-tests physical water balance (135 lpcd standard) and energy loads through 2035, 2045, 2075, and 2125 under climate warming.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Section 2: Intelligent Site Selection */}
      <section id="site-selection" className="py-20 px-6 lg:px-12 border-t border-white/[0.08]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#34D399]/10 text-[#34D399] border border-[#34D399]/30">
              GEOSPATIAL DECISION SUPPORT
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#F1F5F9]">
              Intelligent Site Selection with Hard-Stop Safety
            </h2>
            <p className="text-sm text-[#94A3B8] leading-relaxed">
              Evaluating candidate parcels for new greenfield cities requires rigorous, multi-factor analysis. TerraAI
              evaluates candidate sites across five fundamental pillars with transparent mathematical derivations.
            </p>

            <div className="space-y-3 text-xs">
              <div className="flex items-start space-x-3 p-3 rounded-xl bg-[#111F30] border border-white/[0.08]">
                <CheckCircle2 className="w-4 h-4 text-[#34D399] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#F1F5F9]">5 Foundational Evaluation Pillars:</span>
                  <p className="text-[#94A3B8] mt-0.5">
                    Terrain & Land Buildability, Water Security, Hazard Risk, Environmental Impact, and Infrastructure Access.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-xl bg-[#111F30] border border-[#F87171]/30">
                <AlertTriangle className="w-4 h-4 text-[#F87171] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#F87171]">Automatic Deal-Breaker Exclusions:</span>
                  <p className="text-[#94A3B8] mt-0.5">
                    Disqualifies dangerous locations (e.g. &gt;50% Bhuvan flood inundation, &gt;15% wetland overlap, &gt;30% steep slope).
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-xl bg-[#111F30] border border-white/[0.08]">
                <Sliders className="w-4 h-4 text-[#22D3EE] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#F1F5F9]">Planner Priority Sensitivity Presets:</span>
                  <p className="text-[#94A3B8] mt-0.5">
                    Live dynamic ranking recalculation across Balanced, Climate-Resilient, and Infrastructure-First priorities.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Comparison Preview Card */}
          <div className="lg:col-span-6 p-6 rounded-3xl bg-[#111F30] border border-white/[0.1] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <span className="text-xs font-bold text-[#F1F5F9]">Greater Jewar Greenfield Candidate Parcels</span>
              <span className="text-[10px] font-mono text-[#22D3EE]">Sensitivity: Balanced</span>
            </div>

            <div className="space-y-3">
              {/* Site A */}
              <div className="p-3.5 rounded-2xl bg-[#0D1928] border border-[#34D399]/40 flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#34D399]"></span>
                    <span className="font-bold text-xs text-[#F1F5F9]">Site A — Jewar North Greenfield</span>
                  </div>
                  <div className="text-[11px] text-[#94A3B8] mt-1">
                    Optimal flat slope (1.1°), safe elevation (202m), Expressway adjacent
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-base font-bold font-mono text-[#34D399]">84.2</div>
                  <span className="text-[10px] text-[#34D399] font-bold">Rank #1</span>
                </div>
              </div>

              {/* Site B */}
              <div className="p-3.5 rounded-2xl bg-[#0D1928] border border-[#F87171]/40 flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#F87171]"></span>
                    <span className="font-bold text-xs text-[#F1F5F9]">Site B — Yamuna Floodplain Fringe</span>
                  </div>
                  <div className="text-[11px] text-[#F87171] mt-1 font-semibold">
                    HARD-STOP: 53.4% high Bhuvan flood inundation overlap
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-base font-bold font-mono text-[#F87171]">41.5</div>
                  <span className="text-[10px] text-[#F87171] font-bold">Unviable</span>
                </div>
              </div>

              {/* Site C */}
              <div className="p-3.5 rounded-2xl bg-[#0D1928] border border-[#60A5FA]/40 flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#60A5FA]"></span>
                    <span className="font-bold text-xs text-[#F1F5F9]">Site C — Khurja Agricultural Fringe</span>
                  </div>
                  <div className="text-[11px] text-[#94A3B8] mt-1">
                    Flood-safe terrain, but displaced prime agricultural cropland penalty
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-base font-bold font-mono text-[#60A5FA]">76.8</div>
                  <span className="text-[10px] text-[#60A5FA] font-bold">Rank #2</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Section 3: Satellite-Powered Environmental Analysis */}
      <section className="py-20 px-6 lg:px-12 bg-[#0D1928]/50 border-t border-white/[0.08]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#22D3EE]/10 text-[#22D3EE] border border-[#22D3EE]/30">
              MULTIDISCIPLINARY MODULES
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#F1F5F9]">
              Specialized Environmental & Physical Intelligence
            </h2>
            <p className="text-sm text-[#94A3B8]">
              Six dedicated AI modules purpose-built for urban master planners, civil engineers, and environmental scientists.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#111F30] border border-white/[0.08] hover:border-[#22D3EE]/40 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#17283A] flex items-center justify-center text-[#22D3EE]">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-base text-[#F1F5F9]">TerraTerrain AI</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                CartoDEM 30m digital elevation model analysis, slope aspect, terrain roughness (TRI), and cut-and-fill grading estimates.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#111F30] border border-white/[0.08] hover:border-[#34D399]/40 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#17283A] flex items-center justify-center text-[#34D399]">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-base text-[#F1F5F9]">TerraSoil AI</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Soil composition ternary models (sand/silt/clay), bearing capacity (kPa), NPK fertility, and geotechnical foundation suitability.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#111F30] border border-white/[0.08] hover:border-[#60A5FA]/40 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#17283A] flex items-center justify-center text-[#60A5FA]">
                <Droplets className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-base text-[#F1F5F9]">TerraWater AI</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Groundwater depth trends, municipal water balance against 135 lpcd standards, catchment yield, and rainwater retention tanks.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#111F30] border border-white/[0.08] hover:border-[#F87171]/40 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#17283A] flex items-center justify-center text-[#F87171]">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-base text-[#F1F5F9]">TerraClimate AI</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                CMIP6 climate warming projections (SSP2-4.5 vs SSP5-8.5), extreme heat anomalies, and Bhuvan flood return period maps.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#111F30] border border-white/[0.08] hover:border-[#FBBF24]/40 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#17283A] flex items-center justify-center text-[#FBBF24]">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-base text-[#F1F5F9]">TerraEnergy AI</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Solar Global Horizontal Irradiance (GHI), wind power density, net-zero microgrid sizing, and BESS battery energy storage capacity.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#111F30] border border-white/[0.08] hover:border-[#34D399]/40 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#17283A] flex items-center justify-center text-[#34D399]">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-base text-[#F1F5F9]">TerraVegetation AI</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Sentinel-2 10m NDVI biomass index, urban tree canopy coverage, ecological corridors, and native biodiverse species selection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Section 4: AI City Master-Plan Generation */}
      <section id="city-designer" className="py-20 px-6 lg:px-12 border-t border-white/[0.08]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#22D3EE]/10 text-[#22D3EE] border border-[#22D3EE]/30">
              SIGNATURE EXPERIENCE
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#F1F5F9]">
              AI City Master-Plan Designer
            </h2>
            <p className="text-sm text-[#94A3B8]">
              An interactive workspace where planners define constraints and generative AI outputs balanced, biophilic zoning layouts.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-gradient-to-br from-[#111F30] via-[#0D1928] to-[#111F30] border border-[#22D3EE]/40 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center space-x-2 text-xs text-[#22D3EE] font-mono">
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Generative Biophilic Urbanism</span>
              </div>
              <h3 className="font-heading font-bold text-2xl text-[#F1F5F9]">
                Interactive Zoning, Multi-Modal Networks & Microgrids
              </h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                TerraAI generates real spatial geometries with live polygon boundaries, not generic concept cards.
                Specify target population (e.g. 25,000 residents), land acreage, and sustainability goals. The AI assistant
                synthesizes:
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono pt-2">
                <div className="p-2.5 rounded-lg bg-[#07111F] border border-white/[0.08] text-center">
                  <div className="text-[#60A5FA] font-bold">Residential</div>
                  <div className="text-[10px] text-[#94A3B8]">Passive Solar</div>
                </div>
                <div className="p-2.5 rounded-lg bg-[#07111F] border border-white/[0.08] text-center">
                  <div className="text-[#22D3EE] font-bold">Commercial</div>
                  <div className="text-[10px] text-[#94A3B8]">Transit Core</div>
                </div>
                <div className="p-2.5 rounded-lg bg-[#07111F] border border-white/[0.08] text-center">
                  <div className="text-[#34D399] font-bold">Green Belt</div>
                  <div className="text-[10px] text-[#94A3B8]">Urban Forests</div>
                </div>
                <div className="p-2.5 rounded-lg bg-[#07111F] border border-white/[0.08] text-center">
                  <div className="text-[#FBBF24] font-bold">Clean Energy</div>
                  <div className="text-[10px] text-[#94A3B8]">Agrivoltaics</div>
                </div>
              </div>

              {/* Chat Simulation prompt */}
              <div className="p-3 rounded-xl bg-[#07111F] border border-white/[0.1] text-xs space-y-1.5">
                <div className="text-[11px] font-mono text-[#22D3EE] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Planner Prompt to TerraAdvisor:</span>
                </div>
                <p className="text-[#F1F5F9] italic">
                  "Increase green cover to 35% and buffer the eastern stormwater retention lake by 150m."
                </p>
                <p className="text-[11px] text-[#34D399]">
                  ✓ Master plan revised: Central ecological park expanded by 35 acres; water self-sufficiency raised to 88%.
                </p>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-4">
              <div className="w-full p-4 rounded-2xl bg-[#07111F] border border-white/[0.08] text-center space-y-3">
                <div className="font-heading font-bold text-sm text-[#F1F5F9]">Layout Comparison Synthesis</div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded-xl bg-[#111F30] border border-[#22D3EE]/30">
                    <div className="font-bold text-[#22D3EE]">Layout Alpha</div>
                    <div className="text-[10px] text-[#94A3B8] mt-1">Transit-Oriented</div>
                    <div className="text-xs font-mono text-[#F1F5F9] font-bold mt-1">92% Net-Zero</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#111F30] border border-[#34D399]/30">
                    <div className="font-bold text-[#34D399]">Layout Beta</div>
                    <div className="text-[10px] text-[#94A3B8] mt-1">Agro-Forestry</div>
                    <div className="text-xs font-mono text-[#F1F5F9] font-bold mt-1">42% Greenery</div>
                  </div>
                </div>
                <button
                  onClick={onStartPlanning}
                  className="w-full py-2.5 rounded-xl bg-[#22D3EE] hover:bg-[#38BDF8] text-[#07111F] font-heading font-bold text-xs transition-all shadow-md"
                >
                  Open City Designer Workspace
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Section 5: Future City Simulations */}
      <section id="simulation" className="py-20 px-6 lg:px-12 bg-[#0D1928]/50 border-t border-white/[0.08]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#FBBF24]/10 text-[#FBBF24] border border-[#FBBF24]/30">
              DECADAL CLIMATE STRESS ENGINE
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#F1F5F9]">
              Future City Simulations (2026–2125)
            </h2>
            <p className="text-sm text-[#94A3B8]">
              Cities built today must endure for a century. Explore decadal projections tracking population, municipal water
              demand, clean energy loads, and urban heat island attenuation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-[#111F30] border border-white/[0.08] space-y-2">
              <div className="text-xs font-mono text-[#22D3EE] font-bold">10 YEARS (2035)</div>
              <div className="text-xl font-heading font-black text-[#F1F5F9]">85,000 Res.</div>
              <p className="text-xs text-[#94A3B8]">
                Phase-1 urban core maturity. Water demand reaches 11.48 MLD with safe local rainwater harvesting.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#111F30] border border-white/[0.08] space-y-2">
              <div className="text-xs font-mono text-[#34D399] font-bold">20 YEARS (2045)</div>
              <div className="text-xl font-heading font-black text-[#F1F5F9]">220,000 Res.</div>
              <p className="text-xs text-[#94A3B8]">
                Full scale regional township. 82% circular recycling rate, 98 MW clean solar/wind microgrid.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#111F30] border border-white/[0.08] space-y-2">
              <div className="text-xs font-mono text-[#60A5FA] font-bold">50 YEARS (2075)</div>
              <div className="text-xl font-heading font-black text-[#F1F5F9]">450,000 Res.</div>
              <p className="text-xs text-[#94A3B8]">
                Autonomous circular urbanism. Urban heat island reduced by 3.1°C via mature urban canopy networks.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#111F30] border border-white/[0.08] space-y-2">
              <div className="text-xs font-mono text-[#FBBF24] font-bold">100 YEARS (2125)</div>
              <div className="text-xl font-heading font-black text-[#F1F5F9]">620,000 Res.</div>
              <p className="text-xs text-[#94A3B8]">
                Century climate resilience arc. 98.5% resource circularity and complete net-zero emissions stability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Section 6: ISRO Space-Data Integration */}
      <section id="isro-portals" className="py-20 px-6 lg:px-12 border-t border-white/[0.08]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#34D399]/10 text-[#34D399] border border-[#34D399]/30">
              NATIONAL SPACE DATA INTEGRATION
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#F1F5F9]">
              Four-Portal Space Provenance Guarantee
            </h2>
            <p className="text-sm text-[#94A3B8]">
              TerraAI satisfies the ASTRA 2026 hackathon standard by actively pulling data across all four official Indian
              geoportals with verifiable geodetic provenance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ISRO_PORTALS.map((portal) => (
              <div
                key={portal.id}
                className="p-5 rounded-2xl bg-[#111F30] border border-white/[0.08] hover:border-[#22D3EE]/40 transition-all space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#22D3EE]/20 text-[#22D3EE] border border-[#22D3EE]/40">
                      {portal.name}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-[#34D399] font-bold">
                      <CheckCircle2 className="w-3 h-3" /> Live
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-sm text-[#F1F5F9]">{portal.agency}</h3>
                  <p className="text-[11px] text-[#94A3B8] leading-relaxed line-clamp-3">{portal.overview}</p>
                </div>

                <div className="pt-2 border-t border-white/[0.08] space-y-1 text-[10px] font-mono text-[#94A3B8]">
                  <div>Res: {portal.spatialResolution}</div>
                  <div>Status: {portal.coverageStatus}</div>
                  <a
                    href={portal.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[#22D3EE] hover:underline pt-1"
                  >
                    <span>Visit Geoportal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Section 7: Sustainability Impact Metrics */}
      <section className="py-20 px-6 lg:px-12 bg-gradient-to-b from-[#0D1928] to-[#07111F] border-t border-white/[0.08]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#22D3EE]/10 text-[#22D3EE] border border-[#22D3EE]/30">
              MEASURABLE URBAN ROI
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#F1F5F9]">
              Sustainability Impact by Design
            </h2>
            <p className="text-sm text-[#94A3B8]">
              By identifying environmental hazards early and optimizing site layouts before construction begins, TerraAI
              delivers compounding economic and ecological dividends.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-6 rounded-2xl bg-[#111F30] border border-white/[0.08] space-y-2">
              <div className="text-3xl sm:text-4xl font-heading font-black text-[#22D3EE]">100%</div>
              <div className="text-xs font-bold text-[#F1F5F9]">Disaster Zone Aversion</div>
              <div className="text-[11px] text-[#94A3B8]">Zero construction in 25-yr Bhuvan flood zones</div>
            </div>

            <div className="p-6 rounded-2xl bg-[#111F30] border border-white/[0.08] space-y-2">
              <div className="text-3xl sm:text-4xl font-heading font-black text-[#34D399]">92%</div>
              <div className="text-xs font-bold text-[#F1F5F9]">Renewable Net-Zero Offset</div>
              <div className="text-[11px] text-[#94A3B8]">Agrivoltaics & rooftop solar integration</div>
            </div>

            <div className="p-6 rounded-2xl bg-[#111F30] border border-white/[0.08] space-y-2">
              <div className="text-3xl sm:text-4xl font-heading font-black text-[#60A5FA]">18.4 m²</div>
              <div className="text-xs font-bold text-[#F1F5F9]">Green Space / Person</div>
              <div className="text-[11px] text-[#94A3B8]">2x WHO recommended minimum standards</div>
            </div>

            <div className="p-6 rounded-2xl bg-[#111F30] border border-white/[0.08] space-y-2">
              <div className="text-3xl sm:text-4xl font-heading font-black text-[#FBBF24]">88%</div>
              <div className="text-xs font-bold text-[#F1F5F9]">Water Self-Sufficiency</div>
              <div className="text-[11px] text-[#94A3B8]">Bioswales, cascade ponds, & 135 lpcd balance</div>
            </div>
          </div>

          {/* Banner CTA */}
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#111F30] via-[#17283A] to-[#111F30] border border-[#22D3EE]/30 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <h3 className="font-heading font-bold text-2xl text-[#F1F5F9]">
                Ready to plan the future with space data?
              </h3>
              <p className="text-xs text-[#94A3B8]">
                Explore live demonstration candidate parcels in Greater Jewar & Dholera Special Investment Region.
              </p>
            </div>
            <button
              onClick={onStartPlanning}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#22D3EE] to-[#34D399] text-[#07111F] font-heading font-bold text-sm shadow-xl shadow-[#22D3EE]/25 hover:scale-[1.02] active:scale-95 transition-all shrink-0"
            >
              Start Planning Now
            </button>
          </div>
        </div>
      </section>

      {/* 10. Footer Section */}
      <footer className="py-12 px-6 lg:px-12 bg-[#07111F] border-t border-white/[0.08] text-xs text-[#94A3B8]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-7 h-7 rounded-lg bg-[#0D1928] border border-white/[0.1] flex items-center justify-center">
              <Satellite className="w-3.5 h-3.5 text-[#22D3EE]" />
            </div>
            <div>
              <span className="font-heading font-bold text-[#F1F5F9]">TerraAI</span>
              <span className="text-[10px] text-[#94A3B8] ml-2">Designing Sustainable Cities. Intelligence for Tomorrow.</span>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-[11px]">
            <span>CartoDEM 30m</span>
            <span>Bhuvan LULC</span>
            <span>MOSDAC IMERG</span>
            <span>Sentinel-2 VEDAS</span>
            <span className="text-[#34D399]">ASTRA 2026 Space Hackathon</span>
          </div>

          <div className="text-[10px] font-mono text-[#94A3B8]">
            © 2026 TerraAI Systems • Open Geospatial Intelligence
          </div>
        </div>
      </footer>
    </div>
  );
};
