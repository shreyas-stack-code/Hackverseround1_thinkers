import React, { useState } from 'react';

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

export default function App() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastAnalyzed, setLastAnalyzed] = useState('Just now');

  const navItems = ['Overview', 'Portfolio', 'Signals', 'Settings'];

  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setLastAnalyzed(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-neutral-900 font-sans antialiased selection:bg-purple-100 selection:text-purple-900">
      
      {/* 1. TOP HEADER SECTION (DARK MODE) */}
      <header className="bg-neutral-950 text-white pt-8 pb-10 px-6 sm:px-10 border-b border-neutral-800 shadow-2xl relative overflow-hidden">
        {/* Background Subtle Gradient Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-900/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-10 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          {/* Top Bar: System Status & Primary Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-500 to-indigo-400 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <CpuIcon />
              </div>
              <span className="text-xs font-semibold tracking-widest text-neutral-400 uppercase">
                Multi-Agent Financial Intelligence
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1.5" />
                NSE Live Agent Network
              </span>
            </div>

            {/* Prominent Action Button */}
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

          {/* Large Elegant Serif Greeting */}
          <div className="mb-8">
            <h1 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-white mb-2">
              Good Evening, Investor
            </h1>
            <p className="text-neutral-400 text-sm sm:text-base max-w-xl font-light">
              Autonomous agents analyzing live market data, fundamentals, and downside risk to synthesize trade allocations.
            </p>
          </div>

          {/* Navigation Pill Links */}
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

      {/* 2. MAIN DASHBOARD SECTION (LIGHT MODE) */}
      <main className="max-w-7xl mx-auto px-6 sm:px-10 py-8">
        
        {/* Status bar notification */}
        <div className="flex items-center justify-between mb-6 text-xs text-gray-500 border-b border-gray-200/60 pb-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700">Active Pipeline:</span>
            <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-mono text-[11px]">3 Agents Parallel</span>
            <span className="text-gray-300">•</span>
            <span>Target Ticker: <strong className="text-gray-900 font-mono">RELIANCE.NS</strong></span>
          </div>
          <div>Last Synced: <span className="font-mono text-gray-700">{lastAnalyzed}</span></div>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* CARD 1: USER RISK PROFILE (TOP LEFT) */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              {/* Card Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
                    <SlidersIcon />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 leading-none">Active Investor Profile</h2>
                    <span className="text-xs text-gray-400 font-medium">Risk Matrix & Strategy Controls</span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200/60">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                  Active Mode
                </span>
              </div>

              {/* Profile Overview Pill / Badge */}
              <div className="bg-gradient-to-r from-purple-500/10 via-purple-400/5 to-transparent border border-purple-100 rounded-xl p-4 mb-6 flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-wider font-semibold text-gray-400">Current Mandate</div>
                  <div className="text-base font-bold text-purple-950 mt-0.5">Aggressive Growth</div>
                </div>
                <div className="text-right">
                  <div className="text-xs uppercase tracking-wider font-semibold text-gray-400">Target Return</div>
                  <div className="text-base font-serif font-bold text-gray-900 mt-0.5">18 - 24% p.a.</div>
                </div>
              </div>

              {/* Key Stats Display */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-gray-50/80 border border-gray-100">
                  <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                    Available Capital
                  </div>
                  <div className="font-serif text-2xl font-bold text-gray-900">
                    ₹1,50,000
                  </div>
                  <div className="text-[11px] text-gray-500 mt-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                    100% Unallocated Cash
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gray-50/80 border border-gray-100">
                  <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                    Risk Limit
                  </div>
                  <div className="font-serif text-2xl font-bold text-amber-600">
                    10% <span className="text-xs font-sans text-gray-500 font-normal">/ trade</span>
                  </div>
                  <div className="text-[11px] text-gray-500 mt-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block"></span>
                    Max Drawdown: ₹15,000
                  </div>
                </div>
              </div>

              {/* Sleek Settings Toggles Visual */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs py-1.5 px-3 rounded-lg bg-gray-50/50">
                  <span className="text-gray-600 font-medium">Auto-Hedging Guardrails</span>
                  <span className="text-emerald-700 font-semibold bg-emerald-100/60 px-2 py-0.5 rounded text-[11px]">Enabled</span>
                </div>
                <div className="flex items-center justify-between text-xs py-1.5 px-3 rounded-lg bg-gray-50/50">
                  <span className="text-gray-600 font-medium">Devil's Advocate Consensus Gate</span>
                  <span className="text-purple-700 font-semibold bg-purple-100/60 px-2 py-0.5 rounded text-[11px]">Strict (3/3)</span>
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
              <span>Profile ID: <code className="text-gray-600 font-mono">USR-AGG-9921</code></span>
              <span className="text-purple-600 hover:text-purple-700 font-medium cursor-pointer">Edit Parameters →</span>
            </div>
          </div>

          {/* CARD 2: LIVE MARKET SIGNALS (TOP RIGHT) */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              {/* Card Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                    <TrendingUpIcon />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 leading-none">Market Data (NSE)</h2>
                    <span className="text-xs text-gray-400 font-medium">Real-time Technical Feed</span>
                  </div>
                </div>
                <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md font-semibold">
                  RELIANCE
                </span>
              </div>

              {/* Price & Volatility Banner */}
              <div className="flex items-baseline justify-between mb-6">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                    Last Traded Price (LTP)
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span className="font-serif text-3xl font-bold text-gray-900">
                      ₹2,950.40
                    </span>
                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                      ▲ +1.2%
                    </span>
                  </div>
                </div>
                
                {/* Volume Anomaly Highlight */}
                <div className="text-right">
                  <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                    Volume Metrics
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-amber-500/15 to-orange-500/10 border border-amber-300/40 text-orange-700 text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>
                    +45% Anomaly
                  </div>
                </div>
              </div>

              {/* Mock Bar Chart Graphic (Purple & Orange Accents) */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
                  <span>Intraday Volume Spike vs 20-Day Avg</span>
                  <span className="text-gray-600 font-mono">1.45x Z-Score</span>
                </div>
                
                {/* Tailwind Div Bar Chart */}
                <div className="h-32 bg-gray-50 rounded-xl p-3 border border-gray-100 flex items-end justify-between gap-2">
                  {/* Bar 1 */}
                  <div className="w-full bg-purple-200 rounded-t-md h-[40%] hover:bg-purple-300 transition-all relative group">
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] py-0.5 px-1.5 rounded pointer-events-none">10:00</div>
                  </div>
                  {/* Bar 2 */}
                  <div className="w-full bg-purple-300 rounded-t-md h-[55%] hover:bg-purple-400 transition-all relative group">
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] py-0.5 px-1.5 rounded pointer-events-none">11:00</div>
                  </div>
                  {/* Bar 3 */}
                  <div className="w-full bg-purple-400 rounded-t-md h-[35%] hover:bg-purple-500 transition-all relative group">
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] py-0.5 px-1.5 rounded pointer-events-none">12:00</div>
                  </div>
                  {/* Bar 4 */}
                  <div className="w-full bg-gradient-to-t from-orange-400 to-amber-300 rounded-t-md h-[85%] hover:brightness-110 transition-all relative group shadow-sm">
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] py-0.5 px-1.5 rounded pointer-events-none">13:00</div>
                  </div>
                  {/* Bar 5 (Current Anomaly Spike) */}
                  <div className="w-full bg-gradient-to-t from-purple-600 via-purple-500 to-orange-400 rounded-t-md h-[100%] hover:brightness-110 transition-all relative group shadow-md">
                    <div className="opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 bg-purple-900 text-white text-[10px] font-bold py-0.5 px-1.5 rounded pointer-events-none shadow-sm">Spike</div>
                  </div>
                  {/* Bar 6 */}
                  <div className="w-full bg-purple-200 rounded-t-md h-[60%] hover:bg-purple-300 transition-all relative group">
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] py-0.5 px-1.5 rounded pointer-events-none">15:00</div>
                  </div>
                </div>

                {/* Chart Legend */}
                <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-sm bg-purple-400"></span> Standard Vol
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-r from-purple-500 to-orange-400"></span> Anomaly Detector
                    </span>
                  </div>
                  <span className="font-mono text-gray-400">5D MA: ₹2,912.10</span>
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
              <span>Feed: <code className="text-gray-600 font-mono">NSE-EQ-L2</code></span>
              <span className="text-amber-600 hover:text-amber-700 font-medium cursor-pointer">Detailed Analytics →</span>
            </div>
          </div>

        </div>

        {/* CARD 3: MULTI-AGENT SYNTHESIS (BOTTOM FULL WIDTH) */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
          
          {/* Card Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
                <CpuIcon />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">AI Orchestrator Output</h2>
                <p className="text-xs text-gray-500">Parallel Specialized Agents & Synthesis Matrix</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                Ticker: RELIANCE
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
                Weighting: Aggressive Profile
              </span>
            </div>
          </div>

          {/* Three Visually Distinct Agent Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            
            {/* Column 1: Tech Agent */}
            <div className="bg-slate-50/70 border border-purple-100/80 rounded-xl p-5 hover:border-purple-200 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-700 flex items-center gap-1.5">
                    <TrendingUpIcon />
                    Technical Agent
                  </span>
                  <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                    88% Confidence
                  </span>
                </div>
                <div className="text-sm font-semibold text-gray-900 mb-2">
                  "Bullish momentum detected."
                </div>
                <p className="text-xs text-gray-600 leading-relaxed font-light mb-4">
                  Moving average crossover confirmed on 5D vs 20D timeline. Volume anomaly (+45%) indicates active institutional accumulation.
                </p>
              </div>
              <div className="pt-3 border-t border-gray-200/60 flex items-center justify-between text-[11px] text-gray-500">
                <span>Signal: <strong className="text-emerald-600">STRONG BUY</strong></span>
                <span className="font-mono">RSI: 64.2</span>
              </div>
            </div>

            {/* Column 2: Fundamental Agent */}
            <div className="bg-slate-50/70 border border-indigo-100/80 rounded-xl p-5 hover:border-indigo-200 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1.5">
                    <FileTextIcon />
                    Fundamental Agent
                  </span>
                  <span className="text-[11px] font-semibold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full border border-indigo-200">
                    76% Grounded (RAG)
                  </span>
                </div>
                <div className="text-sm font-semibold text-gray-900 mb-2">
                  "Q3 filings show 14% debt reduction."
                </div>
                <p className="text-xs text-gray-600 leading-relaxed font-light mb-4">
                  RAG query retrieved SEC/SEBI Q3 financial disclosures confirming net debt reduction and healthy free cash flow growth across retail & digital segments.
                </p>
              </div>
              <div className="pt-3 border-t border-gray-200/60 flex items-center justify-between text-[11px] text-gray-500">
                <span>Solvency: <strong className="text-indigo-600">IMPROVED</strong></span>
                <span className="font-mono">P/E: 24.1</span>
              </div>
            </div>

            {/* Column 3: Devil's Advocate */}
            <div className="bg-slate-50/70 border border-amber-100/80 rounded-xl p-5 hover:border-amber-200 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
                    <ShieldAlertIcon />
                    Devil's Advocate
                  </span>
                  <span className="text-[11px] font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">
                    Risk Warning
                  </span>
                </div>
                <div className="text-sm font-semibold text-gray-900 mb-2">
                  "Warning: High promoter pledge."
                </div>
                <p className="text-xs text-gray-600 leading-relaxed font-light mb-4">
                  Promoter equity pledge stands at elevated threshold. Broad market volatility could trigger margin calls if price breaks key support at ₹2,880.
                </p>
              </div>
              <div className="pt-3 border-t border-gray-200/60 flex items-center justify-between text-[11px] text-gray-500">
                <span>Risk Level: <strong className="text-amber-600">MODERATE-HIGH</strong></span>
                <span className="font-mono">Pledge: 18.4%</span>
              </div>
            </div>

          </div>

          {/* FINAL RECOMMENDATION BOX (Soft Purple Background) */}
          <div className="bg-gradient-to-r from-purple-50 via-indigo-50/50 to-purple-50 border border-purple-200/80 rounded-xl p-6 shadow-sm relative overflow-hidden">
            
            {/* Background Decorative Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-300/10 rounded-full blur-xl pointer-events-none" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
                <h3 className="text-sm font-bold uppercase tracking-wider text-purple-900">
                  Synthesizer Final Decision
                </h3>
                <span className="text-xs bg-purple-200/60 text-purple-900 px-2 py-0.5 rounded font-medium">
                  Consensus Weight: 0.82
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs font-medium text-purple-950">
                <CheckCircleIcon />
                <span>Verified against 10% Risk Cap</span>
              </div>
            </div>

            <p className="font-serif text-lg text-purple-950 leading-relaxed font-normal mb-4">
              "Proceed with 5% allocation. Technical momentum is supported by fundamental debt reduction, offsetting promoter pledge risks."
            </p>

            {/* Position Size Breakdown Bar */}
            <div className="pt-4 border-t border-purple-200/60 flex flex-wrap items-center justify-between gap-4 text-xs text-purple-900">
              <div className="flex items-center gap-6">
                <div>
                  <span className="text-purple-600/80 uppercase tracking-wider text-[10px] font-semibold block">Recommended Allocation</span>
                  <strong className="font-serif text-base text-purple-950">₹7,500 <span className="text-xs font-sans text-purple-700 font-normal">(5% of Capital)</span></strong>
                </div>
                <div className="h-8 w-px bg-purple-200"></div>
                <div>
                  <span className="text-purple-600/80 uppercase tracking-wider text-[10px] font-semibold block">Execution Order</span>
                  <span className="font-semibold text-purple-900">Limit Buy @ ₹2,945.00</span>
                </div>
                <div className="h-8 w-px bg-purple-200"></div>
                <div>
                  <span className="text-purple-600/80 uppercase tracking-wider text-[10px] font-semibold block">Stop Loss</span>
                  <span className="font-semibold text-amber-800">₹2,870.00 (-2.5%)</span>
                </div>
              </div>

              <button className="px-4 py-2 rounded-lg bg-purple-900 hover:bg-purple-950 text-white font-medium text-xs shadow-md transition-colors cursor-pointer flex items-center gap-1.5">
                <span>Execute Signal</span>
                <span>→</span>
              </button>
            </div>

          </div>

        </div>

      </main>

      {/* Footer Branding */}
      <footer className="max-w-7xl mx-auto px-6 sm:px-10 py-6 text-center text-xs text-gray-400 border-t border-gray-200/40 mt-12">
        Multi-Agent Financial Intelligence System • High-Fidelity Demo Frontend • Built with React & Tailwind CSS
      </footer>
    </div>
  );
}
