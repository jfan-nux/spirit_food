"""
Cuisine Matcher

Determines the appropriate cuisine based on Snowflake profile or default pairings.
"""

from typing import Optional, List

# 15 supported cuisines
SUPPORTED_CUISINES = [
    "Vietnamese", "Japanese", "Mexican", "Indian", "Chinese",
    "Italian", "Thai", "Korean", "American", "Mediterranean",
    "French", "Greek", "Middle Eastern", "Caribbean", "Ethiopian"
]

# Default cuisine pairings for each dish type (20 dish types)
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

    Args:
        dish_type: The dish type from quiz result
        snowflake_profile: Optional flavor profile from Snowflake lookup
        confidence_threshold: Minimum confidence to use Snowflake preference

    Returns:
        Cuisine string (e.g., "Vietnamese")
    """
    # If Snowflake profile exists with strong confidence
    if snowflake_profile and snowflake_profile.get('found'):
        confidence = snowflake_profile.get('confidence', 0)
        top_cuisine = snowflake_profile.get('top_cuisine')

        if confidence >= confidence_threshold and top_cuisine in SUPPORTED_CUISINES:
            return top_cuisine

    # Fall back to default pairing
    return DEFAULT_PAIRINGS.get(dish_type, "American")


def get_supported_cuisines() -> List[str]:
    """Return list of all supported cuisines."""
    return SUPPORTED_CUISINES.copy()


def get_default_cuisine(dish_type: str) -> str:
    """Get the default cuisine for a dish type."""
    return DEFAULT_PAIRINGS.get(dish_type, "American")
