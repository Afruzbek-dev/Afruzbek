import React, { useState } from 'react';
import { Role, Order, CartItem, MenuItem } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Header } from './components/Header';
import { CustomerView } from './views/CustomerView';
import { AdminView } from './views/AdminView';
import { INITIAL_MENU_ITEMS } from './constants';

const App: React.FC = () => {
  const [role, setRole] = useLocalStorage<Role>('cafe-role', Role.Customer);
  const [menuItems, setMenuItems] = useLocalStorage<MenuItem[]>('cafe-menu', INITIAL_MENU_ITEMS);
  const [orders, setOrders] = useLocalStorage<Order[]>('cafe-orders', []);
  const [cart, setCart] = useState<CartItem[]>([]);

  const addOrder = (order: Order) => {
    setOrders(prevOrders => [order, ...prevOrders]);
  };
  
  return (
    <div className="min-h-screen bg-background font-sans">
      <Header role={role} setRole={setRole} />
      <main className="relative">
        {role === Role.Customer ? (
          <CustomerView
            menuItems={menuItems}
            cart={cart}
            setCart={setCart}
            addOrder={addOrder}
            orders={orders}
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
      <footer className="text-center py-6 text-secondary bg-primary-dark mt-8">
        <p className="font-semibold">&copy; 2024 CafeOrder. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default App;