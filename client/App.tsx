import React, { useState, useEffect } from 'react';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Events } from './components/Events';
import { Updates } from './components/Updates';
import { Team } from './components/Team';
import { JoinForm } from './components/JoinForm';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { Background3D } from './components/Background3D';
import { Tesseract, FloatingCrystal, GyroScope } from './components/Shapes3D';
import { EventsBackground3D } from './components/EventsBackground3D';
import { Zap } from 'lucide-react';
import { HelpButton } from './components/HelpButton';

import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';

// Extracting the main landing page content to a sub-component for cleaner routing
const LandingPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('home');

  // Simple scroll spy to update active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'events', 'updates', 'team', 'join'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="font-rajdhani min-h-screen bg-cyber-black text-gray-200 selection:bg-cyber-neonBlue selection:text-black overflow-x-hidden">

      {/* GLOBAL 3D BACKGROUND (CANVAS) */}
      <Background3D />

      {/* Background Decor Elements (Static Blobs) - kept for extra color depth */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyber-neonBlue blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyber-neonPurple blur-[120px] rounded-full animate-pulse delay-1000" />
      </div>

      <Navbar activeSection={activeSection} />
      <HelpButton />

      <main className="relative z-10 flex flex-col gap-0">
        <section id="home" className="min-h-screen flex items-center justify-center pt-16 relative">
          <Hero />
        </section>

        <section id="about" className="py-20 px-4 md:px-8 bg-cyber-dark/30 border-t border-cyber-panel relative overflow-hidden">
          {/* 3D Decor for About: Tesseract */}
          <div className="absolute top-10 right-[-50px] md:right-20 z-0 scale-75 md:scale-100">
            <Tesseract />
          </div>
          <div className="relative z-10">
            <About />
          </div>
        </section>

        <section id="events" className="py-20 px-4 md:px-8 relative overflow-hidden">
          {/* Interactive 3D Background for Events */}
          <EventsBackground3D />

          {/* 3D Decor for Events: GyroScope */}
          <div className="absolute bottom-10 left-[-50px] md:left-20 z-0 scale-75 md:scale-100">
            <GyroScope />
          </div>
          <div className="relative z-10">
            <Events />
          </div>
        </section>

        <section id="updates" className="py-20 px-4 md:px-8 bg-cyber-dark/30 border-y border-cyber-panel relative">
          {/* 3D Decor for Updates: Subtle floating crystal in distance? */}
          <div className="absolute top-0 right-0 z-0 opacity-10 translate-x-1/2">
            <Tesseract />
          </div>
          <div className="relative z-10">
            <Updates />
          </div>
        </section>

        <section id="team" className="py-20 px-4 md:px-8 relative overflow-hidden">
          {/* 3D Decor for Team: Floating Crystal */}
          <div className="absolute top-1/2 right-10 transform -translate-y-1/2 z-0 scale-75 md:scale-100">
            <FloatingCrystal />
          </div>
          <div className="relative z-10">
            <Team />
          </div>
        </section>

        <section id="join" className="py-20 px-4 md:px-8 bg-gradient-to-b from-cyber-black to-cyber-dark border-t border-cyber-panel relative overflow-hidden">
          {/* 3D Decor for Join: Another GyroScope on the other side */}
          <div className="absolute bottom-0 left-[-100px] z-0 opacity-20 scale-150">
            <GyroScope />
          </div>
          <div className="relative z-10">
            <JoinForm />
          </div>
        </section>
      </main>

      <Footer />

      {/* Floating Action Button for quick join on mobile */}
      <a
        href="#join"
        className="fixed bottom-6 right-6 md:hidden z-50 bg-cyber-neonPink text-white p-4 rounded-full shadow-[0_0_15px_rgba(255,0,85,0.5)] active:scale-95 transition-transform"
        aria-label="Join Now"
      >
        <Zap size={24} fill="currentColor" />
      </a>
    </div>
  );
}

import { TeamsManagement } from './components/TeamsManagement';

// ... (imports remain the same, adding TeamsManagement to routes)

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/teams" element={<TeamsManagement />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;