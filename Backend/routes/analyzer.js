// routes/analyzer.js
import express from "express";
import formidable from "formidable";
import fs from "fs";
import parseResume from "../utils/parseResume.js";
import fetch from "node-fetch";

const router = express.Router();

// Helper: call Gemini generateContent
// Helper: call Gemini generateContent
async function callGemini(promptText) {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-1.5-flash";
  if (!apiKey) throw new Error("GEMINI_API_KEY not set in env");

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const body = {
    contents: [
      {
        role: "user",
        parts: [{ text: promptText }]
      }
    ]
  };

  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Gemini API error: ${resp.status} ${text}`);
  }

  const data = await resp.json();
  let textOut = "";
  try {
    if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      textOut = data.candidates[0].content.parts[0].text;
    } else {
      textOut = JSON.stringify(data);
    }
  } catch (e) {
    textOut = JSON.stringify(data);
  }
  return textOut;
}


// POST /api/analyze
router.post("/", async (req, res) => {
  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    try {
      if (err) {
        console.error("Formidable parse error:", err);
        return res.status(500).json({ error: "File upload error" });
      }

      // Extract job description, handling both single-value fields and array-like fields
      const jobDescription = fields.jobDescription?.[0] || fields.jobDescription;
      if (!jobDescription) {
        return res.status(400).json({ error: "No job description provided" });
      }

      let resumeText = "";

      // Prioritize file upload, then resume text field
      const resumeFile = files.resume?.[0];
      const resumeTextFromField = fields.resumeText?.[0] || fields.resumeText;

      if (resumeFile) {
        const buffer = fs.readFileSync(resumeFile.filepath);
        resumeText = await parseResume(buffer, resumeFile.originalFilename || resumeFile.newFilename);
      } else if (resumeTextFromField) {
        resumeText = resumeTextFromField;
      } else {
        return res.status(400).json({ error: "No resume provided" });
      }

      // If resumeText is still empty after checks
      if (!resumeText.trim()) {
        return res.status(400).json({ error: "Resume content is empty" });
      }

      // Compose the prompt for Gemini.
      const prompt = `
You are a helpful assistant that extracts skills and experience from resumes and compares them to a job description.
Your response MUST be a valid JSON object with the following keys:
- "match_percentage" (number 0-100)
- "matched_skills" (array of strings)
- "missing_skills" (array of strings)
- "summary" (short string, 1-2 sentences)
- "suggestions" (array of short strings)

Resume:
"""${resumeText.replace(/`/g, "'")}"""

Job description:
"""${jobDescription.replace(/`/g, "'")}"""

Analyze technical and soft skills. Prioritize explicit skill mentions, but also infer likely skills from role titles and past experiences.
`

      const geminiResp = await callGemini(prompt);

      let parsed = null;
      const jsonMatch = geminiResp.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      const jsonString = jsonMatch ? jsonMatch[1] : geminiResp.replace(/[\n\r]/g, '');

      try {
        parsed = JSON.parse(jsonString);
      } catch (e) {
        console.warn("Failed to parse Gemini response as JSON. Raw response:", geminiResp);
        return res.status(500).json({ error: "Failed to parse Gemini response", geminiRaw: geminiResp });
      }

      return res.json({ ok: true, result: parsed });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message || String(e) });
    }
  });
});

export default router;