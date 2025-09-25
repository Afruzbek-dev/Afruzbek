
import React from 'react';
import { Order, OrderStatus } from '../types';

interface OrderCardProps {
  order: Order;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
}

const statusConfig = {
    [OrderStatus.Pending]: {
        color: 'bg-yellow-100 text-yellow-800',
        next: OrderStatus.InProgress
    },
    [OrderStatus.InProgress]: {
        color: 'bg-blue-100 text-blue-800',
        next: OrderStatus.Ready
    },
    [OrderStatus.Ready]: {
        color: 'bg-green-100 text-green-800',
        next: OrderStatus.Completed
    },
    [OrderStatus.Completed]: {
        color: 'bg-gray-100 text-gray-500',
        next: null
    }
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, onUpdateStatus }) => {
    const timeAgo = Math.round((Date.now() - order.createdAt) / 1000 / 60);

    return (
        <div className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-lg">
            <div>
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="text-lg font-bold text-primary">{order.customerName}</h3>
                        <p className="text-xs text-gray-500">Order #{order.id.substring(0, 6)} &bull; {timeAgo} min ago</p>
                    </div>
                    <span className={`px-2 py-1 text-sm font-semibold rounded-full ${statusConfig[order.status].color}`}>
                        {order.status}
                    </span>
                </div>
                <ul className="space-y-1 text-sm border-t pt-2 mt-2">
                    {order.items.map(item => (
                        <li key={item.id} className="flex justify-between">
                            <span>{item.quantity}x {item.name}</span>
                            <span>${(item.quantity * item.price).toFixed(2)}</span>
                        </li>
                    ))}
                </ul>
                <div className="text-right font-bold mt-2 border-t pt-2">
                    Total: ${order.total.toFixed(2)}
                </div>
            </div>
            {statusConfig[order.status].next && (
                <button
                    onClick={() => onUpdateStatus(order.id, statusConfig[order.status].next!)}
                    className="mt-4 w-full bg-primary text-white py-2 rounded-md font-bold hover:bg-primary/90 transition-colors duration-300"
                >
                    Mark as {statusConfig[order.status].next}
                </button>
            )}
        </div>
    );
};
