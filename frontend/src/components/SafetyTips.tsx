import React from 'react';

interface SafetyTip {
  text: string;
}

const safetyTips: SafetyTip[] = [
  { text: 'Evacuate immediately to nearest Relief Centre.' },
  { text: 'Turn off electricity and gas supply.' },
  { text: 'Avoid flooded roads.' },
  { text: 'Prepare emergency kits.' },
  { text: 'Charge mobile devices.' },
  { text: 'Follow official emergency instructions.' },
];

export const SafetyTips: React.FC = () => {
  return (
    <section>
      <h3 className="text-gray-900 text-base font-bold leading-6 mb-3">
        Safety Tips:
      </h3>
      <ul className="gap-y-2">
        {safetyTips.map((tip, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="text-gray-900 text-sm font-normal leading-5">
              •
            </span>
            <span className="text-gray-700 text-sm font-normal leading-5">
              {tip.text}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
};
