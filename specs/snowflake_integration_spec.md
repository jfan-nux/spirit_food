# Snowflake Integration Specification

## Overview

Query Snowflake for user flavor profiles to personalize cuisine selection in Spirit Food.

## Existing Utility

Use `backend/utils/snowflake_connection.py` which provides:
- `SnowflakeHook` class with `query_snowflake(query, method='pandas')`
- Auto-loads `.env` from `backend/config/.env`
- Context manager support (`with SnowflakeHook() as hook:`)

## Implementation: snowflake_lookup.py

Create `backend/snowflake_lookup.py`:

```python
from utils.snowflake_connection import SnowflakeHook
from utils.logger import get_logger
from typing import Optional, Dict, List
import json

logger = get_logger(__name__)

def lookup_flavor_profile(email: str) -> Dict:
    """
    Look up a user's flavor profile from Snowflake.

    Args:
        email: User's email (e.g., "fiona.fan@doordash.com")

    Returns:
        Dict with keys: found, cuisine_preferences, top_cuisine, confidence
    """
    # Extract username from email
    username = email.split('@')[0] if '@' in email else email

    query = f"""
    SELECT
        consumer_id,
        flavor_profile_json,
        top_cuisines,
        cuisine_confidence
    FROM proddb.public.consumer_flavor_profiles
    WHERE LOWER(email_prefix) = LOWER('{username}')
    LIMIT 1
    """

    try:
        with SnowflakeHook() as hook:
            df = hook.query_snowflake(query)

            if df.empty:
                logger.info(f"No flavor profile found for {username}")
                return {
                    "found": False,
                    "cuisine_preferences": [],
                    "top_cuisine": None,
                    "confidence": 0
                }

            row = df.iloc[0]

            # Parse JSON flavor profile
            profile = json.loads(row.get('flavor_profile_json', '{}'))
            cuisines = row.get('top_cuisines', '').split(',') if row.get('top_cuisines') else []
            confidence = float(row.get('cuisine_confidence', 0))

            return {
                "found": True,
                "cuisine_preferences": cuisines[:5],  # Top 5 cuisines
                "top_cuisine": cuisines[0] if cuisines else None,
                "confidence": confidence
            }

    except Exception as e:
        logger.error(f"Snowflake lookup failed: {e}")
        return {
            "found": False,
            "cuisine_preferences": [],
            "top_cuisine": None,
            "confidence": 0,
            "error": str(e)
        }
```

## Cuisine Matching Logic

Create `backend/cuisine_matcher.py`:

```python
from typing import Optional, List

# 15 supported cuisines from cuisine_personalities.md
SUPPORTED_CUISINES = [
    "Vietnamese", "Japanese", "Mexican", "Indian", "Chinese",
    "Italian", "Thai", "Korean", "American", "Mediterranean",
    "French", "Greek", "Middle Eastern", "Caribbean", "Ethiopian"
]

# Default cuisine pairings for each dish type
DEFAULT_PAIRINGS = {
    "Pho": "Vietnamese",
    "Ramen": "Japanese",
    "Taco": "Mexican",
    "Burrito": "Mexican",
    "Curry": "Indian",
    "Biryani": "Indian",
    "Dumpling": "Chinese",
    "Hot Pot": "Chinese",
    "Pizza": "Italian",
    "Pad Thai": "Thai",
    "Sushi": "Japanese",
    "Poke": "Japanese",
    "Burger": "American",
    "Fried Chicken": "American",
    "Wings": "American",
    "Sandwich": "American",
    "Noodles": "Chinese",
    "Rice Bowl": "Japanese",
    "Acai Bowl": "American",
    "Boba": "Chinese"
}

def determine_cuisine(
    dish_type: str,
    snowflake_profile: Optional[dict] = None,
    confidence_threshold: float = 0.5
) -> str:
    """
    Determine cuisine based on Snowflake profile or default pairing.

    Priority:
    1. Strong Snowflake preference (confidence > threshold)
    2. Default pairing for dish type
    """
    # If Snowflake profile exists with strong confidence
    if snowflake_profile and snowflake_profile.get('found'):
        confidence = snowflake_profile.get('confidence', 0)
        top_cuisine = snowflake_profile.get('top_cuisine')

        if confidence >= confidence_threshold and top_cuisine in SUPPORTED_CUISINES:
            return top_cuisine

    # Fall back to default pairing
    return DEFAULT_PAIRINGS.get(dish_type, "American")
```

## Frontend Integration

Update `src/js/api.js` to call the backend:

```javascript
const API_BASE = 'http://localhost:8000';

async function getFlavorProfile(email) {
    try {
        const response = await fetch(`${API_BASE}/api/flavor-profile`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        return await response.json();
    } catch (error) {
        console.warn('Backend unavailable, using quiz-only mode');
        return { found: false };
    }
}
```

## ID Card Personalization Indicator

When Snowflake data is used, add indicator to ID card:
- If `found: true` and cuisine from profile: "Personalized with your DoorDash data"
- If `found: false` or default cuisine: "Based on quiz responses"
