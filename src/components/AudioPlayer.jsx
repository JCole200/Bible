import React, { useState, useEffect, useRef } from 'react';

const AudioPlayer = ({ textToRead, reference }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [voices, setVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState(null);
    const synth = window.speechSynthesis;
    const utteranceRef = useRef(null);

    useEffect(() => {
        // Load voices
        // Load voices
        const loadVoices = () => {
            // Create a shallow copy to be safe
            let availableVoices = [...synth.getVoices()];

            // Sort to prioritizing "Google" or "premium" voices if available
            availableVoices.sort((a, b) => {
                const aName = a.name.toLowerCase();
                const bName = b.name.toLowerCase();
                // Custom ranking for better voices
                const isGoogle = (name) => name.includes('google');
                const isPremium = (name) => name.includes('premium') || name.includes('enhanced');

                if (isGoogle(aName) && !isGoogle(bName)) return -1;
                if (isGoogle(bName) && !isGoogle(aName)) return 1;
                if (isPremium(aName) && !isPremium(bName)) return -1;
                if (isPremium(bName) && !isPremium(aName)) return 1;

                return aName.localeCompare(bName);
            });

            // Filter to only the top 2 voices
            // First try English, if that results in empty, take top 2 of all
            let topVoices = availableVoices.filter(v => v.lang.startsWith('en'));
            if (topVoices.length === 0) topVoices = availableVoices;

            topVoices = topVoices.slice(0, 2);

            setVoices(topVoices);

            // Default to the first voice if none selected or current selection is not in list
            if (!selectedVoice || !topVoices.find(v => v.name === selectedVoice.name)) {
                if (topVoices.length > 0) {
                    setSelectedVoice(topVoices[0]);
                }
            }
        };

        loadVoices();

        // Chrome triggers this event when voices are ready
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = loadVoices;
        }
    }, []);

    useEffect(() => {
        // Cancel any ongoing speech when component unmounts or text changes
        return () => {
            synth.cancel();
        };
    }, [textToRead]);

    useEffect(() => {
        if (textToRead) {
            // Create a new utterance with optimized "realistic" settings
            const utterance = new SpeechSynthesisUtterance(textToRead);
            utterance.rate = 0.95; // Slightly faster than 0.9 for better flow
            utterance.pitch = 1.0;

            if (selectedVoice) {
                utterance.voice = selectedVoice;
            }

            utterance.onend = () => {
                setIsPlaying(false);
                setIsPaused(false);
            };

            utteranceRef.current = utterance;
        }
    }, [textToRead, selectedVoice]);

    const handlePlay = () => {
        if (isPaused) {
            synth.resume();
            setIsPaused(false);
            setIsPlaying(true);
        } else {
            synth.cancel(); // effective reset
            if (utteranceRef.current) {
                // Re-assign voice in case it changed
                if (selectedVoice) utteranceRef.current.voice = selectedVoice;
                synth.speak(utteranceRef.current);
                setIsPlaying(true);
            }
        }
    };

    const handlePause = () => {
        synth.pause();
        setIsPlaying(false);
        setIsPaused(true);
    };

    const handleStop = () => {
        synth.cancel();
        setIsPlaying(false);
        setIsPaused(false);
    };

    return (
        <div className="glass-panel" style={{
            padding: '1rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '1rem',
            width: 'fit-content',
            maxWidth: '100%'
        }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>Audio Bible</span>

                {voices.length > 0 && (
                    <select
                        value={selectedVoice ? selectedVoice.name : ''}
                        onChange={(e) => {
                            const voice = voices.find(v => v.name === e.target.value);
                            setSelectedVoice(voice);
                            // Stop current if playing to avoid mixed voices
                            if (isPlaying) {
                                synth.cancel();
                                setIsPlaying(false);
                                setIsPaused(false);
                            }
                        }}
                        style={{
                            background: 'rgba(50, 50, 50, 0.5)',
                            border: '1px solid var(--glass-border)',
                            color: 'var(--text-color)',
                            borderRadius: '6px',
                            padding: '0.25rem 0.5rem',
                            fontSize: '0.8rem',
                            maxWidth: 'auto'
                        }}
                    >
                        {voices
                            .slice(0, 2)
                            .map(v => (
                                <option key={v.name} value={v.name}>
                                    {v.name.replace('Google', '').replace('English', '').replace('United States', '').trim()}
                                    {v.name.toLowerCase().includes('female') ? ' (F)' : ''}
                                    {v.name.toLowerCase().includes('male') ? ' (M)' : ''}
                                </option>
                            ))}
                    </select>
                )}
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
                {!isPlaying && !isPaused ? (
                    <button onClick={handlePlay} title="Play">
                        ▶ Listen
                    </button>
                ) : isPlaying ? (
                    <button onClick={handlePause} title="Pause" className="secondary">
                        ⏸ Pause
                    </button>
                ) : (
                    <button onClick={handlePlay} title="Resume">
                        ▶ Resume
                    </button>
                )}

                {(isPlaying || isPaused) && (
                    <button onClick={handleStop} title="Stop" className="secondary">
                        ⏹ Stop
                    </button>
                )}
            </div>
        </div>
    );
};

export default AudioPlayer;
