import ContactSection from '../components/sections/ContactSection.jsx';
import React from 'react';

import HeroSection from '../components/sections/HeroSection.jsx';
import StatsSection from '../components/sections/StatsSection.jsx';
import AboutSection from '../components/sections/AboutSection.jsx';
import TrainingSection from '../components/sections/TrainingSection.jsx';
import TrainersSection from '../components/sections/TrainersSection.jsx';
import FacilitiesSection from '../components/sections/FacilitiesSection.jsx';
import ReviewsSection from '../components/sections/ReviewsSection.jsx';
import Header from '../components/layout/Header.jsx';
import Footer from '../components/layout/Footer.jsx';
import BranchesSection from '../components/sections/BranchesSection.jsx';
export default function Website({ c }) {
  return (
    <>
      <Header c={c} />
      <main>
        <HeroSection c={c} />
        <StatsSection c={c} />
        <AboutSection c={c} />
        <TrainingSection c={c} />
        <TrainersSection c={c} />
        <FacilitiesSection c={c} />
        <ReviewsSection c={c} />
        <BranchesSection c={c} />
        <ContactSection c={c} />
      </main>
      <Footer c={c} />
    </>
  );
}
