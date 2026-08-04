from fastapi import FastAPI
from api.command import router as command_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Vaani API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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