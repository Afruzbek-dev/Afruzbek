import React, { useState } from 'react';
import { MenuItem } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { CheckIcon } from './icons/CheckIcon';


interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onAddToCart }) => {
  const [wasAdded, setWasAdded] = useState(false);

  const handleAddToCart = () => {
    onAddToCart(item);
    setWasAdded(true);
    setTimeout(() => setWasAdded(false), 1500);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col transform hover:scale-105 transition-transform duration-300 ease-in-out group">
       <div className="relative">
        <img src={item.imageUrl} alt={item.name} className="w-full h-48 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold font-serif text-primary">{item.name}</h3>
        <p className="text-secondary font-bold text-lg mt-1">${item.price.toFixed(2)}</p>
        <div className="mt-auto pt-4">
          <button
            onClick={handleAddToCart}
            disabled={wasAdded}
            className={`w-full flex items-center justify-center py-2 px-4 rounded-md font-bold transition-colors duration-300 ${
              wasAdded 
                ? 'bg-green-500 text-white' 
                : 'bg-accent text-white hover:bg-accent-dark'
            }`}
          >
            {wasAdded ? (
                <>
                    <CheckIcon className="w-5 h-5 mr-2" />
                    <span>Added!</span>
                </>
            ) : (
                <>
                    <PlusIcon className="w-5 h-5 mr-2" />
                    <span>Add to Cart</span>
                </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};