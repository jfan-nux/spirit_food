"""
Spirit Food Backend API

FastAPI server for Snowflake lookups and AI ID card generation.
"""

import os
from datetime import datetime
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from dotenv import load_dotenv

from snowflake_lookup import lookup_flavor_profile
from cuisine_matcher import determine_cuisine, get_supported_cuisines
from id_generator import generate_id_card as ai_generate_id_card

# Load environment variables
env_path = Path(__file__).parent / "config" / ".env"
print(f"DEBUG: Loading .env from: {env_path}")
print(f"DEBUG: .env file exists: {env_path.exists()}")
load_dotenv(dotenv_path=env_path)

# Debug: Print loaded API keys (masked)
portkey_key = os.getenv('PORTKEY_API_KEY', '')
portkey_virtual = os.getenv('PORTKEY_OPENAI_VIRTUAL_KEY', '')
print(f"DEBUG: PORTKEY_API_KEY loaded: {'YES (' + portkey_key[:8] + '...)' if portkey_key else 'NO (empty)'}")
print(f"DEBUG: PORTKEY_OPENAI_VIRTUAL_KEY loaded: {'YES (' + portkey_virtual[:8] + '...)' if portkey_virtual else 'NO (empty)'}")

# Create FastAPI app
app = FastAPI(
    title="Spirit Food API",
    description="Backend API for Spirit Food personality quiz",
    version="1.0.0"
)

# Configure CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8888",
        "http://127.0.0.1:8888",
        "http://localhost:8889",
        "http://127.0.0.1:8889",
        "http://localhost:3000",  # Common dev port
    ],
    allow_origin_regex=r"https://.*\.ngrok(-free)?\.app|https://.*\.ngrok\.io",  # ngrok tunnels for demo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================================
# Request/Response Models
# ============================================================================

class HealthResponse(BaseModel):
    status: str
    timestamp: str


class FlavorProfileRequest(BaseModel):
    email: EmailStr


class FlavorProfileResponse(BaseModel):
    found: bool
    cuisine_preferences: list[str]
    top_cuisine: Optional[str]
    confidence: float


class IDCardRequest(BaseModel):
    dish_type: str
    cuisine: str
    alignment_adjective: str
    time_axis: str
    time_percent: int
    adventure_axis: str
    adventure_percent: int


class PeerReview(BaseModel):
    text: str
    reviewer: str


class IDCardResponse(BaseModel):
    title: str
    strengths: list[str]
    weaknesses: list[str]
    quotes: list[str]
    hidden_talent: str
    peer_reviews: list[PeerReview]
    cached: bool


class ErrorResponse(BaseModel):
    error: bool
    message: str
    code: str


# ============================================================================
# Endpoints
# ============================================================================

@app.get("/api/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint."""
    return HealthResponse(
        status="ok",
        timestamp=datetime.utcnow().isoformat() + "Z"
    )


@app.post("/api/flavor-profile", response_model=FlavorProfileResponse)
async def get_flavor_profile(request: FlavorProfileRequest):
    """
    Look up user's flavor profile from Snowflake.

    Returns cuisine preferences based on order history.
    """
    try:
        profile = lookup_flavor_profile(request.email)
        return FlavorProfileResponse(
            found=profile.get("found", False),
            cuisine_preferences=profile.get("cuisine_preferences", []),
            top_cuisine=profile.get("top_cuisine"),
            confidence=profile.get("confidence", 0)
        )
    except Exception as e:
        return FlavorProfileResponse(
            found=False,
            cuisine_preferences=[],
            top_cuisine=None,
            confidence=0
        )


@app.post("/api/generate-id-card", response_model=IDCardResponse)
async def generate_id_card(request: IDCardRequest):
    """
    Generate AI-powered ID card content.

    Uses Portkey LLM to create personalized card content.
    Falls back to hardcoded content if AI is unavailable.
    """
    # Try AI generation first
    ai_result = ai_generate_id_card(
        dish_type=request.dish_type,
        cuisine=request.cuisine,
        alignment_adjective=request.alignment_adjective,
        time_axis=request.time_axis,
        time_percent=request.time_percent,
        adventure_axis=request.adventure_axis,
        adventure_percent=request.adventure_percent
    )

    if ai_result:
        return IDCardResponse(
            title=ai_result.get("title", f"The {request.alignment_adjective} {request.dish_type}"),
            strengths=ai_result.get("strengths", []),
            weaknesses=ai_result.get("weaknesses", []),
            quotes=ai_result.get("quotes", []),
            hidden_talent=ai_result.get("hidden_talent", ""),
            peer_reviews=[
                PeerReview(text=pr.get("text", ""), reviewer=pr.get("reviewer", ""))
                for pr in ai_result.get("peer_reviews", [])
            ],
            cached=ai_result.get("cached", False)
        )

    # Fall back to hardcoded content
    return IDCardResponse(
        title=f"The {request.alignment_adjective} {request.dish_type}",
        strengths=[
            "Impeccable taste in comfort food",
            "Can sense when food is ready by smell alone",
            "Never met a cuisine they didn't like"
        ],
        weaknesses=[
            "Cannot resist 'just one more bite'",
            "Gets hangry at inopportune times",
            "Spends too much time reading menus"
        ],
        quotes=[
            "Life is too short for bad food.",
            "Calories don't count on weekends."
        ],
        hidden_talent="Can identify any dish by smell within a 50-foot radius",
        peer_reviews=[
            PeerReview(text="Always knows the best spots!", reviewer="Ramen"),
            PeerReview(text="A true food adventurer.", reviewer="Burger"),
            PeerReview(text="We could learn a thing or two.", reviewer="Salad")
        ],
        cached=False
    )


# ============================================================================
# Main Entry Point
# ============================================================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
