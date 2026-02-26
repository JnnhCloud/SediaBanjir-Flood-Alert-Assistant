import React, { useState } from 'react';

interface LocationSelectorProps {
  onLocationChange?: (state: string, area: string, location: string) => void;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({ onLocationChange }) => {
  const [selectedState, setSelectedState] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const state = e.target.value;
    setSelectedState(state);
    setSelectedArea('');
    setSelectedLocation('');
    onLocationChange?.(state, '', '');
  };

  const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const area = e.target.value;
    setSelectedArea(area);
    setSelectedLocation('');
    onLocationChange?.(selectedState, area, '');
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const location = e.target.value;
    setSelectedLocation(location);
    onLocationChange?.(selectedState, selectedArea, location);
  };

  return (
    <div className="grid grid-cols-3 gap-6 mb-8 max-md:grid-cols-1">
      <div>
        <label htmlFor="state-select" className="text-gray-900 text-base font-semibold leading-6 mb-2 block">
          State:
        </label>
        <div className="relative">
          <select
            id="state-select"
            value={selectedState}
            onChange={handleStateChange}
            className="w-full bg-gray-300 text-gray-900 text-sm font-medium leading-5 cursor-pointer px-4 py-3 rounded-lg appearance-none"
          >
            <option value="">Select state</option>
            <option value="sarawak">Sarawak</option>
            <option value="sabah">Sabah</option>
            <option value="kelantan">Kelantan</option>
            <option value="terengganu">Terengganu</option>
            <option value="pahang">Pahang</option>
          </select>
          <i className="ti ti-chevron-down absolute -translate-y-2/4 text-gray-900 text-base pointer-events-none right-4 top-2/4" />
        </div>
      </div>
      <div>
        <label htmlFor="area-select" className="text-gray-900 text-base font-semibold leading-6 mb-2 block">
          Area:
        </label>
        <div className="relative">
          <select
            id="area-select"
            value={selectedArea}
            onChange={handleAreaChange}
            disabled={!selectedState}
            className="w-full bg-gray-300 text-gray-900 text-sm font-medium leading-5 cursor-pointer px-4 py-3 rounded-lg appearance-none disabled:opacity-50"
          >
            <option value="">Select area</option>
            {selectedState === 'sarawak' && (
              <>
                <option value="miri">Miri</option>
                <option value="kuching">Kuching</option>
                <option value="sibu">Sibu</option>
              </>
            )}
          </select>
          <i className="ti ti-chevron-down absolute -translate-y-2/4 text-gray-900 text-base pointer-events-none right-4 top-2/4" />
        </div>
      </div>
      <div>
        <label htmlFor="location-select" className="text-gray-900 text-base font-semibold leading-6 mb-2 block">
          Location:
        </label>
        <div className="relative">
          <select
            id="location-select"
            value={selectedLocation}
            onChange={handleLocationChange}
            disabled={!selectedArea}
            className="w-full bg-gray-300 text-gray-900 text-sm font-medium leading-5 cursor-pointer px-4 py-3 rounded-lg appearance-none disabled:opacity-50"
          >
            <option value="">Select location</option>
            {selectedArea === 'miri' && (
              <>
                <option value="long-teru">Long Teru</option>
                <option value="baram">Baram</option>
                <option value="marudi">Marudi</option>
              </>
            )}
          </select>
          <i className="ti ti-chevron-down absolute -translate-y-2/4 text-gray-900 text-base pointer-events-none right-4 top-2/4" />
        </div>
      </div>
    </div>
  );
};
