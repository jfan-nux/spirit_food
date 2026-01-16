# Spirit Food - Technical Specification

## Overview

Spirit Food is a whimsical personality quiz app for DoorDash consumers that determines their "Spirit Food" - a combination of dish type, cuisine preference, and personality alignment (e.g., "Chaotic Midnight Vietnamese Pho").

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        SPIRIT FOOD APP                          │
├─────────────────────────────────────────────────────────────────┤
│  Screen 1: Email Entry                                          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  "Discover Your Spirit Food"                             │   │
│  │  [____@doordash.com____]  [Begin Quest]                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              ↓                                  │
│  Background: Snowflake lookup for flavor profile                │
│                              ↓                                  │
├─────────────────────────────────────────────────────────────────┤
│  Screen 2-10: Adventure Quiz (8-12 questions)                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  [Whimsical scenario illustration]                       │   │
│  │  "You're floating through the Sauce Nebula when..."      │   │
│  │                                                          │   │
│  │  [ Choice A ] [ Choice B ] [ Choice C ] [ Choice D ]     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              ↓                                  │
│  Deterministic scoring → Dish Type + Alignment                  │
│                              ↓                                  │
│  Layer Snowflake flavor profile → Cuisine Type                  │
│                              ↓                                  │
├─────────────────────────────────────────────────────────────────┤
│  Screen 3: Spirit Food ID Card                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  SPIRIT FOOD ID                                          │   │
│  │  "Chaotic Midnight Vietnamese Pho"                       │   │
│  │                                                          │   │
│  │  [AI-Generated Food Portrait]                            │   │
│  │                                                          │   │
│  │  Strengths: ...    Weaknesses: ...                       │   │
│  │  Alignment: Late Night 80%, Adventurous 60%              │   │
│  │  Peer Reviews: "..." - Burger, "..." - Sushi             │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Email Entry & Snowflake Lookup

```python
# User enters email (e.g., fiona.fan@doordash.com)
# Extract username: fiona.fan

# Snowflake Query
SELECT consumer_id, flavor_profile_json
FROM proddb.public.consumer_flavor_profiles
WHERE email_prefix = '{username}'
LIMIT 1;

# If found: Parse JSON for cuisine preferences
# If not found: Use quiz-only determination
```

### 2. Quiz Scoring System

Each choice awards points to:
- **Dish Types** (20 possible outcomes)
- **Alignment Axes** (2 axes, 3 values each)

```javascript
const scores = {
  // Dish Types
  dishes: {
    "Pho": 0, "Ramen": 0, "Burger": 0, "Taco": 0, "Pizza": 0,
    "Sushi": 0, "Curry": 0, "Dumpling": 0, "Sandwich": 0, "Burrito": 0,
    "Fried Chicken": 0, "Pad Thai": 0, "Biryani": 0, "Hot Pot": 0,
    "Acai Bowl": 0, "Poke": 0, "Wings": 0, "Noodles": 0, "Rice Bowl": 0, "Boba": 0
  },
  // Alignment Axis 1: Time of Day
  timeAxis: { "Early Bird": 0, "All Day": 0, "Late Night": 0 },
  // Alignment Axis 2: Adventure Level
  adventureAxis: { "Comfort Seeker": 0, "Balanced": 0, "Flavor Adventurer": 0 }
};
```

### 3. Cuisine Determination (Layered)

```
Priority Order:
1. If Snowflake profile exists AND has strong cuisine preference:
   → Use top cuisine from profile

2. If Snowflake profile exists but weak preference:
   → Use quiz-suggested cuisine weighted by profile

3. If no Snowflake profile:
   → Use default cuisine pairing for dish type

Default Pairings:
- Pho → Vietnamese
- Ramen → Japanese
- Taco → Mexican
- Curry → Indian
- Dumpling → Chinese
- etc.
```

### 4. ID Card Generation (AI)

