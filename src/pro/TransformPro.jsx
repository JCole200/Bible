import React, { useState } from 'react';
import './TransformPro.css';

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
                <button onClick={onBack} className="secondary back-btn">
                    ← Back to Free
                </button>
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
                    {activeTab === 'research' && (
                        <div className="feature-placeholder">
                            <h2>AI Theological Research Engine</h2>
                            <p>Architecting RAG integration with historical commentaries...</p>
                            <div className="ai-chat-mockup">
                                <div className="ai-bubble">How does Spurgeon interpret the "Living Water" in John 4?</div>
                                <div className="ai-response">
                                    Spurgeon views the "Living Water" as the refreshing, eternal influence of the Holy Spirit...
                                    <cite>[Spurgeon, Metropolitan Tabernacle Pulpit, Vol 14]</cite>
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab !== 'research' && (
                        <div className="feature-placeholder">
                            <h2>{features.find(f => f.id === activeTab).name}</h2>
                            <p>Feature under development according to architected roadmap.</p>
                            <div className="loading-bar"><div className="progress"></div></div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default TransformPro;
