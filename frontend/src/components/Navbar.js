import { NavLink } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark fixed-top p-2" style={{ backgroundColor: '#D1512D',color: '#F5E8E4' }}>
            <div className="container-fluid">
                
                <a className="website-name m-1" style={{color:"#F5C7A9"}} href="/">
                <strong>Vesper</strong>
                </a>
                <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="offcanvas offcanvas-end text-bg-dark" tabIndex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
                    <div className="offcanvas-header">
                        <h5 className="offcanvas-title" id="offcanvasNavbarLabel">Navigation</h5>
                        <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>

                    <div className="offcanvas-body">
                        <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/">Home</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/text-generation">IntelliGen</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/codex">CodeVue</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/pdf-summary">Summarization</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/auto-lit-review">Literature Review</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/humanize-text">Humanize</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/about">About</NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;
