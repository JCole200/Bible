import React, { useEffect } from 'react';

/**
 * LexicalDetailSheet (v1.0)
 * A "Sacred Minimalist" bottom sheet for deep-dive lexical analysis.
 * Features: Lemma Header, Morphological Tagging, and Usage Frequency.
 */
const LexicalDetailSheet = ({ word, onClose, isVisible }) => {
    if (!word) return null;

    // Simulate "Haptic" feedback on launch if supported
    useEffect(() => {
        if (isVisible && window.navigator.vibrate) {
            window.navigator.vibrate(10);
        }
    }, [isVisible]);

    return (
        <div className={`lexical-sheet-overlay ${isVisible ? 'visible' : ''}`} onClick={onClose}>
            <div
                className={`lexical-sheet-container ${isVisible ? 'open' : ''}`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Drag Handle */}
                <div className="sheet-handle"></div>

                {/* Header: Lemma & Transliteration */}
                <div className="sheet-header">
                    <h2 className="sacred-lemma">{word.lemma}</h2>
                    <span className="sacred-translit">/{word.translit}/</span>
                </div>

                <div className="sheet-content">
                    {/* Definition */}
                    <div className="sacred-section">
                        <label>Strong's {word.strongs_id || 'G3056'}</label>
                        <p className="sacred-definition">{word.def || word.definition}</p>
                    </div>

                    {/* Morphology & Usage Row */}
                    <div className="sacred-meta-row">
                        <div className="sacred-meta-item">
                            <span className="label">Morphology</span>
                            <div className="morph-tag">{word.parsing || 'Aorist Active Indicative'}</div>
                        </div>
                        <div className="sacred-meta-item">
                            <span className="label">Frequency</span>
                            <div className="freq-count">
                                <strong>{word.occurrences || 0}</strong>
                                <span className="small"> occurrences</span>
                            </div>
                        </div>
                    </div>

                    {/* Detailed Etymology or Usage Hint */}
                    <div className="sacred-section extra-padding">
                        <label>Etymology</label>
                        <p className="sacred-etymology">{word.etymology || 'From its primitive root; properly to speak...'}</p>
                    </div>
                </div>

                {/* Close Button / Action */}
                <button className="sacred-close-btn" onClick={onClose}>
                    REVEAL TEXT
                </button>
            </div>
        </div>
    );
};

export default LexicalDetailSheet;
