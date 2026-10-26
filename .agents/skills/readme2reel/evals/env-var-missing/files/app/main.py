from fastapi import FastAPI

from . import config

app = FastAPI()


@app.get("/forecast/{city}")
def forecast(city: str) -> dict:
    return {"city": city, "ttl": config.CACHE_TTL_SECONDS}
