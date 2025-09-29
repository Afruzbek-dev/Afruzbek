import React from 'react';
import { OrderStatus } from '../types';
import { ClockIcon } from './icons/ClockIcon';
import { ProcessingIcon } from './icons/ProcessingIcon';
import { BellIcon } from './icons/BellIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { XCircleIcon } from './icons/XCircleIcon';

interface OrderStatusTrackerProps {
  status: OrderStatus;
}

const statusSteps = [
  { status: OrderStatus.Pending, label: 'Order Placed', icon: ClockIcon },
  { status: OrderStatus.InProgress, label: 'In Progress', icon: ProcessingIcon },
  { status: OrderStatus.Ready, label: 'Ready for Pickup', icon: BellIcon },
  { status: OrderStatus.Completed, label: 'Completed', icon: CheckCircleIcon },
];

export const OrderStatusTracker: React.FC<OrderStatusTrackerProps> = ({ status }) => {
  if (status === OrderStatus.Cancelled) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-red-50 rounded-lg">
        <XCircleIcon className="w-16 h-16 text-red-500 mb-4" />
        <h3 className="text-2xl font-bold text-red-700">Order Cancelled</h3>
        <p className="text-red-600 mt-1">Please contact us for more information.</p>
      </div>
    );
  }
  
  const currentStatusIndex = statusSteps.findIndex(step => step.status === status);

  return (
    <div className="w-full py-4">
      <div className="flex items-start">
        {statusSteps.map((step, index) => {
          const isCompleted = index < currentStatusIndex;
          const isCurrent = index === currentStatusIndex;

          const iconColor = (isCompleted || isCurrent) ? 'bg-accent text-white' : 'bg-gray-200 text-gray-500';
          const lineColor = isCompleted ? 'bg-accent' : 'bg-gray-200';
          const textColor = (isCompleted || isCurrent) ? 'text-primary-dark font-semibold' : 'text-gray-500';
          
          return (
            <React.Fragment key={step.status}>
              <div className="flex flex-col items-center shrink-0">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full ring-4 ring-background ${iconColor} transition-colors duration-500`}>
                  <step.icon className="w-6 h-6"/>
                </div>
                <p className={`text-center text-sm mt-2 w-24 ${textColor}`}>{step.label}</p>
              </div>
              {index < statusSteps.length - 1 && (
                <div className={`flex-auto h-1 mt-5 ${lineColor} transition-colors duration-500`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
