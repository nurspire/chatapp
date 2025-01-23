'use client';
import { motion } from 'framer-motion';
import './About.css';
import Header from '../components/Home/Header/Header';
import Footer from '../components/Home/Footer/Footer';
export default function About() {
  const teamMembers = [
    { name: 'Fahad', position: 'Founder', image: '/fahad.png' },
    { name: 'Ali', position: 'Co-Founder', image: '/ali.png' },
    // { name: 'Uneeb', position: 'Co-Founder', image: '/uneeb.png' },
    // { name: 'Moaz', position: 'Co-Founder', image: '/moaz.png' },
  ];

  return (
    <>
      <Header />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="about-container"
      >
        <motion.h1
          className="about-heading"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          About Us
        </motion.h1>

        <motion.div
          className="about-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="section">
            <motion.h2
              className="section-heading"
              whileHover={{ scale: 1.02, color: 'var(--color-accent)' }}
            >
              Our Story
            </motion.h2>
            <motion.p className="section-text" whileHover={{ x: 5 }}>
              Founded in 2023, we strive to enhance the digital experience through innovation, quality, and value.
            </motion.p>
            <motion.p className="section-text" whileHover={{ x: 5 }}>
              Our mission is to empower businesses and individuals with transformative solutions.
            </motion.p>
          </div>

          <div className="section">
            <motion.h2
              className="section-heading"
              whileHover={{ scale: 1.02, color: 'var(--color-accent)' }}
            >
              Our Mission
            </motion.h2>
            <motion.p className="section-text" whileHover={{ x: 5 }}>
              Simplifying complexity through innovative solutions that positively impact lives.
            </motion.p>
            <motion.p className="section-text" whileHover={{ x: 5 }}>
              Guided by integrity and collaboration, we aim to shape a better future.
            </motion.p>
          </div>
        </motion.div>

        <motion.div
          className="team-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h2 className="team-heading">Meet the Team</h2>
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                className="team-member"
                whileHover={{ scale: 1.03, boxShadow: '0 0 15px var(--color-shadow-accent)' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <div 
                  className="team-member-icon" 
                  style={{ 
                    backgroundImage: `url(${member.image})`, 
                    backgroundSize: 'cover', 
                    backgroundPosition: 'center', 
                    width: '120px', 
                    height: '120px', 
                    borderRadius: '50%', 
                    overflow: 'hidden' 
                  }}
                ></div>
                <h3 className="team-member-name">{member.name}</h3>
                <p className="team-member-position">{member.position}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
      <Footer/>
    </>
  );
}
