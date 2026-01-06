import React from 'react';

const CrossReference = () => {
    const refs = [
        { source: 'John 1:1', target: 'Genesis 1:1', relationship: 'Pre-existent Word / Creation' },
        { source: 'John 1:1', target: '1 John 1:1', relationship: 'Word of Life' },
        { source: 'John 1:3', target: 'Colossians 1:16', relationship: 'Creation through Him' },
        { source: 'John 1:4', target: 'Psalm 36:9', relationship: 'Fountain of Life' }
    ];

    return (
        <div className="cross-ref-feature">
            <div className="pane-header">
                <span className="pane-icon">🔗</span>
                <h3>Semantic Cross-References</h3>
            </div>
            <div className="cross-ref-list">
                {refs.map((ref, i) => (
                    <div key={i} className="cross-ref-card">
                        <div className="ref-path">
                            <span className="ref-source">{ref.source}</span>
                            <span className="ref-arrow">→</span>
                            <span className="ref-target">{ref.target}</span>
                        </div>
                        <p className="ref-relation">{ref.relationship}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CrossReference;
