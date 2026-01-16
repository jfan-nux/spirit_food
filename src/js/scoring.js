/**
 * Spirit Food Scoring System
 * Handles dish type scoring, alignment calculations, and personality data
 */

// Initialize scores
const scores = {
    dishes: {
        "Pho": 0,
        "Ramen": 0,
        "Burger": 0,
        "Taco": 0,
        "Pizza": 0,
        "Sushi": 0,
        "Curry": 0,
        "Dumpling": 0,
        "Sandwich": 0,
        "Burrito": 0,
        "Fried Chicken": 0,
        "Pad Thai": 0,
        "Biryani": 0,
        "Hot Pot": 0,
        "Acai Bowl": 0,
        "Poke": 0,
        "Wings": 0,
        "Noodles": 0,
        "Rice Bowl": 0,
        "Boba": 0
    },
    timeAxis: {
        "Early Bird": 0,
        "All Day": 0,
        "Late Night": 0
    },
    adventureAxis: {
        "Comfort": 0,
        "Balanced": 0,
        "Adventurer": 0
    }
};

// Default cuisine pairings for each dish
const defaultCuisines = {
    "Pho": "Vietnamese",
    "Ramen": "Japanese",
    "Burger": "American",
    "Taco": "Mexican",
    "Pizza": "Italian",
    "Sushi": "Japanese",
    "Curry": "Indian",
    "Dumpling": "Chinese",
    "Sandwich": "American",
    "Burrito": "Mexican",
    "Fried Chicken": "American",
    "Pad Thai": "Thai",
    "Biryani": "Indian",
    "Hot Pot": "Chinese",
    "Acai Bowl": "Brazilian",
    "Poke": "Hawaiian",
    "Wings": "American",
    "Noodles": "Chinese",
    "Rice Bowl": "Japanese",
    "Boba": "Taiwanese"
};

// Alignment adjective matrix
const alignmentAdjectives = {
    "Comfort_Early Bird": "Wholesome",
    "Comfort_All Day": "Classic",
    "Comfort_Late Night": "Soothing",
    "Balanced_Early Bird": "Fresh",
    "Balanced_All Day": "Versatile",
    "Balanced_Late Night": "Chill",
    "Adventurer_Early Bird": "Bold",
    "Adventurer_All Day": "Wild",
    "Adventurer_Late Night": "Unhinged"
};

