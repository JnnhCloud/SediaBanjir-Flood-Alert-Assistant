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