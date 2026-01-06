import React, { useState, useEffect } from 'react';
import './TransformPro.css';
import AIResearch from './features/AIResearch';
import TimeTraveler from './features/TimeTraveler';
import LexicalSuite from './features/LexicalSuite';
import CinematicAudio from './features/CinematicAudio';
import MemorySRS from './features/MemorySRS';
import BibleReader from '../components/BibleReader';
import AudioPlayer from '../components/AudioPlayer';

const TransformPro = ({
    onBack,
    chapterData,
    currentBook,
    currentChapter,
    loading,
    onBookChange,
    onChapterChange,
    onNext,
    onPrev,
    fullText,
    BIBLE_BOOKS
}) => {
    const [activeTab, setActiveTab] = useState('research');
    const [showScripture, setShowScripture] = useState(true);

    const features = [
        { id: 'research', icon: '🤖', name: 'AI Research', desc: 'Theological RAG Engine' },
        { id: 'traveler', icon: '🏛️', name: 'Time Traveler', desc: '3D Contextual GIS Layer' },
        { id: 'lexical', icon: '📜', name: 'Lexicon', desc: 'Deep-Dive Greek/Hebrew' },
        { id: 'audio', icon: '🎭', name: 'Cinematic', desc: 'Dramatized Soundscapes' },
        { id: 'retention', icon: '🧠', name: 'Retention', desc: 'Spaced Repetition SRS' },
    ];

    return (
        <div className={`pro-container ${showScripture ? 'scripture-open' : ''}`}>
            <header className="pro-header glass-panel">
                <div className="pro-branding">
                    <div className="pro-badge">PRO</div>
                    <h1>Transform</h1>
                </div>

                <div className="pro-nav-controls">
                    <div className="pro-bible-nav glass-panel">
                        <select
                            value={currentBook}
                            onChange={(e) => onBookChange(e.target.value)}
                            className="pro-select"
                        >
                            {BIBLE_BOOKS.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                        <div className="pro-chapter-nav">
                            <button onClick={onPrev} disabled={currentChapter <= 1}>←</button>
                            <span className="pro-chapter-val">{currentChapter}</span>
                            <button onClick={onNext}>→</button>
                        </div>
                    </div>

                    <div className="pro-header-actions">
                        <button
                            className={`pro-utility-btn ${showScripture ? 'active' : ''}`}
                            onClick={() => setShowScripture(!showScripture)}
                            title="Toggle Scripture Sidebar"
                        >
                            📖 <span className="hide-mobile">Scripture</span>
                        </button>
                        <button onClick={onBack} className="secondary back-btn">
                            ← Back
                        </button>
                    </div>
                </div>
            </header>

            <div className="pro-layout-v2">
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

                    <div className="pro-sidebar-footer">
                        {chapterData && (
                            <AudioPlayer textToRead={fullText} reference={chapterData.reference} compact={true} />
                        )}
                    </div>
                </aside>

                <div className="pro-main-view">
                    <main className="pro-content glass-panel">
                        {activeTab === 'research' && <AIResearch />}
                        {activeTab === 'traveler' && <TimeTraveler />}
                        {activeTab === 'lexical' && <LexicalSuite />}
                        {activeTab === 'audio' && <CinematicAudio />}
                        {activeTab === 'retention' && <MemorySRS />}
                    </main>

                    {showScripture && (
                        <aside className="pro-scripture-sidebar animate-slide-left">
                            <BibleReader chapterData={chapterData} loading={loading} />
                        </aside>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TransformPro;
