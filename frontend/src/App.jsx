import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import './index.css';

function App() {
  const [topic, setTopic] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [progress, setProgress] = useState([]);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('report');
  const [error, setError] = useState(null);
  
  const hasSearched = isSearching || result !== null;

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsSearching(true);
    setProgress([]);
    setResult(null);
    setError(null);
    setActiveTab('report'); // Reset to report tab on new search

    try {
      const eventSource = new EventSource(`http://127.0.0.1:8002/api/research?topic=${encodeURIComponent(topic)}`);

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        if (data.status === 'completed') {
          setResult(data.result);
          setIsSearching(false);
          eventSource.close();
        } else {
          setProgress(prev => {
            const newProgress = [...prev];
            const existingIndex = newProgress.findIndex(p => p.step === data.step);
            if (existingIndex >= 0) {
              newProgress[existingIndex] = data;
            } else {
              newProgress.push(data);
            }
            return newProgress;
          });
        }
      };

      eventSource.onerror = (error) => {
        console.error("EventSource failed:", error);
        setError("Connection to the server failed or the pipeline encountered an error.");
        setIsSearching(false);
        eventSource.close();
      };
    } catch (err) {
      console.error(err);
      setError(err.toString());
      setIsSearching(false);
    }
  };

  return (
    <div className={`app-wrapper ${hasSearched ? 'has-searched' : ''}`}>
      {/* Top Navigation - Only visible after searching */}
      {hasSearched && (
        <nav className="top-nav">
          <div className="nav-logo" onClick={() => { setResult(null); setIsSearching(false); setTopic(''); }}>
            Deep Research AI
          </div>
          <form className="nav-search-form" onSubmit={handleSearch}>
            <div className="search-box nav-search-box">
              <input 
                type="text" 
                className="search-input" 
                placeholder="Ask a new question..." 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                disabled={isSearching}
              />
              <button type="submit" className="search-button" disabled={!topic.trim() || isSearching}>
                Ask
              </button>
            </div>
          </form>
        </nav>
      )}

      <main className="main-content">
        {/* Hero Section - Only visible before searching */}
        {!hasSearched && (
          <div className="hero-section">
            <header className="hero-header">
              <h1>Deep Research AI</h1>
              <p className="hero-subtitle">Ask any question and let our autonomous agents analyze the web to uncover the truth.</p>
            </header>

            <form className="search-container" onSubmit={handleSearch}>
              <div className="search-box">
                <input 
                  type="text" 
                  className="search-input" 
                  placeholder="What do you want to learn about?" 
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  disabled={isSearching}
                  autoFocus
                />
                <button type="submit" className="search-button" disabled={!topic.trim() || isSearching}>
                  Ask Question
                </button>
              </div>
            </form>
            
            <div className="suggestions">
              <span>Try asking:</span>
              <button type="button" onClick={() => setTopic('The future of solid-state batteries in EVs')}>The future of solid-state batteries in EVs</button>
              <button type="button" onClick={() => setTopic('How do quantum computers break encryption?')}>How do quantum computers break encryption?</button>
            </div>
          </div>
        )}

        {error && (
          <div className="error-message">
            Error: {error}
          </div>
        )}

        {/* Loading State */}
        {isSearching && (
          <div className="loading-container">
            <div className="spinner"></div>
            <h2>AI Agents at Work</h2>
            <p className="loading-subtitle">
              Compiling research on "{topic}"...
            </p>
            
            <div className="status-steps">
              {progress.map((p, idx) => (
                <div key={idx} className="status-step">
                  <div className={`status-icon ${p.status === 'completed' ? 'completed' : 'running'}`}>
                    {p.status === 'completed' ? '✓' : '⟳'}
                  </div>
                  <div>
                    <strong>{p.step}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {result && !isSearching && (
          <div className="results-container">
            <div className="results-header">
              <h2>Research Results for "{topic}"</h2>
            </div>
            
            <div className="tabs">
              <button 
                className={`tab ${activeTab === 'report' ? 'active' : ''}`}
                onClick={() => setActiveTab('report')}
              >
                Final Report
              </button>
              <button 
                className={`tab ${activeTab === 'feedback' ? 'active' : ''}`}
                onClick={() => setActiveTab('feedback')}
              >
                Critic Review
              </button>
              <button 
                className={`tab ${activeTab === 'sources' ? 'active' : ''}`}
                onClick={() => setActiveTab('sources')}
              >
                Sources & Data
              </button>
            </div>
            
            <div className="tab-content">
              {activeTab === 'report' && (
                <article className="markdown-content report-article">
                  <ReactMarkdown>{result.report}</ReactMarkdown>
                </article>
              )}
              
              {activeTab === 'feedback' && (
                <div className="markdown-content">
                  <div className="feedback-box">
                    <ReactMarkdown>{result.feedback}</ReactMarkdown>
                  </div>
                </div>
              )}
              
              {activeTab === 'sources' && (
                <div className="markdown-content sources-content">
                  <div className="source-section">
                    <h3>Search Results</h3>
                    <pre><code>{result.search_result}</code></pre>
                  </div>
                  
                  <div className="source-section">
                    <h3>Top Scraped Content</h3>
                    <pre><code>{result.scrapped_content}</code></pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
