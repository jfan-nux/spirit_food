# Backend API Specification

## Overview

Flask/FastAPI server to handle Snowflake lookups and AI ID card generation for Spirit Food.

## Tech Stack

- **Framework**: FastAPI (preferred) or Flask
- **Server**: Uvicorn
- **CORS**: Enable for frontend at localhost:8888

## File Structure

```
backend/
├── app.py              # Main FastAPI server
├── requirements.txt    # Python dependencies
├── config/
│   └── .env           # Environment variables (API keys)
└── utils/             # Already exists
    ├── portkey_llm.py
    ├── snowflake_connection.py
    └── logger.py
```

## API Endpoints

### 1. GET /api/health
Health check endpoint.

**Response:**
```json
{"status": "ok", "timestamp": "2026-01-15T12:00:00Z"}
```

### 2. POST /api/flavor-profile
Look up user's flavor profile from Snowflake.

**Request:**
```json
{"email": "fiona.fan@doordash.com"}
```

**Response (found):**
```json
{
  "found": true,
  "cuisine_preferences": ["Vietnamese", "Japanese", "Thai"],
  "top_cuisine": "Vietnamese",
  "confidence": 0.85
}
```

**Response (not found):**
```json
{
  "found": false,
  "cuisine_preferences": [],
  "top_cuisine": null,
  "confidence": 0
}
```

### 3. POST /api/generate-id-card
Generate AI-powered ID card content.

**Request:**
```json
{
  "dish_type": "Pho",
  "cuisine": "Vietnamese",
  "alignment_adjective": "Unhinged",
  "time_axis": "Late Night",
  "time_percent": 82,
  "adventure_axis": "Adventurer",
  "adventure_percent": 68
}
```

**Response:**
```json
{
  "title": "The Midnight Broth Whisperer",
  "strengths": ["...", "...", "..."],
  "weaknesses": ["...", "...", "..."],
  "quotes": ["...", "..."],
  "hidden_talent": "...",
  "peer_reviews": [
    {"text": "...", "reviewer": "Ramen"},
    {"text": "...", "reviewer": "Burger"},
    {"text": "...", "reviewer": "Salad"}
  ],
  "cached": false
}
```

## Environment Variables

Required in `backend/config/.env`:

```bash
# Snowflake
SNOWFLAKE_USER=your.name
SNOWFLAKE_PASSWORD=your_password_or_pat
SNOWFLAKE_ACCOUNT=doordash
SNOWFLAKE_DATABASE=proddb
SNOWFLAKE_SCHEMA=public
SNOWFLAKE_WAREHOUSE=ADHOC

# Portkey/OpenAI
PORTKEY_API_KEY=your_portkey_key
PORTKEY_OPENAI_VIRTUAL_KEY=your_virtual_key
```

## Dependencies (requirements.txt)

```
fastapi>=0.104.0
uvicorn>=0.24.0
python-dotenv>=1.0.0
snowflake-connector-python>=3.0.0
pandas>=2.0.0
openai>=1.0.0
portkey-ai>=0.1.0
```

## CORS Configuration

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8888", "http://127.0.0.1:8888"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Running the Server

```bash
cd backend
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

## Error Handling

All endpoints should return appropriate HTTP status codes:
- 200: Success
- 400: Bad request (invalid input)
- 500: Server error (Snowflake/AI failure)

Error response format:
```json
{
  "error": true,
  "message": "Description of the error",
  "code": "ERROR_CODE"
}
```
