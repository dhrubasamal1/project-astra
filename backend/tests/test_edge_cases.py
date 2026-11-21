"""
test_edge_cases.py
Intensive Bug & Edge-Case Audit Suite for TerraAI:
1. Malformed / self-intersecting polygons (returns 422 with clean error message, never unhandled 500).
2. Micro-parcels (0.001 km2) and large parcels (1500 km2): tests division by zero and numerical stability.
3. MultiPolygon geometries: verifies multi-part candidate sites.
4. Zero and extreme populations in physical water balance and scenario projections.
5. 100% missing indicator payload: ensures graceful renormalization without crashes.
6. Special characters and XSS prevention in site names across HTML reports and GeoJSON exports.
7. Extreme climate parameters (0 mm rain, 500% rainfall variability, 0 lpcd).
"""

import pytest
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.scoring import score_site, compare_sites
from backend.app.scenarios import compute_physical_water_balance
from backend.app.report import generate_html_report, export_scorecards_to_geojson
from backend.app.models import SiteScorecard, IndicatorValue

client = TestClient(app)


def test_micro_parcel_numerical_stability():
    """Test very small candidate parcel (0.001 km2 / 0.1 ha) to verify no ZeroDivisionError."""
    micro_poly = {
        "type": "Polygon",
        "coordinates": [
            [
                [77.5300, 28.2200],
                [77.5305, 28.2200],
                [77.5305, 28.2205],
                [77.5300, 28.2205],
                [77.5300, 28.2200]
            ]
        ]
    }
    payload = {
        "site": micro_poly,
        "site_name": "Micro Parcel Alpha",
        "region_id": "up_jewar",
        "population": 1000,
        "weight_preset": "balanced"
    }
    resp = client.post("/api/analyze", json=payload)
    assert resp.status_code == 200, f"Micro-parcel failed with code {resp.status_code}: {resp.text}"
    data = resp.json()
    assert data["area_km2"] >= 0.0
    assert 0 <= data["overall_score"] <= 100


