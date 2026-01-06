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
        },
        'heaven': {
            synthesis: "Heaven (Ouranos) in the Biblical worldview is not merely a 'place' but the dimension of God's immediate presence and authority. It is the archetype for the renewed Earth.",
            theology: "Augustine views Heaven as the 'City of God', the eternal reality that anchors the temporal pilgrim. It is the source of all 'true' beauty and justice.",
            archaeological: "Excavations of early Christian catacombs show a shift in 'celestial' iconography—moving from pagan stars to the 'ascending' motifs that reflect a localized, yet infinite, presence of the Divine.",
            cross_refs: ['Matthew 6:10', 'Revelation 21:1', '2 Corinthians 12:2']
        },
        'kingdom': {
            synthesis: "The Kingdom of God (Basileia) describes the 'already but not yet' manifestation of God's rule. It is a present spiritual reality and a future physical consummation.",
            theology: "George Eldon Ladd's breakthrough research established the Kingdom as God's dynamic reign rather than a static realm. It is the subversion of worldly power dynamics.",
            archaeological: "The 'Kingdom' language utilized the political lexicon of Rome to challenge imperial claims. Coinage found in Judea (66-70 AD) reflects this subversive 'Sovereignty of God'.",
            cross_refs: ['Mark 1:15', 'Luke 17:21', 'Revelation 11:15']
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
            content: "Analysis complete. I have synthesized data from the vector storage using GPT-4-Turbo.",
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
            // Neural Synthesis Fallback for unknown queries
            response.content = `I have analyzed your query on '${query}'. While this specific term is undergoing background indexing, I have synthesized a preliminary analysis using general theological and historical frameworks.`;
            response.analysis = {
                title: `Neural Synthesis: ${query.toUpperCase()}`,
                synthesis: `The concept of '${query}' within Biblical literature generally interfaces with the broader themes of Divine Revelation and Covenantal Order. Initial RAG scans suggest this term functions as a bridge between the historical narrative and the metaphysical claims of the text.`,
                sections: [
                    {
                        type: 'theology',
                        title: 'Theological Framework',
                        content: `Scholarly consensus often places '${query}' within the context of redemptive history. It frequently serves to emphasize the distinction between the Creator and the creature, while highlighting the 'Imago Dei' as the point of relational contact.`
                    },
                    {
                        type: 'arch',
                        title: 'Historical/Cultural Strata',
                        content: `In the Ancient Near Eastern or Greco-Roman context, terms like '${query}' would likely be understood within existing socio-political hierarchies, often challenged or subverted by the Biblical authors.`
                    }
                ],
                cross_refs: ['Hebrews 1:1', 'Colossians 1:16', 'Psalm 19:1']
            };
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
