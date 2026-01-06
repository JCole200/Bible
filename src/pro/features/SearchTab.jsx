import React, { useState } from 'react';
import { searchVerses } from '../../services/bibleApi';
import { BIBLE_BOOKS } from '../../constants';

const SearchTab = ({ onBookChange, onChapterChange }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [searching, setSearching] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query) return;

        setSearching(true);
        try {
            const data = await searchVerses(query);
            // Bolls API returns { results: [...], ... }
            setResults(data.results || []);
        } catch (error) {
            console.error("Search failed:", error);
            setResults([]);
        } finally {
            setSearching(false);
        }
    };

    const cleanText = (text) => {
        // Remove <mark> tags, Strong's numbers <S>...</S>, and other tags
        return text
            .replace(/<S>\d+<\/S>/g, '') // Remove Strong's
            .replace(/<[^>]+>/g, '')      // Remove HTML tags like <mark>
            .replace(/\s+/g, ' ')        // Normalize whitespace
            .trim();
    };

    const jumpToPassage = (bookId, chapter) => {
        const bookName = BIBLE_BOOKS[bookId - 1];
        if (bookName) {
            onBookChange(bookName);
            onChapterChange(chapter);
        }
    };

    return (
        <div className="search-pane">
            <div className="search-bar-container">
                <form onSubmit={handleSearch} className="search-form">
                    <input
                        type="text"
                        placeholder="Search for words (e.g. 'Grace', 'Faith')"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="search-input"
                    />
                    <button type="submit" className="search-submit-btn">🔍</button>
                </form>
            </div>

            <div className="search-results-area">
                {searching ? (
                    <div className="search-loading">
                        <div className="loader-ring"></div>
                        <p>Scanning 31,102 verses...</p>
                    </div>
                ) : results.length > 0 ? (
                    <div className="results-list">
                        <div className="results-count">{results.length} Occurrences found</div>
                        {results.map((res, i) => (
                            <div key={i} className="search-result-card animate-fade-in">
                                <div className="result-header">
                                    <span className="result-ref">
                                        {BIBLE_BOOKS[res.book - 1]} {res.chapter}:{res.verse}
                                    </span>
                                    <button
                                        className="jump-to-btn"
                                        onClick={() => jumpToPassage(res.book, res.chapter)}
                                    >
                                        Jump to Page →
                                    </button>
                                </div>
                                <p className="result-text">{cleanText(res.text)}</p>
                            </div>
                        ))}
                    </div>
                ) : query && !searching ? (
                    <div className="no-results">
                        <p>No results found for "{query}"</p>
                    </div>
                ) : (
                    <div className="search-placeholder">
                        <div className="placeholder-icon">🔍</div>
                        <h3>Bible Search</h3>
                        <p>Search across the entire Old and New Testaments instantly.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchTab;
