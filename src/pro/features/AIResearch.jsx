import React, { useState, useRef, useEffect } from 'react';

const AIResearch = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [analysisPhase, setAnalysisPhase] = useState(null);
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
        }
    };

    const handleSend = () => {
        if (!input.trim()) return;
        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setAnalysisPhase('synthesizing');
        setTimeout(() => {
            generateResponse(userMsg.content);
        }, 1500);
    };

    const generateResponse = (query) => {
        const lowerQuery = query.toLowerCase();
        let key = Object.keys(knowledgeBase).find(k => lowerQuery.includes(k));
        let response = { role: 'assistant', content: "", analysis: null };

        if (key) {
            const data = knowledgeBase[key];
            response.content = data.synthesis;
            response.analysis = data;
        } else {
            response.content = `I have analyzed your query on '${query}'. While indexed data is limited, scholarly frameworks suggest this term relates back to redemptive history.`;
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
        <div className="ai-assistant-pane">
            <div className="ai-chat-box">
                <div className="ai-input-wrapper">
                    <input
                        className="ai-main-input"
                        placeholder="Ask about this passage..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button className="ai-send-btn" onClick={handleSend}>
                        <i>↗</i>
                    </button>
                </div>

                <div className="ai-messages-viewer" ref={scrollRef}>
                    {messages.length === 0 && !analysisPhase && (
                        <div className="ai-empty-state">
                            <div className="empty-sparkle">✨</div>
                            <h4>Ask me anything about this passage!</h4>
                            <p>I can help explain meanings, context, and applications.</p>
                        </div>
                    )}

                    {messages.map((m, i) => (
                        <div key={i} className={`ai-message-row ${m.role}`}>
                            <div className="ai-message-bubble">
                                {m.content}
                                {m.analysis && (
                                    <div className="ai-analysis-details">
                                        <div className="ref-tags">
                                            {m.analysis.cross_refs.map(ref => <span key={ref} className="ref-tag">{ref}</span>)}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {analysisPhase && (
                        <div className="ai-message-row assistant">
                            <div className="ai-message-bubble loading">
                                Synthesizing insights...
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AIResearch;
