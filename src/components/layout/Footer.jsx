import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

const Footer = () => {
    const { isDarkMode } = useContext(ThemeContext);

    const footerSections = {
        shop: {
            title: 'Shop',
            links: [
                { name: 'Luxury Watches', href: '/collections/luxury' },
                { name: 'Sports Watches', href: '/collections/sports' },
                { name: 'Classic Collection', href: '/collections/classic' },
                { name: 'Limited Editions', href: '/collections/limited' },
                { name: 'New Arrivals', href: '/collections/new' },
                { name: 'Best Sellers', href: '/collections/bestsellers' }
            ]
        },
        brands: {
            title: 'Brands',
            links: [
                { name: 'Rolex', href: '/brands/rolex' },
                { name: 'Omega', href: '/brands/omega' },
                { name: 'Tag Heuer', href: '/brands/tag-heuer' },
                { name: 'Patek Philippe', href: '/brands/patek-philippe' },
                { name: 'Audemars Piguet', href: '/brands/audemars-piguet' },
                { name: 'IWC Schaffhausen', href: '/brands/iwc' }
            ]
        },
        services: {
            title: 'Services',
            links: [
                { name: 'Watch Repair', href: '/services/repair' },
                { name: 'Authentication', href: '/services/authentication' },
                { name: 'Customization', href: '/services/customization' },
                { name: 'Insurance', href: '/services/insurance' },
                { name: 'Trade-In', href: '/services/trade-in' },
                { name: 'Warranty', href: '/services/warranty' }
            ]
        },
        company: {
            title: 'Company',
            links: [
                { name: 'About Us', href: '/about' },
                { name: 'Our Story', href: '/about/story' },
                { name: 'Craftsmanship', href: '/about/craftsmanship' },
                { name: 'Sustainability', href: '/about/sustainability' },
                { name: 'Press', href: '/about/press' },
                { name: 'Careers', href: '/about/careers' }
            ]
        },
        support: {
            title: 'Support',
            links: [
                { name: 'Contact Us', href: '/support/contact' },
                { name: 'Shipping Info', href: '/support/shipping' },
                { name: 'Returns', href: '/support/returns' },
                { name: 'Size Guide', href: '/support/size-guide' },
                { name: 'FAQ', href: '/support/faq' },
                { name: 'Privacy Policy', href: '/support/privacy' }
            ]
        }
    };

    const socialLinks = [
        { name: 'Facebook', icon: '📘', href: 'https://facebook.com' },
        { name: 'Instagram', icon: '📷', href: 'https://instagram.com' },
        { name: 'Twitter', icon: '🐦', href: 'https://twitter.com' },
        { name: 'Pinterest', icon: '📌', href: 'https://pinterest.com' },
        { name: 'YouTube', icon: '📺', href: 'https://youtube.com' }
    ];

    const paymentMethods = ['💳', '🏦', '📱', '🔗', '👛'];

    return (
        <footer className={`SoleiTic-Footer-container ${isDarkMode ? 'SoleiTic-Footer-dark' : 'SoleiTic-Footer-light'}`}>
            {/* Main Footer Content */}
            <div className="SoleiTic-Footer-main">
                <div className="SoleiTic-Footer-content">
                    {/* Brand Section */}
                    <div className="SoleiTic-Footer-brand">
                        <div className="SoleiTic-Footer-logo">
                            <span className="SoleiTic-Footer-logo-text">SoleiTic</span>
                            <span className="SoleiTic-Footer-logo-subtitle">Timeless Elegance</span>
                        </div>
                        <p className="SoleiTic-Footer-description">
                            Discover the art of precision timekeeping with our exclusive collection 
                            of luxury watches. Each timepiece tells a story of craftsmanship, 
                            innovation, and timeless elegance.
                        </p>
                        <div className="SoleiTic-Footer-social">
                            {socialLinks.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.href}
                                    className="SoleiTic-Footer-social-link"
                                    aria-label={social.name}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <span className="SoleiTic-Footer-social-icon">{social.icon}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Sections */}
                    <div className="SoleiTic-Footer-links">
                        {Object.entries(footerSections).map(([key, section]) => (
                            <div key={key} className="SoleiTic-Footer-section">
                                <h3 className="SoleiTic-Footer-section-title">{section.title}</h3>
                                <ul className="SoleiTic-Footer-section-links">
                                    {section.links.map((link, index) => (
                                        <li key={index} className="SoleiTic-Footer-section-item">
                                            <a 
                                                href={link.href} 
                                                className="SoleiTic-Footer-section-link"
                                            >
                                                {link.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Newsletter Section */}
                <div className="SoleiTic-Footer-newsletter">
                    <div className="SoleiTic-Footer-newsletter-content">
                        <div className="SoleiTic-Footer-newsletter-text">
                            <h3 className="SoleiTic-Footer-newsletter-title">
                                Stay Updated
                            </h3>
                            <p className="SoleiTic-Footer-newsletter-description">
                                Subscribe to receive updates on new collections, exclusive offers, 
                                and watch care tips.
                            </p>
                        </div>
                        <form className="SoleiTic-Footer-newsletter-form">
                            <div className="SoleiTic-Footer-newsletter-input-group">
                                <input 
                                    type="email" 
                                    placeholder="Enter your email address"
                                    className="SoleiTic-Footer-newsletter-input"
                                    required
                                />
                                <button 
                                    type="submit"
                                    className="SoleiTic-Footer-newsletter-button"
                                >
                                    Subscribe
                                </button>
                            </div>
                            <p className="SoleiTic-Footer-newsletter-note">
                                By subscribing, you agree to our Privacy Policy
                            </p>
                        </form>
                    </div>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className="SoleiTic-Footer-bottom">
                <div className="SoleiTic-Footer-bottom-content">
                    <div className="SoleiTic-Footer-copyright">
                        <p>&copy; 2024 SoleiTic Watches. All rights reserved.</p>
                    </div>
                    
                    <div className="SoleiTic-Footer-payment">
                        <span className="SoleiTic-Footer-payment-text">We accept:</span>
                        <div className="SoleiTic-Footer-payment-methods">
                            {paymentMethods.map((method, index) => (
                                <span key={index} className="SoleiTic-Footer-payment-method">
                                    {method}
                                </span>
                            ))}
                        </div>
                    </div>
                    
                    <div className="SoleiTic-Footer-legal">
                        <a href="/privacy" className="SoleiTic-Footer-legal-link">Privacy Policy</a>
                        <a href="/terms" className="SoleiTic-Footer-legal-link">Terms of Service</a>
                        <a href="/cookies" className="SoleiTic-Footer-legal-link">Cookie Policy</a>
                    </div>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="SoleiTic-Footer-decoration SoleiTic-Footer-decoration-1"></div>
            <div className="SoleiTic-Footer-decoration SoleiTic-Footer-decoration-2"></div>
        </footer>
    );
};

export default Footer;