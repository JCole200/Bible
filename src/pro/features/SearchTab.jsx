import React, { useState } from 'react';
import { searchVerses } from '../../services/bibleApi';

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
            // bible-api.com returns { verses: [...] } 
            setResults(data.verses || []);
        } catch (error) {
            console.error("Search failed:", error);
            setResults([]);
        } finally {
            setSearching(false);
        }
    };

    const jumpToPassage = (ref) => {
        // Simple regex to extract Book and Chapter 
        // e.g. "John 3:16" or "1 John 1:1"
        const match = ref.match(/^(.+?)\s(\d+):/);
        if (match) {
            const book = match[1];
            const chapter = parseInt(match[2]);
            onBookChange(book);
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
                                    <span className="result-ref">{res.book_name} {res.chapter}:{res.verse}</span>
                                    <button
                                        className="jump-to-btn"
                                        onClick={() => jumpToPassage(`${res.book_name} ${res.chapter}:${res.verse}`)}
                                    >
                                        Jump to Page →
                                    </button>
                                </div>
                                <p className="result-text">{res.text}</p>
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
