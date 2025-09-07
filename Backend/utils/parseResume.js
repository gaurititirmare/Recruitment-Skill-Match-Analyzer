// utils/parseResume.js
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import mammoth from "mammoth";
import path from "path";

export default async function parseResume(buffer, filename = "file") {
  const ext = path.extname(filename).toLowerCase();
  if (ext === ".pdf") {
    const data = await pdfParse(buffer);
    return data.text || "";
  } else if (ext === ".docx" || ext === ".doc") {
    const res = await mammoth.extractRawText({ buffer });
    return res.value || "";
  } else {
    // fallback assume plain text
    return buffer.toString("utf-8");
  }
}
