<<<<<<< HEAD
import React from "react";

const districtData: Record<string, string[]> = {
  SARAWAK: ["Sibu", "Kuching", "Miri", "Bintulu"],
  SABAH: ["Kota Kinabalu", "Sandakan", "Tawau"],
  JOHOR: ["Johor Bahru", "Muar", "Batu Pahat"],
  SELANGOR: ["Shah Alam", "Klang", "Petaling"],
  PAHANG: ["Kuantan", "Bentong"],
  PERAK: ["Ipoh", "Taiping"],
  KELANTAN: ["Kota Bharu"],
  TERENGGANU: ["Kuala Terengganu"],
  KEDAH: ["Alor Setar"],
  PERLIS: ["Kangar"],
  "NEGERI SEMBILAN": ["Seremban"],
  MELAKA: ["Melaka Tengah"],
  "PULAU PINANG": ["George Town"]
};

interface Props {
  selectedState: string;
  setSelectedState: (state: string) => void;
  selectedDistrict: string;
  setSelectedDistrict: (district: string) => void;
}

export default function LocationSelector({
  selectedState,
  setSelectedState,
  selectedDistrict,
  setSelectedDistrict
}: Props) {
  return (
    <div style={{ marginTop: 20 }}>
      <select value={selectedState} onChange={e => { setSelectedState(e.target.value); setSelectedDistrict(""); }}>
        <option value="">Select State</option>
        {Object.keys(districtData).map(state => (
          <option key={state} value={state}>{state}</option>
        ))}
      </select>

      <select
        value={selectedDistrict}
        onChange={e => setSelectedDistrict(e.target.value)}
        style={{ marginLeft: 10 }}
      >
        <option value="">Select District</option>
        {selectedState && districtData[selectedState]?.map(d => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>
    </div>
  );
}
=======
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
>>>>>>> 6647c9ad590f2a68beb4af9fa7bcb10be892e574
