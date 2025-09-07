import React, { useState, useContext } from "react";
import { Briefcase, Clipboard, X } from "lucide-react";
import { ThemeContext } from "../App";

export default function JobInput({ onChange }) {
  const [jobText, setJobText] = useState("");
  const { darkMode } = useContext(ThemeContext);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setJobText(text);
      onChange(text);
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
      const fallbackText = window.prompt("Paste the job description here:");
      if (fallbackText) {
        setJobText(fallbackText);
        onChange(fallbackText);
      }
    }
  };

  const handleTextChange = (e) => {
    const text = e.target.value;
    setJobText(text);
    onChange(text);
  };

  const clearText = () => {
    setJobText("");
    onChange("");
  };

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2">
        <Briefcase size={24} className="text-indigo-600 dark:text-indigo-400" />
        Job Description
      </h3>
      
      <div className="flex items-center justify-between mb-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Paste the full job description text below
        </label>
        <div className="flex items-center gap-2">
          {jobText && (
            <button 
              onClick={clearText}
              className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 flex items-center gap-1"
            >
              <X size={14} />
              Clear
            </button>
          )}
          <button
            onClick={handlePaste}
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded-md transition-colors"
          >
            <Clipboard size={14} />
            Paste
          </button>
        </div>
      </div>
      
      <div className="relative">
        <textarea
          placeholder="Paste the job description here..."
          rows={14}
          value={jobText}
          className="w-full border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg p-4 text-sm shadow-sm transition-all resize-y bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          onChange={handleTextChange}
        />
        {!jobText && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center text-gray-400 dark:text-gray-500 text-xs p-4">
              <div className="mb-1">Paste the job description here</div>
              <div>You can use the paste button or Ctrl+V</div>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-center mt-2">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Character count: {jobText.length}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {jobText.split(/\s+/).filter(Boolean).length} words
        </p>
      </div>
    </div>
  );
}