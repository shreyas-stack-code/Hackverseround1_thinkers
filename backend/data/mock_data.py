"""
Synthetic data generators — stands in for NSE feeds / SEBI filings / news APIs.
Deterministic (seeded) so demo runs are repeatable.
"""
import random
import datetime as dt

TICKERS = ["RELIANCE", "TCS", "INFY", "HDFCBANK", "ZOMATO", "TATAMOTORS"]

random.seed(42)


def get_price_series(ticker: str, days: int = 60):
    """Return a list of {date, close, volume} dicts with a mildly realistic random walk."""
    seed = sum(ord(c) for c in ticker)
    rng = random.Random(seed)
    price = rng.uniform(150, 3500)
    base_vol = rng.randint(500_000, 5_000_000)
    series = []
    today = dt.date.today()
    for i in range(days, 0, -1):
        drift = rng.uniform(-0.02, 0.022)
        price = max(price * (1 + drift), 1)
        vol_spike = rng.choice([1, 1, 1, 1, 2.5, 3.2]) if i < 5 else 1
        volume = int(base_vol * rng.uniform(0.7, 1.3) * vol_spike)
        series.append({
            "date": (today - dt.timedelta(days=i)).isoformat(),
            "close": round(price, 2),
            "volume": volume,
        })
    return series


def get_news_headlines(ticker: str):
    """Synthetic sentiment-bearing headlines for a ticker."""
    bank = {
        "RELIANCE": [
            "Reliance Jio adds 4M subscribers in Q, ARPU rises",
            "Reliance Retail expansion faces margin pressure, analysts cautious",
            "Reliance announces new green energy capex plan",
        ],
        "TCS": [
            "TCS wins large multi-year deal from European bank",
            "TCS attrition ticks up, hiring guidance softened",
            "TCS Q results beat street estimates on margins",
        ],
        "INFY": [
            "Infosys raises full-year revenue guidance",
            "Infosys flags weakness in discretionary tech spend",
            "Infosys announces buyback program",
        ],
        "HDFCBANK": [
            "HDFC Bank loan growth moderates amid tight liquidity",
            "HDFC Bank asset quality stable, NPAs contained",
            "Brokerages remain divided on HDFC Bank near-term outlook",
        ],
        "ZOMATO": [
            "Zomato quick-commerce arm burns cash faster than expected",
            "Zomato posts surprise profit, stock rallies",
            "Regulatory scrutiny on gig-worker pay hits food delivery stocks",
        ],
        "TATAMOTORS": [
            "Tata Motors JLR sales strong in key export markets",
            "Tata Motors EV division faces increased competition",
            "Tata Motors debt reduction ahead of schedule",
        ],
    }
    return bank.get(ticker, ["No recent headlines available."])


def get_filing_corpus():
    """Synthetic SEBI-style disclosure / earnings-call excerpts used for RAG."""
    return [
        {"ticker": "RELIANCE", "source": "Q1 FY26 Earnings Call Transcript",
         "text": "Management reiterated that Reliance Jio's ARPU improvement is driven by tariff "
                 "repricing completed last quarter, and guided that retail segment EBITDA margins "
                 "should stabilize as new store additions slow in the second half of the fiscal year."},
        {"ticker": "RELIANCE", "source": "SEBI Corporate Announcement",
         "text": "The company disclosed a capital expenditure plan of approximately INR 75,000 crore "
                 "over three years directed toward new energy manufacturing, including solar giga "
                 "factories, flagged as a long-gestation investment with limited near-term earnings impact."},
        {"ticker": "TCS", "source": "Q1 FY26 Earnings Call Transcript",
         "text": "TCS management noted that voluntary attrition rose to 14.2% this quarter and that "
                 "the company plans to slow lateral hiring while increasing campus intake, which could "
                 "pressure bench costs in the short term."},
        {"ticker": "TCS", "source": "SEBI Corporate Announcement",
         "text": "TCS announced a multi-year digital transformation contract with a European banking "
                 "client valued at over USD 1 billion, expected to contribute to revenue starting next "
                 "quarter."},
        {"ticker": "INFY", "source": "Q1 FY26 Earnings Call Transcript",
         "text": "Infosys raised full-year revenue growth guidance to 4-7% citing resilient demand in "
                 "financial services, while cautioning that discretionary spending in retail and "
                 "telecom verticals remains soft."},
        {"ticker": "INFY", "source": "SEBI Corporate Announcement",
         "text": "The board approved a share buyback of up to INR 18,000 crore, to be executed via the "
                 "open market route, subject to regulatory approval."},
        {"ticker": "HDFCBANK", "source": "Q1 FY26 Earnings Call Transcript",
         "text": "HDFC Bank management indicated loan growth has moderated to align deposit mobilization "
                 "with credit growth following the merger, and that net interest margins are expected "
                 "to remain under mild pressure for the next two quarters."},
        {"ticker": "HDFCBANK", "source": "SEBI Corporate Announcement",
         "text": "The bank disclosed gross non-performing assets at 1.24%, broadly stable quarter over "
                 "quarter, with management characterizing asset quality trends as benign."},
        {"ticker": "ZOMATO", "source": "Q1 FY26 Earnings Call Transcript",
         "text": "Zomato management stated that the quick-commerce business (Blinkit) continues to "
                 "prioritize dark-store expansion over near-term profitability, with contribution "
                 "margin improvement targeted for later in the fiscal year."},
        {"ticker": "ZOMATO", "source": "SEBI Corporate Announcement",
         "text": "The company reported a surprise consolidated net profit for the quarter, aided by "
                 "improved unit economics in the food delivery segment."},
        {"ticker": "TATAMOTORS", "source": "Q1 FY26 Earnings Call Transcript",
         "text": "Tata Motors management highlighted strong JLR order books in North America and "
                 "Europe, while flagging that the domestic EV passenger vehicle segment faces "
                 "intensifying price competition."},
        {"ticker": "TATAMOTORS", "source": "SEBI Corporate Announcement",
         "text": "The company announced it has reduced net automotive debt ahead of its stated "
                 "timeline, citing strong free cash flow generation across segments."},
    ]


def get_user_portfolio(user_id: str):
    demo_portfolios = {
        "u_conservative": {"holdings": {"HDFCBANK": 20, "TCS": 10}, "watchlist": ["RELIANCE", "INFY"]},
        "u_moderate": {"holdings": {"RELIANCE": 15, "INFY": 25, "TATAMOTORS": 10}, "watchlist": ["TCS", "ZOMATO"]},
        "u_aggressive": {"holdings": {"ZOMATO": 100, "TATAMOTORS": 40}, "watchlist": ["RELIANCE", "HDFCBANK"]},
    }
    return demo_portfolios.get(user_id, {"holdings": {}, "watchlist": TICKERS[:2]})
