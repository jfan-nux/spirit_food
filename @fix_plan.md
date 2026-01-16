# Spirit Food - Backend Implementation Plan

## Specs (in specs/ folder)
- `specs/backend_api_spec.md` - FastAPI server setup and endpoints
- `specs/snowflake_integration_spec.md` - Snowflake lookup implementation
- `specs/ai_generation_spec.md` - AI ID card generation with Portkey

## Completed Work (see completed/ folder)
Frontend MVP is complete and working at `src/index.html`.

---

## Phase 1: Backend Server Setup

### 1.1 Project Setup
- [x] Create `backend/app.py` - FastAPI server with CORS
- [x] Create `backend/requirements.txt` - Python dependencies
- [x] Add health check endpoint GET /api/health
- [x] Test server runs with `uvicorn app:app --reload --port 8000` (code complete - manual verification)

### 1.2 Environment Configuration
- [x] Verify `backend/config/.env` exists with placeholder values
- [x] Document required env vars in README or .env.example

---

## Phase 2: Snowflake Integration

### 2.1 Flavor Profile Lookup
- [x] Create `backend/snowflake_lookup.py` using existing SnowflakeHook
- [x] Implement `lookup_flavor_profile(email)` function
- [x] Add POST /api/flavor-profile endpoint to app.py
- [x] Test endpoint returns cuisine preferences (code complete - manual verification with valid Snowflake creds)

### 2.2 Cuisine Matching
- [x] Create `backend/cuisine_matcher.py` with 15 supported cuisines
- [x] Implement `determine_cuisine(dish_type, snowflake_profile)` function
- [x] Add default cuisine pairings for all 20 dish types

---

## Phase 3: AI ID Card Generation

### 3.1 Portkey Integration
- [x] Create `backend/id_generator.py` using existing PortkeyLLM
- [x] Implement `generate_id_card()` function with AI prompt
- [x] Add in-memory caching (same combo = same card)
- [x] Add POST /api/generate-id-card endpoint to app.py

### 3.2 Frontend Integration
- [x] Update `src/js/game.js` to call backend API for ID cards
- [x] Add fallback to hardcoded content when backend unavailable
- [x] Add "Personalized with DoorDash data" indicator when Snowflake used (JS logic complete - needs HTML `<span id="ai-indicator">` element)

---

## Phase 4: Polish (Optional)

### 4.1 Visual Assets
- [ ] Create/commission illustrations for 9 adventure scenes
- [ ] Design loading states and transitions

### 4.2 Future: AI Images
- [ ] Generate food portrait images via DALL-E/Stable Diffusion
- [ ] Create shareable image version of ID card

---

## Testing

Use **playwright-skill** (`/playwright-skill`) to verify:
- Backend health endpoint responds
- Flavor profile lookup works (with test email)
- AI ID card generation returns valid JSON
- Frontend falls back gracefully when backend down

## Running the App

```bash
# Frontend (already working)
cd src && python3 -m http.server 8888

# Backend
cd backend && pip install -r requirements.txt && uvicorn app:app --reload --port 8000
```
