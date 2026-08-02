from fastapi import FastAPI
from api.command import router as command_router

app = FastAPI(
    title="Vaani API",
    version="1.0.0"
)

app.include_router(command_router)


@app.get("/")
def home():
    return {"message": "Welcome to Vaani"}


@app.get("/health")
def health():
    return {
        "status": "running",
        "assistant": "Vaani"
    }