import { useState } from 'react';
import axios from '../api/api';
import jsPDF from 'jspdf';
import ReactMarkdown from 'react-markdown';

const AutoLitReview = () => {
  const [query, setQuery] = useState('');
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(false);

  const handleGenerateReview = async () => {
    if (!query.trim()) {
      return alert("Please enter a topic for the literature review.");
    }

    setLoading(true);
    setReview('');
    setError('');

    try {
      const res = await axios.post('/auto-lit-review/', { query });
      setReview(res.data.response);
    } catch (err) {
      console.error(err);
      setError("Failed to generate literature review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(review, 180);  // Wraps text nicely
    doc.text(lines, 10, 10);
    doc.save(`literature_review_${query.slice(0, 20)}.pdf`);
  };


  return (
    <div className="container py-5 my-3">
    <div className="container py-5">
      <h2 className="home-title display-5 mb-3">Auto Literature Review</h2>
      <p className="lead text-center mb-4">
        Enter a research topic to instantly generate a structured literature review using AI-based synthesis from top papers.
      </p>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="e.g. Emotion Detection using Transformers"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <button className="btn mb-3" style={{backgroundColor:"#411530",color:"#F7F7F7"}} onClick={handleGenerateReview} disabled={loading}>
        {loading ? "Generating..." : "Generate Literature Review"}
      </button>

      {error && <div className="alert alert-danger">{error}</div>}

      {review && (
        <div
          className="mt-4 p-3 rounded"
          style={{
            backgroundColor: '#F5C7A9',
            whiteSpace: 'pre-wrap',
            border: '1px solid #e0a877'
          }}
        >
          <ReactMarkdown>
            {expanded ? review : review.slice(0, 800) + (review.length > 800 ? '...' : '')}
          </ReactMarkdown>
            {review.length > 800 && (
              <div>
                <button
                  className="btn btn-link p-0 mt-2 my-4 mx-1 "
                  style={{ color: '#411530', textDecoration:"underline" }}
                  onClick={() => setExpanded(!expanded)}
                >
                  <strong>{expanded ? "Read Less" : "Read More"}</strong>
                </button>
              </div>
            )}
          
          <button
            className="btn"
            style={{backgroundColor:"#411530", color:"#F7F7F7"}}
    
            onClick={handleDownloadPDF}
          >
            Download as PDF
          </button>


        </div>
      )}
    </div>
    </div>
  );
};

export default AutoLitReview;
