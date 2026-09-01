"""
Multi-agent orchestration layer.

Three specialist agents run in PARALLEL (ThreadPoolExecutor), each with a
defined role and a structured output contract:
    {agent, view, confidence, citations: [...], raw_reasoning}

A SynthesisAgent then consumes all three structured outputs + the user's risk
profile and produces one explainable recommendation.
"""
import os
import concurrent.futures as cf

try:
    import anthropic
    _CLIENT = anthropic.Anthropic() if os.environ.get("ANTHROPIC_API_KEY") else None
except ImportError:
    _CLIENT = None

MODEL = "claude-sonnet-4-6"


def _llm(system_prompt, user_prompt, max_tokens=300):
    if _CLIENT is None:
        return None
    try:
        resp = _CLIENT.messages.create(
            model=MODEL,
            max_tokens=max_tokens,
            system=system_prompt,
            messages=[{"role": "user", "content": user_prompt}],
        )
        return resp.content[0].text.strip()
    except Exception as e:
        return f"[LLM unavailable: {e}]"


class TechnicalAgent:
    """Reasons over momentum + volume signals."""
    name = "Technical Agent"

    def run(self, ticker, signals):
        momentum = next(s for s in signals if s["dimension"] == "momentum")
        volume = next(s for s in signals if s["dimension"] == "volume_anomaly")
        avg_conf = round((momentum["confidence"] + volume["confidence"]) / 2, 2)

        narrative = _llm(
            "You are a terse equity technical analyst. In 2 sentences, interpret "
            "the given momentum and volume signals for a retail investor. Do not invent numbers.",
            f"Ticker: {ticker}\nMomentum: {momentum['label']} ({momentum['reasoning']})\n"
            f"Volume: {volume['label']} ({volume['reasoning']})"
        ) or f"{momentum['label']} combined with {volume['label'].lower()} suggests " \
             f"{'caution' if avg_conf < 0.6 else 'a fairly clear technical read'} on {ticker}."

        return {
            "agent": self.name,
            "view": narrative,
            "confidence": avg_conf,
            "citations": [f"Price/volume series (last 60 sessions) — {momentum['reasoning']}",
                          volume["reasoning"]],
        }


class FundamentalAgent:
    """RAG-grounded agent — reasons over regulatory filings / earnings call excerpts."""
    name = "Fundamental Agent"

    def __init__(self, rag_engine):
        self.rag = rag_engine

    def run(self, ticker):
        chunks = self.rag.retrieve(
            query=f"{ticker} earnings guidance margins outlook risk",
            ticker=ticker, top_k=2
        )
        if not chunks:
            return {"agent": self.name, "view": "No filings available for this ticker.",
                     "confidence": 0.3, "citations": []}

        context = "\n".join(f"- ({c['source']}) {c['text']}" for c in chunks)
        narrative = _llm(
            "You are a fundamental research analyst. Summarize the fundamental outlook for a "
            "retail investor in 2-3 sentences, grounded ONLY in the provided excerpts. "
            "Do not add outside facts.",
            f"Ticker: {ticker}\nExcerpts:\n{context}"
        ) or f"Recent disclosures for {ticker} show: " + " ".join(c["text"][:120] + "..." for c in chunks)

        confidence = round(min(0.55 + max(c["relevance"] for c in chunks) * 0.5, 0.92), 2)
        return {
            "agent": self.name,
            "view": narrative,
            "confidence": confidence,
            "citations": [f"{c['source']} (relevance {c['relevance']})" for c in chunks],
        }


class SentimentAgent:
    """Reasons over news/social sentiment signal."""
    name = "Sentiment Agent"

    def run(self, ticker, signals, headlines):
        sentiment = next(s for s in signals if s["dimension"] == "sentiment")
        narrative = _llm(
            "You are a market sentiment analyst. In 1-2 sentences, explain what the "
            "sentiment classification implies for a retail investor, referencing the headlines "
            "only in general terms.",
            f"Ticker: {ticker}\nSentiment: {sentiment['label']} ({sentiment['reasoning']})\n"
            f"Headlines: {headlines}"
        ) or f"{sentiment['label']} across recent coverage ({sentiment['reasoning']})."

        return {
            "agent": self.name,
            "view": narrative,
            "confidence": sentiment["confidence"],
            "citations": [f"Headline scan: {h}" for h in headlines[:3]],
        }


class SynthesisAgent:
    """Combines the three specialist outputs, weighted by user risk profile."""
    name = "Synthesis Agent"

    RISK_WEIGHTS = {
        "conservative": {"Technical Agent": 0.25, "Fundamental Agent": 0.55, "Sentiment Agent": 0.20},
        "moderate":     {"Technical Agent": 0.35, "Fundamental Agent": 0.40, "Sentiment Agent": 0.25},
        "aggressive":   {"Technical Agent": 0.50, "Fundamental Agent": 0.25, "Sentiment Agent": 0.25},
    }

    def run(self, ticker, agent_outputs, risk_profile):
        weights = self.RISK_WEIGHTS.get(risk_profile, self.RISK_WEIGHTS["moderate"])
        weighted_conf = sum(o["confidence"] * weights.get(o["agent"], 0.33) for o in agent_outputs)
        weighted_conf = round(weighted_conf, 2)

        stance = "Watch" if weighted_conf < 0.55 else ("Consider" if weighted_conf < 0.75 else "Strong signal to review")

        combined_context = "\n".join(f"- {o['agent']} ({weights.get(o['agent'],0):.0%} weight, "
                                      f"conf {o['confidence']}): {o['view']}" for o in agent_outputs)

        narrative = _llm(
            "You are a synthesis layer producing a final explainable note for a RETAIL investor "
            "with the given risk profile. Combine the three agent views into one coherent 3-4 "
            "sentence recommendation. Be explicit this is not financial advice. Reference which "
            "agent view mattered most given the risk profile weighting.",
            f"Ticker: {ticker}\nRisk profile: {risk_profile}\nAgent views (with weights):\n{combined_context}"
        ) or (f"For a {risk_profile} profile, weighting Fundamentals/Technicals/Sentiment at "
              f"{weights['Fundamental Agent']:.0%}/{weights['Technical Agent']:.0%}/{weights['Sentiment Agent']:.0%}, "
              f"the blended confidence is {weighted_conf}. {stance} on {ticker}. This is not financial advice — "
              f"cross-check against your own research.")

        return {
            "agent": self.name,
            "ticker": ticker,
            "risk_profile": risk_profile,
            "weights": weights,
            "weighted_confidence": weighted_conf,
            "stance": stance,
            "narrative": narrative,
            "sources": [o["agent"] for o in agent_outputs],
        }


def run_agents_parallel(ticker, signals, headlines, rag_engine, risk_profile):
    """Dispatches the 3 specialist agents in parallel, then runs synthesis."""
    tech = TechnicalAgent()
    fund = FundamentalAgent(rag_engine)
    sent = SentimentAgent()

    with cf.ThreadPoolExecutor(max_workers=3) as executor:
        futures = {
            executor.submit(tech.run, ticker, signals): "tech",
            executor.submit(fund.run, ticker): "fund",
            executor.submit(sent.run, ticker, signals, headlines): "sent",
        }
        results = {}
        for future in cf.as_completed(futures):
            results[futures[future]] = future.result()

    agent_outputs = [results["tech"], results["fund"], results["sent"]]
    synthesis = SynthesisAgent().run(ticker, agent_outputs, risk_profile)
    return agent_outputs, synthesis
