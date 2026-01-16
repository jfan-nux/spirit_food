# AI ID Card Generation Specification

## Overview

Use Portkey/OpenAI to generate dynamic, personalized ID card content instead of hardcoded personalities.

## Existing Utility

Use `backend/utils/portkey_llm.py` which provides:
- `PortkeyLLM` class with `analyze_text(text, prompt, model, max_tokens, temperature)`
- `get_portkey_llm()` singleton accessor
- Reads config from `PORTKEY_API_KEY` and `PORTKEY_OPENAI_VIRTUAL_KEY` env vars

## Implementation: id_generator.py

Create `backend/id_generator.py`:

```python
from utils.portkey_llm import get_portkey_llm
from utils.logger import get_logger
import json
from typing import Dict, Optional
import hashlib

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
```

## API Endpoint Integration

Add to `backend/app.py`:

```python
from id_generator import generate_id_card

@app.post("/api/generate-id-card")
async def api_generate_id_card(request: IDCardRequest):
    result = generate_id_card(
        dish_type=request.dish_type,
        cuisine=request.cuisine,
        alignment_adjective=request.alignment_adjective,
        time_axis=request.time_axis,
        time_percent=request.time_percent,
        adventure_axis=request.adventure_axis,
        adventure_percent=request.adventure_percent
    )

    if result is None:
        raise HTTPException(status_code=500, detail="AI generation failed")

    return result
```

## Frontend Integration

Update `src/js/game.js` to optionally use AI-generated content:

```javascript
async function getIDCardContent(dishType, cuisine, alignment) {
    // Try AI generation first
    try {
        const response = await fetch('http://localhost:8000/api/generate-id-card', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                dish_type: dishType,
                cuisine: cuisine,
                alignment_adjective: alignment.adjective,
                time_axis: alignment.timeAxis,
                time_percent: alignment.timePercent,
                adventure_axis: alignment.adventureAxis,
                adventure_percent: alignment.adventurePercent
            })
        });

        if (response.ok) {
            return await response.json();
        }
    } catch (error) {
        console.warn('AI generation unavailable, using hardcoded content');
    }

    // Fall back to hardcoded content from scoring.js
    return getHardcodedPersonality(dishType);
}
```

## Caching Strategy

- Cache key: MD5 hash of `dish_type|cuisine|alignment_adjective`
- Same combo always returns same content (deterministic UX)
- Cache lives in memory (cleared on server restart)
- Future enhancement: Redis/persistent cache

## Model Selection

- **gpt-4o-mini**: Fast, cheap, good for creative text
- Temperature 0.8 for creative variety
- Max tokens 1000 (typical response ~400 tokens)
