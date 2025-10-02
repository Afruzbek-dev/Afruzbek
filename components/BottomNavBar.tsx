import React from 'react';
import { HomeIcon } from './icons/HomeIcon';
import { ReceiptIcon } from './icons/ReceiptIcon';
import { ShoppingCartIcon } from './icons/ShoppingCartIcon';

export type MobileView = 'menu' | 'cart' | 'orders';

interface BottomNavBarProps {
  activeView: MobileView;
  setActiveView: (view: MobileView) => void;
  cartItemCount: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeView, setActiveView, cartItemCount }) => {
  const navItems = [
    { view: 'menu' as MobileView, icon: HomeIcon, label: 'Menu' },
    { view: 'cart' as MobileView, icon: ShoppingCartIcon, label: 'Cart', badge: cartItemCount > 0 ? cartItemCount : null },
    { view: 'orders' as MobileView, icon: ReceiptIcon, label: 'My Orders' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-40 md:hidden">
      <div className="flex justify-around items-center h-16">
        {navItems.map(item => (
          <button
            key={item.view}
            onClick={() => setActiveView(item.view)}
            className={`flex flex-col items-center justify-center w-full space-y-1 transition-colors duration-200 ${
              activeView === item.view ? 'text-primary' : 'text-gray-500 hover:text-primary'
            }`}
          >
            <div className="relative">
              <item.icon className="w-6 h-6" />
              {item.badge && (
                <span className="absolute -top-2 -right-3 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-accent rounded-full">
                  {item.badge}
                </span>
              )}
            </div>
            <span className={`text-xs ${activeView === item.view ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
