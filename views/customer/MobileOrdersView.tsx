import React from 'react';
import { Order } from '../../types';
import { OrderStatusTracker } from '../../components/OrderStatusTracker';
import { ReceiptIcon } from '../../components/icons/ReceiptIcon';

interface MobileOrdersViewProps {
  orders: Order[];
}

export const MobileOrdersView: React.FC<MobileOrdersViewProps> = ({ orders }) => {
  const sortedOrders = [...orders].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="p-4 space-y-4">
       <h2 className="text-2xl font-bold font-serif text-primary">My Orders</h2>
      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg shadow-sm">
           <ReceiptIcon className="w-16 h-16 mx-auto text-gray-300" />
          <p className="text-gray-500 mt-4">You haven't placed any orders yet.</p>
          <p className="text-sm text-gray-400">Your active and past orders will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedOrders.map(order => (
            <div key={order.id} className="bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <p className="font-bold text-primary-dark">Order #{order.id.substring(0, 6)}</p>
                  <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <p className="font-bold text-lg text-primary-dark">${order.total.toFixed(2)}</p>
              </div>
              <OrderStatusTracker status={order.status} />
              <div className="mt-2 text-sm">
                  <ul className="space-y-1">
                      {order.items.map(item => (
                          <li key={item.id} className="flex justify-between text-gray-600">
                              <span>{item.quantity}x {item.name}</span>
                              <span>${(item.quantity * item.price).toFixed(2)}</span>
                          </li>
                      ))}
                  </ul>
                   {order.notes && (
                      <p className="text-xs text-gray-500 italic mt-2">Note: {order.notes}</p>
                  )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
