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
        const loadVoices = () => {
            // Create a shallow copy to be safe
            let availableVoices = [...synth.getVoices()];

            // Filter for UK English
            let ukVoices = availableVoices.filter(v => v.lang === 'en-GB' || v.lang.includes('GB'));

            // If no UK voices, fallback to general English but warn/try best
            if (ukVoices.length === 0) {
                ukVoices = availableVoices.filter(v => v.lang.startsWith('en'));
            }

            // Try to find specifically one Male and one Female if possible
            // Common names for UK voices: 
            // Male: Daniel (Mac), Google UK English Male
            // Female: Kate, Serena, Stephanie (Mac), Google UK English Female

            let maleVoice = ukVoices.find(v =>
                v.name.includes('Male') ||
                v.name.includes('Daniel') ||
                v.name.includes('Arthur')
            );

            let femaleVoice = ukVoices.find(v =>
                v.name.includes('Female') ||
                v.name.includes('Kate') ||
                v.name.includes('Serena') ||
                v.name.includes('Stephanie') ||
                v.name.includes('Martha')
            );

            // If we couldn't find specific genders, just take the top 2 sorted by "premium"
            if (!maleVoice || !femaleVoice) {
                ukVoices.sort((a, b) => {
                    const isPremium = (name) => name.toLowerCase().includes('premium') || name.toLowerCase().includes('enhanced');
                    if (isPremium(a.name) && !isPremium(b.name)) return -1;
                    if (isPremium(b.name) && !isPremium(a.name)) return 1;
                    return 0;
                });

                const top2 = ukVoices.slice(0, 2);
                if (!maleVoice && top2[0]) maleVoice = top2[0];
                if (!femaleVoice && top2[1]) femaleVoice = top2[1];
            }

            // Construct the list of 2 voices
            const finalVoices = [];
            if (maleVoice) finalVoices.push(maleVoice);

            // Only add female if it's different logic or distinct object 
            if (femaleVoice && (!maleVoice || femaleVoice.name !== maleVoice.name)) {
                finalVoices.push(femaleVoice);
            }

            // FALLBACK FOR MOBILE: If "strict" UK filtering failed (common on iOS/Android where list is small)
            // Just take whatever English voices we have.
            if (finalVoices.length === 0) {
                const fallbackVoices = availableVoices.filter(v => v.lang.startsWith('en')).slice(0, 2);
                setVoices(fallbackVoices);
                if (fallbackVoices.length > 0 && !selectedVoice) {
                    setSelectedVoice(fallbackVoices[0]);
                }
            } else {
                setVoices(finalVoices);

                // Default to the first voice
                if (finalVoices.length > 0) {
                    if (!selectedVoice || !finalVoices.find(v => v.name === selectedVoice.name)) {
                        setSelectedVoice(finalVoices[0]);
                    }
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

    const getVoiceLabel = (voice) => {
        // Intelligent labeling
        if (voice.name.includes('Male') || voice.name.includes('Daniel') || voice.name.includes('Arthur')) {
            return "Male (UK)";
        }
        if (voice.name.includes('Female') || voice.name.includes('Kate') || voice.name.includes('Serena') || voice.name.includes('Stephanie')) {
            return "Female (UK)";
        }
        return voice.name.replace('Google', '').replace('English', '').replace('United Kingdom', '').replace('(Great Britain)', '').trim();
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
                        {voices.map(v => (
                            <option key={v.name} value={v.name}>
                                {getVoiceLabel(v)}
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
