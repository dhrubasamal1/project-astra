import React, { useState, lazy, Suspense } from 'react';
import {
  Sparkles,
  ArrowRight,
  Compass,
  Layers,
  ShieldCheck,
  TrendingUp,
  Satellite,
  Database,
  FileText,
  MapPin,
  ChevronDown,
} from 'lucide-react';

// Glowing-Circle Fallback Component while 3D Canvas / Textures load
const EarthFallback: React.FC = () => (
  <div className="w-full h-full flex flex-col items-center justify-center relative">
    <div className="w-64 h-64 md:w-80 md:h-80 rounded-full border border-cyan-500/30 flex items-center justify-center relative animate-pulse">
      {/* Outer spinning radar arc */}
      <div
        className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-400 border-r-emerald-400 animate-spin"
        style={{ animationDuration: '3s' }}
      />
      {/* Inner glowing core */}
      <div className="w-48 h-48 md:w-60 md:h-60 rounded-full bg-gradient-to-tr from-cyan-950 via-slate-900 to-emerald-950 border border-cyan-400/40 shadow-[0_0_50px_rgba(6,182,212,0.3)] flex flex-col items-center justify-center gap-2">
        <span className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
        <span className="text-xs font-mono font-bold text-cyan-300 tracking-wider uppercase text-center px-4">
          Synthesizing Orbital Earth...
        </span>
      </div>
    </div>
  </div>
);

// Lazy-load the 3D Earth globe (no SSR, client-only WebGL)
const EarthGlobe3D = lazy(() =>
  import('./EarthGlobe3D').then((module) => ({ default: module.EarthGlobe3D }))
);

