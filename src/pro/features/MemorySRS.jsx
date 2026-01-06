import React, { useState, useEffect } from 'react';

const MemorySRS = () => {
    const [view, setView] = useState('dashboard'); // dashboard, challenge, settings
    const [stats, setStats] = useState({
        mastered: 0,
        due: 0,
        streak: 0,
        xp: 0
    });

    // Sample verses for SRS demo
    const [deck, setDeck] = useState([
        { id: 1, ref: 'John 11:35', text: 'Jesus wept.', interval: 1, ease: 2.5, nextReview: Date.now() },
        { id: 2, ref: 'Psalm 23:1', text: 'The Lord is my shepherd; I shall not want.', interval: 1, ease: 2.5, nextReview: Date.now() + 86400000 },
        { id: 3, ref: 'Romans 8:28', text: 'And we know that for those who love God all things work together for good.', interval: 1, ease: 2.5, nextReview: Date.now() - 100 }
    ]);

    const [currentVerse, setCurrentVerse] = useState(null);
    const [userEntry, setUserEntry] = useState('');
    const [isRevealed, setIsRevealed] = useState(false);

    useEffect(() => {
        const dueCount = deck.filter(v => v.nextReview <= Date.now()).length;
        setStats(prev => ({ ...prev, due: dueCount }));
    }, [deck]);

    // SM-2 Algorithm Implementation
    const processReview = (quality) => {
        const nextDeck = deck.map(v => {
            if (v.id === currentVerse.id) {
                let n = v.interval;
                let ef = v.ease;

                if (quality >= 3) {
                    if (n === 0) n = 1;
                    else if (n === 1) n = 6;
                    else n = Math.round(n * ef);
                    ef = ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
                } else {
                    n = 1;
                    ef = Math.max(1.3, ef - 0.2);
                }

                return {
                    ...v,
                    interval: n,
                    ease: ef,
                    nextReview: Date.now() + (n * 86400000)
                };
            }
            return v;
        });

        setDeck(nextDeck);
        setStats(prev => ({ ...prev, xp: prev.xp + (quality * 10) }));
        setView('dashboard');
        setIsRevealed(false);
        setUserEntry('');
    };

    const startChallenge = () => {
        const due = deck.find(v => v.nextReview <= Date.now());
        if (due) {
            setCurrentVerse(due);
            setView('challenge');
        } else {
            alert("No verses due for review!");
        }
    };

    return (
        <div className="feature-container srs-system">
            <div className="feature-header">
                <h2>Cognitive Retention & SRS</h2>
                <p>Neural-linked memory cycles for scripture mastery.</p>
            </div>

            {view === 'dashboard' && (
                <div className="srs-dashboard">
                    <div className="stat-grid">
                        <div className="stat-card">
                            <span className="stat-value">{stats.due}</span>
                            <span className="stat-label">Due Today</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-value">{stats.xp}</span>
                            <span className="stat-label">Total XP</span>
                        </div>
                        <div className="stat-card highlight">
                            <span className="stat-value">🔥 {stats.streak}</span>
                            <span className="stat-label">Day Streak</span>
                        </div>
                    </div>

                    <div className="srs-actions">
                        <button className="pro-btn-glow" onClick={startChallenge}>
                            Start Mastery Session
                        </button>
                    </div>

                    <div className="deck-list">
                        <h3>Your Deck</h3>
                        {deck.map(v => (
                            <div key={v.id} className="deck-item">
                                <div className="deck-info">
                                    <strong>{v.ref}</strong>
                                    <span>Review in {Math.max(0, Math.ceil((v.nextReview - Date.now()) / 86400000))} days</span>
                                </div>
                                <div className="deck-progress">
                                    <div className="progress-dot" style={{ opacity: v.interval > 7 ? 1 : 0.3 }}></div>
                                    <div className="progress-dot" style={{ opacity: v.interval > 14 ? 1 : 0.3 }}></div>
                                    <div className="progress-dot" style={{ opacity: v.interval > 30 ? 1 : 0.3 }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {view === 'challenge' && currentVerse && (
                <div className="srs-challenge">
                    <div className="challenge-header">
                        <span className="challenge-ref">{currentVerse.ref}</span>
                        <div className="challenge-type">Recall Challenge</div>
                    </div>

                    <div className="challenge-content">
                        {!isRevealed ? (
                            <div className="input-area">
                                <textarea
                                    placeholder="Type the verse from memory..."
                                    value={userEntry}
                                    onChange={(e) => setUserEntry(e.target.value)}
                                />
                                <button className="secondary" onClick={() => setIsRevealed(true)}>
                                    Reveal Answer
                                </button>
                            </div>
                        ) : (
                            <div className="reveal-area">
                                <p className="correct-text">{currentVerse.text}</p>
                                <div className="your-text">
                                    <label>Your Attempt:</label>
                                    <p>{userEntry || "(No entry)"}</p>
                                </div>

                                <div className="quality-selector">
                                    <p>How well did you recall this?</p>
                                    <div className="button-group">
                                        <button onClick={() => processReview(0)} className="q0">Again</button>
                                        <button onClick={() => processReview(3)} className="q3">Hard</button>
                                        <button onClick={() => processReview(4)} className="q4">Good</button>
                                        <button onClick={() => processReview(5)} className="q5">Easy</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MemorySRS;
