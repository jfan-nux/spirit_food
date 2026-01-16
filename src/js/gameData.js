/**
 * Spirit Food Adventure Tree - Game Data
 * Ported from specs/adventure_tree.md
 *
 * Each choice awards points to:
 * - Dish Types: Array of dish names
 * - Time Axis: "Early Bird", "All Day", "Late Night"
 * - Adventure Axis: "Comfort", "Balanced", "Adventurer"
 */

const gameData = {
    "1": {
        "scene": 1,
        "text": "You materialize in the DoorDash Dimension - a swirling vortex of delivery bags and glowing receipts. A cheerful ding announces your existence. What kind of vessel are you in?",
        "image": "images/scene1.png",
        "choices": {
            "A sturdy paper bag, practical and dependable": {
                "next": 2,
                "dishes": ["Burger", "Sandwich", "Wings"],
                "time": "All Day",
                "adventure": "Comfort"
            },
            "A sleek black container, mysterious and warm": {
                "next": 2,
                "dishes": ["Pho", "Ramen", "Hot Pot"],
                "time": "Late Night",
                "adventure": "Adventurer"
            },
            "A colorful box covered in restaurant logos": {
                "next": 2,
                "dishes": ["Taco", "Burrito", "Pad Thai"],
                "time": "All Day",
                "adventure": "Balanced"
            },
            "A tower of carefully stacked containers": {
                "next": 2,
                "dishes": ["Sushi", "Poke", "Dumpling"],
                "time": "All Day",
                "adventure": "Adventurer"
            }
        }
    },
    "2": {
        "scene": 2,
        "text": "A Dasher materializes before you - but something's off. They're riding a giant flying chopstick and their hot bag is full of glowing stars. 'Quick!' they shout. 'The Hangry Void is expanding! Where should we go first?'",
        "image": "images/scene2.png",
        "choices": {
            "To the Comfort Clouds! Where warmth never fades!": {
                "next": "3A",
                "dishes": ["Burger", "Fried Chicken", "Pizza"],
                "time": "Early Bird",
                "adventure": "Comfort"
            },
            "Through the Spice Nebula! No flavor is too bold!": {
                "next": "3B",
                "dishes": ["Curry", "Biryani", "Hot Pot"],
                "time": "Late Night",
                "adventure": "Adventurer"
            },
            "The Noodle Nexus! Where carbs bend reality!": {
                "next": "3C",
                "dishes": ["Ramen", "Pho", "Pad Thai", "Noodles"],
                "time": "All Day",
                "adventure": "Balanced"
            },
            "The Crispy Kingdom! Where texture is everything!": {
                "next": "3D",
                "dishes": ["Wings", "Fried Chicken", "Taco"],
                "time": "Late Night",
                "adventure": "Adventurer"
            }
        }
    },
    "3A": {
        "scene": 3,
        "text": "You float through clouds made of mashed potatoes and gravy rain. A wise old Grilled Cheese floats by. 'Young one,' it says, 'what do you seek in these gentle skies?'",
        "image": "images/scene3a.png",
        "choices": {
            "I seek the warmth of familiar flavors": {
                "next": 4,
                "dishes": ["Burger", "Sandwich"],
                "time": "Early Bird",
                "adventure": "Comfort"
            },
            "I want to wrap myself in something satisfying": {
                "next": 4,
                "dishes": ["Burrito", "Sandwich"],
                "time": "All Day",
                "adventure": "Comfort"
            },
            "I'm here for the crispy-meets-soft experience": {
                "next": 4,
                "dishes": ["Fried Chicken", "Wings"],
                "time": "Late Night",
                "adventure": "Balanced"
            },
            "Just vibing honestly": {
                "next": 4,
                "dishes": ["Pizza", "Noodles"],
                "time": "All Day",
                "adventure": "Comfort"
            }
        }
    },
    "3B": {
        "scene": 3,
        "text": "Colors you've never seen assault your senses. A being made entirely of chili oil approaches. 'You dare enter my domain?' it booms. 'Prove your worth!'",
        "image": "images/scene3b.png",
        "choices": {
            "Bow respectfully and ask to learn the ancient ways": {
                "next": 4,
                "dishes": ["Curry", "Biryani"],
                "time": "All Day",
                "adventure": "Adventurer"
            },
            "Challenge it to a heat tolerance contest": {
                "next": 4,
                "dishes": ["Hot Pot", "Ramen"],
                "time": "Late Night",
                "adventure": "Adventurer"
            },
            "Offer it a cooling drink as a peace offering": {
                "next": 4,
                "dishes": ["Pho", "Rice Bowl"],
                "time": "Late Night",
                "adventure": "Balanced"
            },
            "Run away screaming but like in a fun way": {
                "next": 4,
                "dishes": ["Pad Thai", "Noodles"],
                "time": "All Day",
                "adventure": "Balanced"
            }
        }
    },
    "3C": {
        "scene": 3,
        "text": "Infinite strands of noodles stretch in every direction like a carbohydrate cosmos. They whisper secrets of umami. A Ramen sage asks: 'What is your noodle philosophy?'",
        "image": "images/scene3c.png",
        "choices": {
            "Broth is life. The noodle is merely the vessel.": {
                "next": 4,
                "dishes": ["Pho", "Ramen"],
                "time": "Late Night",
                "adventure": "Adventurer"
            },
            "Stir-fried, tossed, SAUCED. Dry noodles reign supreme.": {
                "next": 4,
                "dishes": ["Pad Thai", "Noodles"],
                "time": "All Day",
                "adventure": "Balanced"
            },
            "I believe in the power of the slurp": {
                "next": 4,
                "dishes": ["Ramen", "Pho", "Hot Pot"],
                "time": "Late Night",
                "adventure": "Adventurer"
            },
            "Noodles? I thought this was the Rice District": {
                "next": 4,
                "dishes": ["Rice Bowl", "Biryani"],
                "time": "All Day",
                "adventure": "Comfort"
            }
        }
    },
    "3D": {
        "scene": 3,
        "text": "Everything here CRUNCHES. The ground is made of fried wontons. The trees are giant tempura vegetables. A Chicken Tender knight approaches. 'State your crunch allegiance!'",
        "image": "images/scene3d.png",
        "choices": {
            "I pledge to the Order of the Deep Fry!": {
                "next": 4,
                "dishes": ["Fried Chicken", "Wings"],
                "time": "Late Night",
                "adventure": "Comfort"
            },
            "My loyalty lies with the Taco Crunch Covenant!": {
                "next": 4,
                "dishes": ["Taco", "Burrito"],
                "time": "Late Night",
                "adventure": "Adventurer"
            },
            "I serve the Dumpling Wrapper Council!": {
                "next": 4,
                "dishes": ["Dumpling", "Sushi"],
                "time": "All Day",
                "adventure": "Balanced"
            },
            "I'm more of a soft crunch person - like lettuce": {
                "next": 4,
                "dishes": ["Sandwich", "Poke"],
                "time": "Early Bird",
                "adventure": "Balanced"
            }
        }
    },
    "4": {
        "scene": 4,
        "text": "ALERT! A temporal anomaly! You're being pulled through the Clock of Cravings! When do you feel most... yourself?",
        "image": "images/scene4.png",
        "choices": {
            "Dawn. Fresh starts. Breakfast energy forever.": {
                "next": 5,
                "dishes": ["Acai Bowl", "Sandwich", "Burrito"],
                "time": "Early Bird",
                "adventure": null,
                "timeBonus": true
            },
            "High noon. Peak performance. Main character moment.": {
                "next": 5,
                "dishes": ["Burger", "Poke", "Rice Bowl"],
                "time": "All Day",
                "adventure": null,
                "timeBonus": true
            },
            "The golden hour. Dinner dreams. Cozy contemplation.": {
                "next": 5,
                "dishes": ["Curry", "Ramen", "Hot Pot"],
                "time": "All Day",
                "adventure": "Comfort"
            },
            "2 AM. The witching hour. When hunger is REAL.": {
                "next": 5,
                "dishes": ["Pho", "Taco", "Fried Chicken"],
                "time": "Late Night",
                "adventure": null,
                "timeBonus": true
            }
        }
    },
    "5": {
        "scene": 5,
        "text": "You arrive at a mystical intersection where four elemental forces converge. Each path calls to you. Which ingredient energy resonates with your soul?",
        "image": "images/scene5.png",
        "choices": {
            "PROTEIN PATH - Strength flows through me": {
                "next": 6,
                "dishes": ["Burger", "Fried Chicken", "Wings"],
                "time": null,
                "adventure": "Comfort"
            },
            "CARB CANYON - I am sustained by the grain": {
                "next": 6,
                "dishes": ["Ramen", "Noodles", "Rice Bowl", "Biryani"],
                "time": null,
                "adventure": "Balanced"
            },
            "VEGGIE VALLEY - Freshness is my vibe": {
                "next": 6,
                "dishes": ["Poke", "Acai Bowl"],
                "time": "Early Bird",
                "adventure": "Adventurer"
            },
            "SAUCE SPRINGS - Flavor over everything": {
                "next": 6,
                "dishes": ["Curry", "Pho", "Hot Pot", "Pad Thai"],
                "time": "Late Night",
                "adventure": "Adventurer"
            }
        }
    },
    "6": {
        "scene": 6,
        "text": "A giant phone notification appears in the sky. Your friends are ordering food together! How do you approach the group order?",
        "image": "images/scene6.png",
        "choices": {
            "I'll get my usual. I know what I like.": {
                "next": 7,
                "dishes": ["Burger", "Pizza", "Fried Chicken"],
                "time": null,
                "adventure": "Comfort",
                "adventureBonus": true
            },
            "What's everyone else getting? I'll coordinate!": {
                "next": 7,
                "dishes": ["Sushi", "Dumpling", "Poke"],
                "time": null,
                "adventure": "Balanced",
                "adventureBonus": true
            },
            "Let me find something no one's tried before!": {
                "next": 7,
                "dishes": ["Biryani", "Pho", "Hot Pot"],
                "time": null,
                "adventure": "Adventurer",
                "adventureBonus": true
            },
            "I'm just here for the boba honestly": {
                "next": 7,
                "dishes": ["Boba", "Acai Bowl"],
                "time": "Late Night",
                "adventure": "Balanced"
            }
        }
    },
    "7": {
        "scene": 7,
        "text": "DISASTER! The Hangry Void has caught up! It's a swirling mass of empty stomachs and sad desk lunches! Only the perfect food can satisfy it! What's your battle cry?",
        "image": "images/scene7.png",
        "choices": {
            "COMFORT CONQUERS ALL! *summons cozy energy*": {
                "next": 8,
                "dishes": ["Burger", "Ramen", "Pizza"],
                "time": "Late Night",
                "adventure": "Comfort"
            },
            "SPICE SAVES THE DAY! *unleashes flavor blast*": {
                "next": 8,
                "dishes": ["Curry", "Pho", "Hot Pot", "Taco"],
                "time": "Late Night",
                "adventure": "Adventurer"
            },
            "FRESHNESS PREVAILS! *radiates health*": {
                "next": 8,
                "dishes": ["Poke", "Acai Bowl", "Sushi"],
                "time": "Early Bird",
                "adventure": "Adventurer"
            },
            "CARBS ARE KING! *becomes extra filling*": {
                "next": 8,
                "dishes": ["Burrito", "Noodles", "Rice Bowl", "Biryani"],
                "time": "All Day",
                "adventure": "Comfort"
            }
        }
    },
    "8": {
        "scene": 8,
        "text": "Victory! The Hangry Void is satisfied! Your Dasher guide says, 'You've proven yourself. Where shall I deliver you for eternity?'",
        "image": "images/scene8.png",
        "choices": {
            "A cozy apartment with Netflix already playing": {
                "next": 9,
                "dishes": ["Ramen", "Pizza", "Wings"],
                "time": "Late Night",
                "adventure": "Comfort"
            },
            "A sunny park bench, people-watching paradise": {
                "next": 9,
                "dishes": ["Poke", "Acai Bowl", "Sandwich"],
                "time": "Early Bird",
                "adventure": "Balanced"
            },
            "A lively dinner table with too many people": {
                "next": 9,
                "dishes": ["Hot Pot", "Dumpling", "Curry"],
                "time": "All Day",
                "adventure": "Adventurer"
            },
            "Wherever I'm needed most. I'm versatile.": {
                "next": 9,
                "dishes": ["Burger", "Taco", "Rice Bowl"],
                "time": "All Day",
                "adventure": "Balanced"
            }
        }
    },
    "9": {
        "scene": 9,
        "text": "One last thing, the universe whispers. When someone asks what kind of food you are... what do you FEEL in your soul?",
        "image": "images/scene9.png",
        "isFinal": true,
        "choices": {
            "I'm the food you crave when you need a hug": {
                "next": 0,
                "dishes": ["Pho", "Ramen", "Curry"],
                "time": "Late Night",
                "adventure": "Comfort",
                "multiplier": 2
            },
            "I'm the food that makes people say 'treat yourself'": {
                "next": 0,
                "dishes": ["Sushi", "Poke", "Acai Bowl"],
                "time": "Early Bird",
                "adventure": "Adventurer",
                "multiplier": 2
            },
            "I'm the food that brings people together": {
                "next": 0,
                "dishes": ["Hot Pot", "Dumpling", "Pizza"],
                "time": "All Day",
                "adventure": "Balanced",
                "multiplier": 2
            },
            "I'm the food that hits different at 2am": {
                "next": 0,
                "dishes": ["Taco", "Burger", "Fried Chicken", "Wings"],
                "time": "Late Night",
                "adventure": null,
                "timeBonus": true,
                "multiplier": 2
            }
        }
    }
};

// Total number of scenes for progress bar
const TOTAL_SCENES = 9;

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { gameData, TOTAL_SCENES };
}
