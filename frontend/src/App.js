import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Humanizer from "./components/Humanizer";
import Home from "./components/Home";  
import Generate from "./components/Generate";
import Codex from "./components/Codex";
import PdfSummarizer from "./components/PdfSummarizer";
import AutoLitReview from "./components/AutoLitReview";
import About from "./components/About";

function App() {
  return (
    <Router>
      <Navbar />
      
      <Routes>
        <Route path="/about" element={<About />} />
        <Route path="/" element={<Home />} />
        <Route path="/humanize-text" element={<Humanizer />} />
        <Route path="/text-generation" element={<Generate />} />
        <Route path="/codex" element={<Codex />} />
        <Route path="/pdf-summary" element={<PdfSummarizer/>}/>
        <Route path="/auto-lit-review" element={<AutoLitReview />} />
      </Routes>
    </Router>
  );
}

export default App;
