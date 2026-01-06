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
            let availableVoices = [...synth.getVoices()];

            // Filter for UK English
            let ukVoices = availableVoices.filter(v => v.lang.startsWith('en-GB') || v.lang.includes('GB'));

            // If no UK voices, fallback to general English (US/AU/etc)
            if (ukVoices.length === 0) {
                ukVoices = availableVoices.filter(v => v.lang.startsWith('en'));
            }

            // If still nothing, just use all available
            if (ukVoices.length === 0) {
                ukVoices = availableVoices;
            }

            // Heuristic for "Human/Realistic" quality
            const getQualityScore = (voice) => {
                const name = voice.name.toLowerCase();
                if (name.includes('natural')) return 100;
                if (name.includes('premium')) return 90;
                if (name.includes('enhanced')) return 80;
                if (name.includes('google')) return 70;
                if (name.includes('daniel') || name.includes('serena') || name.includes('kate')) return 60;
                return 0;
            };

            // Find best Male
            const maleCandidates = ukVoices.filter(v =>
                v.name.toLowerCase().includes('male') ||
                v.name.toLowerCase().includes('daniel') ||
                v.name.toLowerCase().includes('arthur') ||
                v.name.toLowerCase().includes('oliver')
            ).sort((a, b) => getQualityScore(b) - getQualityScore(a));

            const maleVoice = maleCandidates[0];

            // Find best Female
            const femaleCandidates = ukVoices.filter(v =>
                v.name.toLowerCase().includes('female') ||
                v.name.toLowerCase().includes('kate') ||
                v.name.toLowerCase().includes('serena') ||
                v.name.toLowerCase().includes('stephanie') ||
                v.name.toLowerCase().includes('martha') ||
                v.name.toLowerCase().includes('samantha')
            ).sort((a, b) => getQualityScore(b) - getQualityScore(a));

            const femaleVoice = femaleCandidates[0];

            // Final list
            const finalVoices = [];
            if (maleVoice) finalVoices.push(maleVoice);
            if (femaleVoice && (!maleVoice || femaleVoice.name !== maleVoice.name)) {
                finalVoices.push(femaleVoice);
            }

            // Emergency fallback: If we still don't have 2 distinct voices, just take the top 2 overall
            if (finalVoices.length < 2) {
                const others = ukVoices
                    .sort((a, b) => getQualityScore(b) - getQualityScore(a))
                    .filter(v => !finalVoices.find(fv => fv.name === v.name));

                finalVoices.push(...others.slice(0, 2 - finalVoices.length));
            }

            setVoices(finalVoices.slice(0, 2));

            // Auto-select first voice if none selected
            if (finalVoices.length > 0) {
                if (!selectedVoice || !finalVoices.find(v => v.name === selectedVoice.name)) {
                    setSelectedVoice(finalVoices[0]);
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
