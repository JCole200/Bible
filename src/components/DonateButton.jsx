import React from 'react';

const DonateButton = () => {
    return (
        <button
            onClick={() => window.open('https://example.com/donate', '_blank')}
            style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
                fontWeight: 'bold',
                marginLeft: 'auto'
            }}
        >
            ❤ Donate
        </button>
    );
};

export default DonateButton;
