"""
Snowflake Flavor Profile Lookup

Queries Snowflake for user flavor profiles to personalize cuisine selection.
"""

import json
from typing import Dict

from utils.snowflake_connection import SnowflakeHook
from utils.logger import get_logger

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

    query = """
    SELECT
        consumer_id,
        flavor_profile_json,
        top_cuisines,
        cuisine_confidence
    FROM proddb.public.consumer_flavor_profiles
    WHERE LOWER(email_prefix) = LOWER(%(username)s)
    LIMIT 1
    """

    try:
        with SnowflakeHook() as hook:
            df = hook.fetch_pandas_all(query, params={"username": username})
            # Lowercase column names for consistent access
            df.columns = [c.lower() for c in df.columns]

            if df.empty:
                logger.info(f"No flavor profile found for {username}")
                print(f"DEBUG: No profile found for username: {username}")
                return {
                    "found": False,
                    "cuisine_preferences": [],
                    "top_cuisine": None,
                    "confidence": 0
                }

            row = df.iloc[0]

            # Debug: Print raw row data (first 1000 chars)
            print(f"DEBUG: Retrieved profile for {username}:")
            print(f"DEBUG: Raw row data: {str(dict(row))[:1000]}")

            # Parse JSON flavor profile
            profile = json.loads(row.get('flavor_profile_json', '{}'))
            cuisines_raw = row.get('top_cuisines', '')
            cuisines = cuisines_raw.split(',') if cuisines_raw else []
            cuisines = [c.strip() for c in cuisines if c.strip()]
            confidence = float(row.get('cuisine_confidence', 0))

            return {
                "found": True,
                "cuisine_preferences": cuisines[:5],  # Top 5 cuisines
                "top_cuisine": cuisines[0] if cuisines else None,
                "confidence": confidence
            }

    except Exception as e:
        logger.error(f"Snowflake lookup failed: {e}")
        print(f"DEBUG: Snowflake lookup FAILED for {email}: {str(e)[:500]}")
        return {
            "found": False,
            "cuisine_preferences": [],
            "top_cuisine": None,
            "confidence": 0,
            "error": str(e)
        }
