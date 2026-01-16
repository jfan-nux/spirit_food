"""
ID Card Generator

Uses Portkey LLM to generate AI-powered Spirit Food ID card content.
"""

from typing import Dict, Optional
import json
import hashlib

from utils.portkey_llm import get_portkey_llm
from utils.logger import get_logger

logger = get_logger(__name__)

# In-memory cache for AI responses
_id_card_cache: Dict[str, dict] = {}


def generate_cache_key(dish_type: str, cuisine: str, alignment_adjective: str) -> str:
    """Generate a unique cache key for this combination."""
    combo = f"{dish_type}|{cuisine}|{alignment_adjective}"
    return hashlib.md5(combo.encode()).hexdigest()


def generate_id_card(
    dish_type: str,
    cuisine: str,
    alignment_adjective: str,
    time_axis: str,
    time_percent: int,
    adventure_axis: str,
    adventure_percent: int,
    use_cache: bool = True
) -> Optional[Dict]:
    """
    Generate AI-powered ID card content.

    Args:
        dish_type: e.g., "Pho", "Burger"
        cuisine: e.g., "Vietnamese", "American"
        alignment_adjective: e.g., "Unhinged", "Classic"
        time_axis: e.g., "Late Night", "Early Bird"
        time_percent: 0-100
        adventure_axis: e.g., "Adventurer", "Comfort Seeker"
        adventure_percent: 0-100
        use_cache: Whether to use cached responses

    Returns:
        Dict with title, strengths, weaknesses, quotes, hidden_talent, peer_reviews
    """
    # Check cache first
    cache_key = generate_cache_key(dish_type, cuisine, alignment_adjective)
    if use_cache and cache_key in _id_card_cache:
        logger.info(f"Cache hit for {alignment_adjective} {cuisine} {dish_type}")
        cached = _id_card_cache[cache_key].copy()
        cached['cached'] = True
        return cached

    llm = get_portkey_llm()
    if not llm.is_available():
        logger.warning("Portkey LLM not available, returning None")
        return None

    prompt = f"""Generate a Spirit Food ID card for the following combination:

SPIRIT FOOD: {alignment_adjective} {cuisine} {dish_type}
- Dish Type: {dish_type}
- Cuisine: {cuisine}
- Time Alignment: {time_axis} ({time_percent}%)
- Adventure Alignment: {adventure_axis} ({adventure_percent}%)

Generate:
1. **Creative Title** (2-4 words) - capture the essence of this combination
2. **Three Strengths** (1 sentence each) - exaggerated positive traits
3. **Three Weaknesses** (1 sentence each) - humorous food-related flaws
4. **Two Signature Quotes** - what this food would say
5. **Hidden Talent** (1 phrase) - an unexpected ability
6. **Three Peer Reviews** - from other foods (include reviewer name)

TONE: Whimsical, absurdist humor, zodiac-reading energy
STYLE: BuzzFeed meets horoscope meets food critic

Return ONLY valid JSON:
{{
  "title": "...",
  "strengths": ["...", "...", "..."],
  "weaknesses": ["...", "...", "..."],
  "quotes": ["...", "..."],
  "hidden_talent": "...",
  "peer_reviews": [
    {{"text": "...", "reviewer": "..."}},
    {{"text": "...", "reviewer": "..."}},
    {{"text": "...", "reviewer": "..."}}
  ]
}}"""

    try:
        response = llm.analyze_text(
            text=f"{alignment_adjective} {cuisine} {dish_type}",
            prompt=prompt,
            model="gpt-4o-mini",
            max_tokens=1000,
            temperature=0.8  # Higher for creativity
        )

        if not response:
            logger.error("Empty response from LLM")
            return None

        # Parse JSON response
        # Handle potential markdown code blocks
        if "```json" in response:
            response = response.split("```json")[1].split("```")[0]
        elif "```" in response:
            response = response.split("```")[1].split("```")[0]

        result = json.loads(response.strip())
        result['cached'] = False

        # Cache the result
        if use_cache:
            _id_card_cache[cache_key] = result.copy()
            logger.info(f"Cached ID card for {alignment_adjective} {cuisine} {dish_type}")

        return result

    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse AI response as JSON: {e}")
        logger.debug(f"Raw response: {response}")
        return None
    except Exception as e:
        logger.error(f"AI generation failed: {e}")
        return None


def clear_cache():
    """Clear the ID card cache."""
    global _id_card_cache
    _id_card_cache = {}
    logger.info("ID card cache cleared")
