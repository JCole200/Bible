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
            coords: '31.7683° N, 35.2137° E',
            offset: { x: -5, y: -10 },
            discovery: "Recent excavations at the Southern Wall (Ophel) have uncovered 2,000-year-old purification baths (Mikva'ot) used by pilgrims entering the Temple. The Stratigraphy reveals a complex layering of Herodian, Byzantine, and Ummayad occupational levels.",
            stats: {
                depth: '18.4m',
                certainty: '98%',
                period: 'Early Roman',
                relics: 'Miksa\'ot, Stone Vessels'
            }
        },
        'capernaum': {
            name: 'Capernaum',
            ancient: 'Kfar Nahum',
            modern: 'Archaeological Park',
            coords: '32.8811° N, 35.5752° E',
            offset: { x: 15, y: -30 },
            discovery: "The 'Insula of Saint Peter' demonstrates 1st-century domestic architecture. Beneath the octagonal Byzantine church, excavations revealed a simple dwelling with early Christian graffiti, suggesting its use as an early 'domus-ecclesia'.",
            stats: {
                depth: '4.2m',
                certainty: '89%',
                period: 'Apostolic',
                relics: 'Fishing Hooks, Oil Lamps'
            }
        },
        'galilee': {
            name: 'Sea of Galilee',
            ancient: 'Lake Gennesaret',
            modern: 'Lake Kinneret',
            coords: '32.8225° N, 35.5872° E',
            offset: { x: 10, y: -20 },
            discovery: "A Roman-era shipwreck (The Jesus Boat) found in 1986 reveal construction techniques mentioned in the Gospels. The vessel was preserved in lake mud, allowing for comprehensive dendrochronological dating to the late 1st century BC.",
            stats: {
                depth: '2.5m (Underwater)',
                certainty: '100%',
                period: 'Late Herodian',
                relics: 'Cedar/Oak Planking'
            }
        }
    };

    const timeline = [
        { id: '4BC', label: 'Herodian/Nativity' },
        { id: '30AD', label: 'Apostolic/Ministry' },
        { id: '70AD', label: 'Destruction/Diaspora' },
        { id: '325AD', label: 'Constantinian/Late' },
        { id: 'Modern', label: 'Satellite/Present' }
    ];

    const activeLoc = locations[currentRef];

    const triggerScan = () => {
        setIsScanning(true);
        setTimeout(() => setIsScanning(false), 2000);
    };

    return (
        <div className="feature-container time-traveler animate-fade-in">
            <div className="feature-header">
                <div className="pro-label-tag">NEURAL GIS ENGINE v4.2</div>
                <h2>The Time Traveler</h2>
                <p>Relativizing topographical data and archaeological strata across biblical history.</p>
            </div>

            <div className="map-interface-v2 glass-panel">
                <div className="map-top-bar">
                    <div className="coord-box">
                        <span className="coord-label">COORDS: {activeLoc.coords}</span>
                        <span className="coord-label">ALTITUDE: {layer === 'ancient' ? '-12m (Strata)' : '+780m (ASL)'}</span>
                    </div>
                    <div className="view-modes">
                        <button className={layer === 'ancient' ? 'active' : ''} onClick={() => { setLayer('ancient'); triggerScan(); }}>ANCIENT STRATA</button>
                        <button className={layer === 'modern' ? 'active' : ''} onClick={() => { setLayer('modern'); triggerScan(); }}>MODERN SATELLITE</button>
                    </div>
                </div>

                <div className="map-viewport">
                    <div
                        className={`map-canvas-core ${layer}`}
                        style={{ transform: `scale(1.5) translate(${activeLoc.offset.x}%, ${activeLoc.offset.y}%)` }}
                    >
                        <div className="map-grid-layer"></div>
                        <div className="map-topography-layer"></div>

                        {isScanning && <div className="radar-sweep"></div>}

                        <div className="target-marker-v2">
                            <div className="marker-ring"></div>
                            <div className="marker-point"></div>
                            <div className="marker-data-card glass-panel">
                                <span className="loc-title">{activeLoc.name}</span>
                                <span className="loc-subtitle">{layer === 'ancient' ? activeLoc.ancient : activeLoc.modern}</span>
                                <div className="live-telemetry">
                                    <div className="tele-bar"></div>
                                    <span>Signal Verified via Neural-Scan</span>
                                </div>
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
                                <span className="loc-puck"></span>
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
                                <span className="node-id"></span>
                                <span className="node-label-wrap">
                                    <span className="node-id-text">{t.id}</span>
                                    <span className="node-label">{t.label}</span>
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="discovery-dashboard">
                <div className="analysis-card glass-panel">
                    <div className="card-header">
                        <h3>Archaeological Intel</h3>
                        <span className="live-badge">LIVE INTEL</span>
                    </div>
                    <div className="discovery-info">
                        <p>{activeLoc.discovery}</p>
                    </div>
                    <div className="discovery-grid">
                        <div className="metric">
                            <label>Depth Strata</label>
                            <strong>{activeLoc.stats.depth}</strong>
                        </div>
                        <div className="metric">
                            <label>Period</label>
                            <strong>{activeLoc.stats.period}</strong>
                        </div>
                        <div className="metric">
                            <label>Primary Relics</label>
                            <strong>{activeLoc.stats.relics}</strong>
                        </div>
                        <div className="metric">
                            <label>Certainty</label>
                            <strong>{activeLoc.stats.certainty}</strong>
                        </div>
                    </div>
                </div>

                <div className="rendering-card glass-panel">
                    <div className="card-header">
                        <h3>Volumetric AR Preview</h3>
                        <span className="pro-label">S-23 MODEL</span>
                    </div>
                    <div className="volumetric-viewport">
                        <div className="wireframe-scanner">
                            <div className="scanner-line"></div>
                        </div>
                        <div className="model-3d-sim">
                            <div className="wireframe-orbit"></div>
                            <div className="wireframe-base"></div>
                        </div>
                    </div>
                    <button className="pro-action-btn-glow sm" onClick={() => alert("Initializing Neural VR Link...")}>
                        INITIALIZE VOLUMETRIC LINK
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TimeTraveler;
