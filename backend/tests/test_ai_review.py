import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)


def test_ai_review_endpoint_success():
    payload = {
        "region_id": "up_jewar",
        "site_code": "A",
        "site_name": "Jewar Greenfield Core",
        "area_km2": 24.5,
        "overall_score": 91.0,
        "verdict": "Highly Suitable",
        "has_dealbreaker": False,
        "dealbreakers": [],
        "pillars": {
            "terrain": {"score": 92.0},
            "water": {"score": 88.0},
            "hazard": {"score": 95.0}
        },
        "water_stress_index": 0.65,
        "target_population": 450000,
        "horizon_year": 2050
    }
    response = client.post("/api/ai/review", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["site_code"] == "A"
    assert "recommended_zoning" in data
    zoning = data["recommended_zoning"]
    assert zoning["residential_pct"] > 0
    assert zoning["sponge_parks_pct"] > 0
    assert len(data["phased_roadmap"]) >= 3
    assert len(data["climate_resilience_playbook"]) >= 3


def test_ai_review_dealbreaker_sponge_allocation():
    payload = {
        "region_id": "up_jewar",
        "site_code": "B",
        "site_name": "Yamuna Floodplain Strip",
        "area_km2": 22.8,
        "overall_score": 42.0,
        "verdict": "Disqualified",
        "has_dealbreaker": True,
        "dealbreakers": ["Bhuvan 10-Yr Floodway Inundation"]
    }
    response = client.post("/api/ai/review", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    # Dealbreaker site allocates significant acreage to sponge retention
    zoning = data["recommended_zoning"]
    assert zoning["sponge_parks_pct"] >= 30.0


def test_ai_review_custom_user_query():
    payload = {
        "region_id": "up_jewar",
        "site_code": "A",
        "site_name": "Jewar Greenfield Core",
        "area_km2": 24.5,
        "overall_score": 91.0,
        "user_query": "Can we construct a 60,000-seat multi-modal stadium here?"
    }
    response = client.post("/api/ai/review", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["custom_answer"] is not None
    assert len(data["custom_answer"]) > 10
