import React, { useState } from 'react';
import { FloodMap } from '@/components/FloodMap';
import { LocationSelector } from '@/components/LocationSelector';
import { AlertCard } from '@/components/AlertCard';
import { LegendIndicators } from '@/components/LegendIndicators';

const Index = () => {
  const [selectedLocation, setSelectedLocation] = useState({
    state: '',
    area: '',
    location: ''
  });

  const handleLocationChange = (state: string, area: string, location: string) => {
    setSelectedLocation({ state, area, location });
  };

  return (
    <main className="min-h-screen bg-neutral-200 px-5 py-10">
      <div className="max-w-[1200px] mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-blue-900 text-[40px] font-extrabold leading-[48px] tracking-[-0.02em]">
            FLOOD ALERT ASSISTANT
          </h1>
        </header>

        <section className="bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] mb-6 p-8 rounded-2xl">
          <h2 className="text-gray-900 text-xl font-semibold leading-7 mb-4">
            Flood Monitoring Map
          </h2>
          <FloodMap />
          <LegendIndicators />
        </section>

        <section>
          <LocationSelector onLocationChange={handleLocationChange} />
        </section>

        <AlertCard />

        <footer className="text-center text-gray-500 text-xs font-normal leading-4">
          <div className="mb-1">
            Based on data from{' '}
            <span className="font-medium">
              Department of Irrigation and Drainage Malaysia
            </span>{' '}
            &{' '}
            <span className="font-medium">
              Malaysian Meteorological Department.
            </span>
          </div>
          <div>
            • Relief Centre information is subject to official updates from NADMA.
          </div>
        </footer>
      </div>
    </main>
  );
};

export default Index;
