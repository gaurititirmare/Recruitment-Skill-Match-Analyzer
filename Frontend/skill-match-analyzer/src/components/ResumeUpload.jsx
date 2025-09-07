import React, { useRef, useState, useContext } from "react";
import { CheckCircle2, UploadCloud, FileText, X, FileUp } from "lucide-react";
import { ThemeContext } from "../App";

export default function ResumeUpload({ onChange }) {
  const fileRef = useRef();
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [pastedText, setPastedText] = useState("");
  const { darkMode } = useContext(ThemeContext);

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    processFile(file);
  }

  function processFile(file) {
    onChange(file);
    setUploadedFile(file);
  }

  function handleDragOver(e) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }

  function removeFile() {
    setUploadedFile(null);
    onChange("");
    if (fileRef.current) {
      fileRef.current.value = "";
    }
  }

  function handleTextChange(e) {
    const text = e.target.value;
    setPastedText(text);
    onChange(text);
    
    if (text && uploadedFile) {
      setUploadedFile(null);
      if (fileRef.current) {
        fileRef.current.value = "";
      }
    }
  }

  function clearText() {
    setPastedText("");
    onChange("");
  }

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2">
        <UploadCloud size={24} className="text-indigo-600 dark:text-indigo-400" />
        Upload Resume
      </h3>

      {/* File Upload Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Upload a PDF or DOCX file
        </label>
        
        {/* Drag and Drop Area */}
        <div 
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300 ${
            isDragging 
              ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20" 
              : uploadedFile
              ? "border-green-400 bg-green-50 dark:bg-green-900/20"
              : "border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
        >
          <div className="flex flex-col items-center justify-center space-y-3">
            {uploadedFile ? (
              <CheckCircle2 size={32} className="text-green-500" />
            ) : (
              <FileUp size={32} className="text-gray-400 dark:text-gray-500" />
            )}
            <div>
              {uploadedFile ? (
                <p className="text-sm font-medium text-green-700 dark:text-green-300">
                  Resume Uploaded Successfully!
                </p>
              ) : (
                <>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Drag & drop your resume here
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    or click to browse files
                  </p>
                </>
              )}
            </div>
            <span className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
              PDF, DOCX up to 5MB
            </span>
          </div>
          
          <input
            type="file"
            ref={fileRef}
            onChange={handleFile}
            className="hidden"
            accept=".pdf,.docx,.doc"
          />
        </div>

        {/* Success Notification - Now persistent until removed */}
        {uploadedFile && (
          <div className="mt-4 flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 text-sm animate-fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} />
              <span className="truncate max-w-xs">"{uploadedFile.name}" uploaded successfully!</span>
            </div>
            <button 
              onClick={removeFile}
              className="text-green-700 dark:text-green-300 hover:text-green-900 dark:hover:text-green-100 transition-colors"
              aria-label="Remove file"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>

      <div className="relative my-8 flex justify-center items-center">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-300 dark:border-gray-600"></span>
        </div>
        <div className="relative z-10 bg-white dark:bg-gray-800 px-4 text-sm text-gray-500 dark:text-gray-400 font-medium">OR</div>
      </div>

      {/* Textarea for paste option */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
            <FileText size={16} />
            Paste resume text
          </label>
          {pastedText && (
            <button 
              onClick={clearText}
              className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 flex items-center gap-1 transition-colors"
            >
              <X size={14} />
              Clear
            </button>
          )}
        </div>
        <div className="relative">
          <textarea
            placeholder="Paste resume text here..."
            rows={8}
            value={pastedText}
            className="w-full border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg p-4 text-sm shadow-sm transition-all resize-y bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            onChange={handleTextChange}
          />
          {!pastedText && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center text-gray-400 dark:text-gray-500 text-xs p-4">
                <div className="mb-1">Paste your resume content here</div>
                <div>Ctrl+V or right-click to paste</div>
              </div>
            </div>
          )}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Character count: {pastedText.length}
        </p>
      </div>
    </div>
  );
}