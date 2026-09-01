# FinBot — Multi-Agent Autonomous Financial Intelligence System

## Problem Statement Compliance Matrix (PS-01)

| Requirement | Implementation Component | Status |
| :--- | :--- | :--- |
| **1. Signal Classification Module** | Evaluates price momentum, volume anomaly, and news sentiment deterministically with confidence levels & citations ([`core/signal_classifier.py`](file:///c:/Users/afraa/Downloads/finbot/backend/core/signal_classifier.py)) | ✅ **VERIFIED** |
| **2. Retrieval-Augmented Generation (RAG)** | TF-IDF + cosine similarity engine searching SEBI filings & earnings call transcripts with source attribution ([`core/rag_engine.py`](file:///c:/Users/afraa/Downloads/finbot/backend/core/rag_engine.py)) | ✅ **VERIFIED** |
| **3. Parallel Multi-Agent Architecture** | 3 specialist agents (`Technical`, `Fundamental`, `Sentiment`) executing in parallel via `ThreadPoolExecutor`, consumed by `SynthesisAgent` ([`core/agents.py`](file:///c:/Users/afraa/Downloads/finbot/backend/core/agents.py)) | ✅ **VERIFIED** |
| **4. User Profiling & Strategy Matrix** | Risk profiles (`conservative`, `moderate`, `aggressive`) dynamically alter agent consensus weighting matrices ([`core/user_profile.py`](file:///c:/Users/afraa/Downloads/finbot/backend/core/user_profile.py)) | ✅ **VERIFIED** |
| **5. Live Interface Rendering** | React + Tailwind dashboard rendering signals, agent reasoning traces with citations, portfolio state, and RAG search ([`src/App.jsx`](file:///c:/Users/afraa/Downloads/finbot/src/App.jsx)) | ✅ **VERIFIED** |
| **6. Performance Logging (3 Metrics)** | Tracks **Agent Response Latency (ms)**, **Portfolio Risk Concentration (HHI %)**, and **30-Day Forward Signal Accuracy (%)** per session ([`backend/api.py`](file:///c:/Users/afraa/Downloads/finbot/backend/api.py)) | ✅ **VERIFIED** |
| **7. Degraded Data Handling** | Fallback baseline citations & zero-dependency execution for missing filings, offline feeds, or uninstalled libraries | ✅ **VERIFIED** |
| **8. Written Architecture Summary** | Summary of agent architecture and decision logic for judges review (`ARCHITECTURE.md`) | ✅ **VERIFIED** |

---

## 🏛️ System Architecture

```text
               +----------------------------------+
               |     React UI Frontend Dashboard   |
               | (Overview / Portfolio / Signals) |
               +----------------+-----------------+
                                | REST API
                                v
               +----------------------------------+
               |      Python Backend Server       |
               |         (backend/api.py)         |
               +----------------+-----------------+
                                |
        +-----------------------+-----------------------+
        |                       |                       |
        v                       v                       v
+---------------+       +---------------+       +---------------+
| Signal Engine |       |   RAG Engine  |       | User Profiles |
| (Momentum/Vol)|       | (SEBI Corpus) |       | (Risk Matrix) |
+-------+-------+       +-------+-------+       +-------+-------+
        |                       |                       |
        +-----------------------+-----------------------+
                                |
                                v
               +----------------------------------+
               |  ThreadPoolExecutor (Parallel)   |
               +--------+-------+-------+---------+
                        |       |       |
      +-----------------+       |       +-----------------+
      v                         v                         v
+------------------+  +-------------------+  +-------------------+
| Technical Agent  |  | Fundamental Agent |  |  Sentiment Agent  |
+--------+---------+  +---------+---------+  +---------+---------+
         |                      |                      |
         +----------------------+----------------------+
                                |
                                v
                      +-------------------+
                      |  Synthesis Agent  |
                      +---------+---------+
                                |
                                v
                    Synthesized Recommendation
```

---

## 🧠 Multi-Agent Consensus Weights

The `SynthesisAgent` weights specialist agent confidence scores according to the retail investor's registered risk profile:

| Agent | Conservative Profile | Moderate Profile | Aggressive Profile |
| :--- | :--- | :--- | :--- |
| **Fundamental Agent (RAG)** | **55%** | **40%** | **25%** |
| **Technical Agent (Price/Vol)** | **25%** | **35%** | **50%** |
| **Sentiment Agent (News)** | **20%** | **25%** | **25%** |

---

## ⚡ Performance & Session Metrics Logged

Each user session logs 3 key quantitative metrics:
1. **Agent Response Latency (`agent_response_latency_ms`)**: Multi-agent parallel execution time in milliseconds.
2. **Portfolio Risk Concentration Score (`portfolio_risk_concentration_score`)**: Herfindahl-Hirschman Index (HHI %) calculating portfolio diversification.
3. **Signal Accuracy 30-Day Forward (`signal_accuracy_30d_forward`)**: Measured precision score comparing stance signal confidence against 30-day forward return benchmarks.
