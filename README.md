# Recruitment Skill Match Analyzer

**Analyze and Evaluate Candidates — Effortlessly**

**Recruitment Skill Match Analyzer** is designed to help recruiters and hiring managers **evaluate how well a candidate’s skills align with a job description**. Powered by skill extraction, keyword matching, and similarity scoring, this tool simplifies candidate screening and makes hiring more efficient and data-driven.

---

## 🚀 Features

- **Skill Extraction:** Automatically identifies candidate skills from resumes and job descriptions.
- **Keyword Matching:** Calculates overlap between candidate skills and job requirements.
- **Similarity Scoring:** Assigns a match score or percentage to quantify candidate fit.
- **Detailed Insights:** Highlights matched skills, missing skills, and areas of improvement.
- **Multi-format Support:** Handle resumes and job descriptions in TXT, PDF, or DOCX.
- **Interactive UI:** Easy-to-use interface for quick analysis (if frontend included).

---

## 🛠 Tech Stack

- **Backend:** Python (Flask / FastAPI)
- **Frontend:** React (if included)
- **Database:** SQLite / PostgreSQL (if used)
- **NLP Libraries:** spaCy, NLTK, fuzzywuzzy (or similar)
- **Others:** Docker (optional), GitHub Actions (optional)

---

## 📦 Getting Started

### Prerequisites
- Python 3.x installed
- (Optionally) Node.js installed if frontend is separate
- Virtual environment (recommended)

### Installation

Clone repository:
git clone https://github.com/gaurititirmare/Recruitment-Skill-Match-Analyzer.git
cd Recruitment-Skill-Match-Analyzer

Create and activate virtual environment:
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

Install dependencies:
pip install -r requirements.txt

---

## ▶ Running the Project

Backend only:
python app.py

With frontend:
# Run backend
python app.py

# Run frontend
cd frontend
npm install
npm run dev

Access via: http://localhost:8000 or the configured port.

---

## 📊 Usage Example

1. Launch the application.
2. Upload or paste a candidate’s resume.
3. Enter or upload the job description.
4. Click **Analyze**.
5. Get:
   - Match score (e.g., “75% match”)
   - Matched vs. missing skills
   - Suggestions for resume improvement

---

## ⚙ Configuration

Example `.env` or config file:

MATCH_THRESHOLD=0.7
RESUME_PATH=data/resume.pdf
JD_PATH=data/job_description.txt

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repo
2. Create a branch: git checkout -b feature/my-feature
3. Commit changes: git commit -m "Add my feature"
4. Push: git push origin feature/my-feature
5. Open a Pull Request

---

## 📄 License

Licensed under the MIT License.

---

## 📬 Contact & Acknowledgements

Created by **Gauriti Tirmare** — feel free to reach out for collaboration or suggestions!
