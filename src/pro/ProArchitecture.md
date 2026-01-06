# Transform Pro Architecture & Technical Roadmap

## 1. AI Theological Research Engine (RAG)
**Logic Flow:**
1.  **Ingestion:** Scrape and tokenize public domain commentaries (Henry, Spurgeon, etc.).
2.  **Embedding:** Generate vector embeddings using OpenAI `text-embedding-3-small` or local HuggingFace models.
3.  **Storage:** Upsert vectors into **Pinecone** or **Supabase Vector**.
4.  **Retrieval:** On user query, fetch top $k$ relevant chunks using cosine similarity.
5.  **Generation:** Pass chunks + query to GPT-4o with a system prompt enforcing citation and "no-hallucination" rules.

**API Structure:**
```typescript
POST /api/pro/research
Body: {
  query: string,
  context_reference: string // e.g., "John 3:16"
}
Response: {
  answer: string,
  citations: Array<{ text: string, source: string, year: number }>,
  related_cross_references: string[]
}
```

## 2. The "Time Traveler" Contextual Layer
**Logic Flow:**
1.  **Reference Mapping:** Map Bible verses to latitude/longitude coordinates.
2.  **GIS Integration:** Utilize **Mapbox GL JS** for custom terrain and overlay rendering.
3.  **3D Rendering:** Use **Three.js** or **React Three Fiber** to render GLB models of archaeological reconstructions (e.g., Herod's Temple).
4.  **Synchronization:** Listen to window scroll events to trigger map transitions based on the verse currently in the viewport.

**API Structure:**
```typescript
GET /api/pro/locations?ref=Matthew+4
Response: {
  coordinates: { lat: number, lng: number },
  ancient_name: string,
  modern_name: string,
  assets: {
    model_3d: string, // URL to .glb
    historical_summary: string
  }
}
```

## 3. Linguistic & Lexical Suite (Interlinear)
**Logic Flow:**
1.  **Strong's Integration:** Use a JSON-mapped Strong's Concordance.
2.  **Parsing:** Tokenize the translation and match Greek/Hebrew lemmas using a lookup table.
3.  **Deep Dive UI:** A side-panel modal that displays etymology, frequency of use, and tense-specific nuances (Aorist vs. Perfect).

**API Structure:**
```typescript
GET /api/pro/lexicon?word_id=G2424
Response: {
  lemma: string,
  transliteration: string,
  definition: string,
  strongs_id: string,
  tenses: { form: string, explanation: string },
  occurrences_count: number
}
```

## 4. Cinematic Audio Soundscapes
**Logic Flow:**
1.  **Multi-track Mixer:** Use **Web Audio API** or **Tone.js** to manage multiple audio nodes.
2.  **Procedural Generation:** Loop high-quality environmental sounds (rain, wind, market noise) at varying volumes.
3.  **Syncing:** Coordinate the "Narrator" track with "Ambient" tracks based on the genre of the book (Poetry vs. History).

**Audio Specs:**
- **Narrator Track:** 128kbps Mono MP3.
- **Ambient Tracks:** 64kbps Stereo OGG (looped).

## 5. Cognitive Retention & SRS System
**Logic Flow:**
1.  **SM-2 Algorithm:** Implement the Spaced Repetition algorithm to calculate the next review interval ($I$).
2.  **User Progress Tracking:** Store "Card" states in **indexedDB** for offline access and sync to a central DB.
3.  **Gamification:** Incremental XP for correct recalls, daily streaks, and leaderboard integration.

**API Structure:**
```typescript
POST /api/pro/srs/review
Body: {
  verse_id: string,
  recall_quality: 0 | 1 | 2 | 3 | 4 | 5
}
Response: {
  next_review_date: string,
  current_streak: number,
  earned_xp: number
}
```

---

## Technical Roadmap
- **Phase 1 (Week 1-2):** Infrastructure setup. Pinecone integration for RAG and GIS mapping.
- **Phase 2 (Week 3-4):** Linguistic Suite. Mapping English text to Strong's IDs.
- **Phase 3 (Week 5-6):** Soundscape engine and 3D Archaeological Layer.
- **Phase 4 (Week 7-8):** Gamification and SRS Dashboard.
- **Phase 5 (Week 9):** Performance optimization and final UI polish.
