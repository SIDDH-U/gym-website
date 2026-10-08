import React, { memo } from 'react';
import Hero from '../components/Hero';
import Ticker from '../components/Ticker';
import Programs from '../components/Programs';
import Stats from '../components/Stats';
import Transformations from '../components/Transformations';
import Trainers from '../components/Trainers';
import Pricing from '../components/Pricing';
import FinalCTA from '../components/FinalCTA';

import { useDocumentTitle } from '../utils/seo';

function Home({ onOpenTrial }) {
  useDocumentTitle(
    'IRONFORGE | Forge Your Strength. Own Your Power.',
    "IRONFORGE - Premium Men's Gym. Forge your strength. Own your power. 24/7 access, elite coaches, world-class iron equipment."
  );

  return (
    <div className="flex flex-col w-full">
      <Hero onOpenTrial={onOpenTrial} />
      <Ticker />
      <Programs />
      <Stats />
      <Transformations />
      <Trainers />
      <Pricing />
      <FinalCTA onOpenTrial={onOpenTrial} />
    </div>
  );
}

export default memo(Home);
