import React from 'react';
import { SafetyTips } from './SafetyTips';

interface AlertData {
  location: string;
  status: string;
  statusColor: string;
  statusIcon: string;
  description: string;
  waterLevel: string;
  rainfall: string;
  trend: string;
  lastUpdated: string;
  prediction: string;
}

interface AlertCardProps {
  alertData?: AlertData;
}

const defaultAlertData: AlertData = {
  location: 'LONG TERU, MIRI',
  status: 'Danger',
  statusColor: 'text-red-500',
  statusIcon: 'ti-home',
  description: 'River level caused considerable flooding, evacuation to be initiated.',
  waterLevel: '3.2 mm',
  rainfall: '45 mm',
  trend: 'Rising',
  lastUpdated: '3:42 PM',
  prediction: 'Water level expected to increase within 3 hours due to continous heavy rainfall.',
};

export const AlertCard: React.FC<AlertCardProps> = ({ alertData = defaultAlertData }) => {
  const handleReliefCentreClick = () => {
    console.log('View Nearest Relief Centre clicked');
  };

  const handleEmergencyContactClick = () => {
    console.log('Emergency Contact clicked');
  };

  return (
    <article className="bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] overflow-hidden mb-6 rounded-2xl">
      <div className="bg-[#E57373] h-12" />
      <div className="p-8">
        <header className="mb-6">
          <h2 className="text-gray-900 text-[32px] font-extrabold leading-10 tracking-[-0.02em] mb-4">
            {alertData.location}
          </h2>
          <div className="flex items-center gap-2 mb-6">
            <i className={`ti ${alertData.statusIcon} ${alertData.statusColor} text-xl`} />
            <div className={`${alertData.statusColor} text-xl font-bold leading-7`}>
              {alertData.status}
            </div>
          </div>
          <p className="text-gray-500 text-sm font-normal leading-5 mb-6">
            {alertData.description}
          </p>
        </header>

        <section className="grid grid-cols-4 gap-4 mb-6 max-md:grid-cols-2 max-sm:grid-cols-1">
          <div>
            <div className="text-gray-900 text-xs font-semibold leading-4 mb-1">
              Water Level:
            </div>
            <div className="bg-blue-300 text-blue-900 text-sm font-semibold leading-5 text-center px-3 py-1.5 rounded-md">
              {alertData.waterLevel}
            </div>
          </div>
          <div>
            <div className="text-gray-900 text-xs font-semibold leading-4 mb-1">
              Rainfall (24 H):
            </div>
            <div className="bg-purple-400 text-purple-900 text-sm font-semibold leading-5 text-center px-3 py-1.5 rounded-md">
              {alertData.rainfall}
            </div>
          </div>
          <div>
            <div className="text-gray-900 text-xs font-semibold leading-4 mb-1">
              Trend:
            </div>
            <div className="bg-red-400 text-red-900 text-sm font-semibold leading-5 text-center px-3 py-1.5 rounded-md">
              {alertData.trend}
            </div>
          </div>
          <div>
            <div className="text-gray-900 text-xs font-semibold leading-4 mb-1">
              Last Updated:
            </div>
            <div className="text-gray-900 text-sm font-medium leading-5 text-center">
              {alertData.lastUpdated}
            </div>
          </div>
        </section>

        <section className="bg-amber-100 border-amber-500 rounded mb-6 px-4 py-3 border-4">
          <div className="flex items-start gap-2">
            <i className="ti ti-alert-triangle text-amber-500 text-base mt-0.5" />
            <div className="text-amber-800 text-sm font-medium leading-5">
              <span className="font-bold">Prediction:</span> {alertData.prediction}
            </div>
          </div>
        </section>

        <SafetyTips />

        <hr className="h-px bg-gray-200 my-6" />

        <div className="flex gap-4 max-sm:flex-col">
          <button 
            onClick={handleReliefCentreClick}
            className="flex-1 bg-red-500 text-white flex items-center justify-center gap-2 cursor-pointer shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] px-5 py-3 rounded-lg hover:bg-red-600 transition-colors"
          >
            <i className="ti ti-list text-lg" />
            <span className="text-sm font-semibold leading-5">
              View Nearest Relief Centre
            </span>
          </button>
          <button 
            onClick={handleEmergencyContactClick}
            className="flex-1 bg-gray-500 text-white flex items-center justify-center gap-2 cursor-pointer shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] px-5 py-3 rounded-lg hover:bg-gray-600 transition-colors"
          >
            <i className="ti ti-phone text-lg" />
            <span className="text-sm font-semibold leading-5">
              Emergency Contact
            </span>
          </button>
        </div>
      </div>
    </article>
  );
};
