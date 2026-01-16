# Spirit Food Alignment System

## Overview

The Spirit Food alignment system uses two DoorDash-themed axes to describe food personality, creating a 3x3 grid of possible alignments. This replaces D&D's Lawful-Chaotic/Good-Evil with more food-relevant dimensions.

---

## Axis 1: Time of Day (When You're Craved)

This axis represents when a food is most likely to be ordered and the energy it brings.

### Early Bird (Morning/Breakfast Energy)
- **Vibe**: Fresh starts, optimism, "I'm going to be productive today"
- **Associated behaviors**: Health-conscious, planning ahead, morning routines
- **DoorDash context**: First order of the day, pre-11am, weekend brunch
- **Foods that skew Early Bird**: Acai Bowl, Poke, Sandwich, Bagel

### All Day (Anytime Energy)
- **Vibe**: Versatile, reliable, "I'm appropriate for any occasion"
- **Associated behaviors**: Balanced, adaptable, crowd-pleasers
- **DoorDash context**: Lunch orders, family dinners, office catering
- **Foods that skew All Day**: Burger, Pizza, Rice Bowl, Noodles

### Late Night (Midnight Energy)
- **Vibe**: Indulgent, no regrets, "The rules don't apply after dark"
- **Associated behaviors**: Spontaneous, comfort-seeking, treating yourself
- **DoorDash context**: Post-10pm orders, post-bar food, movie night
- **Foods that skew Late Night**: Pho, Ramen, Taco, Fried Chicken, Wings

---

## Axis 2: Adventure Level (Flavor Philosophy)

This axis represents how adventurous the food is and the eater it attracts.

### Comfort Seeker (Cozy)
- **Vibe**: "I know what I like and I like what I know"
- **Associated behaviors**: Loyal to favorites, reorders often, seeks warmth
- **DoorDash context**: High repeat order rate, same restaurants, familiar items
- **Foods that skew Comfort Seeker**: Burger, Fried Chicken, Mac & Cheese, Pizza

### Balanced
- **Vibe**: "I'll try something new, but I need a safe option too"
- **Associated behaviors**: Moderate variety, tries trending items, shares plates
- **DoorDash context**: Mix of regulars and exploration, group orders
- **Foods that skew Balanced**: Pad Thai, Dumpling, Rice Bowl, Sandwich

### Flavor Adventurer (Chaotic)
- **Vibe**: "Is it weird? I'm in. Is it spicy? BRING IT."
- **Associated behaviors**: Seeks novelty, handles heat, orders dishes they can't pronounce
- **DoorDash context**: High cuisine variety, tries new restaurants, specialty items
- **Foods that skew Adventurer**: Hot Pot, Biryani, Pho, Curry, Sushi

---

## The 9 Alignments

### COZY MORNING
**Title Style**: "Wholesome [Cuisine] [Dish]"
**Example**: "Wholesome Brazilian Acai Bowl"
**Personality**: The responsible adult who has their life together. Meal preps, hydrates, believes in routines. The friend who gently suggests you should eat vegetables.
**Energy**: Sunrise optimism, yoga pants, actual productivity

### COZY ANYTIME
**Title Style**: "Classic [Cuisine] [Dish]"
**Example**: "Classic American Burger"
**Personality**: The reliable friend who's always there. Not flashy, not trying to be. Just consistently satisfying. The comfort of knowing exactly what you're getting.
**Energy**: Nostalgic warmth, family dinners, movie marathons

### COZY MIDNIGHT
**Title Style**: "Soothing [Cuisine] [Dish]"
**Example**: "Soothing Vietnamese Pho"
**Personality**: The gentle night owl. Seeks comfort in the darkness. The food equivalent of a warm blanket and lo-fi beats. Heals what ails you at 2am.
**Energy**: Quiet introspection, cozy solitude, late-night tenderness

### BALANCED MORNING
**Title Style**: "Fresh [Cuisine] [Dish]"
**Example**: "Fresh Japanese Poke"
**Personality**: The casual health enthusiast. Wants to feel good but not at the expense of taste. Makes smart choices that still spark joy. Aspirational but attainable.
**Energy**: Beach vibes, farmers markets, casual brunch dates

### BALANCED ANYTIME
**Title Style**: "Versatile [Cuisine] [Dish]"
**Example**: "Versatile Chinese Dumpling"
**Personality**: The universal diplomat. Works in any situation, with any crowd. The food that everyone can agree on. Adaptable, approachable, eternally appropriate.
**Energy**: Group hangs, office parties, "I'm easy, whatever you want"

### BALANCED MIDNIGHT
**Title Style**: "Chill [Cuisine] [Dish]"
**Example**: "Chill Thai Pad Thai"
**Personality**: The laid-back night dweller. Late nights aren't chaotic, they're just... extended. Enjoying the evening without going off the rails. Sustainable indulgence.
**Energy**: Netflix binges, midnight snacks, responsible spontaneity

