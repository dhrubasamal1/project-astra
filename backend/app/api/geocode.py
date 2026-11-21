"""Geocoding API endpoint with coordinate parsing, OpenStreetMap Nominatim integration,
and resilient offline fallback for smart city planning.
"""

import re
from typing import Any, Dict, List, Optional
import httpx
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel

router = APIRouter(prefix="/geocode", tags=["Geocoding"])

# Offline fallback dictionary for top Indian smart cities and project focus corridors
FALLBACK_PLACES: Dict[str, Dict[str, Any]] = {
    "jewar": {
        "name": "Jewar Greenfield Corridor",
        "display_name": "Jewar, Gautam Buddha Nagar, Uttar Pradesh, India",
        "lat": 28.2608,
        "lon": 77.7420,
        "type": "aerotropolis"
    },
    "noida": {
        "name": "Noida",
        "display_name": "Noida, Gautam Buddha Nagar, Uttar Pradesh, India",
        "lat": 28.5706,
        "lon": 77.3272,
        "type": "city"
    },
    "greater noida": {
        "name": "Greater Noida",
        "display_name": "Greater Noida, Gautam Buddha Nagar, Uttar Pradesh, India",
        "lat": 28.4744,
        "lon": 77.5040,
        "type": "city"
    },
    "dholera": {
        "name": "Dholera Special Investment Region (SIR)",
        "display_name": "Dholera, Ahmedabad District, Gujarat, India",
        "lat": 22.2464,
        "lon": 72.1932,
        "type": "smart_city"
    },
    "ahmedabad": {
        "name": "Ahmedabad",
        "display_name": "Ahmedabad, Gujarat, India",
        "lat": 23.0225,
        "lon": 72.5714,
        "type": "city"
    },
    "delhi": {
        "name": "New Delhi",
        "display_name": "New Delhi, Delhi, India",
        "lat": 28.6139,
        "lon": 77.2090,
        "type": "capital"
    },
    "mumbai": {
        "name": "Mumbai",
        "display_name": "Mumbai, Maharashtra, India",
        "lat": 19.0760,
        "lon": 72.8777,
        "type": "megacity"
    },
    "bengaluru": {
        "name": "Bengaluru",
        "display_name": "Bengaluru, Karnataka, India",
        "lat": 12.9716,
        "lon": 77.5946,
        "type": "tech_hub"
    },
    "hyderabad": {
        "name": "Hyderabad",
        "display_name": "Hyderabad, Telangana, India",
        "lat": 17.3850,
        "lon": 78.4867,
        "type": "city"
    },
    "pune": {
        "name": "Pune",
        "display_name": "Pune, Maharashtra, India",
        "lat": 18.5204,
        "lon": 73.8567,
        "type": "city"
    },
    "chennai": {
        "name": "Chennai",
        "display_name": "Chennai, Tamil Nadu, India",
        "lat": 13.0827,
        "lon": 80.2707,
        "type": "city"
    },
    "kolkata": {
        "name": "Kolkata",
        "display_name": "Kolkata, West Bengal, India",
        "lat": 22.5726,
        "lon": 88.3639,
        "type": "city"
    },
    "surat": {
        "name": "Surat",
        "display_name": "Surat, Gujarat, India",
        "lat": 21.1702,
        "lon": 72.8311,
        "type": "city"
    },
    "jaipur": {
        "name": "Jaipur",
        "display_name": "Jaipur, Rajasthan, India",
        "lat": 26.9124,
        "lon": 75.7873,
        "type": "city"
    },
    "lucknow": {
        "name": "Lucknow",
        "display_name": "Lucknow, Uttar Pradesh, India",
        "lat": 26.8467,
        "lon": 80.9462,
        "type": "city"
    },
    "varanasi": {
        "name": "Varanasi",
        "display_name": "Varanasi, Uttar Pradesh, India",
        "lat": 25.3176,
        "lon": 82.9739,
        "type": "city"
    },
    "gift city": {
        "name": "GIFT City",
        "display_name": "Gujarat International Finance Tec-City, Gandhinagar, Gujarat, India",
        "lat": 23.1610,
        "lon": 72.6841,
        "type": "smart_city"
    }
}


class GeocodeItem(BaseModel):
    name: str
    display_name: str
    lat: float
    lon: float
    type: str = "location"
    boundingbox: Optional[List[float]] = None


@router.get("", response_model=List[GeocodeItem])
async def search_locations(q: str = Query(..., min_length=1, description="Location search query or coordinates")):
    """Search for locations via coordinate parsing, OpenStreetMap Nominatim, or offline fallback."""
    query = q.strip()
    if not query:
        return []

    # 1. Direct coordinate parsing: "28.2608, 77.742" or "28.2608 77.742"
    coord_match = re.match(
        r'^\s*([-+]?\d+(?:\.\d+)?)\s*[, ]\s*([-+]?\d+(?:\.\d+)?)\s*$',
        query
    )
    if coord_match:
        try:
            lat = float(coord_match.group(1))
            lon = float(coord_match.group(2))
            if -90.0 <= lat <= 90.0 and -180.0 <= lon <= 180.0:
                return [
                    GeocodeItem(
                        name=f"Coordinates {lat:.4f}°N, {lon:.4f}°E",
                        display_name=f"Custom Coordinates [{lat:.5f}, {lon:.5f}]",
                        lat=lat,
                        lon=lon,
                        type="coordinate"
                    )
                ]
        except (ValueError, TypeError):
            pass

    # 2. Try online OpenStreetMap Nominatim API
    try:
        url = "https://nominatim.openstreetmap.org/search"
        headers = {
            "User-Agent": "TerraCityAI-SmartCity-Planner/1.0 (https://project-astra-6p3.pages.dev)"
        }
        params = {
            "format": "json",
            "q": query,
            "limit": 6,
            "addressdetails": 1
        }
        async with httpx.AsyncClient(timeout=4.0) as client:
            resp = await client.get(url, params=params, headers=headers)
            if resp.status_code == 200:
                data = resp.json()
                if isinstance(data, list) and len(data) > 0:
                    results = []
                    for item in data:
                        try:
                            bbox = None
                            if "boundingbox" in item and len(item["boundingbox"]) == 4:
                                bbox = [float(b) for b in item["boundingbox"]]
                            results.append(
                                GeocodeItem(
                                    name=item.get("name") or item.get("display_name", "").split(",")[0],
                                    display_name=item.get("display_name", ""),
                                    lat=float(item["lat"]),
                                    lon=float(item["lon"]),
                                    type=item.get("type") or item.get("class", "location"),
                                    boundingbox=bbox
                                )
                            )
                        except (ValueError, KeyError):
                            continue
                    if results:
                        return results
    except Exception:
        # Fall back gracefully to offline database
        pass

    # 3. Offline dictionary lookup
    q_lower = query.lower()
    matches = []
    for key, item in FALLBACK_PLACES.items():
        if q_lower in key or key in q_lower or q_lower in item["display_name"].lower():
            matches.append(
                GeocodeItem(
                    name=item["name"],
                    display_name=item["display_name"],
                    lat=item["lat"],
                    lon=item["lon"],
                    type=item.get("type", "city")
                )
            )

    return matches[:5]
