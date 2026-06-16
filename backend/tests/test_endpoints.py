import unittest
import io
from fastapi.testclient import TestClient
from app.main import app

class TestEndpoints(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_health_endpoint(self):
        response = self.client.get("/api/health")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "online")
        self.assertIn("database", data)
        self.assertIn("ai_service", data)

    def test_ai_suggestions_summary(self):
        payload = {
            "field_type": "summary",
            "target_role": "Tally Accountant",
            "current_text": "I do accounting."
        }
        response = self.client.post("/api/ai-assistant/suggest", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("suggestions", data)
        self.assertEqual(len(data["suggestions"]), 3)
        self.assertTrue(any("Tally" in s or "Accountant" in s or "Ledger" in s or "workflow" in s for s in data["suggestions"]))

    def test_ai_suggestions_achievements(self):
        payload = {
            "field_type": "achievements",
            "target_role": "Data Analyst",
            "current_text": "Analyzed records."
        }
        response = self.client.post("/api/ai-assistant/suggest", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("suggestions", data)
        self.assertEqual(len(data["suggestions"]), 3)
        self.assertTrue(any("efficiency" in s.lower() or "optimized" in s.lower() or "latency" in s.lower() for s in data["suggestions"]))

    def test_skills_recommendation_tally(self):
        payload = {
            "target_role": "Tally Accountant"
        }
        response = self.client.post("/api/ai-assistant/recommend-skills", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("skills", data)
        self.assertTrue(len(data["skills"]) >= 6)
        self.assertIn("Tally Prime", data["skills"])
        self.assertIn("GST Filing", data["skills"])

    def test_skills_recommendation_data(self):
        payload = {
            "target_role": "Data Analyst"
        }
        response = self.client.post("/api/ai-assistant/recommend-skills", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("skills", data)
        self.assertTrue(len(data["skills"]) >= 6)
        self.assertIn("SQL", data["skills"])
        self.assertIn("Python", data["skills"])

    def test_projects_recommendation(self):
        payload = {
            "target_role": "Data Analyst"
        }
        response = self.client.post("/api/ai-assistant/recommend-projects", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("projects", data)
        self.assertEqual(len(data["projects"]), 3)
        for proj in data["projects"]:
            self.assertIn("name", proj)
            self.assertIn("description", proj)
            self.assertIn("tech_stack", proj)

    def test_certifications_recommendation(self):
        payload = {
            "target_role": "Software Engineer"
        }
        response = self.client.post("/api/ai-assistant/recommend-certifications", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("certifications", data)
        self.assertTrue(len(data["certifications"]) >= 1)
        for cert in data["certifications"]:
            self.assertIn("name", cert)
            self.assertIn("issuer", cert)

    def test_resume_upload_plain_text(self):
        file_content = b"Alex Mercer\nSoftware Engineer\nReact, Python, SQL\nSan Francisco, CA"
        files = {"file": ("resume.txt", file_content, "text/plain")}
        response = self.client.post("/api/resumes/upload", files=files)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("contact", data)
        self.assertEqual(data["contact"]["name"], "Alex Mercer")
        self.assertEqual(data["contact"]["email"], "alexmercer@email.com")

if __name__ == "__main__":
    unittest.main()
