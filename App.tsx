import React, { useState, useEffect } from 'react';
import { Role, Order, MenuItem, CartItem, OrderStatus } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { INITIAL_MENU_ITEMS } from './constants';
import { CustomerView } from './views/CustomerView';
import { AdminView } from './views/AdminView';
import { Header } from './components/Header';
import { useMediaQuery } from './hooks/useMediaQuery';

function App() {
  const [role, setRole] = useLocalStorage<Role>('app-role', Role.Customer);
  const [menuItems, setMenuItems] = useLocalStorage<MenuItem[]>('menu-items', INITIAL_MENU_ITEMS);
  const [orders, setOrders] = useLocalStorage<Order[]>('orders', []);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [customerOrderIds, setCustomerOrderIds] = useLocalStorage<string[]>('customer-order-ids', []);
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  useEffect(() => {
    if (orders.length === 0) {
      const demoOrders: Order[] = [
        { id: 'demo-1', customerName: 'Alice', items: [{...INITIAL_MENU_ITEMS[1], quantity: 1}, {...INITIAL_MENU_ITEMS[6], quantity: 1}], total: 10.00, status: OrderStatus.InProgress, createdAt: Date.now() - 120000, notes: 'Extra hot latte please' },
        { id: 'demo-2', customerName: 'Bob', items: [{...INITIAL_MENU_ITEMS[2], quantity: 2}], total: 8.50, status: OrderStatus.Pending, createdAt: Date.now() - 300000 },
        { id: 'demo-3', customerName: 'Charlie', items: [{...INITIAL_MENU_ITEMS[7], quantity: 1}], total: 6.00, status: OrderStatus.Ready, createdAt: Date.now() - 600000 },
        { id: 'demo-4', customerName: 'David', items: [{...INITIAL_MENU_ITEMS[4], quantity: 1}], total: 5.00, status: OrderStatus.Completed, createdAt: Date.now() - 900000 },
      ];
      setOrders(demoOrders);
    }
  }, [orders.length, setOrders]);

  const addToCart = (item: MenuItem) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === item.id);
      if (existingItem) {
        return prevItems.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prevItems, { ...item, quantity: 1 }];
    });
  };

  const updateCartQuantity = (itemId: number, quantity: number) => {
    setCartItems(prevItems => {
      if (quantity <= 0) {
        return prevItems.filter(i => i.id !== itemId);
      }
      return prevItems.map(i => i.id === itemId ? { ...i, quantity } : i);
    });
  };

  const placeOrder = (customerName: string, notes: string) => {
    if (cartItems.length === 0) return;
    const newOrder: Order = {
      id: `order-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      customerName,
      items: cartItems,
      total: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
      status: OrderStatus.Pending,
      createdAt: Date.now(),
      notes,
    };
    setOrders(prevOrders => [newOrder, ...prevOrders]);
    setCustomerOrderIds(prevIds => [newOrder.id, ...prevIds]);
    setCartItems([]);
  };

  const customerOrders = orders.filter(o => customerOrderIds.includes(o.id));

  return (
    <div className="bg-background text-text-color min-h-screen font-sans">
      <Header role={role} setRole={setRole} isMobile={isMobile} />
      <main>
        {role === Role.Customer ? (
          <CustomerView
            menuItems={menuItems}
            cartItems={cartItems}
            orders={customerOrders}
            onAddToCart={addToCart}
            onUpdateCartQuantity={updateCartQuantity}
            onPlaceOrder={placeOrder}
            isMobile={isMobile}
          />
        ) : (
          <AdminView 
            orders={orders} 
            setOrders={setOrders} 
            menuItems={menuItems}
            setMenuItems={setMenuItems}
          />
        )}
      </main>
    </div>
  );
}

export default App;
