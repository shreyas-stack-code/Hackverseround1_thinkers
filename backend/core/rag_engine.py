"""
Lightweight semantic retrieval layer.
Uses TF-IDF + cosine similarity (scikit-learn) instead of a downloaded embedding
model — no network dependency during the demo, runs in milliseconds.
"""
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


class RagEngine:
    def __init__(self, corpus):
        """corpus: list of {ticker, source, text} dicts."""
        self.corpus = corpus
        self.texts = [c["text"] for c in corpus]
        self.vectorizer = TfidfVectorizer(stop_words="english")
        self.matrix = self.vectorizer.fit_transform(self.texts)

    def retrieve(self, query, ticker=None, top_k=2):
        """Return top_k chunks most relevant to query, optionally filtered by ticker."""
        candidate_idx = [i for i, c in enumerate(self.corpus)
                         if ticker is None or c["ticker"] == ticker]
        if not candidate_idx:
            return []

        query_vec = self.vectorizer.transform([query])
        sims = cosine_similarity(query_vec, self.matrix[candidate_idx]).flatten()
        ranked = sorted(zip(candidate_idx, sims), key=lambda x: x[1], reverse=True)[:top_k]

        results = []
        for idx, score in ranked:
            chunk = self.corpus[idx]
            results.append({
                "text": chunk["text"],
                "source": chunk["source"],
                "ticker": chunk["ticker"],
                "relevance": round(float(score), 3),
            })
        return results
