import { useState, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, LazyMotion, domMax, m } from 'framer-motion';

import IntroLoader from './components/IntroLoader';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import StickyMobileJoin from './components/StickyMobileJoin';
import FreeTrialModal from './components/FreeTrialModal';
import ScrollToTop from './components/ScrollToTop';
import FpsMeter from './components/FpsMeter';
import Home from './pages/Home';
import { ROUTE_VARIANTS } from './motion';

// Lazy load detail subpages
const ProgramDetail = lazy(() => import('./pages/ProgramDetail'));
const TrainerDetail = lazy(() => import('./pages/TrainerDetail'));

function AnimatedRoutes({ onOpenTrial }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <m.div variants={ROUTE_VARIANTS} initial="initial" animate="animate" exit="exit" className="w-full">
              <Home onOpenTrial={onOpenTrial} />
            </m.div>
          }
        />
        <Route
          path="/programs/:slug"
          element={
            <m.div variants={ROUTE_VARIANTS} initial="initial" animate="animate" exit="exit" className="w-full">
              <ProgramDetail onOpenTrial={onOpenTrial} />
            </m.div>
          }
        />
        <Route
          path="/trainers/:slug"
          element={
            <m.div variants={ROUTE_VARIANTS} initial="initial" animate="animate" exit="exit" className="w-full">
              <TrainerDetail onOpenTrial={onOpenTrial} />
            </m.div>
          }
        />
        <Route
          path="*"
          element={
            <m.div variants={ROUTE_VARIANTS} initial="initial" animate="animate" exit="exit" className="w-full">
              <Home onOpenTrial={onOpenTrial} />
            </m.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  const [trialModalOpen, setTrialModalOpen] = useState(false);
  const [trialModalData, setTrialModalData] = useState({});

  const handleOpenTrial = (customData = {}) => {
    setTrialModalData(customData);
    setTrialModalOpen(true);
  };

  return (
    <LazyMotion features={domMax} strict={false}>
      <BrowserRouter>
        <ScrollToTop />
        
        <div className="min-h-screen bg-[#0A0A0A] text-[#F2F2F0] flex flex-col selection:bg-[#E8590C] selection:text-white relative pb-16 lg:pb-0">
          {/* Barbell Intro Loader */}
          <IntroLoader />

          {/* Global Navbar */}
          <Navbar onOpenTrial={handleOpenTrial} />

          {/* Dev FPS Overlay (enabled via ?fps=1) */}
          <FpsMeter />

          {/* Dynamic Pages */}
          <main className="flex-grow flex flex-col">
            <Suspense
              fallback={
                <div className="min-h-[60vh] flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full border-2 border-[#E8590C] border-t-transparent animate-spin" />
                </div>
              }
            >
              <AnimatedRoutes onOpenTrial={handleOpenTrial} />
            </Suspense>
          </main>

          {/* Global Compact Footer */}
          <Footer />

          {/* Sticky Mobile Join Bar (56px, auto-hides on pricing & final CTA) */}
          <StickyMobileJoin />

          {/* Global Free Trial Pass Modal / Mobile Bottom Sheet */}
          <FreeTrialModal
            isOpen={trialModalOpen}
            onClose={() => setTrialModalOpen(false)}
            initialData={trialModalData}
          />
        </div>
      </BrowserRouter>
    </LazyMotion>
  );
}
