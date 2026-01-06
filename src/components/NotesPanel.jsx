import React, { useState, useEffect } from 'react';

const NotesPanel = ({ reference, isOpen, onClose }) => {
    const [note, setNote] = useState('');

    // Load note for this reference
    useEffect(() => {
        const savedNote = localStorage.getItem(`bible-note-${reference}`);
        setNote(savedNote || '');
    }, [reference]);

    const handleSave = () => {
        if (reference) {
            localStorage.setItem(`bible-note-${reference}`, note);
            // Optional: Show a subtle toast or feedback
        }
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            right: 0,
            height: '100vh',
            width: '350px',
            background: 'rgba(22, 27, 34, 0.95)',
            backdropFilter: 'blur(16px)',
            borderLeft: '1px solid var(--glass-border)',
            padding: '2rem',
            boxSizing: 'border-box',
            transform: 'translateX(0)',
            transition: 'transform 0.3s ease',
            zIndex: 1000,
            boxShadow: '-4px 0 20px rgba(0,0,0,0.5)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h3>Notes for {reference}</h3>
                <button onClick={onClose} className="secondary" style={{ padding: '0.5rem' }}>✕</button>
            </div>

            <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                onBlur={handleSave} // Auto-save on blur
                placeholder="Record your reflections here..."
                style={{
                    width: '100%',
                    height: '70vh',
                    background: 'rgba(0,0,0,0.2)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '8px',
                    padding: '1rem',
                    color: 'var(--text-color)',
                    fontFamily: 'var(--font-main)',
                    fontSize: '1rem',
                    resize: 'none',
                    outline: 'none'
                }}
            />
            <p style={{ fontSize: '0.8rem', opacity: 0.6, marginTop: '1rem' }}>
                Notes are automatically saved to your device.
            </p>
        </div>
    );
};

export default NotesPanel;
