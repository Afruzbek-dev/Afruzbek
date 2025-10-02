import React, { useState, useEffect, useRef } from 'react';
import { Order, OrderStatus } from '../../types';
import { OrderStatusTracker } from '../../components/OrderStatusTracker';
import { ReceiptIcon } from '../../components/icons/ReceiptIcon';
import { ArrowLeftIcon } from '../../components/icons/ArrowLeftIcon';
import { NoteIcon } from '../../components/icons/NoteIcon';

interface MobileOrdersViewProps {
  orders: Order[];
}

const statusConfig = {
    [OrderStatus.Pending]: { color: 'bg-yellow-100 text-yellow-800', dot: 'bg-yellow-500' },
    [OrderStatus.InProgress]: { color: 'bg-blue-100 text-blue-800', dot: 'bg-blue-500' },
    [OrderStatus.Ready]: { color: 'bg-green-100 text-green-800', dot: 'bg-green-500' },
    [OrderStatus.Completed]: { color: 'bg-gray-200 text-gray-600', dot: 'bg-gray-500' },
    [OrderStatus.Cancelled]: { color: 'bg-red-100 text-red-800', dot: 'bg-red-500' }
};

export const MobileOrdersView: React.FC<MobileOrdersViewProps> = ({ orders }) => {
  const [updatedOrderIds, setUpdatedOrderIds] = useState<Set<string>>(new Set());
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const prevOrdersRef = useRef<Map<string, Order>>(new Map(orders.map(o => [o.id, o])));

  useEffect(() => {
    const updatedDetectedIds: string[] = [];
    const currentOrdersMap: Map<string, Order> = new Map(orders.map(o => [o.id, o]));

    currentOrdersMap.forEach((order, id) => {
        const prevOrder = prevOrdersRef.current.get(id);
        if (prevOrder && prevOrder.status !== order.status) {
            updatedDetectedIds.push(id);
        }
    });

    if (updatedDetectedIds.length > 0) {
        setUpdatedOrderIds(prev => new Set([...prev, ...updatedDetectedIds]));
        const timer = window.setTimeout(() => {
            setUpdatedOrderIds(currentIds => {
                const updatedIds = new Set(currentIds);
                updatedDetectedIds.forEach(id => updatedIds.delete(id));
                return updatedIds;
            });
        }, 3000);
        
        return () => clearTimeout(timer);
    }
    
    prevOrdersRef.current = currentOrdersMap;
  }, [orders]);

  const sortedOrders = [...orders].sort((a, b) => b.createdAt - a.createdAt);
  const selectedOrder = orders.find(o => o.id === selectedOrderId);

  if (selectedOrder) {
    return (
        <div className="p-4 animate-fadeIn">
            <button onClick={() => setSelectedOrderId(null)} className="flex items-center font-semibold text-primary-dark mb-4 p-2 -ml-2 hover:bg-secondary/20 rounded-md transition-colors">
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Back to All Orders
            </button>
            <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-2xl font-bold font-serif text-primary">Order #{selectedOrder.id.substring(0, 6)}</h2>
                        <p className="text-sm text-gray-500">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                    </div>
                    <p className="font-bold text-2xl text-primary-dark">${selectedOrder.total.toFixed(2)}</p>
                </div>
                
                <OrderStatusTracker status={selectedOrder.status} />

                <div className="mt-6 border-t pt-4">
                    <h3 className="font-bold text-lg text-primary-dark mb-2">Order Summary</h3>
                    <ul className="space-y-2">
                        {selectedOrder.items.map(item => (
                            <li key={item.id} className="flex justify-between text-gray-700">
                                <span>{item.quantity}x {item.name}</span>
                                <span className="font-medium">${(item.quantity * item.price).toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                    {selectedOrder.notes && (
                         <div className="mt-4 pt-4 border-t border-dashed">
                            <div className="flex items-start text-sm text-gray-600">
                                <NoteIcon className="w-4 h-4 mr-2 text-secondary flex-shrink-0 mt-0.5" />
                                <p className="italic">{selectedOrder.notes}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
  }

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
            <button 
                key={order.id} 
                onClick={() => setSelectedOrderId(order.id)}
                className={`w-full text-left bg-white rounded-lg shadow-md p-4 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 ${updatedOrderIds.has(order.id) ? 'ring-4 ring-blue-400 ring-offset-2 ring-offset-background' : ''}`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-primary-dark">Order #{order.id.substring(0, 6)}</p>
                  <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                    <p className="font-bold text-lg text-primary-dark">${order.total.toFixed(2)}</p>
                    <span className={`flex items-center justify-center px-2 py-1 text-xs font-semibold rounded-full mt-1 ${statusConfig[order.status].color}`}>
                        <span className={`w-2 h-2 rounded-full mr-1.5 ${statusConfig[order.status].dot}`}></span>
                        {order.status}
                    </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
