# ⚡ FinIntel: Multi-Agent Financial Intelligence System

> Bridging the gap between raw public financial data and personalized, actionable decision-making for retail investors.

[![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?logo=react&logoColor=black)](#)
[![Tailwind](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?logo=tailwind-css&logoColor=white)](#)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi&logoColor=white)](#)
[![Python](https://img.shields.io/badge/AI_Engine-Python%20%2B%20LangChain-3776AB?logo=python&logoColor=white)](#)

## 🎯 The Problem
India's retail investment ecosystem does not suffer from a lack of data; it suffers from an **infrastructure gap**. Hedge funds deploy parallel teams of analysts to evaluate technicals, fundamentals, and risk before executing a trade. Retail investors get a price chart and a hunch. This asymmetry leads to massive capital loss in derivative and mid-cap markets.

## 🚀 Our Unique Edge (The "Smart" Approach)
Most AI financial tools simply wrap an API around a Large Language Model and ask it to guess. That approach hallucinates math and ignores personal risk. We engineered a **Production-Safe, Multi-Agent Architecture** built on three core innovations:

1. **The "Dual-Brain" Guardrail System:** AI is probabilistic; finance requires determinism. Before our AI agents even begin analyzing a stock, a hardcoded Python deterministic layer evaluates the user's risk profile (e.g., blocking any trade exceeding a 10% portfolio allocation). The AI cannot override this math. 
2. **Dialectical Synthesis (The Devil's Advocate):** Our agents do not operate in an echo chamber. We dedicated a specific AI agent solely to finding fatal flaws in the trade idea (e.g., promoter pledges, volume divergences). The Synthesizer agent must explicitly resolve these clashes before outputting a recommendation.
3. **Grounded Explainability:** Every insight is cited. If the Fundamental Agent claims debt is reduced, it provides the exact semantic chunk retrieved from the SEBI filing via our local ChromaDB vector store.

---

## 🧠 System Architecture

```mermaid
graph TD
    %% Frontend
    User([Retail Investor]) -->|Clicks Analyze| UI[React/Tailwind Dashboard]
    UI -->|JSON Payload| API[FastAPI Orchestrator]

    %% Backend Guardrails
    API -->|Phase 1| RuleEngine{Deterministic Rule Engine}
    RuleEngine -->|Fails 10% Limit| Blocked[Reject Trade: Safety Override]
    RuleEngine -->|Passes Limit| Agents[Trigger Parallel AI Agents]

    %% AI Agents
    subgraph Multi-Agent Processing
        Agents --> Tech[Technical Agent]
        Agents --> Fund[Fundamental Agent]
        Fund <-->|RAG Query| VectorDB[(ChromaDB: SEBI Filings)]
        Agents --> Risk[Risk/Profile Agent]
        
        Tech --> Devil[Devil's Advocate Agent]
        Fund --> Devil
    end

    %% Synthesis
    Tech --> Synth[Synthesizer / Team Lead]
    Fund --> Synth
    Risk --> Synth
    Devil --> Synth

    Synth -->|Synthesized & Cited Recommendation| API
    API --> UI
