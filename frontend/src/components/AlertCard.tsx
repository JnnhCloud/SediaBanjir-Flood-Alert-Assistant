import React from 'react';
import { SafetyTips } from './SafetyTips';

interface AlertData {
  location: {
    area: string;
    district: string;
    state: string;
    full: string;
  };
  status: string;
  description: string;
  waterLevel: string;
  trend: string;
  lastUpdated: string;
  rainfall?: string;
  prediction?: string;
}

interface AlertCardProps {
  alertData?: AlertData;
}

export const AlertCard: React.FC<AlertCardProps> = ({ alertData }) => {
  if (!alertData) return null;

  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'danger':
      case 'severe':
        return { color: 'text-red-500', icon: 'ti-alert-circle' };
      case 'warning':
        return { color: 'text-orange-500', icon: 'ti-alert-triangle' };
      case 'watch':
        return { color: 'text-yellow-500', icon: 'ti-eye' };
      default:
        return { color: 'text-green-500', icon: 'ti-check' };
    }
  };

  const { color, icon } = getStatusStyle(alertData.status);

  const handleReliefCentreClick = () => console.log('View Nearest Relief Centre clicked');
  const handleEmergencyContactClick = () => console.log('Emergency Contact clicked');

  return (
    <article className="bg-white shadow overflow-hidden mb-6 rounded-2xl">
      <div className="bg-[#E57373] h-12" />
      <div className="p-8">
        <header className="mb-6">
          <h2 className="text-gray-900 text-[32px] font-extrabold leading-10 tracking-[-0.02em] mb-4">
            {alertData.location.full}
          </h2>

          <div className="flex items-center gap-2 mb-6">
            <i className={`ti ${icon} ${color} text-xl`} />
            <div className={`${color} text-xl font-bold leading-7`}>
              {alertData.status}
            </div>
          </div>

          <p className="text-gray-500 text-sm font-normal leading-5 mb-6">
            {alertData.description}
          </p>
        </header>

        <section className="grid grid-cols-4 gap-4 mb-6 max-md:grid-cols-2 max-sm:grid-cols-1">
          <div>
            <div className="text-gray-900 text-xs font-semibold leading-4 mb-1">Water Level:</div>
            <div className="bg-blue-300 text-blue-900 text-sm font-semibold leading-5 text-center px-3 py-1.5 rounded-md">
              {alertData.waterLevel}
            </div>
          </div>

          <div>
            <div className="text-gray-900 text-xs font-semibold leading-4 mb-1">Rainfall (24 H):</div>
            <div className="bg-purple-400 text-purple-900 text-sm font-semibold leading-5 text-center px-3 py-1.5 rounded-md">
              {alertData.rainfall ?? 'N/A'}
            </div>
          </div>

          <div>
            <div className="text-gray-900 text-xs font-semibold leading-4 mb-1">Trend:</div>
            <div className="bg-red-400 text-red-900 text-sm font-semibold leading-5 text-center px-3 py-1.5 rounded-md">
              {alertData.trend}
            </div>
          </div>

          <div>
            <div className="text-gray-900 text-xs font-semibold leading-4 mb-1">Last Updated:</div>
            <div className="text-gray-900 text-sm font-medium leading-5 text-center">
              {alertData.lastUpdated}
            </div>
          </div>
        </section>

        <section className="bg-amber-100 border-amber-500 rounded mb-6 px-4 py-3 border-4">
          <div className="flex items-start gap-2">
            <i className="ti ti-alert-triangle text-amber-500 text-base mt-0.5" />
            <div className="text-amber-800 text-sm font-medium leading-5">
              <span className="font-bold">Prediction:</span> {alertData.prediction ?? 'No prediction available.'}
            </div>
          </div>
        </section>

        <SafetyTips />

        <hr className="h-px bg-gray-200 my-6" />

        <div className="flex gap-4 max-sm:flex-col">
          <button 
            onClick={handleReliefCentreClick}
            className="flex-1 bg-red-500 text-white flex items-center justify-center gap-2 px-5 py-3 rounded-lg hover:bg-red-600 transition-colors"
          >
            <i className="ti ti-list text-lg" />
            <span className="text-sm font-semibold leading-5">View Nearest Relief Centre</span>
          </button>
          <button 
            onClick={handleEmergencyContactClick}
            className="flex-1 bg-gray-500 text-white flex items-center justify-center gap-2 px-5 py-3 rounded-lg hover:bg-gray-600 transition-colors"
          >
            <i className="ti ti-phone text-lg" />
            <span className="text-sm font-semibold leading-5">Emergency Contact</span>
          </button>
        </div>
      </div>
    </article>
  );
};