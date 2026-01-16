# spirit_food

A food personality quiz app with Snowflake data lookups and AI-powered ID card generation.

## Prerequisites

- Python 3.10+
- Node.js (optional, for alternative frontend serving)

## Setup

### Backend

```bash
cd backend
pip install -r requirements.txt
```

Configure environment variables in `backend/config/.env`:
```
PORTKEY_API_KEY=your_portkey_key
PORTKEY_OPENAI_VIRTUAL_KEY=your_virtual_key
# Snowflake credentials if using data lookups
```

### Frontend

No build step required - static HTML/CSS/JS.

## Running

### Start Backend (port 8000)

```bash
cd backend
python app.py
```

Or with uvicorn directly:
```bash
cd backend
uvicorn app:app --reload --port 8000
```

### Start Frontend (port 8888)

```bash
cd src
python -m http.server 8888
```

### Access the App

- Frontend: http://localhost:8888
- API docs: http://localhost:8000/docs

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/flavor-profile` | POST | Lookup user flavor profile from Snowflake |
| `/api/generate-id-card` | POST | Generate AI-powered personality ID card |
