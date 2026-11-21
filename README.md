# TerraCity AI

> **AI-Powered Smart City Planning & Land Intelligence Platform**  
> *Tagline: "Designing Sustainable Cities. Intelligence for Tomorrow."*  
> *ASTRA 2026 Hackathon (ANTERiX, VIT Bhopal — Theme: Space)*

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg?style=flat&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg?style=flat&logo=react)](https://reactjs.org)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB.svg?style=flat&logo=python)](https://python.org)
[![ISRO Portals](https://img.shields.io/badge/ISRO_Portals-4_Active-FF9933.svg?style=flat)](https://www.isro.gov.in)
[![Offline Mode](https://img.shields.io/badge/Offline_Demo-100%25_Ready-green.svg?style=flat)](#offline-mode)

---

## Overview

TerraCity AI is a unified geospatial intelligence and sustainable urban planning platform that empowers state urban development boards, infrastructure authorities, and master planners to evaluate candidate land parcels for new greenfield cities or industrial townships.

Unifying fragmented land-use analysis into one intelligent platform, TerraAI covers **7 core intelligence pillars**:
1. **Terrain & Elevation**: CartoDEM 30m slope profiling, buildable share (<=15%), relief, and terrain ruggedness index (TRI).
2. **Geological & Soil Conditions**: VEDAS lithology, soil bearing stability, and land degradation susceptibility.
3. **Water Availability & Hydrology**: MOSDAC INSAT-3D precipitation climatology, monsoon variability (CV), surface water proximity, and aquifer recharge prospects.
4. **Climate Stress & Future Scenarios**: Multi-decade physical water balance simulations and SSP climate stress testing (2026–2050 and 100-year time travel).
5. **Disaster Risks & Statutory Hard-Stops**: Real Bhuvan flood inundation hazard zonation, CartoDEM HAND hydrologic flood proxy (<2m), BIS IS 1893:2016 seismic zones, and GSI landslide inventories.
6. **Renewable Energy Potential**: VEDAS solar GHI insolation mapping (4.5–6.5 kWh/m²/day) and rooftop photovoltaic suitability.
7. **Sustainable Smart City Master Plan Generation**: Parametric land-use zoning (Residential, Commercial, Green buffer, Transit, Solar, Civic, Waste/STP), AI Prompt Assistant ("Increase green cover and reduce road area", "15-minute city walkability"), and live URDPFI compliance KPIs.

---

## Four-Portal Space Provenance

TerraAI integrates real data from four official Indian space portals:

```
+-----------------------------------------------------------------------------------------+
|                                        TERRAAI                                          |
+-------------------+--------------------+--------------------+---------------------------+
|    BHOONIDHI      |       BHUVAN       |      MOSDAC        |          VEDAS            |
|   (NRSC/ISRO)     |    (NRSC/ISRO)     |    (SAC/ISRO)      |        (SAC/ISRO)         |
+-------------------+--------------------+--------------------+---------------------------+
| CartoDEM 30m DEM  | LULC 1:50k &       | INSAT-3D/3DR Daily | Sentinel-2 Multi-Temporal |
| Stereo-Derived    | Historical Flood   | Precipitation      | NDVI (10m) Time-Series    |
| Surface Model     | Hazard Zonation    | Climatology        | & Solar GHI Insolation    |
+-------------------+--------------------+--------------------+---------------------------+
| • Mean Slope      | • Land Cover Class | • Annual Mean Rain | • Mean NDVI               |
| • Buildable Share | • Wetland Overlap  | • Rainfall CV      | • Multi-Year Trend        |
| • Roughness (TRI) | • Flood Frequency  | • Dry Month Count  | • Ecological Sensitivity  |
| • HAND Proxy      | • Groundwater Pot. | • Drought Exposure | • Solar GHI Potential     |
+-------------------+--------------------+--------------------+---------------------------+
```

---

## 6 Modular Application Views

1. **Command Center**: Leaflet GIS map with interactive location search bar (geocoding & coordinates auto-fly), `@geoman-io/leaflet-geoman-free` freehand polygon drawing, 1-click candidate load, 7 toggleable ISRO layers, translucent red deal-breaker rendering, and right analytics drawer.
2. **Landing Page Overview**: Strategic overview of TerraAI with live mission metrics, 7 intelligence pillars, and one-click quickstart.
3. **AI City Master-Plan Designer**: Interactive parametric zoning editor across 7 urban sectors, live URDPFI compliance metrics, and conversational Prompt Assistant.
4. **100-Year Future Simulation**: Interactive time-travel slider (10yr, 20yr, 50yr, 100yr), SSP climate scenarios, demand/supply trajectories, and phased urban directives.
5. **ISRO Space Data Hub**: Dedicated portal telemetry console for Bhoonidhi, Bhuvan, MOSDAC, and VEDAS with live connectivity, dataset metadata, and query signatures.
6. **TerraAdvisor**: Floating planning co-pilot assistant available throughout the application with actionable prompt recommendations.

---

## Architecture & Tech Stack

- **Backend**: Python 3.11+, FastAPI, Pydantic v2, rasterio, shapely, pyproj, numpy, SQLite analysis store, pyyaml, httpx, pytest (72/72 tests passing).
- **AI & Planning Intelligence**: Google Gemini 3.8 Flash (`gemini-3.8-flash` via `/api/ai/review`) with rich spatial polygon coordinates & centroid payloads, 15+ satellite indicators, live API Transparency Inspector, and deterministic fallback synthesis for intelligent executive critique, autonomous smart zoning allocation, phased CapEx roadmap (2026–2050), and space-grounded climate resilience countermeasures.
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Dual-Theme (Light & Dark mode with basemap auto-sync), Leaflet + Geoman, Recharts, Lucide Icons.
- **Data Caching**: Regional COG rasters and GeoJSON vectors stored in `data/cache/regions/` and `data/fixtures/` for 100% offline operation.

---

## Local Run Instructions

### Prerequisites
- Python 3.11+
- Node.js 18+ (with `npm` or `npm.cmd` on Windows)

### 1. Quick Start via Windows PowerShell

Open a PowerShell terminal in the repository root:

```powershell
# Copy environment template
Copy-Item .env.example .env

# Install backend dependencies
python -m pip install -r backend/requirements.txt

# Run backend tests
python -m pytest backend/tests -v

# Start FastAPI backend server (Port 8000)
python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
```

In a second PowerShell terminal:

```powershell
# Navigate to frontend and install dependencies
cd frontend
npm.cmd install

# Start Vite development server (Port 5173)
npm.cmd run dev
```

Open your browser to:
- **Frontend App**: [http://localhost:5173](http://localhost:5173)
- **FastAPI OpenAPI Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **API Health Check**: [http://localhost:8000/api/health](http://localhost:8000/api/health)

### 2. Quick Start via Makefile (Linux / macOS / Git Bash)

```bash
# Setup both backend and frontend
make setup

# Run test suite
make test

# Start backend server
make run-backend

# In another terminal: start frontend
make run-frontend
```

---

## 3-Minute Live Demo Script

Follow this script for a flawless hackathon jury demonstration:

| Time | Segment | Actions to Perform | What to Highlight |
| :---: | :--- | :--- | :--- |
| **0:00 - 0:30** | **Orbital Entry & Load** | 1. Experience the **cinematic 3D Earth globe orbital opening** (ISRO satellites Cartosat-3/EOS-04/INSAT-3DR, altitude dive 35,786 km -> 1,200m, LiDAR sweep).<br/>2. Select **UP Jewar** from the region selector in Command Center.<br/>3. Click **"Load Candidate Sites (A, B, C)"** in 1 click.<br/>4. Draw a custom polygon freehand on the map canvas using the draw tool. | Show space-first orbital telemetry, instant candidate loading, and dynamic spatial zonal math executed in < 150 ms offline. |
| **0:30 - 1:05** | **Scorecard & Provenance** | 1. Click **Analyse All Sites**.<br/>2. Select **Site A** to view its 5-pillar scorecard and Recharts radar gauge.<br/>3. Click on the **Bhoonidhi** and **MOSDAC** indicator source badges. | Point out honest 4-portal provenance metadata: exact dataset name, resolution (30m / 4km), vintage (2021-2024), and confidence tier. |
| **1:05 - 1:40** | **Compare, Deal-Breakers & Sensitivity** | 1. Switch to the **Compare** tab.<br/>2. Observe **Site B** flagged with a **Red Deal-Breaker Banner** (Severe Flood Hazard).<br/>3. Notice the **translucent red floodplain mask** overlaid on the map.<br/>4. Toggle from **Balanced** to **Climate-Resilient** and **Infra-First** priority presets. | Demonstrate live MCA rank shifts. Point out deterministic "why" explanations generated from top-3 numeric pillar drivers, and the tie-check advisory. |
| **1:40 - 2:15** | **AI Review & Master-Plan Designer** | 1. In Scorecard tab, click **"Generate AI Planning Review"** (powered by Gemini 3.8 Flash) to view executive critique, autonomous smart zoning (ha + %), phased CapEx roadmap, and inspect the live **API Transparency Drawer**.<br/>2. Switch to **Master-Plan Designer** view and adjust residential/green buffer sliders.<br/>3. Switch to **Future Simulation** view and drag the time-travel slider to 2050 and 2126. | Showcase generative AI synthesis grounded in satellite metrics, automated smart zoning, space-sensor climate resilience countermeasures, and live URDPFI compliance. |
| **2:15 - 3:00** | **Four-Portal Proof & Export** | 1. Open the **ISRO Space Data Hub** to display the 4-portal live connectivity matrix.<br/>2. Switch to Dholera to showcase transparent **CartoDEM HAND flood proxy fallback**.<br/>3. Click **Print Report** (clean print CSS preview) and **Download GeoJSON**. | Reiterate that all four Indian space portals supply active indicators. Demonstrate GIS interoperability with instant GeoJSON download. |

---

## Honest Positioning & Non-Goals

- **Targeted Gap**: Early-stage greenfield site screening across terrain, water, and hazards using Indian satellite data.
- **Not in Scope**: Micro road layout engineering, architectural building plans, or 100-year absolute certainty predictions.
- **Existing Systems**: We complement—rather than replace—PM GatiShakti (national transport corridor logistics), AMRUT 2.0 (brownfield city master plans), and VEDAS Urban Sprawl (historical sprawl monitoring).

---

## License

Built for the **ASTRA 2026 Hackathon**. Open-source under the [MIT License](LICENSE).
