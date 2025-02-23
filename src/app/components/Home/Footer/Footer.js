import Link from 'next/link';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter, FaFiverr, FaUpwork } from 'react-icons/fa';
import './Footer.css';
import { FaYoutube } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="footer">
      {/* Top Section */}
      <div className="footer-top">
        {/* Logo and CTA */}
        <div className="footer-brand">
          <div className="brand-logo">
            <img src="/logo.png" alt="Echo Logo" />
          </div>
          <p className="brand-description">
            Empowering communication with cutting-edge solutions. Your success is our priority.
          </p>
          <button className="cta-button">Get a Quote</button>
        </div>

        {/* Quick Links */}
        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            {["Home", "About Us", "Services", "Blog"].map((link) => (
              <li key={link}>
                <Link href="#" className="link">{link}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-links">
          <h3>Resources</h3>
          <ul>
            {["Pricing", "FAQ", "Support", "Contact"].map((link) => (
              <li key={link}>
                <Link href="#" className="link">{link}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Social Media and Newsletter */}
        <div className="footer-social">
          <div className="social-section">
            <h3>Stay Connected</h3>
            <div className="social-icons">
              <Link href="#" aria-label="Facebook" className="social-icon">
                <FaFacebookF />
              </Link>
              <Link href="#" aria-label="Instagram" className="social-icon">
                <FaInstagram />
              </Link>
              {/* <Link href="#" aria-label="LinkedIn" className="social-icon">
                <FaLinkedinIn />
              </Link> */}
              <Link href="#" aria-label="Twitter" className="social-icon">
                <FaTwitter />
              </Link>
              <Link href="#" aria-label="Fiverr" className="social-icon">
                <FaYoutube />
              </Link>
            </div>
          </div>
          <div className="footer-newsletter">
            <p>Subscribe to our newsletter for updates and exclusive offers.</p>
            <form className="newsletter-form">
              <input
                type="email"
                placeholder="Enter your email"
                aria-label="Email"
                required
              />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="footer-bottom">
        <p>&copy; 2024 VersaNex. All rights reserved.</p>
      </div>
    </footer>
  );
}
