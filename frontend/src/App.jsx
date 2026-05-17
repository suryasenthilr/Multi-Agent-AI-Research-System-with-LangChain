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
  const [pastReports, setPastReports] = useState([]);
  const [currentReportId, setCurrentReportId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const hasSearched = isSearching || result !== null;

  const fetchReports = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/reports");
      const data = await res.json();
      setPastReports(data);
    } catch (e) {
      console.error("Failed to fetch past reports", e);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const startNewConversation = () => {
    setTopic('');
    setResult(null);
    setIsSearching(false);
    setProgress([]);
    setError(null);
    setCurrentReportId(null);
    if (window.innerWidth < 768) setIsSidebarOpen(false); // auto close on mobile
  };

  const loadReport = async (id) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/reports/${id}`);
      const data = await res.json();
      setResult({
        report: data.report_content,
        feedback: data.feedback,
        search_result: "Data archived.",
        scrapped_content: "Data archived."
      });
      setTopic(data.topic);
      setIsSearching(false);
      setActiveTab('report');
      setCurrentReportId(id);
      if (window.innerWidth < 768) setIsSidebarOpen(false);
    } catch (e) {
      console.error("Failed to load report", e);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsSearching(true);
    setProgress([]);
    setResult(null);
    setError(null);
    setActiveTab('report'); 
    setCurrentReportId(null);

    try {
      const eventSource = new EventSource(`http://127.0.0.1:8000/api/research?topic=${encodeURIComponent(topic)}`);

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        if (data.status === 'completed') {
          setResult(data.result);
          setIsSearching(false);
          eventSource.close();
          fetchReports(); 
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

  const filteredReports = pastReports.filter(report => 
    report.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="app-layout">
      {/* Sidebar Overlay for Mobile */}
      {!isSidebarOpen && window.innerWidth < 768 ? null : (
        <div 
          className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`} 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <button className="new-chat-button" onClick={startNewConversation}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            New Chat
          </button>
        </div>
        
        <div className="sidebar-search-container">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="search-icon"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input 
            type="text" 
            placeholder="Search history..." 
            className="sidebar-search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="history-list">
          {filteredReports.length === 0 ? (
            <div className="no-history">No history found</div>
          ) : (
            filteredReports.map((report) => (
              <div 
                key={report.id} 
                className={`history-item ${currentReportId === report.id ? 'active' : ''}`}
                onClick={() => loadReport(report.id)}
                title={report.topic}
              >
                <span className="history-text">{report.topic}</span>
              </div>
            ))
          )}
        </div>
      </aside>

      <div className="main-container">
        {/* Top Navbar */}
        <nav className="top-nav">
          <button className="hamburger-button" onClick={() => setIsSidebarOpen(prev => !prev)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
          {hasSearched && (
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
               </div>
             </form>
          )}
        </nav>

        <main className={`main-content ${hasSearched ? 'content-top' : 'content-center'}`}>
          {/* Welcome Screen */}
          {!hasSearched && (
            <div className="hero-section fade-in">
              <header className="hero-header">
                <h1 className="serif-greeting">
                  <svg className="greeting-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                  </svg>
                  {getGreeting()}
                </h1>
                <p className="hero-subtitle">An autonomous AI platform that analyzes the web to compile comprehensive research reports.</p>
              </header>

              <form className="search-container" onSubmit={handleSearch}>
                <div className="search-box premium-shadow">
                  <input 
                    type="text" 
                    className="search-input hero-input" 
                    placeholder="How can I help you today?" 
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    disabled={isSearching}
                    autoFocus
                  />
                  <button type="submit" className="hero-submit-button" disabled={!topic.trim() || isSearching}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                  </button>
                </div>
              </form>
              
              <div className="suggestions">
                <button type="button" className="pill-button" onClick={() => setTopic('The future of solid-state batteries in EVs')}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                  Solid-state batteries
                </button>
                <button type="button" className="pill-button" onClick={() => setTopic('How do quantum computers break encryption?')}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                  Quantum encryption
                </button>
                <button type="button" className="pill-button" onClick={() => setTopic('Latest breakthroughs in fusion energy 2026')}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polyline></svg>
                  Fusion energy
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="error-message fade-in">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              <span>{error}</span>
            </div>
          )}

          {/* Loading State */}
          {isSearching && (
            <div className="loading-container fade-in">
              <div className="dynamic-spinner"></div>
              <h2>Agents at Work</h2>
              <p className="loading-subtitle">Gathering intelligence on "{topic}"...</p>
              
              <div className="status-steps">
                {progress.map((p, idx) => (
                  <div key={idx} className="status-step slide-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                    <div className={`status-icon ${p.status === 'completed' ? 'completed' : 'running'}`}>
                      {p.status === 'completed' ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="spin-icon"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
                      )}
                    </div>
                    <div className="step-text">{p.step}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          {result && !isSearching && (
            <div className="results-container fade-in">
              <div className="results-header">
                <h2>{topic}</h2>
              </div>
              
              <div className="tabs">
                <button className={`tab ${activeTab === 'report' ? 'active' : ''}`} onClick={() => setActiveTab('report')}>
                  Final Report
                </button>
                <button className={`tab ${activeTab === 'feedback' ? 'active' : ''}`} onClick={() => setActiveTab('feedback')}>
                  Critic Review
                </button>
                <button className={`tab ${activeTab === 'sources' ? 'active' : ''}`} onClick={() => setActiveTab('sources')}>
                  Sources
                </button>
              </div>
              
              <div className="tab-content">
                {activeTab === 'report' && (
                  <article className="markdown-content report-article slide-up">
                    <ReactMarkdown>{result.report}</ReactMarkdown>
                  </article>
                )}
                
                {activeTab === 'feedback' && (
                  <div className="markdown-content slide-up">
                    <div className="feedback-box">
                      <ReactMarkdown>{result.feedback}</ReactMarkdown>
                    </div>
                  </div>
                )}
                
                {activeTab === 'sources' && (
                  <div className="markdown-content sources-content slide-up">
                    <div className="source-section">
                      <h3>Search Data</h3>
                      <pre><code>{result.search_result}</code></pre>
                    </div>
                    
                    <div className="source-section">
                      <h3>Scraped Content</h3>
                      <pre><code>{result.scrapped_content}</code></pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