// Food personalities data (from food_personalities.md)
const foodPersonalities = {
    "Pho": {
        archetype: "The Midnight Healer",
        emoji: "\uD83C\uDF5C",
        strengths: [
            "Cures any ailment: colds, hangovers, heartbreak, existential dread",
            "Layers of complexity that reveal themselves slowly, like a good therapist",
            "The rare food that actually tastes BETTER when you're exhausted and vulnerable"
        ],
        weaknesses: [
            "Cannot be eaten quietly (slurping is legally required)",
            "Will splash on white shirts with surgical precision",
            "Makes you nostalgic for grandma's cooking even if she never made pho"
        ],
        quotes: [
            "The broth knows your secrets. And it accepts you anyway.",
            "You think you ordered soup. You actually ordered a spiritual experience."
        ],
        peerReviews: [
            { text: "Pho thinks it's so deep. It's literally just soup with delusions of grandeur.", reviewer: "Burger" },
            { text: "I aspire to Pho's level of comfort. Teach me your ways.", reviewer: "Salad" },
            { text: "We're not so different, you and I. Except I have miso and superiority.", reviewer: "Ramen" }
        ],
        hiddenTalent: "Can read the room and adjust its warmth accordingly"
    },
    "Ramen": {
        archetype: "The Brooding Artist",
        emoji: "\uD83C\uDF5C",
        strengths: [
            "Has more depth than your ex (literally, the broth is 24-hour simmered)",
            "Every component is a deliberate choice - noodle firmness is a LIFESTYLE",
            "Looks simple but is actually incredibly complex underneath"
        ],
        weaknesses: [
            "Pretentious about broth purity and will let you know",
            "Gets soggy if you don't commit fast enough",
            "Has a superiority complex about being 'authentic'"
        ],
        quotes: [
            "You don't choose your ramen. Your ramen chooses you.",
            "I've been simmering for 24 hours. What have YOU accomplished?"
        ],
        peerReviews: [
            { text: "Ramen acts like it invented noodle soup. We all see through it.", reviewer: "Pho" },
            { text: "Respect the craft. Even if the craft is exhausting to listen to.", reviewer: "Sushi" },
            { text: "Ramen is the friend who makes everything about them. But like, deliciously.", reviewer: "Pizza" }
        ],
        hiddenTalent: "Can make anyone feel like they're in a Studio Ghibli film"
    },
    "Burger": {
        archetype: "The Reliable Friend",
        emoji: "\uD83C\uDF54",
        strengths: [
            "Always there when you need it, no questions asked",
            "Customizable to literally any mood (pickles? no pickles? chaos)",
            "The universal language of satisfaction"
        ],
        weaknesses: [
            "Falls apart under pressure (and gravity)",
            "Can't handle complex situations without getting messy",
            "Thinks it's more sophisticated than it is when it adds avocado"
        ],
        quotes: [
            "I'm not basic. I'm CLASSIC. There's a difference.",
            "You want complicated? Go date a salad. I'm here for you."
        ],
        peerReviews: [
            { text: "Burger is that friend who peaked in high school but you still love them.", reviewer: "Sushi" },
            { text: "Reliable. Predictable. Sometimes that's exactly what you need.", reviewer: "Curry" },
            { text: "We're basically the same person, just different cultural upbringings.", reviewer: "Taco" }
        ],
        hiddenTalent: "Making you forget your diet existed"
    },
    "Taco": {
        archetype: "The Life of the Party",
        emoji: "\uD83C\uDF2E",
        strengths: [
            "Brings people together (taco nights are sacred)",
            "Tiny but mighty - maximum flavor per square inch",
            "Versatile enough for breakfast, lunch, dinner, AND 2am"
        ],
        weaknesses: [
            "Structurally questionable after the third bite",
            "Toppings have a 50% chance of landing in your lap",
            "Gets defensive when called 'just a folded tortilla'"
        ],
        quotes: [
            "It's not about the shell. It's about what's INSIDE. Deep, right?",
            "I contain multitudes. And also way too much salsa."
        ],
        peerReviews: [
            { text: "Taco energy is unmatched. Chaotic but endearing.", reviewer: "Burrito" },
            { text: "We respect the hustle. Small package, big personality.", reviewer: "Dumpling" },
            { text: "Taco is the friend who convinces you to stay out past midnight.", reviewer: "Salad" }
        ],
        hiddenTalent: "Making Tuesdays something to look forward to"
    },
    "Curry": {
        archetype: "The Wise Elder",
        emoji: "\uD83C\uDF5B",
        strengths: [
            "Contains ancient wisdom passed down through generations",
            "Somehow tastes even better the next day (aging gracefully)",
            "Warmth that reaches your SOUL, not just your stomach"
        ],
        weaknesses: [
            "Will permanently stain your Tupperware (and your heart)",
            "Doesn't understand 'mild' - even mild curry has opinions",
            "Judges you silently if you can't handle the spice"
        ],
        quotes: [
            "I've been perfecting this recipe for 500 years. You're welcome.",
            "The spice is not punishment. It's enlightenment."
        ],
        peerReviews: [
            { text: "Curry has range. Respect.", reviewer: "Hot Pot" },
            { text: "Curry showed up to my party and made it about them. It worked though.", reviewer: "Rice Bowl" },
            { text: "We're both comfort food but Curry has more... gravitas.", reviewer: "Mac & Cheese" }
        ],
        hiddenTalent: "Making you call your mom to ask for recipes"
    },
    "Sushi": {
        archetype: "The Sophisticated Minimalist",
        emoji: "\uD83C\uDF63",
        strengths: [
            "Less is more - every piece is intentional",
            "Makes you feel cultured even when eating with your hands",
            "The rare food that's both healthy AND satisfying"
        ],
        weaknesses: [
            "Judgmental about your soy sauce usage (too much = peasant behavior)",
            "Expensive taste on a ramen budget",
            "Acts like using chopsticks wrong is a personal offense"
        ],
        quotes: [
            "Quality over quantity. Always.",
            "I don't need sauce to be interesting. Unlike SOME foods."
        ],
        peerReviews: [
            { text: "Sushi is that friend who corrects your pronunciation. Annoying but right.", reviewer: "Burger" },
            { text: "We share a respect for craftsmanship. Sushi gets it.", reviewer: "Ramen" },
            { text: "Fancy but still sits at our table. We accept you, Sushi.", reviewer: "Pizza" }
        ],
        hiddenTalent: "Making any meal feel like a special occasion"
    },
    "Dumpling": {
        archetype: "The Hidden Gem",
        emoji: "\uD83E\uDD5F",
        strengths: [
            "Surprise factor - you never know exactly what's inside until you bite",
            "Brings joy in small packages (like puppies or unexpected refunds)",
            "Equally good steamed, fried, or boiled - no ego about it"
        ],
        weaknesses: [
            "Burns the roof of your mouth without warning (soup dumplings are DANGEROUS)",
            "Easy to eat 47 without realizing",
            "Gets competitive about whose grandma's recipe is better"
        ],
        quotes: [
            "Good things come in small packages. Great things come with dipping sauce.",
            "I'm just a humble parcel of joy. Don't overthink it."
        ],
        peerReviews: [
            { text: "Dumpling is the sleeper hit of any meal. Never disappoints.", reviewer: "Hot Pot" },
            { text: "Small but mighty. We relate.", reviewer: "Taco" },
            { text: "Dumpling walked so we could run.", reviewer: "Burrito" }
        ],
        hiddenTalent: "Disappearing faster than you intended"
    },
    "Hot Pot": {
        archetype: "The Social Butterfly",
        emoji: "\u2668\uFE0F",
        strengths: [
            "Forces people to interact and share (communal dining = free therapy)",
            "Customizable to EVERYONE's preferences simultaneously",
            "The only food that's also an activity"
        ],
        weaknesses: [
            "Requires commitment - this is a 2-hour minimum situation",
            "Someone always overcooks the meat (looking at you, Kevin)",
            "Creates arguments about broth territories"
        ],
        quotes: [
            "I don't just feed you. I bring you TOGETHER.",
            "Your dietary restrictions are valid. Get your own pot."
        ],
        peerReviews: [
            { text: "Hot Pot is exhausting but worth it. Like a good friendship.", reviewer: "Ramen" },
            { text: "I could never. Too much socializing. But I respect it.", reviewer: "Pizza" },
            { text: "Hot Pot is the extrovert we all need sometimes.", reviewer: "Pho" }
        ],
        hiddenTalent: "Making you forget time exists"
    },
    "Pizza": {
        archetype: "The People Pleaser",
        emoji: "\uD83C\uDF55",
        strengths: [
            "Makes everyone happy (even pineapple people, we guess)",
            "Works for any occasion: celebration, sadness, hangover, Tuesday",
            "The great equalizer - billionaires and broke students eat the same slice"
        ],
        weaknesses: [
            "Causes intense debates that ruin friendships (pineapple, crust, fold vs. no fold)",
            "Hot cheese is a safety hazard",
            "Convinced it's more Italian than it actually is"
        ],
        quotes: [
            "There are no wrong toppings. Except actually there are. Several.",
            "I'm round. I come in a square box. I'm eaten in triangles. I am COMPLEX."
        ],
        peerReviews: [
            { text: "Pizza is the friend everyone likes but no one knows deeply.", reviewer: "Burger" },
            { text: "We respect the mainstream appeal. Not everyone can be niche.", reviewer: "Sushi" },
            { text: "Pizza remembers where it came from. The streets.", reviewer: "Hot Dog" }
        ],
        hiddenTalent: "Being equally good hot, cold, or microwaved at 3am"
    },
    "Fried Chicken": {
        archetype: "The Confident Icon",
        emoji: "\uD83C\uDF57",
        strengths: [
            "Unapologetically itself - crispy, juicy, perfect",
            "The sound it makes when you bite it is ASMR",
            "Comfort food that also makes you feel powerful"
        ],
        weaknesses: [
            "Makes your fingers a crime scene",
            "Can't be eaten elegantly (don't even try)",
            "Gets jealous when you order other protein"
        ],
        quotes: [
            "I didn't come here to be healthy. I came here to be LEGENDARY.",
            "You can gym tomorrow. Right now, we feast."
        ],
        peerReviews: [
            { text: "Fried Chicken doesn't pretend to be something it's not. Respect.", reviewer: "Burger" },
            { text: "The audacity. The crunch. The confidence. I could never.", reviewer: "Salad" },
            { text: "We're basically cousins. Family loyalty.", reviewer: "Wings" }
        ],
        hiddenTalent: "Making any day feel like a celebration"
    },
    "Wings": {
        archetype: "The Competitive Sports Fan",
        emoji: "\uD83C\uDF57",
        strengths: [
            "Perfect for sharing but also perfect for hoarding",
            "Flavor variety is ENDLESS (buffalo, lemon pepper, garlic parm, YES)",
            "Creates an atmosphere wherever it goes"
        ],
        weaknesses: [
            "Math problems: how many is enough? (answer: more)",
            "Sauce-to-napkin ratio is always wrong",
            "Gets too intense during game days"
        ],
        quotes: [
            "Boneless wings are just chicken nuggets in a costume. I said what I said.",
            "The messier, the better. This is a lifestyle."
        ],
        peerReviews: [
            { text: "Wings are like Fried Chicken's younger, more reckless sibling.", reviewer: "Fried Chicken" },
            { text: "We respect a food that knows its lane.", reviewer: "Pizza" },
            { text: "Wings at a party means it's about to be a GOOD party.", reviewer: "Nachos" }
        ],
        hiddenTalent: "Making people competitive about sauce preferences"
    },
    "Pad Thai": {
        archetype: "The Approachable Adventurer",
        emoji: "\uD83C\uDF5D",
        strengths: [
            "Gateway drug to Thai cuisine - welcomes all skill levels",
            "Perfect balance of sweet, sour, salty (the trinity)",
            "Makes you feel like you're eating healthy even when you're not"
        ],
        weaknesses: [
            "Peanut allergy is its kryptonite",
            "Gets insecure when compared to 'more authentic' Thai dishes",
            "The lime is decorative OR essential depending on who you ask"
        ],
        quotes: [
            "I'm the friend who introduces you to cooler friends.",
            "Squeeze the lime. SQUEEZE IT. There's a right way to eat me."
        ],
        peerReviews: [
            { text: "Pad Thai is where the Thai food journey begins. We all remember.", reviewer: "Curry" },
            { text: "Sweet, tangy, reliable. The golden retriever of noodles.", reviewer: "Ramen" },
            { text: "We see Pad Thai at every restaurant. The universal constant.", reviewer: "Pho" }
        ],
        hiddenTalent: "Making cilantro-haters reconsider their life choices"
    },
    "Biryani": {
        archetype: "The Dramatic Royalty",
        emoji: "\uD83C\uDF5A",
        strengths: [
            "Layers on layers on layers - literally and emotionally",
            "Every bite is different (it's called COMPLEXITY, look it up)",
            "The rice-to-meat ratio debates prove people CARE"
        ],
        weaknesses: [
            "Has extremely high standards about how it should be made",
            "Regional variations cause actual family feuds",
            "Gets offended if you call it 'fancy fried rice'"
        ],
        quotes: [
            "I am not rice with stuff in it. I am an EXPERIENCE.",
            "My dum cooking process takes hours. Speed is for amateurs."
        ],
        peerReviews: [
            { text: "Biryani is extra but like, earned extra. The work is there.", reviewer: "Curry" },
            { text: "We respect the drama. We really do.", reviewer: "Fried Rice" },
            { text: "Biryani is the main character and knows it.", reviewer: "Rice Bowl" }
        ],
        hiddenTalent: "Making you forget about every other rice dish"
    },
    "Poke": {
        archetype: "The Health-Conscious Trendsetter",
        emoji: "\uD83C\uDF63",
        strengths: [
            "Makes healthy eating feel exciting and customizable",
            "Bowl format is just satisfying to eat",
            "Looks as good as it tastes (instagram ready)"
        ],
        weaknesses: [
            "Expensive for what is essentially a deconstructed sushi",
            "'Is this cultural appropriation?' - valid question it can't answer",
            "Base selection stress is real (rice? greens? both? NEITHER?)"
        ],
        quotes: [
            "I'm like sushi but more chill about it.",
            "Build your own bowl. Build your own destiny."
        ],
        peerReviews: [
            { text: "Poke is what happens when Sushi goes to California.", reviewer: "Sushi" },
            { text: "We're glad the healthy kids have representation.", reviewer: "Acai Bowl" },
            { text: "Poke is trying very hard. And succeeding, honestly.", reviewer: "Ramen" }
        ],
        hiddenTalent: "Making you feel virtuous about lunch"
    },
    "Acai Bowl": {
        archetype: "The Morning Optimist",
        emoji: "\uD83C\uDF53",
        strengths: [
            "Starts days with color and hope",
            "The toppings are a choose-your-own-adventure situation",
            "Convinces you that you're a morning person"
        ],
        weaknesses: [
            "Is it a meal or a smoothie in a bowl? Identity crisis.",
            "Melts into soup if you don't eat fast enough",
            "Gets judged for being 'too millennial'"
        ],
        quotes: [
            "Good morning! I'm beautiful and full of antioxidants!",
            "Your Instagram can't handle this aesthetic."
        ],
        peerReviews: [
            { text: "Acai Bowl is the friend who does yoga at 6am. Annoying but glowing.", reviewer: "Ramen" },
            { text: "We support wellness culture representation.", reviewer: "Poke" },
            { text: "I could never be a breakfast food. Too much pressure.", reviewer: "Pizza" }
        ],
        hiddenTalent: "Making you briefly believe you'll keep this healthy streak going"
    },
    "Burrito": {
        archetype: "The Maximalist",
        emoji: "\uD83C\uDF2F",
        strengths: [
            "Contains entire meals within meals - efficiency king",
            "Portable! Holdable! The food equivalent of a hug!",
            "The last bite is just as good as the first"
        ],
        weaknesses: [
            "Structural integrity is a gamble",
            "Foil gets in the way of your emotional eating",
            "Will make you sleepy - this is a feature AND a bug"
        ],
        quotes: [
            "Why have some of everything when you can have ALL of everything?",
            "I am a blanket of joy. Wrap yourself in me."
        ],
        peerReviews: [
            { text: "Burrito is Taco's bigger, sleepier sibling.", reviewer: "Taco" },
            { text: "We respect the commitment to the wrap life.", reviewer: "Wrap" },
            { text: "Burrito shows up and dominates. No subtlety. We admire it.", reviewer: "Sushi" }
        ],
        hiddenTalent: "Defeating hunger for hours at a time"
    },
    "Rice Bowl": {
        archetype: "The Dependable Foundation",
        emoji: "\uD83C\uDF5A",
        strengths: [
            "The canvas upon which any flavor masterpiece can be built",
            "Meal prep champion - works for literally any protein",
            "Humble but essential - nothing works without rice"
        ],
        weaknesses: [
            "Gets overlooked as 'basic' by fancier foods",
            "Rice-to-topping ratio disputes are CONSTANT",
            "Takes on the personality of whatever's on top"
        ],
        quotes: [
            "I'm the foundation. Everything else is just decoration.",
            "You think you came for the protein. You stayed for the rice."
        ],
        peerReviews: [
            { text: "Rice Bowl is the straight-A student who keeps things running.", reviewer: "Biryani" },
            { text: "Essential. Foundational. The unsung hero.", reviewer: "Curry" },
            { text: "Rice Bowl doesn't need to be flashy. It just IS.", reviewer: "Fried Rice" }
        ],
        hiddenTalent: "Being infinitely customizable without complaint"
    },
    "Noodles": {
        archetype: "The Shapeshifter",
        emoji: "\uD83C\uDF5C",
        strengths: [
            "Takes any form: lo mein, dan dan, japchae, the POSSIBILITIES",
            "Carb comfort without the bread commitment",
            "Slurpable, twirl-able, fork-stabable - utensil democracy"
        ],
        weaknesses: [
            "Identity crisis - what KIND of noodle? Too many options!",
            "Gets tangled at the worst moments",
            "Jealous of pasta for getting more respect in the West"
        ],
        quotes: [
            "I am MANY. I contain MULTITUDES of shapes and sauces.",
            "Pasta is my cousin. We don't talk about the rivalry."
        ],
        peerReviews: [
            { text: "Noodles are everywhere doing everything. Respect the hustle.", reviewer: "Rice" },
            { text: "Specific noodles > general noodles. Get an identity.", reviewer: "Ramen" },
            { text: "The shapeshifter of the food world. Adaptable king.", reviewer: "Dumpling" }
        ],
        hiddenTalent: "Fitting into any cuisine seamlessly"
    },
    "Sandwich": {
        archetype: "The Working Professional",
        emoji: "\uD83E\uDD6A",
        strengths: [
            "Gets the job done - efficient, portable, reliable",
            "Works across all economic levels (PB&J to Wagyu beef)",
            "The architecture can be as simple or complex as needed"
        ],
        weaknesses: [
            "The 'is a hot dog a sandwich' debate haunts it",
            "Soggy bread risk is always present",
            "Gets disrespected as 'just lunch food'"
        ],
        quotes: [
            "I invented the concept of food between bread. You're welcome, humanity.",
            "Simple doesn't mean boring. It means REFINED."
        ],
        peerReviews: [
            { text: "Sandwich is the sensible friend who has their life together.", reviewer: "Burger" },
            { text: "We're basically the same but I have more flair.", reviewer: "Burrito" },
            { text: "Sandwich shows up on time and delivers. Literally.", reviewer: "Pizza" }
        ],
        hiddenTalent: "Making any ingredient combination work somehow"
    },
    "Boba": {
        archetype: "The Trendy Companion",
        emoji: "\uD83E\uDD64",
        strengths: [
            "Chewy tapioca adds textural joy to existence",
            "Customizable sweetness for EVERYONE",
            "Makes any hangout 40% more aesthetic"
        ],
        weaknesses: [
            "Sugar crash incoming - just accept it",
            "Straw physics are a whole thing",
            "Gets called 'just a drink' when it's clearly MORE"
        ],
        quotes: [
            "I'm not a meal but I'm not NOT a meal. I'm a vibe.",
            "The pearls aren't toppings. They're EXPERIENCES."
        ],
        peerReviews: [
            { text: "Boba shows up to every hangout uninvited. But welcome.", reviewer: "Ramen" },
            { text: "Sweet, trendy, photogenic. The food world influencer.", reviewer: "Acai Bowl" },
            { text: "Technically a beverage but has food energy. We accept it.", reviewer: "All Foods" }
        ],
        hiddenTalent: "Making any afternoon feel like a treat"
    }
};

