import React, { useState, useEffect } from 'react';
import './TransformPro.css';
import AIResearch from './features/AIResearch';
import TimeTraveler from './features/TimeTraveler';
import LexicalSuite from './features/LexicalSuite';
import CinematicAudio from './features/CinematicAudio';
import MemorySRS from './features/MemorySRS';

const TransformPro = ({ onBack }) => {
    const [activeTab, setActiveTab] = useState('research');

    const features = [
        { id: 'research', icon: '🤖', name: 'AI Research', desc: 'Theological RAG Engine' },
        { id: 'traveler', icon: '🏛️', name: 'Time Traveler', desc: '3D Contextual GIS Layer' },
        { id: 'lexical', icon: '📜', name: 'Lexicon', desc: 'Deep-Dive Greek/Hebrew' },
        { id: 'audio', icon: '🎭', name: 'Cinematic', desc: 'Dramatized Soundscapes' },
        { id: 'retention', icon: '🧠', name: 'Retention', desc: 'Spaced Repetition SRS' },
    ];

    return (
        <div className="pro-container">
            <header className="pro-header glass-panel">
                <div className="pro-branding">
                    <div className="pro-badge">PRO</div>
                    <h1>Transform</h1>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={onBack} className="secondary back-btn">
                        ← Back to Free
                    </button>
                </div>
            </header>

            <div className="pro-layout">
                <aside className="pro-sidebar glass-panel">
                    {features.map(f => (
                        <button
                            key={f.id}
                            className={`feature-tab ${activeTab === f.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(f.id)}
                        >
                            <span className="feature-icon">{f.icon}</span>
                            <div className="feature-info">
                                <span className="feature-name">{f.name}</span>
                                <span className="feature-desc">{f.desc}</span>
                            </div>
                        </button>
                    ))}
                </aside>

                <main className="pro-content glass-panel">
                    {activeTab === 'research' && <AIResearch />}
                    {activeTab === 'traveler' && <TimeTraveler />}
                    {activeTab === 'lexical' && <LexicalSuite />}
                    {activeTab === 'audio' && <CinematicAudio />}
                    {activeTab === 'retention' && <MemorySRS />}
                </main>
            </div>
        </div>
    );
};

export default TransformPro;