```python
# Prompt to Portkey/OpenAI
prompt = f"""
Generate a Spirit Food ID card for: {alignment} {cuisine} {dish_type}

Include:
1. A whimsical title (e.g., "The Midnight Slurper", "Dawn's Crispy Champion")
2. Three strengths (exaggerated positive food traits)
3. Three weaknesses (humorous food-related flaws)
4. Two signature quotes the food would say
5. Three peer reviews from other foods
6. A hidden talent

Make it playful, exaggerated, and fun like a zodiac reading but for food.
Tone: Whimsical, absurdist humor, DoorDash-themed
"""
```

## Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | HTML/CSS/JavaScript (vanilla, like vegetal) |
| Backend | Python (Flask or FastAPI) |
| Database | Snowflake (via snowflake_connection.py) |
| AI | Portkey/OpenAI (via portkey_llm.py) |
| Hosting | Internal DoorDash or Vercel |

## File Structure

```
spirit_food/
├── src/
│   ├── index.html          # Main app page
│   ├── styles.css          # Styling (vegetal-inspired)
│   ├── js/
│   │   ├── game.js         # Quiz logic & state machine
│   │   ├── scoring.js      # Scoring system
│   │   └── api.js          # Backend API calls
│   └── images/             # Adventure scene illustrations
├── backend/
│   ├── app.py              # Flask/FastAPI server
│   ├── snowflake_lookup.py # Flavor profile queries
│   ├── id_generator.py     # AI ID card generation
│   └── config/.env         # Environment variables
├── specs/
│   ├── spirit_food_spec.md # This file
│   ├── adventure_tree.md   # Quiz question tree
│   ├── food_personalities.md # All 20 dish personalities
│   ├── alignment_system.md # DoorDash alignment axes
│   └── id_card_template.md # ID card content structure
└── data/
    ├── cuisine_types.csv   # 15 cuisines
    └── dish_types.csv      # 20 dishes
```

## Final Output Format

```
Spirit Food ID
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[ALIGNMENT] [CUISINE] [DISH TYPE]
"Late Night Vietnamese Pho"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Title: "The Midnight Broth Whisperer"

[Food Portrait Placeholder]

STRENGTHS:
• Warms souls at 2am when nothing else will
• Layers of complexity that reveal themselves slowly
• The rare food that actually tastes better when you're exhausted

WEAKNESSES:
• Cannot be eaten quietly (slurping is mandatory)
• Splashes on white shirts are inevitable
• Will make you nostalgic for grandma's cooking even if she never made pho

QUOTES:
"The broth knows your secrets."
"Why eat anything else when perfection exists?"

ALIGNMENT:
Late Night: ████████░░ 80%
Adventurous: ██████░░░░ 60%

HIDDEN TALENT: Can cure any cold, hangover, or existential crisis

PEER REVIEWS:
"Pho thinks it's so deep. It's literally just soup." - Burger
"I aspire to Pho's level of comfort." - Salad
"We're not so different, you and I." - Ramen
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Implementation Phases

### Phase 1: Core Quiz (MVP)
- [ ] Static HTML/CSS/JS quiz (no backend)
- [ ] Hardcoded adventure tree (8-10 questions)
- [ ] Deterministic dish type + alignment scoring
- [ ] Static ID card template (text only)

### Phase 2: Backend Integration
- [ ] Flask/FastAPI backend
- [ ] Snowflake flavor profile lookup
- [ ] Cuisine layering logic
- [ ] AI-generated ID card text

### Phase 3: Polish
- [ ] Whimsical illustrations for each scene
- [ ] AI-generated food portrait images
- [ ] Share functionality
- [ ] Mobile-responsive design

## Key Design Decisions

1. **Deterministic Quiz**: Like vegetal, each choice path leads to a specific outcome - no randomness
2. **Layered Cuisine**: Quiz determines dish type; Snowflake data personalizes cuisine
3. **DoorDash Alignment**: Custom axes (Time of Day × Adventure Level) instead of D&D
4. **AI ID Cards**: Text-only for V1, images later
5. **Whimsical Tone**: Absurdist humor, food as characters, exaggerated personality traits
