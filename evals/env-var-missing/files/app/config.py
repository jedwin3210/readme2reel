import os

PORT = int(os.environ.get("PORT", "8000"))
WEATHER_API_KEY = os.environ["WEATHER_API_KEY"]
CACHE_TTL_SECONDS = int(os.environ.get("CACHE_TTL_SECONDS", "300"))
