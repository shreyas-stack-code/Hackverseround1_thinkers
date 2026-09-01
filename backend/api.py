"""
FinBot REST API Backend Server.

Exposes REST endpoints connecting the multi-agent intelligence layer,
RAG retrieval engine, signal classifier, and user profiles to the React UI frontend.
"""
import os
import sys
import json
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

# Add backend directory to sys.path
sys.path.append(os.path.dirname(__file__))

from data.mock_data import TICKERS, get_price_series, get_news_headlines, get_filing_corpus, get_user_portfolio
from core.signal_classifier import classify_all
from core.rag_engine import RagEngine
from core.agents import run_agents_parallel
from core.user_profile import get_profile, log_interaction, list_users

# Initialize RAG Engine
rag_engine = RagEngine(get_filing_corpus())


class ApiRequestHandler(BaseHTTPRequestHandler):
    def _set_headers(self, status=200, content_type="application/json"):
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers(200)

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path
        query = parse_qs(parsed.query)

        if path == "/api/users":
            users = list_users()
            self._set_headers(200)
            self.wfile.write(json.dumps({"users": users}).encode())

        elif path.startswith("/api/user/"):
            user_id = path.replace("/api/user/", "").strip()
            profile = get_profile(user_id)
            portfolio = get_user_portfolio(user_id)
            self._set_headers(200)
            self.wfile.write(json.dumps({"profile": profile, "portfolio": portfolio}).encode())

        elif path == "/api/tickers":
            self._set_headers(200)
            self.wfile.write(json.dumps({"tickers": TICKERS}).encode())

        elif path.startswith("/api/ticker/") and path.endswith("/signals"):
            parts = path.split("/")
            ticker = parts[3] if len(parts) >= 4 else TICKERS[0]
            price_series = get_price_series(ticker)
            headlines = get_news_headlines(ticker)
            signals = classify_all(ticker, price_series, headlines)
            self._set_headers(200)
            self.wfile.write(json.dumps({
                "ticker": ticker,
                "price_series": price_series,
                "headlines": headlines,
                "signals": signals
            }).encode())

        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Endpoint not found"}).encode())

    def do_POST(self):
        parsed = urlparse(self.path)
        path = parsed.path
        length = int(self.headers.get('content-length', 0))
        body_bytes = self.rfile.read(length) if length > 0 else b'{}'
        
        try:
            payload = json.loads(body_bytes.decode('utf-8'))
        except Exception:
            payload = {}

        if path == "/api/analyze":
            ticker = payload.get("ticker", TICKERS[0])
            user_id = payload.get("user_id", "u_moderate")
            profile = get_profile(user_id)
            risk_profile = profile.get("risk_profile", "moderate")

            price_series = get_price_series(ticker)
            headlines = get_news_headlines(ticker)
            signals = classify_all(ticker, price_series, headlines)

            agent_outputs, synthesis = run_agents_parallel(
                ticker, signals, headlines, rag_engine, risk_profile
            )

            log_interaction(user_id, ticker, synthesis["stance"])

            self._set_headers(200)
            self.wfile.write(json.dumps({
                "ticker": ticker,
                "user_id": user_id,
                "risk_profile": risk_profile,
                "agent_outputs": agent_outputs,
                "synthesis": synthesis
            }).encode())

        elif path == "/api/rag/query":
            q = payload.get("query", "")
            ticker = payload.get("ticker", None)
            results = rag_engine.retrieve(query=q, ticker=ticker, top_k=3)
            self._set_headers(200)
            self.wfile.write(json.dumps({"query": q, "results": results}).encode())

        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Endpoint not found"}).encode())


def run_server(port=5000):
    server_address = ('', port)
    httpd = HTTPServer(server_address, ApiRequestHandler)
    print(f"FinBot Backend API running on http://localhost:{port}")
    httpd.serve_forever()


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    run_server(port)
