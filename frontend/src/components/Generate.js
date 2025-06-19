import React, { useState, useRef, useEffect } from 'react';
import axios from '../api/api';
import '../App.css';
import ReactMarkdown from 'react-markdown';

const Generate = () => {
    const [messages, setMessages] = useState([
        { text: "Hi there! Ask me anything academic, research-based, or curious!", sender: "bot" }
    ]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = input; // save current input
        setInput('');

        try {
            const response = await axios.post('http://localhost:8000/generate_text/', {
                query: currentInput
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
        if (e.key === 'Enter') sendMessage();
    };

    useEffect(() => {
        if (messages.length > 1) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    return (
        <div className="chat-container container py-5 my-5">
            <h2 className="home-title display-5 mb-2">
                IntelliGen
            </h2>
            <h5 className="lead text-center mb-4">
                Ask me anything academic, research-based, or curious!
            </h5>
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
            <div className="d-flex mt-3">
                <input
                    type="text"
                    className="form-control me-2"
                    placeholder="Ask me anything..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button className="btn" style={{ backgroundColor: '#411530', color: '#fff' }} onClick={sendMessage}>
                    Send
                </button>
            </div>
        </div>
    );
};

export default Generate;
