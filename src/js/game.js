/**
 * Spirit Food Quiz - Game Controller
 * Handles game state, rendering, and user interactions
 */

// Game state
let currentState = "1";
let userEmail = "";
let sceneHistory = [];

// DOM Elements
const emailScreen = document.getElementById('email-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const emailInput = document.getElementById('email-input');
const startBtn = document.getElementById('start-btn');
const skipEmailLink = document.getElementById('skip-email');
const storyText = document.getElementById('story-text');
const storyImage = document.getElementById('story-image');
const choicesContainer = document.getElementById('choices');
const progressFill = document.getElementById('progress-fill');
const sceneNumber = document.getElementById('scene-number');
const shareBtn = document.getElementById('share-btn');
const retakeBtn = document.getElementById('retake-btn');

/**
 * Initialize the game
 */
function init() {
    console.log("=== Spirit Food Quiz Initialized ===");

    // Event listeners
    startBtn.addEventListener('click', handleStart);
    skipEmailLink.addEventListener('click', handleSkipEmail);
    shareBtn.addEventListener('click', handleShare);
    retakeBtn.addEventListener('click', handleRetake);

    // Allow Enter key to start
    emailInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleStart();
        }
    });
}

/**
 * Handle start button click
 */
function handleStart() {
    userEmail = emailInput.value.trim();
    startQuiz();
}

/**
 * Handle skip email link click
 */
function handleSkipEmail(e) {
    e.preventDefault();
    userEmail = "";
    startQuiz();
}

/**
 * Start the quiz
 */
function startQuiz() {
    // Reset state
    currentState = "1";
    sceneHistory = [];
    resetScores();

    // Hide email screen, show quiz screen
    emailScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    resultScreen.classList.add('hidden');

    // Render first scene
    renderScene(currentState);
}

/**
 * Render a scene
 */
function renderScene(stateId) {
    const scene = gameData[stateId];
    if (!scene) {
        console.error('Scene not found:', stateId);
        return;
    }

    // Update progress
    updateProgress(scene.scene);

    // Update story text
    storyText.textContent = scene.text;

    // Update image (with placeholder fallback - only try once)
    storyImage.onerror = null; // Clear any previous handler
    storyImage.onerror = function() {
        this.onerror = null; // Prevent infinite loop
        this.src = 'images/placeholder.png';
    };
    storyImage.src = scene.image;

    // Clear and render choices
    choicesContainer.innerHTML = '';

    Object.entries(scene.choices).forEach(([choiceText, choiceData]) => {
        const button = document.createElement('button');
        button.className = 'choice-button';
        button.textContent = choiceText;
        button.addEventListener('click', () => handleChoice(choiceText, choiceData));
        choicesContainer.appendChild(button);
    });
}

/**
 * Update progress bar and scene number
 */
function updateProgress(sceneNum) {
    const progress = (sceneNum / TOTAL_SCENES) * 100;
    progressFill.style.width = `${progress}%`;
    sceneNumber.textContent = `Scene ${sceneNum} of ${TOTAL_SCENES}`;
}

/**
 * Handle choice selection
 */
function handleChoice(choiceText, choiceData) {
    // Track history
    sceneHistory.push({
        state: currentState,
        choice: choiceText
    });

    // Apply scores
    applyScore(choiceData);

    // Check if quiz is complete
    if (choiceData.next === 0 || gameData[currentState].isFinal) {
        showResult();
    } else {
        // Move to next state
        currentState = String(choiceData.next);
        renderScene(currentState);
    }
}

/**
 * Show the result screen
 */
async function showResult() {
    console.log("=== showResult() called ===");

    // Calculate result
    const result = calculateResult();
    console.log("calculateResult returned:", result);

    // Hide quiz, show result
    quizScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');

    // Try to get AI-generated personality from backend
    console.log("Calling fetchAIPersonality...");
    try {
        const aiPersonality = await fetchAIPersonality(result);
        console.log("fetchAIPersonality returned:", aiPersonality);
        if (aiPersonality) {
            result.personality = aiPersonality;
            result.aiGenerated = true;
        }
    } catch (e) {
        console.error("fetchAIPersonality error:", e);
    }

    // Render ID card
    console.log("About to call renderIDCard with result:", result);
    renderIDCard(result);
}

/**
 * Fetch AI-generated personality from backend API
 */
