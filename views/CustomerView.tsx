import React, { useState } from 'react';
import { MenuItem, CartItem, Category, Order } from '../types';
import { MenuItemCard } from '../components/MenuItemCard';
import { Cart } from '../components/Cart';
import { CoffeeIcon } from '../components/icons/CoffeeIcon';
import { DessertIcon } from '../components/icons/DessertIcon';
import { SearchIcon } from '../components/icons/SearchIcon';
import { BottomNavBar, MobileView } from '../components/BottomNavBar';
import { MobileOrdersView } from './customer/MobileOrdersView';
import { MobilePaymentView } from './customer/MobilePaymentView';


interface CustomerViewProps {
  menuItems: MenuItem[];
  cartItems: CartItem[];
  orders: Order[];
  onAddToCart: (item: MenuItem) => void;
  onUpdateCartQuantity: (itemId: number, quantity: number) => void;
  onPlaceOrder: (customerName: string, notes: string) => void;
  isMobile: boolean;
}

export const CustomerView: React.FC<CustomerViewProps> = ({ menuItems, cartItems, orders, onAddToCart, onUpdateCartQuantity, onPlaceOrder, isMobile }) => {
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileView, setMobileView] = useState<MobileView>('menu');

  const filteredMenuItems = menuItems
    .filter(item => activeCategory === 'all' || item.category === activeCategory)
    .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const menuContent = (
    <div className="space-y-8 p-4 md:p-0">
      <div>
        <div className="relative mb-6">
            <input
                type="text"
                placeholder="Search for coffee, cake..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full p-4 pl-12 border-2 border-gray-200 rounded-full focus:ring-2 focus:ring-secondary focus:outline-none transition-shadow text-lg"
            />
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400"/>
        </div>

        <div className="flex justify-center space-x-2 sm:space-x-4">
          <button onClick={() => setActiveCategory('all')} className={`px-4 py-2 rounded-full font-semibold transition-all duration-200 ${activeCategory === 'all' ? 'bg-primary text-white shadow-md' : 'bg-white text-gray-700 hover:bg-secondary/20 hover:shadow-sm'}`}>All</button>
          <button onClick={() => setActiveCategory(Category.Coffee)} className={`flex items-center space-x-2 px-4 py-2 rounded-full font-semibold transition-all duration-200 ${activeCategory === Category.Coffee ? 'bg-primary text-white shadow-md' : 'bg-white text-gray-700 hover:bg-secondary/20 hover:shadow-sm'}`}><CoffeeIcon className="w-5 h-5"/> <span>Coffee</span></button>
          <button onClick={() => setActiveCategory(Category.Dessert)} className={`flex items-center space-x-2 px-4 py-2 rounded-full font-semibold transition-all duration-200 ${activeCategory === Category.Dessert ? 'bg-primary text-white shadow-md' : 'bg-white text-gray-700 hover:bg-secondary/20 hover:shadow-sm'}`}><DessertIcon className="w-5 h-5"/> <span>Desserts</span></button>
        </div>
      </div>
      
      {filteredMenuItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
          {filteredMenuItems.map(item => (
            <MenuItemCard key={item.id} item={item} onAddToCart={onAddToCart} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
            <p className="text-xl text-gray-500">No items found matching your search.</p>
        </div>
      )}
    </div>
  );
  
  if (isMobile) {
    return (
      <div className="pb-20">
        {mobileView === 'menu' && menuContent}
        {mobileView === 'cart' && (
          <MobilePaymentView 
            cartItems={cartItems} 
            onUpdateQuantity={onUpdateCartQuantity} 
            onPlaceOrder={(name, notes) => {
              onPlaceOrder(name, notes);
              setMobileView('orders'); // Switch to orders view after placing order
            }} 
          />
        )}
        {mobileView === 'orders' && <MobileOrdersView orders={orders} />}
        
        <BottomNavBar 
            activeView={mobileView} 
            setActiveView={setMobileView} 
            cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
            {menuContent}
        </div>
        <div className="lg:col-span-1">
          <Cart cartItems={cartItems} onUpdateQuantity={onUpdateCartQuantity} onPlaceOrder={onPlaceOrder} />
        </div>
      </div>
    </div>
  );
};