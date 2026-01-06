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

  return (
    <>
      <nav className="glass-panel" style={{
        position: 'sticky',
        top: '1rem',
        margin: '1rem auto',
        width: '95%',
        maxWidth: 'var(--max-width)',
        zIndex: 100,
        padding: '1rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img src={logo} alt="Premier Logo" style={{ height: '40px' }} />
          <h1 style={{ fontSize: '1.5rem', margin: 0, background: 'none', WebkitTextFillColor: 'initial', color: 'var(--text-color)' }}>
            Online Bible
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button className="secondary" onClick={toggleTheme} style={{ padding: '0.5rem', minWidth: 'auto' }} title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}>
              {theme === 'light' ? '🌙' : '☀'}
            </button>

            <select
              value={currentBook}
              onChange={(e) => { setCurrentBook(e.target.value); setCurrentChapter(1); }}
              style={{
                background: 'rgba(50,50,50,0.3)',
                color: 'var(--text-color)',
                border: '1px solid var(--glass-border)',
                padding: '0.5rem',
                borderRadius: '6px'
              }}
            >
              {BIBLE_BOOKS.map(book => (
                <option key={book} value={book}>{book}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button className="secondary" onClick={handlePrev} disabled={currentChapter <= 1} style={{ padding: '0.5rem 1rem' }}>←</button>
            <span style={{ minWidth: '3rem', textAlign: 'center', fontWeight: 'bold' }}>{currentChapter}</span>
            <button className="secondary" onClick={handleNext} style={{ padding: '0.5rem 1rem' }}>→</button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => setNotesOpen(true)} className="secondary">
            ✎ Notes
          </button>
          <DonateButton />
        </div>
      </nav>

      <main className="container">
        {chapterData && (
          <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
            <AudioPlayer textToRead={fullText} reference={chapterData.reference} />
          </div>
        )}

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
