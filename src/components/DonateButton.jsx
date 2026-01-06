import React from 'react';

const DonateButton = ({ compact }) => {
    return (
        <button
            onClick={() => window.open('https://example.com/donate', '_blank')}
            className={`donate-btn ${compact ? 'compact' : ''}`}
            style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
                fontWeight: 'bold'
            }}
        >
            ❤ {compact ? '' : 'Donate'}
        </button>
    );
};

export default DonateButton;
