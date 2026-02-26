import React from 'react';

export const FloodMap: React.FC = () => {
  return (
    <div className="relative bg-[#C4C4C4] h-[250px] mb-6 rounded-xl">
      <div className="absolute -translate-x-2/4 -translate-y-2/4 flex flex-col items-center left-2/4 top-2/4">
        <div className="w-0 h-0 border-blue-800 mb-1 border-[12px] border-l border-r" />
        <div className="text-blue-800 text-xs font-medium leading-4">
          Long Teru
        </div>
      </div>
      <div className="absolute -translate-x-2/4 text-gray-600 text-xs leading-4 left-2/4 bottom-4">
        Map updates dynamically based on dropdown selection.
      </div>
      <div className="absolute flex flex-col gap-2 right-4 top-4">
        <button className="w-8 h-8 bg-white rounded shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] flex items-center justify-center text-gray-700 text-lg font-semibold cursor-pointer">
          +
        </button>
        <button className="w-8 h-8 bg-white rounded shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] flex items-center justify-center text-gray-700 text-lg font-semibold cursor-pointer">
          <i className="ti ti-navigation text-base" />
        </button>
        <button className="w-8 h-8 bg-white rounded shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] flex items-center justify-center text-gray-700 text-lg font-semibold cursor-pointer">
          −
        </button>
      </div>
    </div>
  );
};