interface LandingPageProps {
  onStartPlanning: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartPlanning }) => {
  const [isTargeting, setIsTargeting] = useState(false);
  const [isCrossFading, setIsCrossFading] = useState(false);

  const handleStartPlanning = () => {
    if (isTargeting) return;

    // Respect prefers-reduced-motion: if enabled, skip the 2-second zoom and navigate directly
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      onStartPlanning();
      return;
    }

    // Trigger 3D Earth zoom animation to Dholera, Gujarat
    setIsTargeting(true);
  };

  const handleCrossFade = () => {
    setIsCrossFading(true);
  };

  const handleZoomComplete = () => {
    // Navigate to planning dashboard
    onStartPlanning();
  };

  const handleExplorePlatform = () => {
    const featuresEl = document.getElementById('features');
    if (featuresEl) {
      featuresEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div
      id="landing-scroll-container"
      className="landing-page-root w-full min-h-screen bg-[#030712] text-slate-100 flex flex-col relative overflow-x-hidden selection:bg-cyan-500/30 font-sans scroll-smooth"
    >
      {/* Background Starfield & Subtle Cosmic Radial Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/3 left-10 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[130px]" />
      </div>

      {/* Cinematic Orbital Targeting HUD Overlay (During Start Animation) */}
      {isTargeting && (
        <div className="fixed inset-0 z-40 pointer-events-none flex flex-col justify-between p-6 sm:p-10 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/85 border border-cyan-400 text-cyan-300 text-xs font-mono font-bold shadow-xl shadow-cyan-500/30 backdrop-blur-md">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              <span>PLANETARY ROTATION & TARGET LOCK ACTIVE</span>
            </div>
            <div className="text-right text-[11px] font-mono text-cyan-300 bg-slate-950/80 px-3 py-1 rounded-xl border border-cyan-500/30">
              <div className="font-bold">TARGET: DHOLERA SIR (GUJARAT)</div>
              <div className="text-slate-400">22.2500°N, 72.1900°E</div>
            </div>
          </div>

          <div className="self-center flex flex-col items-center gap-2">
            <div
              className="w-48 h-48 sm:w-64 sm:h-64 rounded-full border-2 border-dashed border-cyan-400/70 animate-spin flex items-center justify-center"
              style={{ animationDuration: '4s' }}
            >
              <div className="w-36 h-36 sm:w-48 sm:h-48 rounded-full border border-emerald-400/50" />
            </div>
            <span className="text-xs font-mono font-black text-cyan-300 uppercase tracking-widest bg-slate-950/90 px-4 py-1.5 rounded-full border border-cyan-500/50 shadow-lg">
              Synchronizing Planetary Telemetry...
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800">
            <span>Bhoonidhi • Bhuvan • MOSDAC • VEDAS</span>
            <span className="text-cyan-400 font-bold">ENTERING URBAN PLANNING MATRIX</span>
          </div>
        </div>
      )}

      {/* Cross-fade Transition Overlay (satellite radar wipe when transitioning to dashboard) */}
      <div
        className={`fixed inset-0 z-50 bg-slate-950 pointer-events-none transition-opacity duration-700 flex items-center justify-center ${
          isCrossFading ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
          <span className="text-xs font-mono font-bold tracking-widest text-cyan-300 uppercase">
            Locking Onto Dholera SIR Satellite Stream...
          </span>
        </div>
      </div>

      {/* Top Navbar */}
      <header className="relative z-20 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Satellite className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-black text-base tracking-tight text-white">TERRA // ASTRA</span>
              <span className="text-[10px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 px-1.5 py-0.5 rounded">
                v2.4
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">ISRO Multi-Portal Geospatial Intelligence</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono">4 Portals Synchronized</span>
          </div>
          <button
            onClick={handleStartPlanning}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black text-xs transition-all shadow-md shadow-cyan-500/20 flex items-center space-x-1.5 cursor-pointer"
          >
            <span>Launch Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 flex-1 min-h-[calc(100vh-65px)] flex flex-col justify-center px-4 sm:px-8 lg:px-14 py-12 lg:py-0 overflow-hidden">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center relative">
          
          {/* Left Text & Call-To-Action Column */}
          <div className="lg:col-span-6 z-20 space-y-6">
            
            {/* Selected Site Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 shadow-sm shadow-cyan-500/10 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="text-xs font-mono font-bold tracking-tight">
                Selected Site: <strong className="text-white">Dholera Greenfield Industrial Smart Zone (Gujarat)</strong>
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black tracking-tight text-white leading-[1.1]">
              Plan the Cities of <br />
              <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                Tomorrow
              </span>
            </h1>

            {/* Subheading Narrative */}
            <p className="text-slate-300 text-base sm:text-lg max-w-xl leading-relaxed font-normal">
              Autonomous greenfield suitability scoring and multi-hazard risk forecasting powered by real-time{' '}
              <strong className="text-cyan-300 font-semibold">Bhoonidhi</strong>,{' '}
              <strong className="text-cyan-300 font-semibold">Bhuvan</strong>,{' '}
              <strong className="text-cyan-300 font-semibold">MOSDAC</strong>, and{' '}
              <strong className="text-cyan-300 font-semibold">VEDAS</strong> satellite indicators.
            </p>

            {/* Quick Metrics Strip */}
            <div className="grid grid-cols-3 gap-3 max-w-md pt-1">
              <div className="bg-slate-900/70 border border-slate-800/80 p-3 rounded-2xl">
                <div className="text-cyan-400 font-black text-lg">30m</div>
                <div className="text-[11px] text-slate-400 font-medium">CartoDEM Slope & Elevation</div>
              </div>
              <div className="bg-slate-900/70 border border-slate-800/80 p-3 rounded-2xl">
                <div className="text-emerald-400 font-black text-lg">2026–50</div>
                <div className="text-[11px] text-slate-400 font-medium">Water Stress Forecasting</div>
              </div>
              <div className="bg-slate-900/70 border border-slate-800/80 p-3 rounded-2xl">
                <div className="text-amber-400 font-black text-lg">Zero</div>
                <div className="text-[11px] text-slate-400 font-medium">Statutory Deal-Breakers</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-3">
              <button
                onClick={handleStartPlanning}
                disabled={isTargeting}
                className="px-7 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black text-sm transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-xl shadow-cyan-500/25 flex items-center justify-center space-x-2.5 cursor-pointer disabled:opacity-80"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>{isTargeting ? 'Orbiting to Dholera...' : 'Start Planning'}</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>

              <button
                onClick={handleExplorePlatform}
                className="px-6 py-4 rounded-2xl border border-cyan-500/30 hover:border-cyan-400/60 bg-slate-900/60 hover:bg-cyan-500/10 text-cyan-300 font-bold text-sm transition-all backdrop-blur-md flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Compass className="w-4 h-4 text-cyan-400" />
                <span>Explore Platform</span>
              </button>
            </div>

            {/* Live Indicator Note */}
            <div className="text-[11px] font-mono text-slate-500 flex items-center gap-1.5 pt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>Free rotation enabled · Drag 3D globe to inspect planetary satellite coverage</span>
            </div>
          </div>

          {/* Right 3D Earth Globe Canvas (Behind text on mobile, right column on desktop) */}
          <div className="lg:col-span-6 h-[460px] sm:h-[540px] lg:h-[680px] w-full relative flex items-center justify-center">
            {/* Ambient cyan lighting under the globe */}
            <div className="absolute w-72 h-72 md:w-96 md:h-96 rounded-full bg-cyan-500/15 blur-[100px] pointer-events-none" />

            {/* Suspense wrapper with custom glowing circle skeleton */}
            <Suspense fallback={<EarthFallback />}>
              <EarthGlobe3D
                isTargeting={isTargeting}
                onCrossFade={handleCrossFade}
                onComplete={handleZoomComplete}
              />
            </Suspense>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="hidden lg:flex flex-col items-center justify-center absolute bottom-4 left-1/2 -translate-x-1/2 z-20 text-slate-500 hover:text-cyan-400 transition-colors cursor-pointer" onClick={handleExplorePlatform}>
          <span className="text-[10px] font-mono uppercase tracking-widest mb-1">Scroll to features</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-24 px-4 sm:px-8 lg:px-14 border-t border-slate-900 bg-slate-950/95">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CORE ARCHITECTURAL CAPABILITIES</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Satellite-Ground Truth Fusion for Greenfield Mastery
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Terra Astra bridges Indian space portal observation feeds directly into deterministic multi-criteria urban suitability models, statutory deal-breaker hazard gates, and climate stress simulations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="bg-slate-900/60 border border-slate-800/90 rounded-3xl p-6 space-y-3 hover:border-cyan-500/40 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                <Satellite className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white group-hover:text-cyan-300 transition-colors">
                Four-Portal Space Fusion
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connects live or cached STAC & WMS feeds from Bhoonidhi, Bhuvan, MOSDAC, and VEDAS. Eliminates single-vendor blindspots with CartoDEM HAND flood proxy fallbacks.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-900/60 border border-slate-800/90 rounded-3xl p-6 space-y-3 hover:border-emerald-500/40 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white group-hover:text-emerald-300 transition-colors">
                Multi-Criteria MCA Engine
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Evaluates candidates across Topography, Water Security, Environmental Buffers, and Transport-Grid Proximity with live weight sensitivity toggles.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-900/60 border border-slate-800/90 rounded-3xl p-6 space-y-3 hover:border-red-500/40 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white group-hover:text-red-300 transition-colors">
                Statutory Deal-Breakers Shield
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Instantly identifies active floodway zones, high-slope exclusions (&gt;15%), and seismic faults, issuing zero-tolerance hard-stop disqualifications.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-slate-900/60 border border-slate-800/90 rounded-3xl p-6 space-y-3 hover:border-blue-500/40 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white group-hover:text-blue-300 transition-colors">
                2026–2050 Water Stress Horizon
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Models municipal water demand against catchment yields, monsoon rainfall CV, and groundwater depletion under baseline, dry, and climate shock trajectories.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-slate-900/60 border border-slate-800/90 rounded-3xl p-6 space-y-3 hover:border-purple-500/40 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white group-hover:text-purple-300 transition-colors">
                Gemini 3.8 Flash Spatial Audit
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Direct JSON schema grounding sends parcel geometry and 15+ satellite indicators to Google Gemini 3.8 Flash for auditable, hallucination-guarded recommendations.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-slate-900/60 border border-slate-800/90 rounded-3xl p-6 space-y-3 hover:border-amber-500/40 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white group-hover:text-amber-300 transition-colors">
                Executive Dossiers & GeoJSON
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Generates print-ready executive site evaluation reports and standardized GeoJSON layers formatted for direct QGIS, ArcGIS, and CAD integration.
              </p>
            </div>

          </div>

          {/* Bottom Call to Action Card */}
          <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-cyan-950/60 via-slate-900 to-emerald-950/60 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
            <div className="space-y-2 text-center sm:text-left">
              <h3 className="text-2xl font-black text-white">
                Ready to Evaluate Greenfield Parcels in Dholera?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300">
                Launch the interactive GIS planner, run sensitivity weights, and test 2050 resilience.
              </p>
            </div>
            <button
              onClick={handleStartPlanning}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-black text-sm transition-all shadow-lg shadow-cyan-500/30 flex items-center space-x-2 shrink-0 cursor-pointer"
            >
              <span>Start Planning Now</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-4 sm:px-8 border-t border-slate-900 text-center text-xs text-slate-500 font-mono">
        <p>© 2026 Project Astra · Built for ISRO Space Data Intelligence Challenge · Dholera SIR & Jewar Corridors</p>
      </footer>
    </div>
  );
};
