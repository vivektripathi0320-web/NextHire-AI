import os
from dotenv import load_dotenv

# Load the root-level .env file
dotenv_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env")
load_dotenv(dotenv_path)

class Settings:
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./nexthire.db")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    PORT: int = int(os.getenv("PORT", "8000"))
    ENV: str = os.getenv("ENV", "development")

settings = Settings()
