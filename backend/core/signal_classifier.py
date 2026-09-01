"""
Signal classification module.
Evaluates three independent dimensions — momentum, volume anomaly, sentiment —
each with a label, a confidence score, and a plain-language reasoning string.
"""
from statistics import mean, pstdev

POSITIVE_WORDS = {"beat", "raise", "raises", "strong", "profit", "growth", "wins",
                   "surprise", "buyback", "rallies", "improve", "improvement"}
NEGATIVE_WORDS = {"pressure", "weak", "weakness", "moderates", "burns", "scrutiny",
                   "soften", "softened", "attrition", "competition", "cautious", "divided"}


def classify_momentum(price_series):
    closes = [p["close"] for p in price_series]
    short_ma = mean(closes[-5:])
    long_ma = mean(closes[-20:])
    pct_diff = (short_ma - long_ma) / long_ma * 100

    if pct_diff > 3:
        label, confidence = "Bullish momentum", min(0.5 + pct_diff / 20, 0.95)
    elif pct_diff < -3:
        label, confidence = "Bearish momentum", min(0.5 + abs(pct_diff) / 20, 0.95)
    else:
        label, confidence = "Neutral / range-bound", 0.55

    reasoning = (f"5-day average close ({short_ma:.1f}) is {pct_diff:+.1f}% vs "
                 f"20-day average ({long_ma:.1f}).")
    return {"dimension": "momentum", "label": label, "confidence": round(confidence, 2),
            "reasoning": reasoning}


def classify_volume_anomaly(price_series):
    volumes = [p["volume"] for p in price_series]
    recent = volumes[-1]
    baseline = volumes[:-1]
    mu, sigma = mean(baseline), pstdev(baseline) or 1
    z = (recent - mu) / sigma

    if z > 1.5:
        label, confidence = "Volume spike (unusual activity)", min(0.5 + z / 6, 0.95)
    elif z < -1.5:
        label, confidence = "Volume drought (low conviction)", min(0.5 + abs(z) / 6, 0.9)
    else:
        label, confidence = "Normal volume", 0.6

    reasoning = f"Latest volume is {z:+.1f} standard deviations from the {len(baseline)}-day mean."
    return {"dimension": "volume_anomaly", "label": label, "confidence": round(confidence, 2),
            "reasoning": reasoning}


def classify_sentiment(headlines):
    pos, neg = 0, 0
    for h in headlines:
        words = set(w.strip(",.").lower() for w in h.split())
        pos += len(words & POSITIVE_WORDS)
        neg += len(words & NEGATIVE_WORDS)

    total = pos + neg
    if total == 0:
        label, confidence, score = "Neutral / no clear signal", 0.5, 0
    else:
        score = (pos - neg) / total
        if score > 0.2:
            label = "Positive sentiment"
        elif score < -0.2:
            label = "Negative sentiment"
        else:
            label = "Mixed sentiment"
        confidence = min(0.5 + abs(score) * 0.4 + total * 0.05, 0.95)

    reasoning = f"{pos} positive vs {neg} negative signal words across {len(headlines)} recent headlines."
    return {"dimension": "sentiment", "label": label, "confidence": round(confidence, 2),
            "reasoning": reasoning}


def classify_all(ticker, price_series, headlines):
    return [
        classify_momentum(price_series),
        classify_volume_anomaly(price_series),
        classify_sentiment(headlines),
    ]
