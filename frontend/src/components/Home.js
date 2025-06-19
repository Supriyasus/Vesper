import React, { useState } from "react";
import "../App.css";
import { FaSearch } from "react-icons/fa";
import axios from "../api/api";

const Home = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await axios.get(`/semantic-search/`, {
        params: { query: query },
      });
      setResults(res.data.papers);  // Save results into state
    } catch (err) {
      console.error(err);
      setResults([]);
    }
    setLoading(false);
  };

  return (
    <div className="home-container container text-center mt-5">
      <h1 className="home-title display-5 mb-4">
        Smarter Writing, Deeper Research, Faster Code.
      </h1>
      <div className="home-search-section">
        <div className="home-search-bar input-group mb-3 w-75 mx-auto">
          <input
            type="text"
            className="form-control"
            placeholder="Enter your search query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button className="home-search-btn btn btn-primary mx-2 " onClick={handleSearch}>
            <FaSearch />
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && <p>Searching...</p>}

      {/* Display search results */}
      {!loading && results.length > 0 && (
        <div className="mt-4 text-start w-75 mx-auto">
          <h4>Search Results:</h4>
          <ul className="list-group">
            {results.map((paper, index) => (
              <li key={index} className="list-group-item mb-3 shadow-sm">
                <strong>
                  <a href={paper.link} style={{color:"#411530"}} target="_blank" rel="noopener noreferrer">
                    {paper.title}
                  </a>
                </strong>
                <br />
                Authors: {paper.authors && paper.authors.length > 0
                  ? paper.authors.join(", ")
                  : "Unknown"}
                <br />
                Year: {paper.year || "N/A"}
              </li>
            ))}
          </ul>

        </div>
      )}
    </div>
  );
};

export default Home;
