import React, { useState, useEffect, useRef } from 'react';

const AudioPlayer = ({ textToRead, reference, compact }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [voices, setVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState(null);
    const synth = window.speechSynthesis;
    const utteranceRef = useRef(null);

    useEffect(() => {
        // Load voices
        const loadVoices = () => {
            let availableVoices = [...synth.getVoices()];

            // Filter for standard UK English, excluding regional variants like Welsh/Scottish if possible
            let ukVoices = availableVoices.filter(v => {
                const lang = v.lang.toLowerCase();
                const name = v.name.toLowerCase();
                // Check for UK/GB markers
                const isUK = lang.startsWith('en-gb') || lang.includes('gb');
                // Exclude specific regional variants if they are causing issues
                const isRegional = name.includes('welsh') || name.includes('scotland') || name.includes('ireland') || lang.includes('wls') || lang.includes('sct');

                return isUK && !isRegional;
            });

            // If no standard UK voices, fallback to any UK English
            if (ukVoices.length === 0) {
                ukVoices = availableVoices.filter(v => v.lang.toLowerCase().startsWith('en-gb') || v.lang.includes('gb'));
            }

            // If still nothing, fallback to general English (US/etc)
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
                const lang = voice.lang.toLowerCase();
                let score = 0;

                if (name.includes('natural')) score += 100;
                if (name.includes('premium')) score += 90;
                if (name.includes('enhanced')) score += 80;
                if (name.includes('google')) score += 70;

                // Prioritize classic standard names
                if (name.includes('daniel') || name.includes('kate') || name.includes('serena') || name.includes('oliver')) score += 60;

                // Penalize regional variants that might have slipped through
                if (name.includes('welsh') || lang.includes('wls')) score -= 200;
                if (name.includes('scotland') || lang.includes('sct')) score -= 200;

                return score;
            };

            // Find best Male
            const maleCandidates = ukVoices.filter(v =>
                v.name.toLowerCase().includes('male') ||
                v.name.toLowerCase().includes('daniel') ||
                v.name.toLowerCase().includes('arthur') ||
                v.name.toLowerCase().includes('oliver') ||
                v.name.toLowerCase().includes('james')
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

            const top2 = finalVoices.slice(0, 2);
            setVoices(top2);

            // Auto-select first voice if none selected
            if (top2.length > 0) {
                if (!selectedVoice || !top2.find(v => v.name === selectedVoice.name)) {
                    setSelectedVoice(top2[0]);
                }
            }
        };
        loadVoices();

        // Chrome triggers this event when voices are ready
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = loadVoices;
        }
    }, []);

    const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
    const chunksRef = useRef([]);

    // Split text into chunks to avoid mobile timeouts (approx 200 chars or by sentence)
    useEffect(() => {
        if (textToRead) {
            // Split by sentence but keep them under reasonable length
            const sentences = textToRead.match(/[^.!?]+[.!?]+/g) || [textToRead];
            chunksRef.current = sentences.map(s => s.trim()).filter(s => s.length > 0);
            setCurrentChunkIndex(0);
            setIsPlaying(false);
            setIsPaused(false);
            synth.cancel();
        }
    }, [textToRead]);

    const playChunk = (index) => {
        if (index >= chunksRef.current.length) {
            setIsPlaying(false);
            setIsPaused(false);
            setCurrentChunkIndex(0);
            return;
        }

        synth.cancel(); // Clear any pending

        const utterance = new SpeechSynthesisUtterance(chunksRef.current[index]);
        utterance.rate = 0.95;
        utterance.pitch = 1.0;
        if (selectedVoice) utterance.voice = selectedVoice;

        utterance.onend = () => {
            if (!isPaused) {
                const nextIndex = index + 1;
                setCurrentChunkIndex(nextIndex);
                playChunk(nextIndex);
            }
        };

        utterance.onerror = (event) => {
            console.error("SpeechSynthesisUtterance error", event);
            setIsPlaying(false);
        };

        utteranceRef.current = utterance;
        synth.speak(utterance);
    };

    const handlePlay = () => {
        if (isPaused) {
            // On mobile, resume is buggy, better to just restart the current chunk
            playChunk(currentChunkIndex);
            setIsPaused(false);
            setIsPlaying(true);
        } else {
            setIsPlaying(true);
            setIsPaused(false);
            playChunk(currentChunkIndex);
        }
    };

    const handlePause = () => {
        synth.cancel(); // On mobile, cancel is safer than pause for stopping activity
        setIsPlaying(false);
        setIsPaused(true);
    };

    const handleStop = () => {
        synth.cancel();
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentChunkIndex(0);
    };

    const getVoiceLabel = (voice) => {
        if (voice.name.includes('Male') || voice.name.includes('Daniel') || voice.name.includes('Arthur')) {
            return "Male (UK)";
        }
        if (voice.name.includes('Female') || voice.name.includes('Kate') || voice.name.includes('Serena') || voice.name.includes('Stephanie')) {
            return "Female (UK)";
        }
        return voice.name.replace('Google', '').replace('English', '').replace('United Kingdom', '').replace('(Great Britain)', '').trim();
    };

    return (
        <div className={`audio-player glass-panel ${compact ? 'compact' : ''}`} style={{
            padding: compact ? '0.5rem 0.75rem' : '1rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: compact ? '0.5rem' : '1rem',
            width: 'fit-content',
            maxWidth: '100%'
        }}>
            <div style={{ fontSize: compact ? '0.8rem' : '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className={compact ? 'hide-mobile' : ''}>Audio <span className="hide-tablet">Bible</span></span>

                {voices.length > 0 && (
                    <select
                        value={selectedVoice ? selectedVoice.name : ''}
                        onChange={(e) => {
                            const voice = voices.find(v => v.name === e.target.value);
                            setSelectedVoice(voice);
                            if (isPlaying) {
                                handleStop();
                            }
                        }}
                        style={{
                            background: 'rgba(50, 50, 50, 0.5)',
                            border: '1px solid var(--glass-border)',
                            color: 'var(--text-color)',
                            borderRadius: '6px',
                            padding: '0.25rem 0.5rem',
                            fontSize: '0.75rem',
                            maxWidth: compact ? '80px' : 'auto'
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
                {!isPlaying ? (
                    <button onClick={handlePlay} title="Play" style={compact ? { padding: '0.4rem 0.8rem', fontSize: '0.8rem' } : {}}>
                        ▶ {isPaused ? 'Resume' : 'Listen'}
                    </button>
                ) : (
                    <button onClick={handlePause} title="Pause" className="secondary" style={compact ? { padding: '0.4rem 0.8rem', fontSize: '0.8rem' } : {}}>
                        ⏸ Pause
                    </button>
                )}

                {(isPlaying || isPaused || currentChunkIndex > 0) && (
                    <button onClick={handleStop} title="Stop" className="secondary" style={compact ? { padding: '0.4rem 0.8rem', fontSize: '0.8rem' } : {}}>
                        ⏹
                    </button>
                )}
            </div>
        </div>
    );
};

export default AudioPlayer;
