import React, { useState } from 'react';

const TimeTraveler = () => {
    const [layer, setLayer] = useState('ancient'); // ancient, modern
    const [currentRef, setCurrentRef] = useState('jerusalem');
    const [timePeriod, setTimePeriod] = useState('70AD');
    const [isScanning, setIsScanning] = useState(false);

    const locations = {
        'jerusalem': {
            name: 'Jerusalem',
            ancient: 'Aelia Capitolina',
            modern: 'Old City Basin',
            offset: { x: -5, y: -10 },
            discovery: "Recent excavations at the Southern Wall (Ophel) have uncovered 2,000-year-old purification baths (Mikva'ot) used by pilgrims entering the Temple.",
            stats: { depth: '18m', certainty: '98%' }
        },
        'capernaum': {
            name: 'Capernaum',
            ancient: 'Kfar Nahum',
            modern: 'Archaeological Park',
            offset: { x: 15, y: -30 },
            discovery: "The 'Insula of Saint Peter' demonstrates 1st-century domestic architecture, including basalt stone structures and early Christian graffiti.",
            stats: { depth: '6m', certainty: '85%' }
        },
        'galilee': {
            name: 'Sea of Galilee',
            ancient: 'Lake Gennesaret',
            modern: 'Lake Kinneret',
            offset: { x: 10, y: -20 },
            discovery: "A Roman-era shipwreck (The Jesus Boat) found in 1986 reveal construction techniques mentioned in the Gospels.",
            stats: { depth: '4m', certainty: '100%' }
        }
    };

    const timeline = [
        { id: '4BC', label: 'Herodian' },
        { id: '30AD', label: 'Apostolic' },
        { id: '70AD', label: 'Diaspora' },
        { id: 'Modern', label: 'Present' }
    ];

    const activeLoc = locations[currentRef];

    const triggerScan = () => {
        setIsScanning(true);
        setTimeout(() => setIsScanning(false), 2000);
    };

    return (
        <div className="feature-container time-traveler animate-fade-in">
            <div className="feature-header">
                <div className="pro-label-tag">GIS ENGINE 4.0</div>
                <h2>The Time Traveler</h2>
                <p>Relativizing topographical data across biblical timelines.</p>
            </div>

            <div className="map-interface-v2 glass-panel">
                <div className="map-top-bar">
                    <div className="coord-box">
                        <span className="coord-label">LAT: 31.7683</span>
                        <span className="coord-label">LNG: 35.2137</span>
                    </div>
                    <div className="view-modes">
                        <button className={layer === 'ancient' ? 'active' : ''} onClick={() => { setLayer('ancient'); triggerScan(); }}>ANCIENT</button>
                        <button className={layer === 'modern' ? 'active' : ''} onClick={() => { setLayer('modern'); triggerScan(); }}>MODERN</button>
                    </div>
                </div>

                <div className="map-viewport">
                    <div
                        className={`map-canvas-core ${layer}`}
                        style={{ transform: `scale(1.5) translate(${activeLoc.offset.x}%, ${activeLoc.offset.y}%)` }}
                    >
                        {/* Map Grid */}
                        <div className="map-grid-layer"></div>

                        {/* Radar Scan Effect */}
                        {isScanning && <div className="radar-sweep"></div>}

                        {/* Target Marker */}
                        <div className="target-marker-v2">
                            <div className="marker-ring"></div>
                            <div className="marker-point"></div>
                            <div className="marker-data-card glass-panel">
                                <span className="loc-title">{activeLoc.name}</span>
                                <span className="loc-subtitle">{layer === 'ancient' ? activeLoc.ancient : activeLoc.modern}</span>
                            </div>
                        </div>
                    </div>

                    <div className="location-nav">
                        {Object.keys(locations).map(key => (
                            <button
                                key={key}
                                className={currentRef === key ? 'active' : ''}
                                onClick={() => { setCurrentRef(key); triggerScan(); }}
                            >
                                {locations[key].name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="timeline-controller">
                    <div className="timeline-track-v2">
                        {timeline.map(t => (
                            <button
                                key={t.id}
                                className={`timeline-node ${timePeriod === t.id ? 'active' : ''}`}
                                onClick={() => { setTimePeriod(t.id); triggerScan(); }}
                            >
                                <span className="node-id">{t.id}</span>
                                <span className="node-label">{t.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="discovery-dashboard">
                <div className="analysis-card glass-panel">
                    <h3><span className="icon">🏺</span> Archaeological Intel</h3>
                    <div className="discovery-info">
                        <p>{activeLoc.discovery}</p>
                    </div>
                    <div className="discovery-metrics">
                        <div className="metric">
                            <label>Mean Depth</label>
                            <strong>{activeLoc.stats.depth}</strong>
                        </div>
                        <div className="metric">
                            <label>Confidence</label>
                            <strong>{activeLoc.stats.certainty}</strong>
                        </div>
                    </div>
                </div>

                <div className="rendering-card glass-panel">
                    <h3><span className="icon">🏙️</span> Volumetric Preview</h3>
                    <div className="volumetric-viewport">
                        <div className="wireframe-scanner">
                            <div className="scanner-line"></div>
                        </div>
                        <div className="wireframe-cube-3d"></div>
                    </div>
                    <button className="pro-action-btn-glow" onClick={() => alert("Initializing Neural VR Link...")}>
                        ENTER VOLUMETRIC AR
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TimeTraveler;
