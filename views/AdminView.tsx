import React, { useState, useEffect, useRef } from 'react';
import { Order, OrderStatus, MenuItem } from '../types';
import { OrderCard } from '../components/OrderCard';
import { AdminMenuManager } from '../components/AdminMenuManager';
import { SortControl, SortOption } from '../components/SortControl';

interface AdminViewProps {
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  menuItems: MenuItem[];
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
}

const applySort = (orders: Order[], sortBy: SortOption): Order[] => {
    return [...orders].sort((a, b) => {
        switch (sortBy) {
            case 'Oldest First':
                return a.createdAt - b.createdAt;
            case 'Total Amount (High-Low)':
                return b.total - a.total;
            case 'Newest First':
            default:
                return b.createdAt - a.createdAt;
        }
    });
};

export const AdminView: React.FC<AdminViewProps> = ({ orders, setOrders, menuItems, setMenuItems }) => {
  const [view, setView] = useState<'orders' | 'menu'>('orders');
  const [newOrderIds, setNewOrderIds] = useState<Set<string>>(new Set());
  const [updatedOrderIds, setUpdatedOrderIds] = useState<Set<string>>(new Set());
  const prevOrdersRef = useRef<Map<string, Order>>(new Map());
  const [activeSort, setActiveSort] = useState<SortOption>('Newest First');
  const [pastSort, setPastSort] = useState<SortOption>('Newest First');


  useEffect(() => {
    const newDetectedIds: string[] = [];
    const updatedDetectedIds: string[] = [];
    const currentOrdersMap: Map<string, Order> = new Map(orders.map(o => [o.id, o]));

    currentOrdersMap.forEach((order, id) => {
        const prevOrder = prevOrdersRef.current.get(id);
        if (!prevOrder) {
            newDetectedIds.push(id);
        } else if (prevOrder.status !== order.status) {
            updatedDetectedIds.push(id);
        }
    });

    const timers: number[] = [];

    if (newDetectedIds.length > 0) {
        setNewOrderIds(prev => new Set([...prev, ...newDetectedIds]));
        const timer = window.setTimeout(() => {
            setNewOrderIds(currentIds => {
                const updatedIds = new Set(currentIds);
                newDetectedIds.forEach(id => updatedIds.delete(id));
                return updatedIds;
            });
        }, 5000); 
        timers.push(timer);
    }

    if (updatedDetectedIds.length > 0) {
        setUpdatedOrderIds(prev => new Set([...prev, ...updatedDetectedIds]));
        const timer = window.setTimeout(() => {
            setUpdatedOrderIds(currentIds => {
                const updatedIds = new Set(currentIds);
                updatedDetectedIds.forEach(id => updatedIds.delete(id));
                return updatedIds;
            });
        }, 3000);
        timers.push(timer);
    }

    prevOrdersRef.current = currentOrdersMap;

    return () => {
        timers.forEach(clearTimeout);
    };
  }, [orders]);

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prevOrders => prevOrders.map(o => o.id === orderId ? { ...o, status } : o));
  };
  
  const addMenuItem = (item: Omit<MenuItem, 'id'>) => {
      const newItem: MenuItem = { ...item, id: Date.now() };
      setMenuItems(prev => [newItem, ...prev]);
  };

  const updateMenuItem = (updatedItem: MenuItem) => {
      setMenuItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
  };

  const deleteMenuItem = (id: number) => {
      setMenuItems(prev => prev.filter(item => item.id !== id));
  };

  const activeOrders = orders.filter(o => ![OrderStatus.Completed, OrderStatus.Cancelled].includes(o.status));
  const pastOrders = orders.filter(o => [OrderStatus.Completed, OrderStatus.Cancelled].includes(o.status));
  
  const sortedActiveOrders = applySort(activeOrders, activeSort);
  const sortedPastOrders = applySort(pastOrders, pastSort);


  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-center mb-8 space-x-2 bg-white p-2 rounded-full shadow-sm max-w-sm mx-auto">
        <button
          onClick={() => setView('orders')}
          className={`w-full px-4 py-2 rounded-full font-semibold transition-colors duration-300 ${view === 'orders' ? 'bg-primary text-white shadow' : 'text-gray-600 hover:bg-secondary/20'}`}
        >
          Live Orders
        </button>
        <button
          onClick={() => setView('menu')}
          className={`w-full px-4 py-2 rounded-full font-semibold transition-colors duration-300 ${view === 'menu' ? 'bg-primary text-white shadow' : 'text-gray-600 hover:bg-secondary/20'}`}
        >
          Manage Menu
        </button>
      </div>

      {view === 'orders' ? (
        <div className="animate-fadeIn">
          <div className="mb-6 space-y-3">
            <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
                <div className="border-l-4 border-accent pl-4">
                    <h2 className="text-3xl font-bold font-serif text-primary">Active Orders ({activeOrders.length})</h2>
                    <p className="text-gray-500">Orders requiring immediate attention.</p>
                </div>
                <SortControl currentSort={activeSort} onSortChange={setActiveSort} />
            </div>
          </div>
          {activeOrders.length === 0 ? (
              <div className="text-center text-gray-500 py-12 bg-white rounded-lg shadow-sm">
                <p className="font-semibold">No active orders at the moment.</p>
              </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedActiveOrders.map(order => (
                <OrderCard 
                    key={order.id} 
                    order={order} 
                    onUpdateStatus={updateOrderStatus}
                    isNew={newOrderIds.has(order.id)}
                    isUpdated={updatedOrderIds.has(order.id)}
                />
                ))}
            </div>
          )}

          <div className="mt-12 mb-6 space-y-3">
            <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
                <div className="border-l-4 border-secondary pl-4">
                    <h2 className="text-3xl font-bold font-serif text-primary">Past Orders ({pastOrders.length})</h2>
                    <p className="text-gray-500">Completed and cancelled order history.</p>
                </div>
                <SortControl currentSort={pastSort} onSortChange={setPastSort} />
            </div>
          </div>
          {pastOrders.length === 0 ? (
               <div className="text-center text-gray-500 py-12 bg-white rounded-lg shadow-sm">
                <p className="font-semibold">No past orders yet.</p>
              </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedPastOrders.slice(0, 8).map(order => (
                <OrderCard 
                    key={order.id} 
                    order={order} 
                    onUpdateStatus={updateOrderStatus} 
                    isUpdated={updatedOrderIds.has(order.id)}
                />
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
