import React from 'react';
import { NextPage } from 'next';
import Header from '../../../components/Header';
import Hero from '../../../components/Hero';
import Services from '../../../components/Services';
import About from '../../../components/About';
import Footer from '../../../components/Footer';
import Categories from '../../../components/Categories';

const Home: NextPage = () => {
  return (
    <div>
      <Header />
      <Hero />
      <Categories />
      <Services />
      <About />
      <Footer />
    </div>
  );
};

export default Home;
