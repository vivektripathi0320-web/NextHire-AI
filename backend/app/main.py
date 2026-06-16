import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.session import engine, Base
from app.api.endpoints import router as api_router
from app.config import settings

# Automatically create database tables during application initialization
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="NextHire AI Backend",
    description="FastAPI Backend for NextHire AI SaaS application - Smart Resumes, Stunning Portfolios, Better Careers.",
    version="1.0.0"
)

# Set up CORS middleware to communicate with the React frontend
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API router
app.include_router(api_router, prefix="/api")

@app.get("/")
def read_root():
    return {
        "message": "Welcome to the NextHire AI API service. Documentation is available at /docs.",
        "version": "1.0.0",
        "docs_url": "/docs"
    }

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.PORT, reload=True)
