
import React from 'react';
import { MenuItem } from '../types';

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onAddToCart }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 ease-in-out group">
      <img src={item.imageUrl} alt={item.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-xl font-semibold font-serif text-primary">{item.name}</h3>
        <p className="text-secondary font-bold text-lg mt-1">${item.price.toFixed(2)}</p>
        <button
          onClick={() => onAddToCart(item)}
          className="mt-4 w-full bg-accent text-white py-2 rounded-md font-bold hover:bg-orange-600 transition-colors duration-300 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 ease-in-out"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};
