import React, { useState, useEffect } from 'react';
import { getChapter } from './services/bibleApi';
import { BIBLE_BOOKS } from './constants';
import BibleReader from './components/BibleReader';
import AudioPlayer from './components/AudioPlayer';
import NotesPanel from './components/NotesPanel';
import DonateButton from './components/DonateButton';
import logo from './assets/logo.png';

function App() {
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

  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    document.body.className = theme === 'light' ? 'light-mode' : '';
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const fullText = chapterData
    ? chapterData.verses.map(v => v.text).join(' ')
    : '';

  return (
    <>
      <nav className="glass-panel main-nav">
        <div className="nav-top">
          <div className="branding">
            <img src={logo} alt="Premier Logo" className="logo" />
            <h1 className="site-title">Online Bible</h1>
          </div>

          <div className="header-actions">
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
