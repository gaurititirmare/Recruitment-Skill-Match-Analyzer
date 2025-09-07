import React, { useState, useRef, useEffect, createContext, useContext } from "react";
import ResumeUpload from "./components/ResumeUpload";
import JobInput from "./components/JobInput";
import ResultCard from "./components/ResultCard";
import axios from "axios";

export const ThemeContext = createContext();

export default function App() {
  const [resumeInput, setResumeInput] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [analysisStarted, setAnalysisStarted] = useState(false);
  const [darkMode, setDarkMode] = useState(true); 
  const resultRef = useRef(null);

  useEffect(() => {
    
    const savedDarkMode = localStorage.getItem("darkMode");
    
    if (savedDarkMode === "false") {
      setDarkMode(false);
    } else {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  }, [darkMode]);


  const isFormValid = resumeInput && jobDescription;

  
  useEffect(() => {
    if (result && resultRef.current) {
      const scrollToResults = () => {
        resultRef.current.scrollIntoView({ 
          behavior: "smooth", 
          block: "start"
        });
      };
      
     
      const timer = setTimeout(scrollToResults, 300);
      return () => clearTimeout(timer);
    }
  }, [result]);

  async function handleAnalyze() {
    try {
      setLoading(true);
      setError(null);
      setResult(null);
      setAnalysisStarted(true);

      const fd = new FormData();
      if (resumeInput instanceof File) {
        fd.append("resume", resumeInput);
      } else if (resumeInput) {
        fd.append("resumeText", resumeInput);
      }
      fd.append("jobDescription", jobDescription);

      const resp = await axios.post("http://localhost:5000/api/analyze", fd, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 120000,
      });

      setResult(resp.data);
    } catch (e) {
      console.error(e);
      setError(e.response?.data?.message || e.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 font-sans text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <header className="bg-white dark:bg-gray-800 shadow-lg py-5 mb-8 md:mb-12 rounded-b-[3rem] md:rounded-b-[5rem] transition-all duration-500 relative">
          <button
            onClick={toggleDarkMode}
            className="absolute top-6 right-6 p-3 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300 flex items-center justify-center"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? (
     
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
            
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          <div className="max-w-5xl mx-auto px-6 text-center">
            <div className="inline-flex items-center justify-center p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-3">
              Skill-Match Analyzer
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Instantly analyze how well a resume matches a job description and get detailed insights
            </p>
          </div>
        </header>


        <main className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 md:p-8 transform transition-all duration-300 hover:shadow-2xl">
              <ResumeUpload onChange={(input) => setResumeInput(input)} />
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 md:p-8 transform transition-all duration-300 hover:shadow-2xl">
              <JobInput onChange={(text) => setJobDescription(text)} />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
            <button
              className={`flex items-center justify-center gap-3 px-8 py-4 rounded-full text-white font-semibold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg ${
                loading
                  ? "bg-indigo-400 dark:bg-indigo-500 cursor-not-allowed"
                  : !isFormValid
                  ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed shadow-none"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl"
              }`}
              onClick={handleAnalyze}
              disabled={loading || !isFormValid}
              aria-label={loading ? "Analyzing resume" : "Analyze resume"}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Analyze Match
                </>
              )}
            </button>

            <button
              className="flex items-center gap-2 px-8 py-4 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-semibold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 hover:bg-gray-300 dark:hover:bg-gray-600 shadow-sm"
              onClick={() => {
                setResumeInput("");
                setJobDescription("");
                setResult(null);
                setError(null);
                setAnalysisStarted(false);
              }}
              aria-label="Reset form"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset
            </button>
          </div>

          {analysisStarted && !result && !error && (
            <div className="mt-12 text-center">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm">
                <svg className="animate-pulse h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 8 8">
                  <circle cx="4" cy="4" r="3" />
                </svg>
                Processing your analysis...
              </div>
            </div>
          )}

          <div ref={resultRef} className="mt-16 transition-opacity duration-500">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-6 py-5 rounded-xl shadow-lg">
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 flex-shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Analysis Error</h3>
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            {result && (
              <div className="mt-6 animate-fade-in">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">Analysis Complete</h2>
                  <p className="text-gray-600 dark:text-gray-400">Here's how the resume matches the job requirements</p>
                </div>
                <ResultCard data={result} />
              </div>
            )}
          </div>
        </main>

        <footer className="mt-20 text-center text-sm text-gray-500 dark:text-gray-500 pb-6">
          <p>Skill-Match Analyzer • Powered by AI Technology</p>
        </footer>
      </div>
    </ThemeContext.Provider>
  );
}