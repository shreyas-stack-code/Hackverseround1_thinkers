"""
Lightweight semantic retrieval layer.
Supports sklearn TfidfVectorizer if available, with automatic pure-Python TF-IDF fallback.
"""
import math
import re

try:
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import cosine_similarity
    _HAS_SKLEARN = True
except ImportError:
    _HAS_SKLEARN = False


class RagEngine:
    def __init__(self, corpus):
        """corpus: list of {ticker, source, text} dicts."""
        self.corpus = corpus
        self.texts = [c["text"] for c in corpus]
        
        if _HAS_SKLEARN:
            self.vectorizer = TfidfVectorizer(stop_words="english")
            self.matrix = self.vectorizer.fit_transform(self.texts)
        else:
            self._build_fallback_index()

    def _tokenize(self, text):
        words = re.findall(r'\b[a-zA-Z0-9]+\b', text.lower())
        stopwords = {"the", "a", "an", "and", "or", "in", "of", "to", "for", "with", "on", "at", "by", "from", "is", "that", "this"}
        return [w for w in words if w not in stopwords]

    def _build_fallback_index(self):
        self.doc_tokens = [self._tokenize(t) for t in self.texts]
        self.doc_freq = {}
        for tokens in self.doc_tokens:
            for w in set(tokens):
                self.doc_freq[w] = self.doc_freq.get(w, 0) + 1

    def _fallback_retrieve(self, query, candidate_idx, top_k):
        q_tokens = self.set_q = set(self._tokenize(query))
        n_docs = len(self.texts)
        scores = []
        for idx in candidate_idx:
            tokens = self.doc_tokens[idx]
            if not tokens:
                scores.append((idx, 0.0))
                continue
            token_counts = {}
            for t in tokens:
                token_counts[t] = token_counts.get(t, 0) + 1
            
            score = 0.0
            for qt in q_tokens:
                if qt in token_counts:
                    tf = token_counts[qt] / len(tokens)
                    df = self.doc_freq.get(qt, 1)
                    idf = math.log((n_docs + 1) / (df + 1)) + 1
                    score += tf * idf
            scores.append((idx, score))

        ranked = sorted(scores, key=lambda x: x[1], reverse=True)[:top_k]
        results = []
        for idx, score in ranked:
            chunk = self.corpus[idx]
            results.append({
                "text": chunk["text"],
                "source": chunk["source"],
                "ticker": chunk["ticker"],
                "relevance": round(float(min(score * 2.5, 0.95)), 3),
            })
        return results

    def retrieve(self, query, ticker=None, top_k=2):
        """Return top_k chunks most relevant to query, optionally filtered by ticker."""
        candidate_idx = [i for i, c in enumerate(self.corpus)
                         if ticker is None or c["ticker"] == ticker]
        if not candidate_idx:
            return []

        if not _HAS_SKLEARN:
            return self._fallback_retrieve(query, candidate_idx, top_k)

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
