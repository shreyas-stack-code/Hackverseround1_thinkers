# FinBot — Multi-Agent Financial Intelligence Platform

A unified full-stack application combining a **Python multi-agent & RAG intelligence backend** with a **modern React + Tailwind CSS frontend dashboard**.

---

## 🏗️ Project Architecture

```text
Hackverseround1_thinkers/
├── backend/                  # Python Intelligence & API Backend
│   ├── api.py                # REST API Server (Endpoints for Signals, RAG, Multi-Agent)
│   ├── requirements.txt      # Python dependencies
│   ├── core/
│   │   ├── agents.py         # Parallel Multi-Agent Orchestrator (Technical, Fundamental, Sentiment, Synthesis)
│   │   ├── rag_engine.py     # TF-IDF + Cosine Similarity Semantic Retrieval
│   │   ├── signal_classifier.py # Deterministic Momentum, Volume & Sentiment Classifiers
│   │   └── user_profile.py   # Risk matrix & user interaction logger
│   └── data/
│       └── mock_data.py      # Price series, headlines, and SEBI filing corpus
├── src/                      # React UI Frontend
│   ├── App.jsx               # Dashboard UI (Live signals, ticker selector, risk matrix, agent traces)
│   ├── index.css             # Tailwind CSS directives
│   └── main.jsx              # React DOM entry point
├── index.html                # HTML document entry
├── vite.config.js            # Vite configuration with API proxy (/api -> http://localhost:5000)
├── tailwind.config.js        # Tailwind CSS config
├── postcss.config.js         # PostCSS config
└── package.json              # Frontend npm dependencies & scripts
```

---

## 🚀 Running the Unified Application

### 1. Start the Python API Backend (Port 5000)
```bash
cd backend
python api.py
```

### 2. Start the React Frontend Dev Server (Port 5173)
```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to interact with the connected dashboard.