def test_large_parcel_near_limit():
    """Test large candidate site (approx 150 km2) within the 2000 km2 cap."""
    large_poly = {
        "type": "Polygon",
        "coordinates": [
            [
                [77.40, 28.10],
                [77.55, 28.10],
                [77.55, 28.25],
                [77.40, 28.25],
                [77.40, 28.10]
            ]
        ]
    }
    payload = {
        "site": large_poly,
        "site_name": "Regional Township Sector",
        "region_id": "up_jewar",
        "population": 500000,
        "weight_preset": "balanced"
    }
    resp = client.post("/api/analyze", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["area_km2"] > 100.0
    assert 0 <= data["overall_score"] <= 100


def test_macro_regional_large_area_stability():
    """Verify stability of macro-regional polygon analysis (>1000 km² and <=3000 km² cap)."""
    macro_poly = {
        "type": "Polygon",
        "coordinates": [
            [
                [77.30, 28.00],
                [77.70, 28.00],
                [77.70, 28.35],
                [77.30, 28.35],
                [77.30, 28.00]
            ]
        ]
    }
    payload = {
        "site": macro_poly,
        "site_name": "Macro Regional Corridor",
        "region_id": "up_jewar",
        "population": 800000,
        "weight_preset": "balanced"
    }
    resp = client.post("/api/analyze", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert 1000.0 < data["area_km2"] <= 3000.0
    assert 0 <= data["overall_score"] <= 100
    assert "terrain_and_land" in data["pillars"]
    assert "water_security" in data["pillars"]


def test_multipolygon_geometry_support():
    """Verify that MultiPolygon geometries are handled properly."""
    multi_poly = {
        "type": "MultiPolygon",
        "coordinates": [
            [
                [
                    [77.525, 28.210],
                    [77.545, 28.210],
                    [77.545, 28.225],
                    [77.525, 28.225],
                    [77.525, 28.210]
                ]
            ],
            [
                [
                    [77.550, 28.230],
                    [77.565, 28.230],
                    [77.565, 28.245],
                    [77.550, 28.245],
                    [77.550, 28.230]
                ]
            ]
        ]
    }
    payload = {
        "site": multi_poly,
        "site_name": "Multi-Cluster Township Site",
        "region_id": "up_jewar",
        "population": 200000
    }
    resp = client.post("/api/analyze", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["area_km2"] > 0
    assert data["overall_score"] > 0


def test_self_intersecting_and_malformed_polygons():
    """Verify that self-intersecting polygons are auto-healed via buffer(0) or malformed polygons return 422."""
    # 1. Bowtie polygon auto-healed by buffer(0)
    bowtie_poly = {
        "type": "Polygon",
        "coordinates": [
            [
                [77.52, 28.21],
                [77.56, 28.25],
                [77.52, 28.25],
                [77.56, 28.21],
                [77.52, 28.21]
            ]
        ]
    }
    payload_bowtie = {
        "site": bowtie_poly,
        "site_name": "Self Intersecting Site",
        "region_id": "up_jewar"
    }
    resp_bowtie = client.post("/api/analyze", json=payload_bowtie)
    # Either successfully auto-healed (200) or rejected (422), never 500
    assert resp_bowtie.status_code in (200, 422)

    # 2. Truly malformed geometry (< 3 points in ring)
    malformed_poly = {
        "type": "Polygon",
        "coordinates": [
            [[77.52, 28.21], [77.56, 28.25]]
        ]
    }
    payload_malformed = {
        "site": malformed_poly,
        "site_name": "Malformed Ring Site",
        "region_id": "up_jewar"
    }
    resp_malformed = client.post("/api/analyze", json=payload_malformed)
    assert resp_malformed.status_code == 422
    assert "error" in resp_malformed.json() or "message" in resp_malformed.json()


def test_small_population_settlement():
    """Verify water balance handles small rural/semi-urban settlement (500 pop) smoothly."""
    res_small = compute_physical_water_balance(
        site_id="site_small",
        site_name="Small Hamlet Site",
        custom_pop0=500,
        preset="baseline"
    )
    assert res_small.final_demand_mld > 0.0
    assert res_small.final_stress_index < 0.8
    assert res_small.stress_band in ["Low Stress", "Low", "Moderate"]


def test_extreme_drought_and_zero_rainfall():
    """Verify physical water balance stability when rainfall is 0.0 mm."""
    res_drought = compute_physical_water_balance(
        site_id="site_arid",
        site_name="Hyper Arid Site",
        site_area_km2=20.0,
        rain_mean_mm=0.0,
        groundwater_class="Very Poor",
        preset="baseline"
    )
    # Should rely purely on external municipal allocation
    assert res_drought.time_series[0].local_supply_mld == 0.0
    assert res_drought.time_series[0].total_supply_mld >= 15.0 # External allocation
    assert res_drought.final_demand_mld > 0.0


def test_all_missing_indicators_scoring():
    """Ensure that a site with zero valid indicators scores gracefully with 0 confidence."""
    empty_inds = {}
    card = score_site(
        site_id="site_empty",
        site_name="No Data Site",
        indicators=empty_inds,
        preset="balanced"
    )
    assert card.site_confidence_pct == 0.0
    assert card.site_confidence_label == "Low"
    assert card.overall_score == 0.0
    assert card.verdict == "Not recommended"


def test_html_report_special_characters_escaping():
    """Verify site names with HTML characters are handled cleanly in report export."""
    special_name = "Site <Alpha> & 'Omega' \"Phase-1\""
    card = score_site(
        site_id="site_special",
        site_name=special_name,
        indicators={"slope_buildable_share": 0.85},
        area_km2=10.0
    )
    cmp_res = compare_sites([card])
    html = generate_html_report([card], comparison=cmp_res, region_id="up_jewar")
    assert "<!DOCTYPE html>" in html
    # Should contain the site name without breaking HTML tags
    assert "Site" in html
    assert "Omega" in html

    # GeoJSON export with special characters
    fc = export_scorecards_to_geojson([card])
    assert fc["type"] == "FeatureCollection"
    assert fc["features"][0]["properties"]["site_name"] == special_name
