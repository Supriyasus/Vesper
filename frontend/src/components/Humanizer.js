import React, { useState } from "react";
import "../App.css";
import axios from "../api/api";

const Humanizer = () => {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [loading, setLoading] = useState(false);
    const [wordCount, setWordCount] = useState(0);

    const handleHumanize = async () => {
        if (!input.trim()) return;
        setLoading(true);
        try {
            const res = await axios.post("/humanize-text/", { query: input });
            setOutput(res.data.response);
        } catch (err) {
            setOutput("Error processing request.");
        }
        setLoading(false);
    };

    const handleInputChange = (e) => {
        const text = e.target.value;
        const words = text.trim().split(/\s+/).filter(Boolean);
        setWordCount(words.length);
        setInput(text);
    };

    return (
        <div className="container text-center my-5 py-5">
            <h1 className="home-title display-5 mb-2">Humanize Your AI Text</h1>
            <p className="lead home-subtitle mb-4">
                Make your AI writing sound naturally human — smoother, more authentic, and ready to share.
            </p>

            <div className="row justify-content-center">
                <div className="col-lg-10 col-md-4">
                    <div className="row border rounded shadow p-4" style={{ backgroundColor: "#fdfdfd" }}>
                        {/* Left Box */}
                        <div className="col-md-6 d-flex flex-column">
                            <h5 className="mb-3">Original Text</h5>
                            <textarea
                                className="form-control"
                                style={{ height: "280px" }}
                                placeholder="Paste your AI-generated text here..."
                                value={input}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Right Box */}
                        <div className="col-md-6 d-flex flex-column">
                            <h5 className="mb-3">Humanized Output</h5>
                            <textarea
                                className="form-control"
                                style={{ height: "280px" }}
                                placeholder="Humanized text will appear here..."
                                value={output}
                                readOnly
                            />
                        </div>

                        {/* Word Count - full row, positioned below both boxes */}
                        <div className="col-12 text-end mt-2">
                            <small className="text-muted">
                                Word count: {wordCount} / 250
                                {wordCount > 250 && <span className="text-danger"> — Limit exceeded!</span>}
                            </small>
                        </div>
                    </div>


                    {/* Button */}
                    <div className="mt-4">
                        <button
                            className="btn px-5 py-2"
                            style={{ background: "#411530", color: "#F7F7F7" }}
                            onClick={handleHumanize}
                            disabled={loading || wordCount > 250}
                        >
                            {loading ? "Humanizing..." : "Humanize Text"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Humanizer;
