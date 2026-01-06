import React, { useState, useEffect, useRef } from 'react';

const CinematicAudio = () => {
    const [isEnvironmentActive, setIsEnvironmentActive] = useState(false);
    const [volumes, setVolumes] = useState({
        narrator: 80,
        ambient: 40,
        reverb: 30
    });
    const [presets, setPresets] = useState([
        { id: 'temple', name: 'Ancient Temple', icon: '🏛️', color: '#3b82f6' },
        { id: 'desert', name: 'Wilderness', icon: '🏜️', color: '#f59e0b' },
        { id: 'rain', name: 'Tabernacle Rain', icon: '🌧️', color: '#10b981' }
    ]);
    const [activePreset, setActivePreset] = useState('temple');

    const audioCtx = useRef(null);
    const nodes = useRef({});

    const initAudio = () => {
        if (!audioCtx.current) {
            audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
        }

        if (isEnvironmentActive) {
            stopEnvironment();
        } else {
            startEnvironment();
        }
    };

    const startEnvironment = () => {
        setIsEnvironmentActive(true);
        const ctx = audioCtx.current;

        // Create White/Brown noise for "Wind/Ambiance"
        const bufferSize = 2 * ctx.sampleRate;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        // Filter the noise to make it "brown" or "windy"
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = activePreset === 'desert' ? 200 : 800;
        filter.Q.value = 1;

        const gainNode = ctx.createGain();
        gainNode.gain.value = volumes.ambient / 200;

        whiteNoise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        whiteNoise.start();
        nodes.current.noise = whiteNoise;
        nodes.current.gain = gainNode;
    };

    const stopEnvironment = () => {
        setIsEnvironmentActive(false);
        if (nodes.current.noise) {
            nodes.current.noise.stop();
        }
    };

    useEffect(() => {
        if (nodes.current.gain) {
            nodes.current.gain.gain.value = volumes.ambient / 200;
        }
    }, [volumes.ambient]);

    return (
        <div className="feature-container cinematic-audio">
            <div className="feature-header">
                <h2>Cinematic Soundscapes</h2>
                <p>Multi-track atmospheric immersion for deeper focus.</p>
            </div>

            <div className="audio-mixer glass-panel">
                <div className="main-toggle">
                    <button
                        className={`power-btn ${isEnvironmentActive ? 'active' : ''}`}
                        onClick={initAudio}
                    >
                        {isEnvironmentActive ? '⏹ Stop Environment' : '▶ Start Immersive Engine'}
                    </button>
                </div>

                <div className="mixer-grid">
                    <div className="mixer-channel">
                        <label>Narrator Quality</label>
                        <div className="premium-label">Ultra-HD Male (UK)</div>
                        <input
                            type="range" min="0" max="100"
                            value={volumes.narrator}
                            onChange={(e) => setVolumes({ ...volumes, narrator: e.target.value })}
                        />
                    </div>
                    <div className="mixer-channel">
                        <label>Ambient Textures</label>
                        <div className="premium-label">Procedural Soundscape</div>
                        <input
                            type="range" min="0" max="100"
                            value={volumes.ambient}
                            onChange={(e) => setVolumes({ ...volumes, ambient: e.target.value })}
                        />
                    </div>
                </div>

                <div className="presets-row">
                    {presets.map(p => (
                        <button
                            key={p.id}
                            className={`preset-card ${activePreset === p.id ? 'active' : ''}`}
                            onClick={() => setActivePreset(p.id)}
                            style={{ '--accent': p.color }}
                        >
                            <span className="p-icon">{p.icon}</span>
                            <span className="p-name">{p.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="audio-visualization">
                <div className="viz-bar" style={{ height: isEnvironmentActive ? '40%' : '5%' }}></div>
                <div className="viz-bar" style={{ height: isEnvironmentActive ? '80%' : '5%' }}></div>
                <div className="viz-bar" style={{ height: isEnvironmentActive ? '60%' : '5%' }}></div>
                <div className="viz-bar" style={{ height: isEnvironmentActive ? '90%' : '5%' }}></div>
                <div className="viz-bar" style={{ height: isEnvironmentActive ? '50%' : '5%' }}></div>
            </div>
        </div>
    );
};

export default CinematicAudio;
