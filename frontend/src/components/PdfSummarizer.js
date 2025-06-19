import { useState } from 'react';
import axios from '../api/api';
import ReactMarkdown from 'react-markdown';

const PdfSummarizer = () => {
  const [file, setFile] = useState(null);
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(false);

  const handleSubmit = async () => {
    if (!file) {
      alert("Please upload a PDF first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("query", query);

    try {
      setLoading(true);
      setError('');
      setResponse('');
      const res = await axios.post("http://localhost:8000/summarize-pdf/", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setResponse(res.data.response);
    } catch (err) {
      console.error("Error summarizing PDF:", err);
      setError("Summarization failed. Please try again or check the backend logs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 my-5">
      <h2 className="home-title display-5 mb-4">Summarizer</h2>
      <h5 className="lead text-center mb-4">
        Upload a research paper and get a clear, concise summary of each section
      </h5>
      <div className="mb-3">
        <label className="form-label fw-bold">Upload PDF</label>
        <input
          type="file"
          accept="application/pdf"
          className="form-control"
          onChange={e => setFile(e.target.files[0])}
        />
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold">Optional Query</label>
        <textarea
          className="form-control"
          rows="3"
          placeholder="Example: Summarize the methodology section or highlight results"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>

      <button className="btn" style={{ backgroundColor: "#411530", color: "#F7F7F7" }} onClick={handleSubmit} disabled={loading}>
        {loading ? "Summarizing..." : "Summarize PDF"}
      </button>

      {error && (
        <div className="alert alert-danger mt-4">
          {error}
        </div>
      )}

      {response && (
        <div
          className="mt-4 p-3 rounded"
          style={{
            backgroundColor: '#F5C7A9',
            whiteSpace: 'pre-wrap',
            border: '1px solid #e0a877'
          }}
        >
          <ReactMarkdown>
            {expanded ? response : response.slice(0, 800) + (response.length > 800 ? '...' : '')}
          </ReactMarkdown>

          {response.length > 800 && (
            <div>
              <button
                className="btn btn-link p-0 mt-2 my-4 mx-1"
                style={{ color: '#411530', textDecoration: "underline" }}
                onClick={() => setExpanded(!expanded)}
              >
                <strong>{expanded ? "Read Less" : "Read More"}</strong>
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default PdfSummarizer;
