import React from 'react';

interface LegendItem {
  color: string;
  label: string;
}

const legendItems: LegendItem[] = [
  { color: 'bg-green-500', label: 'Normal' },
  { color: 'bg-yellow-500', label: 'Alert' },
  { color: 'bg-orange-500', label: 'Warning' },
  { color: 'bg-red-500', label: 'Danger' },
];

export const LegendIndicators: React.FC = () => {
  return (
    <div className="flex items-center gap-6 max-sm:flex-wrap">
      {legendItems.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <div className={`w-4 h-4 ${item.color} rounded-full`} />
          <div className="text-gray-900 text-sm font-medium leading-5">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
};
