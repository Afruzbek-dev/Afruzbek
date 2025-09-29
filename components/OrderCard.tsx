import React from 'react';
import { Order, OrderStatus } from '../types';
import { UserIcon } from './icons/UserIcon';
import { ClockIcon } from './icons/ClockIcon';

interface OrderCardProps {
  order: Order;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  isNew?: boolean;
  isUpdated?: boolean;
}

const statusConfig = {
    [OrderStatus.Pending]: { color: 'bg-yellow-100 text-yellow-800', dot: 'bg-yellow-500', next: OrderStatus.InProgress },
    [OrderStatus.InProgress]: { color: 'bg-blue-100 text-blue-800', dot: 'bg-blue-500', next: OrderStatus.Ready },
    [OrderStatus.Ready]: { color: 'bg-green-100 text-green-800', dot: 'bg-green-500', next: OrderStatus.Completed },
    [OrderStatus.Completed]: { color: 'bg-gray-200 text-gray-600', dot: 'bg-gray-500', next: null },
    [OrderStatus.Cancelled]: { color: 'bg-red-100 text-red-800', dot: 'bg-red-500', next: null }
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, onUpdateStatus, isNew, isUpdated }) => {
    const timeAgo = Math.round((Date.now() - order.createdAt) / 1000 / 60);
    const isCancellable = order.status !== OrderStatus.Completed && order.status !== OrderStatus.Cancelled;
    
    const highlightClass = isNew
        ? 'ring-4 ring-accent ring-offset-2'
        : isUpdated
        ? 'ring-4 ring-blue-400 ring-offset-2'
        : '';

    return (
        <div className={`rounded-lg shadow-md p-4 flex flex-col justify-between transition-all duration-500 hover:shadow-xl ${order.status === OrderStatus.Completed || order.status === OrderStatus.Cancelled ? 'bg-gray-50 opacity-80' : 'bg-white'} ${highlightClass}`}>
            <div>
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <h3 className="text-lg font-bold text-primary flex items-center">
                            <UserIcon className="w-5 h-5 mr-2 text-secondary" />
                            {order.customerName}
                        </h3>
                        <p className="text-xs text-gray-500 flex items-center mt-1">
                             <ClockIcon className="w-4 h-4 mr-1.5 text-gray-400"/>
                            {timeAgo} min ago &bull; #{order.id.substring(0, 6)}
                        </p>
                    </div>
                    <span className={`flex items-center px-2 py-1 text-xs font-semibold rounded-full ${statusConfig[order.status].color}`}>
                        <span className={`w-2 h-2 rounded-full mr-1.5 ${statusConfig[order.status].dot}`}></span>
                        {order.status}
                    </span>
                </div>
                <ul className="space-y-1 text-sm border-t pt-2 mt-2 max-h-32 overflow-y-auto pr-1">
                    {order.items.map(item => (
                        <li key={item.id} className="flex justify-between text-text-color">
                            <span>{item.quantity}x {item.name}</span>
                            <span className="font-medium">${(item.quantity * item.price).toFixed(2)}</span>
                        </li>
                    ))}
                </ul>
                <div className="text-right font-bold text-lg text-primary-dark mt-2 border-t pt-2">
                    Total: ${order.total.toFixed(2)}
                </div>
            </div>
            <div className="mt-4 space-y-2">
                {statusConfig[order.status].next && (
                    <button
                        onClick={() => onUpdateStatus(order.id, statusConfig[order.status].next!)}
                        className="w-full bg-primary text-white py-2 rounded-md font-bold hover:bg-primary-dark transition-all duration-300 transform hover:scale-105"
                    >
                        Mark as "{statusConfig[order.status].next}"
                    </button>
                )}
                 {isCancellable && (
                     <button
                        onClick={() => onUpdateStatus(order.id, OrderStatus.Cancelled)}
                        className="w-full bg-transparent border border-red-500 text-red-500 py-2 rounded-md font-bold hover:bg-red-500 hover:text-white transition-colors duration-300"
                    >
                        Cancel Order
                    </button>
                )}
            </div>
        </div>
    );
};