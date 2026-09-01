"""
User profiling component.
Stores risk tolerance + interaction history per user in a local JSON file.
"""
import json
import os
import datetime as dt

STORE_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "user_store.json")

DEFAULT_PROFILES = {
    "u_conservative": {"risk_profile": "conservative", "history": []},
    "u_moderate": {"risk_profile": "moderate", "history": []},
    "u_aggressive": {"risk_profile": "aggressive", "history": []},
}


def _load():
    if not os.path.exists(STORE_PATH):
        _save(DEFAULT_PROFILES)
        return DEFAULT_PROFILES
    with open(STORE_PATH) as f:
        return json.load(f)


def _save(data):
    os.makedirs(os.path.dirname(STORE_PATH), exist_ok=True)
    with open(STORE_PATH, "w") as f:
        json.dump(data, f, indent=2)


def get_profile(user_id):
    data = _load()
    return data.get(user_id, {"risk_profile": "moderate", "history": []})


def log_interaction(user_id, ticker, stance):
    data = _load()
    data.setdefault(user_id, {"risk_profile": "moderate", "history": []})
    data[user_id]["history"].append({
        "ticker": ticker,
        "stance": stance,
        "timestamp": dt.datetime.now().isoformat(timespec="seconds"),
    })
    data[user_id]["history"] = data[user_id]["history"][-20:]  # cap log size
    _save(data)


def list_users():
    return list(_load().keys())
