import React, { useState } from "react";

interface LocationSelectorProps {
  onLocationChange?: (state: string, district: string, area: string) => void;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  onLocationChange,
}) => {
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedArea, setSelectedArea] = useState("");

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const state = e.target.value;
    setSelectedState(state);
    setSelectedDistrict("");
    setSelectedArea("");
    onLocationChange?.(state, "", "");
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const district = e.target.value;
    setSelectedDistrict(district);
    setSelectedArea("");
    onLocationChange?.(selectedState, district, "");
  };

  const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const area = e.target.value;
    setSelectedArea(area);
    onLocationChange?.(selectedState, selectedDistrict, area);
  };

  return (
    <div className="grid grid-cols-3 gap-6 mb-8 max-md:grid-cols-1">
      {/* STATE */}
      <div>
        <label className="font-semibold mb-2 block">State:</label>
        <select
          value={selectedState}
          onChange={handleStateChange}
          className="w-full bg-gray-300 px-4 py-3 rounded-lg"
        >
          <option value="">Select state</option>
          <option value="sarawak">Sarawak</option>
          <option value="sabah">Sabah</option>
        </select>
      </div>

      {/* DISTRICT */}
      <div>
        <label className="font-semibold mb-2 block">District:</label>
        <select
          value={selectedDistrict}
          onChange={handleDistrictChange}
          disabled={!selectedState}
          className="w-full bg-gray-300 px-4 py-3 rounded-lg disabled:opacity-50"
        >
          <option value="">Select district</option>
          {selectedState === "sarawak" && (
            <>
              <option value="miri">Miri</option>
              <option value="kuching">Kuching</option>
              <option value="sibu">Sibu</option>
            </>
          )}
        </select>
      </div>

      {/* AREA */}
      <div>
        <label className="font-semibold mb-2 block">Area:</label>
        <select
          value={selectedArea}
          onChange={handleAreaChange}
          disabled={!selectedDistrict}
          className="w-full bg-gray-300 px-4 py-3 rounded-lg disabled:opacity-50"
        >
          <option value="">Select area</option>
          {selectedDistrict === "miri" && (
            <>
              <option value="long-teru">Long Teru</option>
              <option value="baram">Baram</option>
            </>
          )}
        </select>
      </div>
    </div>
  );
};