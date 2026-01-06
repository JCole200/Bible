import React, { useState, useRef, useEffect } from 'react';

const AIResearch = () => {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Greeting, Researcher. I have indexed history’s most profound commentaries and archaeological journals. What theological complexity can we explore today?' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Simulate RAG Logic
        setTimeout(() => {
            let response = {
                role: 'assistant',
                content: "Analyzing historical commentaries and cross-referencing Matthew Henry and Spurgeon...",
                citations: [
                    { ref: 'Matthew Henry, Com. on John 1:1', text: 'The Word was with God, and the Word was God. This expresses the coexistence of the Son with the Father.' }
                ]
            };

            if (input.toLowerCase().includes('grace')) {
                response.content = "Grace in the New Testament (Greek: Charis) is best understood through the lens of divine enablement rather than just unmerited favor. Historical data from the Nestle-Aland indices suggests a strong link to restorative power.";
                response.citations = [{ ref: 'Nestle-Aland Lexicon, p. 142', text: 'Charis implies the divine influence upon the heart, and its reflection in the life.' }];
            }

            setMessages(prev => [...prev, response]);
            setIsTyping(false);
        }, 1500);
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

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
                                {m.citations && (
                                    <div className="citations-area">
                                        <label>Citations:</label>
                                        {m.citations.map((c, j) => (
                                            <div key={j} className="citation-item">
                                                <span className="cit-ref">{c.ref}</span>
                                                <p>"{c.text}"</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="msg-row assistant">
                            <div className="msg-bubble typing">
                                <span></span><span></span><span></span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="input-row">
                    <input
                        type="text"
                        placeholder="Ask about grace, sovereignty, or specific verses..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button onClick={handleSend} className="pro-btn-glow sm">Research</button>
                </div>
            </div>

            <div className="engine-status">
                <div className="status-dot"></div>
                <span>Vector Database: Connected (Historical_v2)</span>
            </div>
        </div>
    );
};

export default AIResearch;
