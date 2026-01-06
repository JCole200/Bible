import React, { useState } from 'react';
import './TransformPro.css';
import AIResearch from './features/AIResearch';
import TimeTraveler from './features/TimeTraveler';
import LexicalSuite from './features/LexicalSuite';
import CinematicAudio from './features/CinematicAudio';
import MemorySRS from './features/MemorySRS';
import BibleReader from '../components/BibleReader';
import logo from '../assets/logo.png';

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

    const features = [
        { id: 'research', icon: '✨', name: 'AI' },
        { id: 'audio', icon: '🎧', name: 'Audio' },
        { id: 'traveler', icon: '🌐', name: 'Resources' },
        { id: 'lexical', icon: '📜', name: 'Lexicon' },
        { id: 'retention', icon: '🧠', name: 'Retention' },
        { id: 'notes', icon: '📝', name: 'Notes' },
        { id: 'cross', icon: '🔗', name: 'Cross' },
        { id: 'search', icon: '🔍', name: 'Search' },
    ];

    return (
        <div className="pro-container">
            {/* Global Top Header */}
            <header className="pro-header">
                <div className="pro-branding">
                    <img src={logo} alt="Premier" style={{ height: '32px' }} />
                    <h1>Online Bible</h1>
                </div>

                <div className="pro-top-actions">
                    <button className="theme-toggle-minimal">🌙</button>
                    <button className="pro-donate-btn">
                        💙 Donate
                    </button>
                    <div className="pro-user-avatar">JC</div>
                </div>
            </header>

            {/* Secondary Utility Nav */}
            <nav className="pro-sec-nav">
                <div className="pro-selectors">
                    <select
                        value={currentBook}
                        onChange={(e) => onBookChange(e.target.value)}
                        className="pro-dropdown"
                    >
                        {BIBLE_BOOKS.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>

                    <select
                        value={currentChapter}
                        onChange={(e) => onChapterChange(Number(e.target.value))}
                        className="pro-dropdown"
                    >
                        <option>Chapter {currentChapter}</option>
                    </select>

                    <select className="pro-dropdown">
                        <option>WEB</option>
                        <option>KJV</option>
                        <option>ESV</option>
                    </select>
                </div>

                <div className="pro-feature-tabs">
                    {features.map(f => (
                        <button
                            key={f.id}
                            className={`feature-tab-btn ${activeTab === f.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(f.id)}
                        >
                            <i>{f.icon}</i>
                            <span>{f.name}</span>
                        </button>
                    ))}
                </div>
            </nav>

            {/* Main Application Area */}
            <div className="pro-main-content">
                {/* Scripture Panel (Left) */}
                <section className="pro-scripture-area">
                    <button className="nav-arrow left" onClick={onPrev}>‹</button>
                    <div className="scripture-viewport">
                        <BibleReader chapterData={chapterData} loading={loading} />
                    </div>
                    <button className="nav-arrow right" onClick={onNext}>›</button>
                </section>

                {/* Feature Panel (Right) */}
                <aside className="pro-feature-pane">
                    <div className="pane-header">
                        {activeTab === 'research' && (
                            <>
                                <span className="pane-icon">✨</span>
                                <h3>AI Study Assistant</h3>
                            </>
                        )}
                        {activeTab === 'lexical' && <h3>Lexical Suite</h3>}
                        {/* Add more headers per tab if needed */}
                    </div>

                    <div className="pane-content">
                        {activeTab === 'research' && <AIResearch />}
                        {activeTab === 'traveler' && <TimeTraveler />}
                        {activeTab === 'lexical' && <LexicalSuite />}
                        {activeTab === 'audio' && <CinematicAudio />}
                        {activeTab === 'retention' && <MemorySRS />}
                    </div>
                </aside>
            </div>

            <button
                onClick={onBack}
                style={{ position: 'fixed', bottom: '20px', left: '20px', padding: '0.5rem 1rem', borderRadius: '8px', zIndex: 1000, opacity: 0.5 }}
            >
                Return to Free
            </button>
        </div>
    );
};

export default TransformPro;
