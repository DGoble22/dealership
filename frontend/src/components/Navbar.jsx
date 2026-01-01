import React from 'react';
import {Link} from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="nav-logo">🚔 Tahoe Kings 👑</div>
            <ul className="nav-links">
                <li><Link to="/">Inventory</Link></li>
                <li><Link to="/AboutUs">About Us</Link></li>
            </ul>
            <div className="nav-status">
                <span className="status-indicator"></span> System Online
            </div>
        </nav>
    );
};

export default Navbar;