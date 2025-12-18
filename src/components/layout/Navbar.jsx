import React, { useState, useContext, useRef, useEffect } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

const Navbar = () => {
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const navbarRef = useRef(null);

    const menuItems = [
        {
            title: 'Collections',
            items: ['Luxury Series', 'Sports Edition', 'Classic Collection', 'Limited Edition']
        },
        {
            title: 'Brands',
            items: ['Rolex', 'Omega', 'Tag Heuer', 'Patek Philippe', 'Audemars Piguet']
        },
        {
            title: 'Services',
            items: ['Watch Repair', 'Customization', 'Authentication', 'Insurance']
        },
        {
            title: 'About',
            items: ['Our Story', 'Craftsmanship', 'Sustainability', 'Press']
        }
    ];

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleDropdownEnter = (index) => {
        setActiveDropdown(index);
    };

    const handleDropdownLeave = () => {
        setActiveDropdown(null);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (navbarRef.current && !navbarRef.current.contains(event.target)) {
                setIsMenuOpen(false);
                setActiveDropdown(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <nav 
            ref={navbarRef}
            className={`SoleiTic-Navbar-container ${isDarkMode ? 'SoleiTic-Navbar-dark' : 'SoleiTic-Navbar-light'}`}
        >
            <div className="SoleiTic-Navbar-content">
                {/* Logo */}
                <div className="SoleiTic-Navbar-logo">
                    <a href="/" className="SoleiTic-Navbar-logo-link">
                        <span className="SoleiTic-Navbar-logo-text">SoleiTic</span>
                        <span className="SoleiTic-Navbar-logo-subtitle">Timeless Elegance</span>
                    </a>
                </div>

                {/* Desktop Menu */}
                <div className="SoleiTic-Navbar-menu">
                    {menuItems.map((item, index) => (
                        <div 
                            key={index}
                            className="SoleiTic-Navbar-menu-item"
                            onMouseEnter={() => handleDropdownEnter(index)}
                            onMouseLeave={handleDropdownLeave}
                        >
                            <button className="SoleiTic-Navbar-menu-button">
                                {item.title}
                                <span className="SoleiTic-Navbar-arrow">▼</span>
                            </button>
                            
                            {activeDropdown === index && (
                                <div className="SoleiTic-Navbar-dropdown">
                                    {item.items.map((subItem, subIndex) => (
                                        <a 
                                            key={subIndex}
                                            href={`/${item.title.toLowerCase()}/${subItem.toLowerCase().replace(' ', '-')}`}
                                            className="SoleiTic-Navbar-dropdown-item"
                                        >
                                            {subItem}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Right Side Actions */}
                <div className="SoleiTic-Navbar-actions">
                    <button 
                        className="SoleiTic-Navbar-theme-toggle"
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                    >
                        {isDarkMode ? '☀️' : '🌙'}
                    </button>
                    
                    <a href="/search" className="SoleiTic-Navbar-action-icon" aria-label="Search">
                        🔍
                    </a>
                    
                    <a href="/account" className="SoleiTic-Navbar-action-icon" aria-label="Account">
                        👤
                    </a>
                    
                    <a href="/cart" className="SoleiTic-Navbar-action-icon SoleiTic-Navbar-cart" aria-label="Cart">
                        🛒
                        <span className="SoleiTic-Navbar-cart-badge">3</span>
                    </a>

                    {/* Mobile Menu Button */}
                    <button 
                        className={`SoleiTic-Navbar-mobile-toggle ${isMenuOpen ? 'SoleiTic-Navbar-mobile-toggle-active' : ''}`}
                        onClick={toggleMenu}
                        aria-label="Toggle menu"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`SoleiTic-Navbar-mobile-menu ${isMenuOpen ? 'SoleiTic-Navbar-mobile-menu-active' : ''}`}>
                {menuItems.map((item, index) => (
                    <div key={index} className="SoleiTic-Navbar-mobile-menu-item">
                        <button 
                            className="SoleiTic-Navbar-mobile-menu-button"
                            onClick={() => setActiveDropdown(activeDropdown === index ? null : index)}
                        >
                            {item.title}
                            <span className={`SoleiTic-Navbar-mobile-arrow ${activeDropdown === index ? 'SoleiTic-Navbar-mobile-arrow-active' : ''}`}>
                                ▼
                            </span>
                        </button>
                        
                        <div className={`SoleiTic-Navbar-mobile-dropdown ${activeDropdown === index ? 'SoleiTic-Navbar-mobile-dropdown-active' : ''}`}>
                            {item.items.map((subItem, subIndex) => (
                                <a 
                                    key={subIndex}
                                    href={`/${item.title.toLowerCase()}/${subItem.toLowerCase().replace(' ', '-')}`}
                                    className="SoleiTic-Navbar-mobile-dropdown-item"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {subItem}
                                </a>
                            ))}
                        </div>
                    </div>
                ))}
                
                <div className="SoleiTic-Navbar-mobile-actions">
                    <a href="/search" className="SoleiTic-Navbar-mobile-action">Search</a>
                    <a href="/account" className="SoleiTic-Navbar-mobile-action">Account</a>
                    <a href="/cart" className="SoleiTic-Navbar-mobile-action">Cart (3)</a>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;