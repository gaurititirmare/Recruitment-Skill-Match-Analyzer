import React, { useState, useContext } from "react";
import { CheckCircle2, XCircle, FileText, Lightbulb, Star, ChevronDown, ChevronUp, Copy, Download } from "lucide-react";
import { ThemeContext } from "../App";

function prettyJSON(data) {
  try {
    return JSON.stringify(data, null, 2);
  } catch (e) {
    return String(data);
  }
}

export default function ResultCard({ data }) {
  const parsed = data?.result || {};
  const raw = data?.geminiRaw;
  const [showRawData, setShowRawData] = useState(false);
  const [copied, setCopied] = useState(false);
  const { darkMode } = useContext(ThemeContext);

  const match = parsed.match_percentage ?? parsed.matchPercentage ?? null;

  // Pick color for match progress
  const getProgressColor = () => {
    if (match >= 75) return "bg-green-500";
    if (match >= 50) return "bg-yellow-500";
    if (match >= 25) return "bg-orange-500";
    return "bg-red-500";
  };

  const getMatchTextColor = () => {
    if (match >= 75) return "text-green-700 dark:text-green-400";
    if (match >= 50) return "text-yellow-700 dark:text-yellow-400";
    if (match >= 25) return "text-orange-700 dark:text-orange-400";
    return "text-red-700 dark:text-red-400";
  };

  const getMatchLevel = () => {
    if (match >= 90) return "Excellent Match";
    if (match >= 75) return "Strong Match";
    if (match >= 60) return "Good Match";
    if (match >= 50) return "Moderate Match";
    if (match >= 25) return "Weak Match";
    return "Poor Match";
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadResults = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'skill-match-analysis.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300 hover:shadow-2xl">
      <div className="flex items-start justify-between mb-6">
        <h2 className="text-2xl font-bold text-indigo-700 dark:text-indigo-400 flex items-center gap-3">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
            <FileText size={24} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          Analysis Result
        </h2>
        <div className="flex gap-2">
          <button
            onClick={copyToClipboard}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Copy results to clipboard"
          >
            <Copy size={18} />
          </button>
          <button
            onClick={downloadResults}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Download results as JSON"
          >
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* Match Percentage with Progress Bar */}
      {match !== null && (
        <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Match Score</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">How well the resume matches the job requirements</p>
            </div>
            <div className="flex items-baseline gap-2">
              <span className={`text-4xl font-bold ${getMatchTextColor()}`}>
                {match}%
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">match</span>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-4 mb-3">
            <div
              className={`${getProgressColor()} h-4 rounded-full transition-all duration-1000 ease-out`}
              style={{ width: `${match}%` }}
            />
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{getMatchLevel()}</span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={16} 
                  className={i < Math.floor(match/20) ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-gray-600"} 
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Suitability Level */}
      {parsed.suitability_level && (
        <div className="mb-6">
          <span className="px-4 py-2 text-sm font-medium rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
            {parsed.suitability_level}
          </span>
        </div>
      )}

      {/* Skills Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-5 border border-green-200 dark:border-green-800">
          <h3 className="font-semibold text-green-800 dark:text-green-300 flex items-center gap-2 mb-4">
            <CheckCircle2 size={20} className="text-green-600 dark:text-green-400" />
            Matched Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {(parsed.matched_skills ?? []).map((skill, i) => (
              <span key={i} className="px-3 py-1.5 bg-green-100 dark:bg-green-800/40 text-green-800 dark:text-green-300 text-sm rounded-full font-medium">
                {skill}
              </span>
            ))}
            {(parsed.matched_skills ?? []).length === 0 && (
              <div className="text-green-700 dark:text-green-400 text-sm italic">
                No matched skills detected
              </div>
            )}
          </div>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-5 border border-red-200 dark:border-red-800">
          <h3 className="font-semibold text-red-800 dark:text-red-300 flex items-center gap-2 mb-4">
            <XCircle size={20} className="text-red-600 dark:text-red-400" />
            Missing Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {(parsed.missing_skills ?? []).map((skill, i) => (
              <span key={i} className="px-3 py-1.5 bg-red-100 dark:bg-red-800/40 text-red-800 dark:text-red-300 text-sm rounded-full font-medium">
                {skill}
              </span>
            ))}
            {(parsed.missing_skills ?? []).length === 0 && (
              <div className="text-red-700 dark:text-red-400 text-sm italic">
                No missing skills detected
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {parsed.recommendations && parsed.recommendations.length > 0 && (
        <div className="mb-8 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5 border border-blue-200 dark:border-blue-800">
          <h3 className="font-semibold text-blue-800 dark:text-blue-300 flex items-center gap-2 mb-4">
            <Lightbulb size={20} className="text-blue-600 dark:text-blue-400" />
            Recommendations
          </h3>
          <ul className="space-y-3">
            {parsed.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-blue-900 dark:text-blue-200">
                <span className="mt-1 text-blue-500 dark:text-blue-400">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Summary */}
      {parsed.summary && (
        <div className="mb-8 bg-purple-50 dark:bg-purple-900/20 rounded-xl p-5 border border-purple-200 dark:border-purple-800">
          <h3 className="font-semibold text-purple-800 dark:text-purple-300 mb-3">Summary</h3>
          <p className="text-sm text-purple-900 dark:text-purple-200 leading-relaxed">
            {parsed.summary}
          </p>
        </div>
      )}

      {/* Raw Gemini Response (debug) */}
      {raw && (
        <div className="mt-8">
          <button
            onClick={() => setShowRawData(!showRawData)}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            {showRawData ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {showRawData ? "Hide" : "Show"} Raw Response Data
          </button>
          
          {showRawData && (
            <div className="mt-4 relative">
              <pre className="bg-gray-900 text-green-400 p-4 rounded-xl mt-2 overflow-auto text-xs max-h-96">
                {prettyJSON(raw)}
              </pre>
              {copied && (
                <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                  Copied!
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}