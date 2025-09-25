
import React, { useState } from 'react';
import { MenuItem, CartItem, Category, Order, OrderStatus } from '../types';
import { MenuItemCard } from '../components/MenuItemCard';
import { Cart } from '../components/Cart';
import { CoffeeIcon } from '../components/icons/CoffeeIcon';
import { DessertIcon } from '../components/icons/DessertIcon';
import { Modal } from '../components/Modal';

interface CustomerViewProps {
  menuItems: MenuItem[];
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  addOrder: (order: Order) => void;
  orders: Order[];
}

export const CustomerView: React.FC<CustomerViewProps> = ({ menuItems, cart, setCart, addOrder, orders }) => {
  const [filter, setFilter] = useState<Category | 'All'>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  
  const addToCart = (item: MenuItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const updateCartQuantity = (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      setCart(prevCart => prevCart.filter(item => item.id !== itemId));
    } else {
      setCart(prevCart => prevCart.map(item => item.id === itemId ? { ...item, quantity } : item));
    }
  };

  const placeOrder = (customerName: string) => {
    const newOrder: Order = {
      id: new Date().getTime().toString(),
      customerName,
      items: cart,
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      status: OrderStatus.Pending,
      createdAt: Date.now()
    };
    addOrder(newOrder);
    setLastOrder(newOrder);
    setCart([]);
    setIsModalOpen(true);
  };
  
  const trackedOrder = orders.find(o => o.id === lastOrder?.id);

  const filteredItems = menuItems.filter(item => filter === 'All' || item.category === filter);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
          <div className="mb-6 flex justify-center space-x-2 md:space-x-4 bg-white p-2 rounded-full shadow-sm">
            {['All', Category.Coffee, Category.Dessert].map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat as Category | 'All')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full font-semibold transition-colors duration-300 ${filter === cat ? 'bg-primary text-white' : 'text-gray-600 hover:bg-secondary/20'}`}
              >
                {cat === Category.Coffee && <CoffeeIcon />}
                {cat === Category.Dessert && <DessertIcon />}
                <span>{cat}</span>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredItems.map(item => (
              <MenuItemCard key={item.id} item={item} onAddToCart={addToCart} />
            ))}
          </div>
        </div>
        <div className="lg:col-span-1">
          <Cart cartItems={cart} onUpdateQuantity={updateCartQuantity} onPlaceOrder={placeOrder} />
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Order Status">
        {trackedOrder ? (
            <div>
                <h4 className="font-semibold text-lg">Thank you, {trackedOrder.customerName}!</h4>
                <p className="text-gray-600">Your order #{trackedOrder.id.substring(0, 6)} has been placed.</p>
                <div className="mt-4">
                    <p className="text-xl font-bold">Status: <span className="text-accent">{trackedOrder.status}</span></p>
                </div>
            </div>
        ) : <p>Loading order status...</p>}
      </Modal>
    </div>
  );
};
