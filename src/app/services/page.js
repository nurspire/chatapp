'use client'
import React, { useEffect, useRef } from 'react';
import './services.css';

const services = [
  {
    icon: 'strategy',
    title: 'Quantum Strategy',
    description: 'Harness the power of quantum computing to revolutionize your business strategies.'
  },
  {
    icon: 'web',
    title: 'Neuro-Adaptive Interfaces',
    description: "Create web experiences that adapt in real-time to user's cognitive patterns."
  },
  {
    icon: 'mobile',
    title: 'Holographic Mobile Ecosystems',
    description: 'Develop mobile applications that project interactive holograms for immersive experiences.'
  },
  {
    icon: 'security',
    title: 'Quantum Encryption Shield',
    description: 'Implement unbreakable security protocols using quantum entanglement principles.'
  },
  {
    icon: 'data',
    title: 'Sentient Data Orchestration',
    description: 'Empower your data to make autonomous decisions using advanced AI algorithms.'
  },
  {
    icon: 'ai',
    title: 'Cognitive AI Synthesis',
    description: 'Merge human intuition with AI capabilities to create hybrid intelligence solutions.'
  }
];

const ServicesSection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
          }
        });
      },
      { threshold: 0.1 }
    );

    const cards = document.querySelectorAll('.service-card');
    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const cards = document.querySelectorAll('.service-card');
    
    const handleMouseMove = (e) => {
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <section className="services-section" ref={sectionRef}>
      <div className="services-background">
        <div className="gradient-sphere"></div>
        <div className="gradient-sphere"></div>
        <div className="gradient-sphere"></div>
      </div>
      <div className="content-wrapper">
        <h2 className="services-title">Futuristic Solutions</h2>
        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card" style={{animationDelay: `${index * 0.1}s`}}>
              <div className="service-content">
                <div className={`service-icon ${service.icon}`}></div>
                <h3 className="service-title">{service.title}</h3>
                <p className="service-description">{service.description}</p>
              </div>
              <div className="service-shine"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
