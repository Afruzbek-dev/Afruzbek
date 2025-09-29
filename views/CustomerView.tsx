import React, { useState, useEffect } from 'react';
import { MenuItem, CartItem, Category, Order, OrderStatus } from '../types';
import { MenuItemCard } from '../components/MenuItemCard';
import { Cart } from '../components/Cart';
import { CoffeeIcon } from '../components/icons/CoffeeIcon';
import { DessertIcon } from '../components/icons/DessertIcon';
import { Modal } from '../components/Modal';
import { SearchIcon } from '../components/icons/SearchIcon';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { OrderStatusTracker } from '../components/OrderStatusTracker';

interface CustomerViewProps {
  menuItems: MenuItem[];
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  addOrder: (order: Order) => void;
  orders: Order[];
}

export const CustomerView: React.FC<CustomerViewProps> = ({ menuItems, cart, setCart, addOrder, orders }) => {
  const [filter, setFilter] = useState<Category | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastOrderId, setLastOrderId] = useLocalStorage<string | null>('lastOrderId', null);
  
  const trackedOrder = orders.find(o => o.id === lastOrderId);

  useEffect(() => {
      // If the tracked order is completed or cancelled, stop tracking it after a while
      if (trackedOrder && [OrderStatus.Completed, OrderStatus.Cancelled].includes(trackedOrder.status)) {
          const timer = setTimeout(() => {
              if(lastOrderId === trackedOrder.id) {
                setLastOrderId(null);
              }
          }, 30000); // clear after 30 seconds
          return () => clearTimeout(timer);
      }
  }, [trackedOrder, lastOrderId, setLastOrderId]);


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
    setLastOrderId(newOrder.id);
    setCart([]);
    setIsModalOpen(true);
  };
  
  const filteredItems = menuItems.filter(item =>
    (filter === 'All' || item.category === filter) &&
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
          <div className="sticky top-24 bg-background/90 backdrop-blur-sm z-30 py-4 mb-4 rounded-b-lg">
            <div className="space-y-4">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4">
                  <SearchIcon className="h-5 w-5 text-gray-400" />
                </span>
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for coffee or dessert..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-secondary focus:outline-none transition-shadow shadow-sm"
                  aria-label="Search menu items"
                />
              </div>
              <div className="flex justify-center space-x-2 md:space-x-4 bg-white p-2 rounded-full shadow-sm">
                {['All', Category.Coffee, Category.Dessert].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat as Category | 'All')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full font-semibold transition-colors duration-300 text-sm md:text-base ${filter === cat ? 'bg-primary text-white shadow' : 'text-gray-600 hover:bg-secondary/20'}`}
                  >
                    {cat === Category.Coffee && <CoffeeIcon className="w-5 h-5"/>}
                    {cat === Category.Dessert && <DessertIcon className="w-5 h-5"/>}
                    <span>{cat}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 animate-fadeIn">
            {filteredItems.length > 0 ? (
                filteredItems.map(item => (
                <MenuItemCard key={item.id} item={item} onAddToCart={addToCart} />
                ))
            ) : (
                <div className="sm:col-span-2 xl:col-span-3 text-center py-16 bg-white rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-700">No items found</h3>
                    <p className="text-gray-500 mt-2">Try adjusting your search or filters.</p>
                </div>
            )}
          </div>
        </div>
        <div className="lg:col-span-1 lg:sticky lg:top-24">
          <Cart cartItems={cart} onUpdateQuantity={updateCartQuantity} onPlaceOrder={placeOrder} />
        </div>
      </div>
      
      {lastOrderId && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="fixed bottom-6 right-6 bg-accent text-white py-3 px-5 rounded-full font-bold hover:bg-accent-dark transition-transform hover:scale-105 duration-300 shadow-lg animate-pulse-once z-30"
          >
            Track My Order
          </button>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Order Status">
        {trackedOrder ? (
            <div>
                <div className="text-center mb-6">
                  <h4 className="font-semibold text-xl text-primary-dark">Thank you, {trackedOrder.customerName}!</h4>
                  <p className="text-gray-600">Your order #{trackedOrder.id.substring(0, 6)} is being processed.</p>
                </div>
                <OrderStatusTracker status={trackedOrder.status} />
            </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">No active order is being tracked.</p>
            <p className="text-sm text-gray-500 mt-1">Place a new order to see its status here.</p>
          </div>
        )}
      </Modal>
    </div>
  );
};
