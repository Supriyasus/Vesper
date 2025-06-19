import React, { useState, useRef, useEffect } from 'react';
import axios from '../api/api';
import '../App.css';
import ReactMarkdown from 'react-markdown';

const Codex = () => {
    const [mode, setMode] = useState('debug'); // default mode
    const [messages, setMessages] = useState([
        { text: "Welcome to CodeVue Select a mode and paste your code to get started.", sender: "bot" }
    ]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);
    const [scrollOnUpdate, setScrollOnUpdate] = useState(false);

    const modeLabels = {
        debug: 'Debug Code',
        complete: 'Complete Code',
        explain: 'Explain Code'
    };

    const sendMessage = async () => {
        if (!input.trim()) return;

        setScrollOnUpdate(true);  // activate scroll

        const userMessage = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput('');

        try {
            const response = await axios.post('http://localhost:8000/codex/', {
                query: currentInput,
                mode: mode
            });

            const botReply = { text: response.data.response.trim(), sender: 'bot' };
            setMessages(prev => [...prev, botReply]);
        } catch (error) {
            console.error("Error:", error);
            setMessages(prev => [...prev, {
                text: 'Something went wrong. Please try again.',
                sender: 'bot'
            }]);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    useEffect(() => {
        if (scrollOnUpdate) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            setScrollOnUpdate(false);
        }
    }, [messages, scrollOnUpdate]);



    return (
        <div className="chat-container container py-5 my-5">
            <h2 className="home-title display-5 mb-2">CodeVue</h2>
            <h5 className="lead text-center mb-4">
                Your all-in-one AI code assistant — Debug, Complete, and Explain code instantly.
            </h5>

            {/* Mode Selector */}
            <div className="mb-3 text-center">
                <label className="me-2 fw-bold">Choose Mode:</label>
                <select
                    className="form-select d-inline w-auto"
                    value={mode}
                    onChange={(e) => setMode(e.target.value)}
                >
                    <option value="debug">Debug</option>
                    <option value="complete">Complete</option>
                    <option value="explain">Explain</option>
                </select>
            </div>

            {/* Chat Box */}
            <div className="chat-box border rounded shadow-sm p-3 my-2" style={{ height: '400px', overflowY: 'auto', backgroundColor: '#fdfdfd' }}>
                {messages.map((msg, idx) => (
                    <div key={idx} className={`d-flex mb-3 ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                        <div
                            className="p-3 rounded"
                            style={{
                                maxWidth: '75%',
                                whiteSpace: 'pre-wrap',
                                backgroundColor: msg.sender === 'user' ? '#D1512D' : '#411530',
                                color: '#fff'
                            }}
                        >
                            {msg.sender === 'bot' ? (
                                <ReactMarkdown>{msg.text}</ReactMarkdown>
                            ) : (
                                msg.text
                            )}
                        </div>

                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Box */}
            <div className="mt-3">
                <textarea
                    rows="5"
                    className="form-control mb-2"
                    placeholder={`Paste your code here to ${modeLabels[mode].toLowerCase()}...`}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <div className="d-grid">
                    <button
                        className="btn"
                        style={{ backgroundColor: '#411530', color: '#fff' }}
                        onClick={sendMessage}
                    >
                        {modeLabels[mode]}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Codex;