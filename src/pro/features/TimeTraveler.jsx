import React, { useState } from 'react';

const TimeTraveler = () => {
    const [layer, setLayer] = useState('ancient'); // ancient, modern, hybrid
    const [currentRef, setCurrentRef] = useState('jerusalem');
    const [timePeriod, setTimePeriod] = useState('70AD');

    const locations = {
        'jerusalem': {
            name: 'Jerusalem',
            ancient: 'Aelia Capitolina / City of David',
            modern: 'Jerusalem Old City',
            offset: { x: -10, y: -20 },
            discovery: "Excavations at the Gihon Spring reveal a massive fortification system dating to the Middle Bronze Age (approx. 1800 BCE)."
        },
        'capernaum': {
            name: 'Capernaum',
            ancient: 'Kfar Nahum',
            modern: 'Capernaum Archaeological Park',
            offset: { x: 40, y: -60 },
            discovery: "The 'House of Peter'—an octagonal church built over a 1st-century residential structure—is a primary focus of Franciscan research."
        },
        'galilee': {
            name: 'Sea of Galilee',
            ancient: 'Lake Gennesaret',
            modern: 'Lake Kinneret',
            offset: { x: 30, y: -40 },
            discovery: "The 1986 discovery of the 'Jesus Boat'—a fishing vessel from the 1st Century—provides critical data on ancient nautical engineering."
        }
    };

    const timeline = [
        { id: '4BC', label: 'Herodian Era' },
        { id: '30AD', label: 'Ministry Era' },
        { id: '70AD', label: 'Second Temple Fall' },
        { id: 'Modern', label: 'Present Day' }
    ];

    const activeLoc = locations[currentRef];

    return (
        <div className="feature-container time-traveler">
            <div className="feature-header">
                <h2>The "Time Traveler" Contextual Layer</h2>
                <p>GIS-integrated historical topography and 3D architectural reconstructions.</p>
            </div>

            <div className="map-interface glass-panel">
                <div className="map-controls">
                    <div className="layer-toggle">
                        <button className={layer === 'ancient' ? 'active' : ''} onClick={() => setLayer('ancient')}>Ancient Mapping</button>
                        <button className={layer === 'modern' ? 'active' : ''} onClick={() => setLayer('modern')}>Modern GIS</button>
                    </div>
                    <div className="location-selector">
                        <select value={currentRef} onChange={(e) => setCurrentRef(e.target.value)}>
                            {Object.keys(locations).map(k => (
                                <option key={k} value={k}>{locations[k].name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="map-canvas">
                    <div
                        className={`map-overlay ${layer}`}
                        style={{ transform: `scale(1.2) translate(${activeLoc.offset.x}%, ${activeLoc.offset.y}%)` }}
                    >
                        <div className="map-marker" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                            <div className="marker-dot pulse"></div>
                            <div className="marker-label">
                                <strong>{activeLoc.name}</strong>
                                <span>{layer === 'ancient' ? activeLoc.ancient : activeLoc.modern}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="timeline-slider">
                    <div className="timeline-track">
                        {timeline.map(t => (
                            <div
                                key={t.id}
                                className={`timeline-point ${timePeriod === t.id ? 'active' : ''}`}
                                onClick={() => setTimePeriod(t.id)}
                                title={t.label}
                            ></div>
                        ))}
                    </div>
                    <div className="timeline-meta">
                        <span className="current-period">{timeline.find(t => t.id === timePeriod).label}</span>
                        <span className="period-year">{timePeriod}</span>
                    </div>
                </div>
            </div>

            <div className="pro-layout-secondary grid-2">
                <div className="archaeology-panel glass-panel">
                    <h3>Archaeological Insight</h3>
                    <p className="discovery-text">{activeLoc.discovery}</p>
                    <div className="discovery-stats">
                        <div className="stat"><span>Excavation Depth</span><strong>14m</strong></div>
                        <div className="stat"><span>Period</span><strong>{timePeriod}</strong></div>
                    </div>
                </div>

                <div className="archaeology-panel glass-panel">
                    <h3>3D Reconstruction Preview</h3>
                    <div className="model-viewer-mock">
                        <div className="wireframe-cube animate-spin-slow"></div>
                        <p>Simulating {activeLoc.name} GLB Point Cloud...</p>
                    </div>
                    <button className="pro-btn-glow sm" style={{ width: '100%' }}>Enter AR Simulation</button>
                </div>
            </div>
        </div>
    );
};

export default TimeTraveler;
