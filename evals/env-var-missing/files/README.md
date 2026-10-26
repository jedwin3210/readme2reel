# forecast-api

A small HTTP service that returns cached weather forecasts.

## Run locally

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Configuration

| Variable | Purpose | Default |
|---|---|---|
| `PORT` | Port to listen on | `8000` |
