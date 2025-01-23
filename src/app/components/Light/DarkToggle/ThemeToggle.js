"use client";

import { useState, useEffect } from "react";
import "./ThemeToggle.css";

export default function ThemeToggle() {
  const [isChecked, setIsChecked] = useState(false); // Default state
  const [isMounted, setIsMounted] = useState(false); // Check if the component is mounted

  // Effect to set the initial theme after the component has mounted
  useEffect(() => {
    setIsMounted(true); // Mark component as mounted
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsChecked(true);
      updateTheme(true); // Apply the saved theme
    }
  }, []);

  // Function to toggle theme and save it to localStorage
  const toggleTheme = () => {
    const newTheme = !isChecked;
    setIsChecked(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
    updateTheme(newTheme);
  };

  // Function to update the theme class on the <body>
  const updateTheme = (isDark) => {
    if (isDark) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  };

  if (!isMounted) {
    return null; // Render nothing while waiting for hydration
  }

  return (
    <div className="wrapper">
      <label className="label-theme">
        {/* Sun and Rays for light theme */}
        <div className="astro-theme">
          <div className="crater-theme"></div>
          <div className="crater-theme"></div>
          <div className="crater-theme"></div>
        </div>

        {/* Sun Light Rays */}
        <div className="light-theme"></div>
        <div className="light-theme"></div>
        <div className="light-theme"></div>

        {/* Clouds */}
        <div className="cloud-theme"></div>
        <div className="cloud-theme"></div>
        <div className="cloud-theme"></div>

        {/* Stars */}
        <div className="star-theme"></div>
        <div className="star-theme"></div>
        <div className="star-theme"></div>
        <div className="star-theme"></div>
        <div className="star-theme"></div>

        {/* Toggle checkbox */}
        <input type="checkbox" checked={isChecked} onChange={toggleTheme} />
      </label>
    </div>
  );
}
