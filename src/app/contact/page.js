'use client';
import { useState } from 'react';
import './Contact.css';
import Header from '../components/Home/Header/Header';
import Footer from '../components/Home/Footer/Footer';
export default function Contact() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formState);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
    <Header/>
    <div className="contact-page">
      <h1 className="contact-heading">Contact Us</h1>
      <div className="contact-form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formState.name}
              onChange={handleInputChange}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formState.email}
              onChange={handleInputChange}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="message" className="form-label">Message</label>
            <textarea
              id="message"
              name="message"
              value={formState.message}
              onChange={handleInputChange}
              required
              rows="4"
              className="form-textarea"
            />
          </div>
          <button type="submit" className="submit-button">
            Send Message
          </button>
        </form>
      </div>

      <div className="contact-details">
        <h2>Other Ways to Reach Us</h2>
        <p>Email: contact@example.com</p>
        <p>Phone: +1 (123) 456-7890</p>
        <p>Address: 123 Main St, City, Country</p>
      </div>
    </div>
    <Footer/>
    </>
  );
}