/**
 * Apply score from a choice
 */
function applyScore(choice) {
    const multiplier = choice.multiplier || 1;

    // Add dish scores
    if (choice.dishes) {
        choice.dishes.forEach(dish => {
            if (scores.dishes[dish] !== undefined) {
                scores.dishes[dish] += multiplier;
            }
        });
    }

    // Add time axis score
    if (choice.time) {
        scores.timeAxis[choice.time] += multiplier;
        // Bonus for time-focused questions
        if (choice.timeBonus) {
            scores.timeAxis[choice.time] += 1;
        }
    }

    // Add adventure axis score
    if (choice.adventure) {
        scores.adventureAxis[choice.adventure] += multiplier;
        // Bonus for adventure-focused questions
        if (choice.adventureBonus) {
            scores.adventureAxis[choice.adventure] += 1;
        }
    }
}

/**
 * Reset all scores to 0
 */
function resetScores() {
    Object.keys(scores.dishes).forEach(dish => scores.dishes[dish] = 0);
    Object.keys(scores.timeAxis).forEach(time => scores.timeAxis[time] = 0);
    Object.keys(scores.adventureAxis).forEach(adv => scores.adventureAxis[adv] = 0);
}

/**
 * Calculate the final Spirit Food result
 */
function calculateResult() {
    // Find top dish
    const topDish = Object.entries(scores.dishes)
        .sort((a, b) => b[1] - a[1])[0][0];

    // Calculate time alignment
    const timeTotal = Object.values(scores.timeAxis).reduce((a, b) => a + b, 0);
    const timeResult = Object.entries(scores.timeAxis)
        .map(([axis, value]) => ({
            axis,
            percent: timeTotal > 0 ? Math.round(value / timeTotal * 100) : 33
        }))
        .sort((a, b) => b.percent - a.percent)[0];

    // Calculate adventure alignment
    const advTotal = Object.values(scores.adventureAxis).reduce((a, b) => a + b, 0);
    const advResult = Object.entries(scores.adventureAxis)
        .map(([axis, value]) => ({
            axis,
            percent: advTotal > 0 ? Math.round(value / advTotal * 100) : 33
        }))
        .sort((a, b) => b.percent - a.percent)[0];

    // Get alignment adjective
    const alignmentKey = `${advResult.axis}_${timeResult.axis}`;
    const adjective = alignmentAdjectives[alignmentKey] || "Mysterious";

    // Get cuisine
    const cuisine = defaultCuisines[topDish] || "Fusion";

    // Get personality data
    const personality = foodPersonalities[topDish] || foodPersonalities["Burger"];

    return {
        dish: topDish,
        cuisine: cuisine,
        adjective: adjective,
        fullTitle: `${adjective} ${cuisine} ${topDish}`,
        timeAxis: timeResult,
        adventureAxis: advResult,
        personality: personality,
        rawScores: { ...scores }
    };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        scores,
        defaultCuisines,
        alignmentAdjectives,
        foodPersonalities,
        applyScore,
        resetScores,
        calculateResult
    };
}
