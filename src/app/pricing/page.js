'use client';
import './Pricing.css';
import Header from '../components/Home/Header/Header';
import Footer from '../components/Home/Footer/Footer';
export default function Pricing() {
  return (
    <>
      <Header />
      <div className="pricing-container">
        <h1 className="pricing-heading">Our Pricing Plans</h1>
        <p className="pricing-description">Choose the perfect plan for your needs and unlock amazing benefits.</p>

        <div className="pricing-cards">
          <div className="pricing-card">
            <h2 className="plan-header">Basic</h2>
            <p className="plan-price">$10/month</p>
            <ul className="plan-features">
              <li>Access to basic features</li>
              <li>Email support</li>
              <li>5 GB storage</li>
            </ul>
            <button className="plan-button">Choose Basic</button>
          </div>

          <div className="pricing-card">
            <h2 className="plan-header">Standard</h2>
            <p className="plan-price">$20/month</p>
            <ul className="plan-features">
              <li>Everything in Basic</li>
              <li>Priority email support</li>
              <li>50 GB storage</li>
              <li>Access to new features</li>
            </ul>
            <button className="plan-button">Choose Standard</button>
          </div>

          <div className="pricing-card">
            <h2 className="plan-header">Premium</h2>
            <p className="plan-price">$50/month</p>
            <ul className="plan-features">
              <li>Everything in Standard</li>
              <li>24/7 customer support</li>
              <li>Unlimited storage</li>
              <li>Customizable features</li>
              <li>Dedicated account manager</li>
            </ul>
            <button className="plan-button">Choose Premium</button>
          </div>
        </div>

      </div>
      <Footer/>
    </>
  );
}
