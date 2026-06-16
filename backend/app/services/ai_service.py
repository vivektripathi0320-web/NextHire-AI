import google.generativeai as genai
from app.config import settings

class AIService:
    def __init__(self):
        # We strip quotes in case the key was written as GEMINI_API_KEY="" in .env
        api_key = settings.GEMINI_API_KEY.strip('"').strip("'") if settings.GEMINI_API_KEY else ""
        
        if api_key:
            genai.configure(api_key=api_key)
            self.enabled = True
        else:
            self.enabled = False

    def generate_content(self, prompt: str) -> str:
        if not self.enabled:
            return "API_KEY_MISSING_MOCK_RESPONSE"
            
        try:
            model = genai.GenerativeModel("gemini-1.5-flash")
            response = model.generate_content(prompt)
            return response.text
        except Exception as e:
            # Revert to a friendly error string to avoid crashes
            return f"ERROR: Gemini API execution failed: {str(e)}"

ai_service = AIService()
