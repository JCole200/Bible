import React from 'react';

const BibleReader = ({ chapterData, loading }) => {
    if (loading) {
        return (
            <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', minHeight: '50vh' }}>
                <p style={{ opacity: 0.7 }}>Loading scripture...</p>
            </div>
        );
    }

    if (!chapterData) {
        return (
            <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', minHeight: '50vh' }}>
                <p>Select a book and chapter to begin reading.</p>
            </div>
        );
    }

    return (
        <div className="glass-panel" style={{ padding: '3rem', marginBottom: '2rem' }}>
            <header style={{ marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
                <h2>{chapterData.reference}</h2>
            </header>

            <div className="bible-text">
                {chapterData.verses.map((verse) => (
                    <span key={verse.verse} id={`v${verse.verse}`}>
                        <span className="verse-num">{verse.verse}</span>
                        {verse.text}
                    </span>
                ))}
            </div>

            <div style={{ marginTop: '2rem', fontSize: '0.9rem', opacity: 0.5, fontStyle: 'italic' }}>
                {chapterData.translation_note}
            </div>
        </div>
    );
};

export default BibleReader;