async function fetchAIPersonality(result) {
    const BACKEND_URL = 'http://localhost:8000';
    const TIMEOUT_MS = 5000; // 5 second timeout

    try {
        // Add timeout to prevent hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

        const response = await fetch(`${BACKEND_URL}/api/generate-id-card`, {
            signal: controller.signal,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                dish_type: result.dish,
                cuisine: result.cuisine,
                alignment_adjective: result.adjective,
                time_axis: result.timeAxis.axis,
                time_percent: result.timeAxis.percent,
                adventure_axis: result.adventureAxis.axis,
                adventure_percent: result.adventureAxis.percent
            })
        });

        clearTimeout(timeoutId); // Clear timeout on success

        if (!response.ok) {
            console.warn('Backend returned error, using hardcoded content');
            return null;
        }

        const data = await response.json();

        // Transform backend response to match frontend personality format
        return {
            archetype: data.title,
            emoji: foodPersonalities[result.dish]?.emoji || "🍽️",
            strengths: data.strengths,
            weaknesses: data.weaknesses,
            quotes: data.quotes,
            peerReviews: data.peer_reviews.map(pr => ({
                text: pr.text,
                reviewer: pr.reviewer
            })),
            hiddenTalent: data.hidden_talent,
            cached: data.cached
        };
    } catch (error) {
        console.warn('Backend unavailable, using hardcoded content:', error.message);
        return null;
    }
}

/**
 * Render the Spirit Food ID Card
 */
function renderIDCard(result) {
    console.log("renderIDCard called with:", result);

    if (!result) {
        console.error("ERROR: result is undefined");
        return;
    }

    if (!result.personality) {
        console.error("ERROR: result.personality is undefined", result);
        return;
    }

    const p = result.personality;
    console.log("Personality data:", p);
    console.log("p.archetype:", p.archetype);
    console.log("p.emoji:", p.emoji);
    console.log("p.strengths:", p.strengths);

    // Title
    const titleEl = document.getElementById('spirit-food-title');
    console.log("Setting title to:", result.fullTitle);
    titleEl.textContent = result.fullTitle;

    // Food portrait (emoji)
    document.getElementById('food-portrait').textContent = p.emoji;

    // Title/Archetype
    document.getElementById('food-title-name').textContent = `"${p.archetype}"`;

    // Strengths
    const strengthsList = document.getElementById('strengths-list');
    strengthsList.innerHTML = '';
    p.strengths.forEach(strength => {
        const li = document.createElement('li');
        li.textContent = strength;
        strengthsList.appendChild(li);
    });

    // Weaknesses
    const weaknessesList = document.getElementById('weaknesses-list');
    weaknessesList.innerHTML = '';
    p.weaknesses.forEach(weakness => {
        const li = document.createElement('li');
        li.textContent = weakness;
        weaknessesList.appendChild(li);
    });

    // Quotes
    const quotesDiv = document.getElementById('quotes-list');
    quotesDiv.innerHTML = '';
    p.quotes.forEach(quote => {
        const pTag = document.createElement('p');
        pTag.textContent = `"${quote}"`;
        quotesDiv.appendChild(pTag);
    });

    // Alignment bars
    document.getElementById('time-label').textContent = result.timeAxis.axis + ':';
    document.getElementById('time-bar').style.width = `${result.timeAxis.percent}%`;
    document.getElementById('time-percent').textContent = `${result.timeAxis.percent}%`;

    document.getElementById('adventure-label').textContent = result.adventureAxis.axis + ':';
    document.getElementById('adventure-bar').style.width = `${result.adventureAxis.percent}%`;
    document.getElementById('adventure-percent').textContent = `${result.adventureAxis.percent}%`;

    // Hidden talent
    document.getElementById('hidden-talent').textContent = p.hiddenTalent;

    // Peer reviews
    const peerReviewsDiv = document.getElementById('peer-reviews');
    peerReviewsDiv.innerHTML = '';
    p.peerReviews.forEach(review => {
        const reviewDiv = document.createElement('div');
        reviewDiv.className = 'peer-review';
        reviewDiv.innerHTML = `
            "${review.text}"
            <span class="reviewer">- ${review.reviewer}</span>
        `;
        peerReviewsDiv.appendChild(reviewDiv);
    });

    // Show AI-generated indicator if applicable
    const aiIndicator = document.getElementById('ai-indicator');
    if (aiIndicator) {
        if (result.aiGenerated) {
            aiIndicator.textContent = p.cached ? '✨ AI Generated (cached)' : '✨ AI Generated';
            aiIndicator.style.display = 'block';
        } else {
            aiIndicator.style.display = 'none';
        }
    }
}

/**
 * Handle share button click
 */
function handleShare() {
    const result = calculateResult();
    const shareText = `I'm a ${result.fullTitle}! "${result.personality.archetype}" - Discover your Spirit Food at [URL]`;

    if (navigator.share) {
        navigator.share({
            title: 'My Spirit Food',
            text: shareText
        }).catch(console.error);
    } else {
        // Fallback to clipboard
        navigator.clipboard.writeText(shareText).then(() => {
            alert('Result copied to clipboard!');
        }).catch(() => {
            alert('Share: ' + shareText);
        });
    }
}

/**
 * Handle retake button click
 */
function handleRetake() {
    // Show email screen again
    resultScreen.classList.add('hidden');
    emailScreen.classList.remove('hidden');

    // Reset email input
    emailInput.value = userEmail;
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);
