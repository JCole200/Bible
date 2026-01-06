import React, { useState, useRef, useEffect } from 'react';

const AIResearch = () => {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Greeting, Researcher. Digital archives are synchronized. I have indexed thousands of historical commentaries and archaeological field notes. What complexity shall we deconstruct today?' }
    ]);
    const [input, setInput] = useState('');
    const [analysisPhase, setAnalysisPhase] = useState(null); // 'parsing', 'retrieving', 'synthesizing'
    const scrollRef = useRef(null);

    const knowledgeBase = {
        'grace': {
            synthesis: "Grace (Charis) is the operative power of God's restorative love. In Pauline theology, it transcends simple 'pardon' and enters the realm of 'enablement'.",
            theology: "Spurgeon notes that grace is the 'mother of all virtues'. It is not a static attribute but a dynamic movement of the Divine toward the human condition.",
            archaeological: "Recent findings in Ephesus (1st Century) show the civic usage of 'Charis' in manumission documents, highlighting the legal weight of 'favor leading to freedom'.",
            cross_refs: ['Ephesians 2:8', 'Titus 2:11', 'Romans 5:2']
        },
        'logos': {
            synthesis: "The 'Logos' in John 1 represents the pre-existent Divine Reason. It bridges the gap between Greek philosophy (Heraclitus) and Hebraic 'Davar' (The Word of the Lord).",
            theology: "Matthew Henry posits that Christ as the Word is both the Architect of creation and the Interpreter of the Father's mind.",
            archaeological: "The 'Logos' concept reflects the intellectual atmosphere of Alexandria. Papyri from the Oxyrhynchus collection suggest a common usage of 'Logos' as a mediator in contract law.",
            cross_refs: ['Genesis 1:3', 'Psalm 33:6', 'Hebrews 4:12']
        },
        'sovereignty': {
            synthesis: "Divine Sovereignty is the absolute right of God to govern His creation according to His own pleasure and purpose.",
            theology: "Pink's classic treatise emphasizes that God's power is never arbitrary but always aligned with His perfect holiness.",
            archaeological: "Assyrian royal inscriptions of the 8th Century BC provide a 'negative space' contrast to Biblical sovereignty, focusing on coercive might vs. covenantal authority.",
            cross_refs: ['Psalm 115:3', 'Daniel 4:35', 'Ephesians 1:11']
        }
    };

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');

        // Multi-phase simulation
        setAnalysisPhase('parsing');

        setTimeout(() => {
            setAnalysisPhase('retrieving');
            setTimeout(() => {
                setAnalysisPhase('synthesizing');
                setTimeout(() => {
                    generateResponse(userMsg.content);
                }, 800);
            }, 1000);
        }, 1200);
    };

    const generateResponse = (query) => {
        const lowerQuery = query.toLowerCase();
        let key = Object.keys(knowledgeBase).find(k => lowerQuery.includes(k));

        let response = {
            role: 'assistant',
            content: "Analysis complete. I have synthesized data from the vector storage.",
            analysis: null
        };

        if (key) {
            const data = knowledgeBase[key];
            response.analysis = {
                title: `Deep Dive: ${key.toUpperCase()}`,
                synthesis: data.synthesis,
                sections: [
                    { type: 'theology', title: 'Theological Commentary', content: data.theology },
                    { type: 'arch', title: 'Archaeological Context', content: data.archaeological }
                ],
                cross_refs: data.cross_refs
            };
        } else {
            response.content = "I have analyzed your query. While I have limited specific datasets for this niche topic in the current mock layer, my RAG logic indicates a high relevance to general 'Covenantal' themes. Expanding search parameters...";
        }

        setMessages(prev => [...prev, response]);
        setAnalysisPhase(null);
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, analysisPhase]);

    return (
        <div className="feature-container ai-research">
            <div className="feature-header">
                <h2>AI Theological Research Engine</h2>
                <p>Retrieval-Augmented Generation (RAG) powered by historical archives.</p>
            </div>

            <div className="chat-interface glass-panel">
                <div className="messages-scroll" ref={scrollRef}>
                    {messages.map((m, i) => (
                        <div key={i} className={`msg-row ${m.role}`}>
                            <div className="msg-bubble">
                                <div className="msg-content">{m.content}</div>

                                {m.analysis && (
                                    <div className="analysis-package animate-slide-in">
                                        <div className="analysis-title">{m.analysis.title}</div>

                                        <div className="analysis-synthesis">
                                            <label>Synthesis</label>
                                            <p>{m.analysis.synthesis}</p>
                                        </div>

                                        <div className="analysis-sections">
                                            {m.analysis.sections.map((sec, j) => (
                                                <div key={j} className={`analysis-section ${sec.type}`}>
                                                    <div className="section-title">
                                                        {sec.type === 'theology' ? '📜' : '🏺'} {sec.title}
                                                    </div>
                                                    <p>{sec.content}</p>
                                                </div>
                                            ))}
                                        </div>

                                        {m.analysis.cross_refs && (
                                            <div className="cross-ref-map">
                                                <label>Semantic Cross-References</label>
                                                <div className="ref-tags">
                                                    {m.analysis.cross_refs.map((ref, idx) => (
                                                        <span key={idx} className="ref-tag">{ref}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {analysisPhase && (
                        <div className="msg-row assistant">
                            <div className="analysis-loading-bubble glass-panel">
                                <div className="phase-indicator">
                                    <div className={`phase-step ${analysisPhase === 'parsing' ? 'active' : ''}`}>Semantic Parsing</div>
                                    <div className={`phase-step ${analysisPhase === 'retrieving' ? 'active' : ''}`}>Vector Retrieval</div>
                                    <div className={`phase-step ${analysisPhase === 'synthesizing' ? 'active' : ''}`}>Knowledge Synthesis</div>
                                </div>
                                <div className="typing-dots">
                                    <span></span><span></span><span></span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="input-row">
                    <input
                        type="text"
                        placeholder="Ask about grace, sovereignty, logos..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button onClick={handleSend} className="pro-btn-glow sm">Analyze</button>
                </div>
            </div>

            <div className="engine-status">
                <div className="status-dot pulse"></div>
                <span>Vector Core: Online (Historical_Commentaries_v4)</span>
                <span className="latency">Latency: 24ms</span>
            </div>
        </div>
    );
};

export default AIResearch;
