import React from "react";
import Header from "./Header/Header";
import Hero from "./Hero/Hero";
import Features from "./Features/Features";
import Testimonials from "./Testimonials/Testimonial";
import Footer from "./Footer/Footer";
const Home = () => {
  return (
    <div>
      <Header/>
      <Hero/>
      <Features/>
      <Testimonials/>
      <Footer/>
    </div>
  );
};

export default Home;
