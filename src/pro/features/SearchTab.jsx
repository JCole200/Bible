import React, { useState } from 'react';

const SearchTab = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [searching, setSearching] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query) return;

        setSearching(true);
        // Simulation of a deep-index search
        setTimeout(() => {
            const mockResults = [
                { reference: 'John 1:1', text: 'In the beginning was the Word, and the Word was with God, and the Word was God.' },
                { reference: 'Genesis 1:1', text: 'In the beginning God created the heaven and the earth.' },
                { reference: 'Psalm 119:105', text: 'Thy word is a lamp unto my feet, and a light unto my path.' },
                { reference: 'Matthew 4:4', text: 'But he answered and said, It is written, Man shall not live by bread alone, but by every word that proceedeth out of the mouth of God.' }
            ].filter(r => r.text.toLowerCase().includes(query.toLowerCase()) || r.reference.toLowerCase().includes(query.toLowerCase()));

            setResults(mockResults);
            setSearching(false);
        }, 800);
    };

    return (
        <div className="search-pane">
            <div className="search-bar-container">
                <form onSubmit={handleSearch} className="search-form">
                    <input
                        type="text"
                        placeholder="Search for words or verses (e.g. 'Grace', 'John 3:16')"
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
                                    <span className="result-ref">{res.reference}</span>
                                    <button className="jump-to-btn">Read Passage →</button>
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
