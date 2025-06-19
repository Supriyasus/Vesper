
const AboutUs = () => {
    // Inline styles
    const sectionStyle = {
        backgroundColor: '#F5E8E4',
        padding: '4rem 0',
    };

    const codeBoxStyle = {
        backgroundColor: '#1e1e2f',
        fontFamily: 'Source Code Pro, monospace',
        fontSize: '0.95rem',
        color: '#ffffff',
        padding: '1.5rem',
        borderRadius: '10px',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.15)',
    };

    const iconStyle = {
        fontSize: '2.5rem',
        color: '#6f42c1',
    };

    return (
        <>
            <div style={sectionStyle}>
                <div className="container">
                    {/* Header Section */}
                    <div className="row align-items-center mb-5">
                        <div className="col-md-6">
                            <h1 className="display-5 fw-bold">AI-powered Writing, Reimagined.</h1>
                            <p className="lead text-muted">
                                We’re building a smart, creative, and language-savvy platform that empowers users to
                                <strong> refine, humanize, and explore content</strong> effortlessly. From research automation to rewriting with empathy, our tools are crafted for productivity and quality.
                            </p>
                        </div>

                        {/* Code block */}
                        <div className="col-md-6 my-5">
                            <div style={codeBoxStyle}>
                                <pre className="m-0">
                                    {`> $ upload document
File received successfully.

> $ summarize --pdf
Sections extracted ✓
Summary generated ✓

> $ humanize --text
Rewriting with natural tone...
AI traces removed ✓
Human-style output ready ✓

> $ codex --explain
Code analyzed.
Explanation generated ✓

> $ all systems go
Welcome to Vesper. 🚀
                                `}
                                </pre>
                            </div>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="row text-center justify-content-center">
                        <div className="col-md-3 mb-4">
                            <i className="bi bi-pen" style={{ ...iconStyle, color: "#411530" }}></i>
                            <h6 className="fw-bold mt-3">Humanize AI Text</h6>
                            <p className="text-muted small">Refine AI-generated content into natural, human-like language — instantly.</p>
                        </div>

                        <div className="col-md-3 mb-4">
                            <i className="bi bi-search" style={{ ...iconStyle, color: "#411530" }}></i>
                            <h6 className="fw-bold mt-3">Semantic Research</h6>
                            <p className="text-muted small">Use AI to discover research papers that best match your topic — fast and intelligently.</p>
                        </div>

                        <div className="col-md-3 mb-4">
                            <i className="bi bi-file-earmark-text" style={{ ...iconStyle, color: "#411530" }}></i>
                            <h6 className="fw-bold mt-3">PDF Summarizer</h6>
                            <p className="text-muted small">Upload academic PDFs to get clean, section-wise summaries in Markdown format.</p>
                        </div>

                        <div className="col-md-3 mb-4">
                            <i className="bi bi-code-slash" style={{ ...iconStyle, color: "#411530" }}></i>
                            <h6 className="fw-bold mt-3">CodeVue</h6>
                            <p className="text-muted small">Explain, debug, or complete code intelligently with our AI-powered coding assistant.</p>
                        </div>
                    </div>


                    {/* Extra info */}
                    <div className="row mt-5 text-center">
                        <div className="col-md-12">
                            <h4 className="fw-bold mb-3">Everything you need in one AI-powered workspace</h4>
                            <p className="text-muted">Whether you're a researcher, student, writer, or engineer — our tools are designed to save time, improve clarity, and amplify impact.</p>
                        </div>
                    </div>
                </div>
            </div>
            {/* Connect Section */}
            <div
                style={{
                    backgroundColor: '#F5C7A9',  
                    height: '3rem',
                    width: '100%',
                }}
            ></div>
            <footer style={{
                backgroundColor: '#411530',
                color: '#F5E8E4',
                padding: '3rem 0',
                width: '100%',
            }}>
                <div className="container text-center">
                    <h4 className="fw-bold mb-3 mx-9">Let's Connect</h4>
                    <p className="text">
                        Hi! I am Supriya. Got questions, ideas, or want to collaborate? I’m always open to connecting!                          </p>
                    <div className="d-flex justify-content-center gap-4">
                        <a
                            href="https://github.com/Supriyasus"
                            target="_blank"
                            rel="noopener noreferrer"
                            title="GitHub"
                            aria-label="GitHub"
                            style={{
                                fontSize: '2rem',
                                color: '#F5E8E4',
                                textDecoration: 'none',
                            }}
                        >
                            <i className="bi bi-github"></i>
                        </a>
                        <a
                            href="https://www.linkedin.com/in/supriyasrivas/"
                            target="_blank"
                            rel="noopener noreferrer"
                            title="LinkedIn"
                            aria-label="LinkedIn"
                            style={{
                                fontSize: '2rem',
                                color: '#F5E8E4',
                                textDecoration: 'none',
                            }}
                        >
                            <i className="bi bi-linkedin"></i>
                        </a>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default AboutUs;
