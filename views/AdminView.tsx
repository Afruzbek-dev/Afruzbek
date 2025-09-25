
import React, { useState, useEffect } from 'react';
import { Order, OrderStatus, MenuItem } from '../types';
import { OrderCard } from '../components/OrderCard';
import { AdminMenuManager } from '../components/AdminMenuManager';

interface AdminViewProps {
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  menuItems: MenuItem[];
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
}

export const AdminView: React.FC<AdminViewProps> = ({ orders, setOrders, menuItems, setMenuItems }) => {
  const [view, setView] = useState<'orders' | 'menu'>('orders');

  useEffect(() => {
    // Simulate new order notification sound
    if (orders.some(o => o.status === OrderStatus.Pending)) {
      // In a real app, you might play a sound here.
      // e.g., new Audio('/notification.mp3').play();
    }
  }, [orders]);

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prevOrders => prevOrders.map(o => o.id === orderId ? { ...o, status } : o));
  };
  
  const addMenuItem = (item: Omit<MenuItem, 'id'>) => {
      const newItem: MenuItem = { ...item, id: Date.now() };
      setMenuItems(prev => [...prev, newItem]);
  };

  const updateMenuItem = (updatedItem: MenuItem) => {
      setMenuItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
  };

  const deleteMenuItem = (id: number) => {
      setMenuItems(prev => prev.filter(item => item.id !== id));
  };

  const activeOrders = orders.filter(o => o.status !== OrderStatus.Completed).sort((a, b) => a.createdAt - b.createdAt);
  const completedOrders = orders.filter(o => o.status === OrderStatus.Completed).sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-center mb-6 space-x-2 bg-white p-2 rounded-full shadow-sm max-w-sm mx-auto">
        <button
          onClick={() => setView('orders')}
          className={`w-full px-4 py-2 rounded-full font-semibold transition-colors duration-300 ${view === 'orders' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-secondary/20'}`}
        >
          Live Orders
        </button>
        <button
          onClick={() => setView('menu')}
          className={`w-full px-4 py-2 rounded-full font-semibold transition-colors duration-300 ${view === 'menu' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-secondary/20'}`}
        >
          Manage Menu
        </button>
      </div>

      {view === 'orders' ? (
        <div>
          <h2 className="text-2xl font-bold font-serif text-primary mb-4">Active Orders ({activeOrders.length})</h2>
          {activeOrders.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No active orders.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {activeOrders.map(order => (
                <OrderCard key={order.id} order={order} onUpdateStatus={updateOrderStatus} />
                ))}
            </div>
          )}

          <h2 className="text-2xl font-bold font-serif text-primary mt-12 mb-4">Completed Orders ({completedOrders.length})</h2>
          {completedOrders.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No completed orders yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {completedOrders.slice(0, 4).map(order => ( // Show last 4 completed
                <OrderCard key={order.id} order={order} onUpdateStatus={updateOrderStatus} />
                ))}
            </div>
          )}
        </div>
      ) : (
        <AdminMenuManager
            menuItems={menuItems}
            onAdd={addMenuItem}
            onUpdate={updateMenuItem}
            onDelete={deleteMenuItem}
        />
      )}
    </div>
  );
};
