import React, { useState } from 'react';

const LexicalSuite = () => {
    const [selectedWord, setSelectedWord] = useState(null);

    // Mock data for John 1:1
    const verseData = [
        { id: 1, english: 'In', greek: 'Ἐν', translit: 'En', strongs: 'G1722', parsing: 'Preposition', def: 'in, on, at, by, with' },
        { id: 2, english: 'the beginning', greek: 'ἀρχῇ', translit: 'archē', strongs: 'G746', parsing: 'Noun - Dative Singular Feminine', def: 'beginning, origin, first' },
        { id: 3, english: 'was', greek: 'ἦν', translit: 'ēn', strongs: 'G2258', parsing: 'Verb - Imperfect Indicative Active - 3rd Person Singular', def: 'was, existed' },
        { id: 4, english: 'the', greek: 'ὁ', translit: 'ho', strongs: 'G3588', parsing: 'Article - Nominative Masculine Singular', def: 'the' },
        { id: 5, english: 'Word', greek: 'Λόγος', translit: 'Logos', strongs: 'G3056', parsing: 'Noun - Nominative Masculine Singular', def: 'word, speech, divine reason' },
    ];

    return (
        <div className="feature-container lexical-suite">
            <div className="feature-header">
                <h2>Linguistic & Lexical Suite</h2>
                <p>Original language deep-dives with Strong's-mapped morphology.</p>
            </div>

            <div className="interlinear-container glass-panel">
                <div className="interlinear-row">
                    {verseData.map(word => (
                        <div
                            key={word.id}
                            className={`interlinear-block ${selectedWord?.id === word.id ? 'active' : ''}`}
                            onClick={() => setSelectedWord(word)}
                        >
                            <div className="greek-text">{word.greek}</div>
                            <div className="translit-text">{word.translit}</div>
                            <div className="english-text">{word.english}</div>
                            <div className="strongs-ref">{word.strongs}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="lexicon-details">
                {selectedWord ? (
                    <div className="word-panel glass-panel animate-slide-in">
                        <div className="word-header">
                            <div className="word-identity">
                                <h3>{selectedWord.greek} ({selectedWord.translit})</h3>
                                <span className="strongs-badge">{selectedWord.strongs}</span>
                            </div>
                            <div className="morphology-tag">{selectedWord.parsing}</div>
                        </div>

                        <div className="lexicon-section">
                            <label>Definition</label>
                            <p>{selectedWord.def}</p>
                        </div>

                        <div className="lexicon-section">
                            <label>Etymology & Nuance</label>
                            <p>
                                Derived from the root of <em>{selectedWord.translit}</em>,
                                this term implies more than just a spoken word;
                                it suggests the underlying concept, logic, or divine reason.
                            </p>
                        </div>

                        <button className="pro-btn-glow sm" onClick={() => alert("Loading full etymological map...")}>
                            View Semantic Field Map
                        </button>
                    </div>
                ) : (
                    <div className="empty-state">
                        <p>Select a word above to perform a lexical deep dive.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LexicalSuite;
