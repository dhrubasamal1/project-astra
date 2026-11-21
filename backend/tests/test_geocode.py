import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)


def test_geocode_city_search():
    response = client.get("/api/geocode?q=Jewar")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    first = data[0]
    assert "lat" in first
    assert "lon" in first
    assert "Jewar" in first["display_name"] or "Jewar" in first["name"]


def test_geocode_coordinates_search():
    response = client.get("/api/geocode?q=28.2608,77.7420")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert abs(data[0]["lat"] - 28.2608) < 1e-4
    assert abs(data[0]["lon"] - 77.7420) < 1e-4
    assert data[0]["type"] == "coordinate"


def test_geocode_offline_fallback():
    # Test fallback place lookup
    response = client.get("/api/geocode?q=dholera")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert any("Dholera" in item["display_name"] for item in data)
