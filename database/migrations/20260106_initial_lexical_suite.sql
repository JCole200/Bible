-- migration: initial_lexical_suite
-- description: Professional-grade PostgreSQL schema for Biblical Lexical Suite

-- 1. Strong_Definitions table
CREATE TABLE strong_definitions (
    strongs_id VARCHAR(10) PRIMARY KEY, -- e.g., 'G3056', 'H7225'
    lemma VARCHAR(100) NOT NULL,
    transliteration VARCHAR(100),
    pronunciation VARCHAR(100),
    definition TEXT NOT NULL,
    morphology JSONB DEFAULT '{}', -- stores tense, voice, mood, person, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Verses table
CREATE TABLE verses (
    id SERIAL PRIMARY KEY,
    book VARCHAR(50) NOT NULL,
    chapter INTEGER NOT NULL,
    verse INTEGER NOT NULL,
    version VARCHAR(10) NOT NULL DEFAULT 'KJV',
    text TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    UNIQUE (book, chapter, verse, version)
);

-- 3. Lexicon_Map join-table
-- Links specific English words in a verse to their strongs_id
-- We use word_index to pinpoint the exact occurrence in the text
CREATE TABLE lexicon_map (
    id SERIAL PRIMARY KEY,
    verse_id INTEGER REFERENCES verses(id) ON DELETE CASCADE,
    strongs_id VARCHAR(10) REFERENCES strong_definitions(strongs_id),
    word_text VARCHAR(100) NOT NULL, -- The specific English word/phrase
    word_index INTEGER NOT NULL,    -- Position of the word in the verse text (0-based)
    morphology_override JSONB,      -- Verse-specific morphology if different from lexical base
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexing for performance
CREATE INDEX idx_verses_lookup ON verses(book, chapter, verse);
CREATE INDEX idx_lexicon_verse ON lexicon_map(verse_id);
CREATE INDEX idx_lexicon_strongs ON lexicon_map(strongs_id);
CREATE INDEX idx_strong_morph ON strong_definitions USING GIN (morphology);
