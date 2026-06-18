export const API_BASE_URL = 
  import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.DEV ? "http://localhost:8000" : "https://nexthire-ai-02m7.onrender.com");
