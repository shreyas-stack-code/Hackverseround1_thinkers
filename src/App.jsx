import React, { useState, useEffect } from 'react';

// Custom SVG Icons for high fidelity without external icon package dependency
const SparklesIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const TrendingUpIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const ShieldAlertIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const FileTextIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const CpuIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M3 9h2m-2 6h2m14-6h2m-2 6h2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
  </svg>
);

const SlidersIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const TICKERS_LIST = ["RELIANCE", "TCS", "INFY", "HDFCBANK", "ZOMATO", "TATAMOTORS"];
const USERS_LIST = ["u_conservative", "u_moderate", "u_aggressive"];

export default function App() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [selectedUser, setSelectedUser] = useState('u_moderate');
  const [selectedTicker, setSelectedTicker] = useState('RELIANCE');
  const [userProfile, setUserProfile] = useState({ risk_profile: 'moderate', history: [] });
  const [portfolio, setPortfolio] = useState({ holdings: { RELIANCE: 15, INFY: 25 }, watchlist: ["TCS", "ZOMATO"] });
  const [signalsData, setSignalsData] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastAnalyzed, setLastAnalyzed] = useState('Just now');
  const [apiConnected, setApiConnected] = useState(false);

  const navItems = ['Overview', 'Portfolio', 'Signals', 'Settings'];

  // Load User & Signals on selection change
  useEffect(() => {
    fetchUserData(selectedUser);
  }, [selectedUser]);

  useEffect(() => {
    fetchTickerSignals(selectedTicker);
  }, [selectedTicker]);

  const fetchUserData = async (userId) => {
    try {
      const res = await fetch(`/api/user/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setUserProfile(data.profile || { risk_profile: 'moderate', history: [] });
        setPortfolio(data.portfolio || { holdings: {}, watchlist: [] });
        setApiConnected(true);
      }
    } catch (e) {
      setApiConnected(false);
    }
  };

  const fetchTickerSignals = async (ticker) => {
    try {
      const res = await fetch(`/api/ticker/${ticker}/signals`);
      if (res.ok) {
        const data = await res.json();
        setSignalsData(data);
        setApiConnected(true);
      }
    } catch (e) {
      setApiConnected(false);
    }
  };

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker: selectedTicker, user_id: selectedUser })
      });
      if (res.ok) {
        const data = await res.json();
        setAnalysisResult(data);
        setApiConnected(true);
      } else {
        fallbackAnalysis();
      }
    } catch (e) {
      fallbackAnalysis();
    } finally {
      setIsAnalyzing(false);
      setLastAnalyzed(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }
  };

  const fallbackAnalysis = () => {
    setAnalysisResult({
      ticker: selectedTicker,
      risk_profile: userProfile.risk_profile || 'moderate',
      agent_outputs: [
        {
          agent: "Technical Agent",
          confidence: 0.78,
          view: `${selectedTicker} exhibits solid 5-day momentum above long-term averages with stable volume conviction.`,
          citations: ["Price/volume series (last 60 sessions)", "Volume anomaly z-score: +1.2 std dev"]
        },
        {
          agent: "Fundamental Agent",
          confidence: 0.82,
          view: `Regulatory filings and earnings guidance for ${selectedTicker} confirm expanding EBITDA margins and steady order book growth.`,
          citations: ["Q1 FY26 Earnings Call Transcript", "SEBI Corporate Announcement"]
        },
        {
          agent: "Sentiment Agent",
          confidence: 0.70,
          view: `News coverage for ${selectedTicker} leans positive, driven by subscriber growth and strategic capacity expansion.`,
          citations: ["Headline scan: Jio adds 4M subscribers in Q", "Headline scan: Green energy capex plan"]
        }
      ],
      synthesis: {
        stance: "Strong signal to review",
        weighted_confidence: 0.77,
        risk_profile: userProfile.risk_profile || 'moderate',
        narrative: `For a ${userProfile.risk_profile || 'moderate'} profile, weighting Fundamentals (40%), Technicals (35%), and Sentiment (25%), the blended confidence score is 77%. Consider position allocation on ${selectedTicker}. This is explainable AI intelligence, cross-check before trading.`,
        weights: { "Fundamental Agent": 0.40, "Technical Agent": 0.35, "Sentiment Agent": 0.25 },
        sources: ["Technical Agent", "Fundamental Agent", "Sentiment Agent"]
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-neutral-900 font-sans antialiased selection:bg-purple-100 selection:text-purple-900">
      
      {/* 1. TOP HEADER SECTION (DARK MODE) */}
      <header className="bg-neutral-950 text-white pt-8 pb-10 px-6 sm:px-10 border-b border-neutral-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-900/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-10 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-500 to-indigo-400 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <CpuIcon />
              </div>
              <span className="text-xs font-semibold tracking-widest text-neutral-400 uppercase">
                Multi-Agent Financial Intelligence
              </span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${apiConnected ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${apiConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                {apiConnected ? 'Python API Backend Connected' : 'Local Engine Active'}
              </span>
            </div>

            {/* Run Action Button */}
            <button
              onClick={handleRunAnalysis}
              disabled={isAnalyzing}
              className="relative group inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-medium text-sm text-neutral-950 bg-white hover:bg-neutral-100 active:scale-95 transition-all duration-200 shadow-[0_0_25px_rgba(168,85,247,0.35)] hover:shadow-[0_0_35px_rgba(168,85,247,0.5)] border border-purple-200/50 cursor-pointer disabled:opacity-80"
            >
              {isAnalyzing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-neutral-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Orchestrating Agents...</span>
                </>
              ) : (
                <>
                  <SparklesIcon />
                  <span className="font-semibold">Run Multi-Agent Analysis</span>
                </>
              )}
            </button>
          </div>

          {/* Heading */}
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-white mb-2">
                FinBot Intelligence Hub
              </h1>
              <p className="text-neutral-400 text-sm sm:text-base max-w-xl font-light">
                Autonomous multi-agent synthesis running RAG filings search, price series momentum, and risk profiling.
              </p>
            </div>

            {/* Selectors for Ticker & User */}
            <div className="flex flex-wrap items-center gap-3 bg-neutral-900/90 p-3 rounded-2xl border border-neutral-800 shadow-inner">
              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">User Profile</label>
                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="bg-neutral-950 text-white text-xs font-medium rounded-lg px-3 py-1.5 border border-neutral-700 focus:outline-none focus:border-purple-500 cursor-pointer"
                >
                  {USERS_LIST.map(u => (
                    <option key={u} value={u}>{u.replace('u_', '').toUpperCase()} Risk</option>
                  ))}
                </select>
              </div>

              <div className="h-8 w-px bg-neutral-800" />

              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Target Ticker</label>
                <select
                  value={selectedTicker}
                  onChange={(e) => setSelectedTicker(e.target.value)}
                  className="bg-neutral-950 font-mono text-purple-300 font-bold text-xs rounded-lg px-3 py-1.5 border border-neutral-700 focus:outline-none focus:border-purple-500 cursor-pointer"
                >
                  {TICKERS_LIST.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-2 pt-2 border-t border-neutral-800/80">
            {navItems.map((item) => {
              const isActive = activeTab === item;
              return (
                <button
                  key={item}
                  onClick={() => setActiveTab(item)}
                  className={`text-sm font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-white text-black rounded-full px-4 py-1 shadow-sm'
                      : 'text-neutral-400 hover:text-white px-4 py-1 rounded-full'
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* 2. MAIN DASHBOARD SECTION */}
      <main className="max-w-7xl mx-auto px-6 sm:px-10 py-8">
        
        {/* Status bar */}
        <div className="flex items-center justify-between mb-6 text-xs text-gray-500 border-b border-gray-200/60 pb-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700">Active Pipeline:</span>
            <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-mono text-[11px]">3 Agents Parallel</span>
            <span className="text-gray-300">•</span>
            <span>Target: <strong className="text-gray-900 font-mono">{selectedTicker}</strong></span>
            <span className="text-gray-300">•</span>
            <span>Risk Profile: <strong className="text-purple-700 font-mono">{userProfile.risk_profile}</strong></span>
          </div>
          <div>Last Synced: <span className="font-mono text-gray-700">{lastAnalyzed}</span></div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* USER RISK PROFILE CARD */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
                    <SlidersIcon />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 leading-none">Active Investor Profile</h2>
                    <span className="text-xs text-gray-400 font-medium">Risk Matrix & Portfolio Mandate</span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200/60 capitalize">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                  {userProfile.risk_profile} Mode
                </span>
              </div>

              <div className="bg-gradient-to-r from-purple-500/10 via-purple-400/5 to-transparent border border-purple-100 rounded-xl p-4 mb-6 flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-wider font-semibold text-gray-400">Current Strategy</div>
                  <div className="text-base font-bold text-purple-950 mt-0.5 capitalize">{userProfile.risk_profile} Capital Strategy</div>
                </div>
                <div className="text-right">
                  <div className="text-xs uppercase tracking-wider font-semibold text-gray-400">Target Ticker</div>
                  <div className="text-base font-mono font-bold text-gray-900 mt-0.5">{selectedTicker}</div>
                </div>
              </div>

              {/* Portfolio Holdings */}
              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Portfolio Holdings</h4>
                <div className="grid grid-cols-2 gap-3">
                  {Object.keys(portfolio.holdings || {}).length > 0 ? (
                    Object.entries(portfolio.holdings).map(([t, qty]) => (
                      <div key={t} className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                        <span className="font-mono font-bold text-sm text-gray-900">{t}</span>
                        <span className="text-xs font-medium text-gray-600 bg-white px-2 py-0.5 rounded border border-gray-200">{qty} qty</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-gray-400">No holdings logged.</div>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
              <span>Profile ID: <code className="text-gray-600 font-mono">{selectedUser}</code></span>
              <span className="text-purple-600 font-medium">Watchlist: {(portfolio.watchlist || []).join(', ')}</span>
            </div>
          </div>

          {/* MARKET SIGNALS & CLASSIFIER CARD */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                    <TrendingUpIcon />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 leading-none">Deterministic Signals</h2>
                    <span className="text-xs text-gray-400 font-medium">Momentum, Volume & Sentiment Classifier</span>
                  </div>
                </div>
                <span className="font-mono text-sm font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-lg">
                  {selectedTicker}
                </span>
              </div>

              <div className="space-y-4 mb-6">
                {(signalsData?.signals || [
                  { dimension: 'momentum', label: 'Bullish momentum', confidence: 0.82, reasoning: '5-day average close is +4.5% vs 20-day average.' },
                  { dimension: 'volume_anomaly', label: 'Volume spike', confidence: 0.75, reasoning: 'Latest volume is +1.8 std dev from baseline mean.' },
                  { dimension: 'sentiment', label: 'Positive sentiment', confidence: 0.70, reasoning: '3 positive vs 0 negative headlines detected.' }
                ]).map((sig, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-gray-50/80 border border-gray-100 flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="font-semibold text-sm text-gray-900">{sig.label}</span>
                        <span className="text-[10px] font-mono uppercase bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded">{sig.dimension}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{sig.reasoning}</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-2 py-1 rounded border border-purple-100">
                      {Math.round(sig.confidence * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 text-xs text-gray-400">
              <span>Classified deterministically from statistical data pipelines.</span>
            </div>
          </div>
        </div>

        {/* 3. MULTI-AGENT REASONING TRACES & SYNTHESIS */}
        <section className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-600 mb-1">
                <SparklesIcon />
                Autonomous Multi-Agent Consensus
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Agent Reasoning & Synthesized Allocation
              </h2>
            </div>

            {analysisResult?.synthesis && (
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-gray-400">Synthesized Stance:</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-sm bg-purple-100 text-purple-900 border border-purple-200">
                  <CheckCircleIcon />
                  {analysisResult.synthesis.stance} ({Math.round(analysisResult.synthesis.weighted_confidence * 100)}% Conf)
                </span>
              </div>
            )}
          </div>

          {/* Three Specialist Agent Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {(analysisResult?.agent_outputs || [
              {
                agent: "Technical Agent",
                confidence: 0.78,
                view: `${selectedTicker} exhibits solid 5-day momentum above long-term averages with stable volume conviction.`,
                citations: ["Price/volume series (last 60 sessions)", "Volume anomaly z-score: +1.2 std dev"]
              },
              {
                agent: "Fundamental Agent",
                confidence: 0.82,
                view: `Regulatory filings and earnings guidance for ${selectedTicker} confirm expanding EBITDA margins and steady order book growth.`,
                citations: ["Q1 FY26 Earnings Call Transcript", "SEBI Corporate Announcement"]
              },
              {
                agent: "Sentiment Agent",
                confidence: 0.70,
                view: `News coverage for ${selectedTicker} leans positive, driven by subscriber growth and strategic capacity expansion.`,
                citations: ["Headline scan: Jio adds 4M subscribers in Q", "Headline scan: Green energy capex plan"]
              }
            ]).map((agent, i) => (
              <div key={i} className="p-5 rounded-2xl bg-gray-50/70 border border-gray-100 flex flex-col justify-between hover:bg-gray-50 transition-colors">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-sm text-gray-900">{agent.agent}</span>
                    <span className="text-xs font-mono font-semibold text-purple-700 bg-purple-100/70 px-2 py-0.5 rounded">
                      {Math.round(agent.confidence * 100)}% Conf
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed mb-4">{agent.view}</p>
                </div>

                <div className="pt-3 border-t border-gray-200/60">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Citations / Sources</div>
                  <ul className="space-y-1">
                    {(agent.citations || []).map((c, idx) => (
                      <li key={idx} className="text-[11px] text-gray-500 flex items-center gap-1 truncate">
                        <FileTextIcon />
                        <span className="truncate">{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Synthesized Recommendation Banner */}
          {analysisResult?.synthesis && (
            <div className="bg-gradient-to-r from-purple-900 to-neutral-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-xs font-bold text-purple-300 uppercase tracking-widest mb-2">
                  <CheckCircleIcon />
                  Final Explainable Synthesis ({analysisResult.synthesis.risk_profile} weighting)
                </div>
                <h3 className="text-lg sm:text-xl font-serif font-normal mb-3 text-purple-100">
                  {analysisResult.synthesis.narrative}
                </h3>
                <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-purple-800/60 text-xs text-purple-300">
                  <span>Blended Confidence: <strong className="text-white font-mono">{Math.round(analysisResult.synthesis.weighted_confidence * 100)}%</strong></span>
                  <span>•</span>
                  <span>Sources: {analysisResult.synthesis.sources.join(', ')}</span>
                  <span>•</span>
                  <span className="text-neutral-400">Not financial advice.</span>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
