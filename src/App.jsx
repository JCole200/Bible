import React, { useState, useEffect } from 'react';
import { getChapter } from './services/bibleApi';
import { BIBLE_BOOKS } from './constants';
import BibleReader from './components/BibleReader';
import AudioPlayer from './components/AudioPlayer';
import NotesPanel from './components/NotesPanel';
import DonateButton from './components/DonateButton';
import logo from './assets/logo.png';
import TransformPro from './pro/TransformPro';

function App() {
  const [isPro, setIsPro] = useState(false);
  const [currentBook, setCurrentBook] = useState('John');
  const [currentChapter, setCurrentChapter] = useState(1);
  const [chapterData, setChapterData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);

  useEffect(() => {
    fetchChapter();
  }, [currentBook, currentChapter]);

  const fetchChapter = async () => {
    setLoading(true);
    try {
      const data = await getChapter(currentBook, currentChapter);
      setChapterData(data);
    } catch (error) {
      console.error(error);
      // Handle error gracefully in UI ideally
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setCurrentChapter(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentChapter > 1) {
      setCurrentChapter(prev => prev - 1);
    }
  };

  // Theme Management
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    document.body.className = theme === 'light' ? 'light-mode' : '';
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Construct text for audio player
  const fullText = chapterData
    ? chapterData.verses.map(v => v.text).join(' ')
    : '';

  if (isPro) {
    return <TransformPro onBack={() => setIsPro(false)} />;
  }

  return (
    <>
      <nav className="glass-panel main-nav">
        <div className="nav-top">
          <div className="branding">
            <img src={logo} alt="Premier Logo" className="logo" />
            <h1 className="site-title">Online Bible</h1>
          </div>

          <div className="header-actions">
            <button
              className="pro-action-btn"
              onClick={() => setIsPro(true)}
              style={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: 'white',
                border: 'none',
                padding: '0.4rem 0.8rem',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)'
              }}
            >
              ✨ Transform Pro
            </button>
            <button className="secondary theme-toggle" onClick={toggleTheme} title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}>
              {theme === 'light' ? '🌙' : '☀'}
            </button>
            <button onClick={() => setNotesOpen(true)} className="secondary notes-btn">
              ✎ <span className="hide-mobile">Notes</span>
            </button>
            <DonateButton compact={true} />
          </div>
        </div>

        <div className="nav-bottom">
          <div className="nav-group">
            <select
              value={currentBook}
              onChange={(e) => { setCurrentBook(e.target.value); setCurrentChapter(1); }}
              className="book-select"
            >
              {BIBLE_BOOKS.map(book => (
                <option key={book} value={book}>{book}</option>
              ))}
            </select>

            <div className="chapter-nav">
              <button className="secondary nav-btn" onClick={handlePrev} disabled={currentChapter <= 1}>←</button>
              <span className="chapter-num">{currentChapter}</span>
              <button className="secondary nav-btn" onClick={handleNext}>→</button>
            </div>
          </div>

          <div className="audio-area">
            {chapterData && (
              <AudioPlayer textToRead={fullText} reference={chapterData.reference} compact={true} />
            )}
          </div>
        </div>
      </nav>

      <main className="container">
        <BibleReader chapterData={chapterData} loading={loading} />
      </main>

      <NotesPanel
        reference={chapterData?.reference}
        isOpen={notesOpen}
        onClose={() => setNotesOpen(false)}
      />
    </>
  );
}

export default App;