### CHAOTIC MORNING
**Title Style**: "Bold [Cuisine] [Dish]"
**Example**: "Bold Korean Bibimbap"
**Personality**: The early-riser who chose violence (flavor violence). Believes breakfast should be exciting. Wakes up ready for adventure. Possibly runs marathons.
**Energy**: 5am gym sessions, breakfast burritos, "sleep is for the weak"

### CHAOTIC ANYTIME
**Title Style**: "Wild [Cuisine] [Dish]"
**Example**: "Wild Indian Hot Pot"
**Personality**: The spontaneous explorer. Every meal is an adventure. Doesn't have a "usual order" - has a rotation of 47 different cuisines. Makes eating an experience.
**Energy**: Food festivals, spice challenges, "let's try that new place"

### CHAOTIC MIDNIGHT
**Title Style**: "Unhinged [Cuisine] [Dish]"
**Example**: "Unhinged Mexican Taco"
**Personality**: The glorious chaos agent. Believes 3am is when the REAL living happens. No rules, no regrets, just vibes. The food that enables bad decisions (affectionately).
**Energy**: Post-club runs, dares accepted, "we're already here, might as well"

---

## Alignment Display Format

```
ALIGNMENT: [Axis 2 Label] [Axis 1 Label]

[Axis 1 Name]: ████████░░ [X]%
[Axis 2 Name]: ██████░░░░ [Y]%

Full title: "[Alignment Adjective] [Cuisine] [Dish Type]"
```

**Example**:
```
ALIGNMENT: Chaotic Midnight

Time of Day:     Late Night ████████░░ 78%
Adventure Level: Flavor Adventurer ██████░░░░ 62%

Spirit Food: "Unhinged Vietnamese Pho"
```

---

## Alignment Adjective Mapping

| Adventure \ Time | Early Bird | All Day | Late Night |
|------------------|------------|---------|------------|
| **Comfort Seeker** | Wholesome | Classic | Soothing |
| **Balanced** | Fresh | Versatile | Chill |
| **Flavor Adventurer** | Bold | Wild | Unhinged |

---

## Scoring Thresholds

```javascript
function getAlignmentFromScores(timeAxis, adventureAxis) {
  // Calculate percentages
  const timeTotal = Object.values(timeAxis).reduce((a,b) => a+b, 0);
  const advTotal = Object.values(adventureAxis).reduce((a,b) => a+b, 0);

  const timePercents = {
    earlyBird: timeAxis["Early Bird"] / timeTotal * 100,
    allDay: timeAxis["All Day"] / timeTotal * 100,
    lateNight: timeAxis["Late Night"] / timeTotal * 100
  };

  const advPercents = {
    comfort: adventureAxis["Comfort Seeker"] / advTotal * 100,
    balanced: adventureAxis["Balanced"] / advTotal * 100,
    adventurer: adventureAxis["Flavor Adventurer"] / advTotal * 100
  };

  // Get dominant axis values
  const timeWinner = Object.entries(timePercents)
    .sort((a,b) => b[1] - a[1])[0];
  const advWinner = Object.entries(advPercents)
    .sort((a,b) => b[1] - a[1])[0];

  // Map to alignment adjective
  const adjectives = {
    "comfort_earlyBird": "Wholesome",
    "comfort_allDay": "Classic",
    "comfort_lateNight": "Soothing",
    "balanced_earlyBird": "Fresh",
    "balanced_allDay": "Versatile",
    "balanced_lateNight": "Chill",
    "adventurer_earlyBird": "Bold",
    "adventurer_allDay": "Wild",
    "adventurer_lateNight": "Unhinged"
  };

  const key = `${advWinner[0]}_${timeWinner[0]}`;

  return {
    adjective: adjectives[key],
    timeAxis: { name: timeWinner[0], percent: Math.round(timeWinner[1]) },
    adventureAxis: { name: advWinner[0], percent: Math.round(advWinner[1]) }
  };
}
```

---

## D&D Easter Eggs (Optional Flavor Text)

For users who appreciate the D&D reference, we can add subtle nods:

| Spirit Food Alignment | D&D Equivalent | Easter Egg Text |
|----------------------|----------------|------------------|
| Wholesome Morning | Lawful Good | "Paladin of the breakfast table" |
| Classic Anytime | True Neutral | "The Switzerland of sustenance" |
| Unhinged Midnight | Chaotic Evil | "Chaotic delicious" |
| Soothing Midnight | Neutral Good | "Healing aura: activated" |
| Wild Anytime | Chaotic Neutral | "Flavor roulette enthusiast" |
| Bold Morning | Chaotic Good | "Rebel with a meal plan" |

These can appear as small badges or hidden text on the ID card.
