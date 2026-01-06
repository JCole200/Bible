import React, { useState } from 'react';

const TimeTraveler = () => {
    const [layer, setLayer] = useState('ancient'); // ancient, modern, hybrid
    const [view, setView] = useState('jerusalem');

    const locations = [
        { id: 'jerusalem', name: 'Jerusalem', ancient: 'City of David', modern: 'Old City', lat: '31.7683', lng: '35.2137' },
        { id: 'capernaum', name: 'Capernaum', ancient: 'Kfar Nahum', modern: 'Capernaum Site', lat: '32.8811', lng: '35.5752' }
    ];

    return (
        <div className="feature-container time-traveler">
            <div className="feature-header">
                <h2>The "Time Traveler" Contextual Layer</h2>
                <p>GIS-integrated historical topography and 3D architectural reconstructions.</p>
            </div>

            <div className="map-interface glass-panel">
                <div className="map-controls">
                    <div className="layer-toggle">
                        <button className={layer === 'ancient' ? 'active' : ''} onClick={() => setLayer('ancient')}>Ancient</button>
                        <button className={layer === 'modern' ? 'active' : ''} onClick={() => setLayer('modern')}>Modern</button>
                        <button className={layer === 'hybrid' ? 'active' : ''} onClick={() => setLayer('hybrid')}>Hybrid</button>
                    </div>
                </div>

                <div className="map-canvas">
                    {/* Simulated Map Rendering */}
                    <div className={`map-overlay ${layer}`}>
                        <div className="map-marker" style={{ top: '40%', left: '45%' }}>
                            <div className="marker-dot pulse"></div>
                            <div className="marker-label">
                                <strong>{locations.find(l => l.id === view).name}</strong>
                                <span>{layer === 'ancient' ? locations.find(l => l.id === view).ancient : locations.find(l => l.id === view).modern}</span>
                            </div>
                        </div>

                        <div className="topographic-lines"></div>
                    </div>
                </div>

                <div className="timeline-slider">
                    <div className="timeline-track">
                        <div className="timeline-point" title="4BC"></div>
                        <div className="timeline-point" title="30AD"></div>
                        <div className="timeline-point active" title="70AD"></div>
                        <div className="timeline-point" title="Modern"></div>
                    </div>
                    <span>Current Context: 70 AD (Second Temple Destruction)</span>
                </div>
            </div>

            <div className="archaeology-panel glass-panel">
                <h3>3D Reconstruction Preview</h3>
                <div className="model-viewer-mock">
                    <div className="wireframe-cube"></div>
                    <p>Loading Herod's Temple GLB Model...</p>
                </div>
                <button className="secondary sm">View in AR</button>
            </div>
        </div>
    );
};

export default TimeTraveler;
