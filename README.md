# Recruitment Skill Match Analyzer

## Overview
The Recruitment Skill Match Analyzer is a full-stack application that helps recruiters and job seekers analyze how well a resume matches a given job description. By leveraging NLP and text similarity techniques, the tool scores resumes, highlights missing skills, and provides a detailed analysis of strengths and gaps.

## Features
- Upload resumes in PDF/DOCX format
- Input job descriptions manually
- AI-powered resume-to-job matching
- Get percentage match and detailed feedback
- Full-stack setup with Frontend and Backend
- Modern responsive UI with React
- Environment variables support for secure configuration

## Tech Stack
- Frontend: React, Tailwind CSS
- Backend: Node.js, Express.js
- NLP/Parsing: pdf-parse, mammoth, custom algorithms
- Database: MongoDB (optional, if used)
- Version Control: Git & GitHub

## Installation
1. Clone the repository:
   git clone https://github.com/gaurititirmare/Recruitment-Skill-Match-Analyzer.git
   cd Recruitment-Skill-Match-Analyzer

2. Install dependencies for both Frontend and Backend:
   cd Frontend
   npm install
   cd ../Backend
   npm install

## Configuration
1. Create a `.env` file inside the Backend directory. Example:
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/recruitmentdb
   JWT_SECRET=your_secret_key

2. (Optional) Add API keys if integrating external services.

Note: Make sure `.env` is included in `.gitignore` so it does not get pushed to GitHub.

## Running the Project
1. Start the backend:
   cd Backend
   npm run dev

2. Start the frontend:
   cd ../Frontend
   npm run dev

3. Open your browser and visit:
   http://localhost:5173   (Frontend)
   http://localhost:5000   (Backend API)

## Usage Example
1. Upload a resume (PDF/DOCX) from the frontend.
2. Enter or paste a job description in the input field.
3. Click Analyze.
4. Get results such as:
   - Match percentage
   - Missing skills
   - Improvement suggestions

## Contributing
We welcome contributions.

Steps to contribute:
1. Fork the repo
2. Create a new branch
   git checkout -b feature-branch
3. Make your changes
4. Commit your updates
   git commit -m "Add new feature"
5. Push your branch
   git push origin feature-branch
6. Create a Pull Request

## License
This project is licensed under the MIT License – feel free to use and modify.
