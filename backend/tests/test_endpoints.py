import unittest
import io
import uuid
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
        self.assertEqual(data["file_upload_status"], "success")
        self.assertEqual(data["text_extraction_engine"], "utf-decode")
        self.assertIn("resume_data", data)
        self.assertEqual(data["resume_data"]["name"], "Alex Mercer")
        self.assertEqual(data["resume_data"]["email"], "alexmercer@email.com")

    def test_resume_upload_too_large(self):
        # Create dummy file > 10MB
        large_content = b"A" * (10 * 1024 * 1024 + 10)
        files = {"file": ("resume.pdf", large_content, "application/pdf")}
        response = self.client.post("/api/resumes/upload", files=files)
        self.assertEqual(response.status_code, 400)
        data = response.json()
        self.assertIn("detail", data)
        self.assertIn("File exceeds maximum size", data["detail"])

    def test_portfolio_slug_availability_and_auto_resolution(self):
        # 1. Create a dummy resume first
        resume_payload = {
            "title": "Software Engineer Resume",
            "summary": "Experienced coder",
            "raw_text": "Alex Mercer, React",
            "json_content": {"contact": {"name": "Alex"}}
        }
        res = self.client.post("/api/resumes", json=resume_payload)
        self.assertEqual(res.status_code, 201)
        resume_id = res.json()["id"]

        # 2. Check slug availability (should be True initially)
        unique_slug = f"test-unique-slug-{uuid.uuid4().hex[:8]}"
        check_res = self.client.get(f"/api/portfolios/check-slug/{unique_slug}")
        self.assertEqual(check_res.status_code, 200)
        self.assertEqual(check_res.json()["available"], True)

        # 3. Create a portfolio with this slug
        portfolio_payload = {
            "resume_id": resume_id,
            "slug": unique_slug,
            "title": "Alex Mercer's Portfolio",
            "theme": "classic-dark",
            "customizations": {"linkedin": "linkedin.com/in/alex"}
        }
        create_res = self.client.post("/api/portfolios", json=portfolio_payload)
        self.assertEqual(create_res.status_code, 201)
        self.assertEqual(create_res.json()["slug"], unique_slug)

        # 4. Check slug availability again (should be False now, and suggest unique_slug-1)
        check_res2 = self.client.get(f"/api/portfolios/check-slug/{unique_slug}")
        self.assertEqual(check_res2.status_code, 200)
        self.assertEqual(check_res2.json()["available"], False)
        self.assertEqual(check_res2.json()["suggestion"], f"{unique_slug}-1")

        # 5. Create a second portfolio with the SAME slug (should auto-resolve to unique_slug-1 instead of failing)
        create_res2 = self.client.post("/api/portfolios", json=portfolio_payload)
        self.assertEqual(create_res2.status_code, 201)
        self.assertEqual(create_res2.json()["slug"], f"{unique_slug}-1")

    def test_cover_letters_generate_and_crud(self):
        # 1. Create a dummy resume first
        resume_payload = {
            "title": "Software Engineer Resume",
            "summary": "Experienced coder",
            "raw_text": "Alex Mercer, React",
            "json_content": {"contact": {"name": "Alex Mercer"}, "title": "Software Engineer"}
        }
        res = self.client.post("/api/resumes", json=resume_payload)
        self.assertEqual(res.status_code, 201)
        resume_id = res.json()["id"]

        # 2. Test generation
        gen_payload = {
            "resume_id": resume_id,
            "job_description": "We need a Software Engineer with React experience.",
            "letter_type": "Professional",
            "style": "Confident"
        }
        response = self.client.post("/api/cover-letters/generate", json=gen_payload)
        self.assertEqual(response.status_code, 200)
        gen_data = response.json()
        self.assertIn("content", gen_data)
        self.assertIn("score", gen_data)
        self.assertEqual(gen_data["letter_type"], "Professional")
        self.assertEqual(gen_data["style"], "Confident")

        # 3. Test optimize
        opt_payload = {
            "current_content": gen_data["content"],
            "job_description": "We are seeking a React developer proficient in system design."
        }
        response = self.client.post("/api/cover-letters/optimize", json=opt_payload)
        self.assertEqual(response.status_code, 200)
        opt_data = response.json()
        self.assertIn("greeting", opt_data)
        self.assertIn("introduction", opt_data)

        # 4. Test improve
        imp_payload = {
            "text": gen_data["content"]["body"],
            "instruction": "make it sound more metrics-driven"
        }
        response = self.client.post("/api/cover-letters/improve", json=imp_payload)
        self.assertEqual(response.status_code, 200)
        self.assertIn("improved_text", response.json())

        # 5. Test save
        save_payload = {
            "resume_id": resume_id,
            "title": "My Software Engineer Cover Letter",
            "letter_type": "Professional",
            "style": "Confident",
            "content": gen_data["content"],
            "score": gen_data["score"],
            "personalization_score": gen_data["personalization_score"],
            "ats_score": gen_data["ats_score"],
            "tone_score": gen_data["tone_score"],
            "structure_score": gen_data["structure_score"],
            "keywords_detected": gen_data["keywords_detected"]
        }
        response = self.client.post("/api/cover-letters", json=save_payload)
        self.assertEqual(response.status_code, 201)
        saved_letter = response.json()
        self.assertIn("id", saved_letter)
        self.assertEqual(saved_letter["title"], "My Software Engineer Cover Letter")

        # 6. Test list
        response = self.client.get("/api/cover-letters")
        self.assertEqual(response.status_code, 200)
        letters_list = response.json()
        self.assertTrue(len(letters_list) >= 1)
        self.assertTrue(any(l["id"] == saved_letter["id"] for l in letters_list))

        # 7. Test delete
        response = self.client.delete(f"/api/cover-letters/{saved_letter['id']}")
        self.assertEqual(response.status_code, 204)

        # Verify deletion
        response = self.client.get("/api/cover-letters")
        self.assertEqual(response.status_code, 200)
        self.assertFalse(any(l["id"] == saved_letter["id"] for l in response.json()))

if __name__ == "__main__":
    unittest.main()
