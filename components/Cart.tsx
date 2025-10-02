import React from 'react';
import { CartItem } from '../types';
import { MinusIcon } from './icons/MinusIcon';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';
import { ShoppingCartIcon } from './icons/ShoppingCartIcon';

interface CartProps {
  cartItems: CartItem[];
  onUpdateQuantity: (itemId: number, quantity: number) => void;
  onPlaceOrder: (customerName: string, notes: string) => void;
}

export const Cart: React.FC<CartProps> = ({ cartItems, onUpdateQuantity, onPlaceOrder }) => {
  const [customerName, setCustomerName] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const [isOrdering, setIsOrdering] = React.useState(false);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePlaceOrder = () => {
    if (customerName.trim() && cartItems.length > 0) {
      setIsOrdering(true);
      // Simulate network request
      setTimeout(() => {
        onPlaceOrder(customerName, notes);
        setCustomerName('');
        setNotes('');
        setIsOrdering(false);
      }, 1000);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl sticky top-24 animate-fadeIn">
      <h2 className="text-2xl font-bold font-serif text-primary border-b-2 border-secondary pb-2 mb-4 flex items-center">
        <ShoppingCartIcon className="w-6 h-6 mr-3 text-secondary"/>
        Your Order
      </h2>
      {cartItems.length === 0 ? (
        <div className="text-center py-10">
            <ShoppingCartIcon className="w-16 h-16 mx-auto text-gray-300"/>
            <p className="text-gray-500 mt-4">Your cart is empty.</p>
            <p className="text-sm text-gray-400">Add items from the menu to get started.</p>
        </div>
      ) : (
        <>
          <div className="space-y-4 max-h-64 overflow-y-auto pr-2 -mr-2">
            {cartItems.map(item => (
              <div key={item.id} className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-primary-dark">{item.name}</p>
                  <p className="text-sm text-gray-500">${item.price.toFixed(2)} x {item.quantity}</p>
                </div>
                <div className="flex items-center space-x-2">
                   <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors">
                    <MinusIcon className="w-4 h-4"/>
                  </button>
                  <span className="w-8 text-center font-bold">{item.quantity}</span>
                   <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors">
                    <PlusIcon className="w-4 h-4"/>
                  </button>
                  <button onClick={() => onUpdateQuantity(item.id, 0)} className="text-gray-400 hover:text-red-500 ml-2 transition-colors">
                    <TrashIcon className="w-5 h-5"/>
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 border-t pt-4">
            <div className="flex justify-between items-center text-xl font-bold text-primary-dark">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="mt-4">
                <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full p-3 border rounded-md focus:ring-2 focus:ring-secondary focus:outline-none transition-shadow"
                    aria-label="Your Name"
                />
            </div>
             <div className="mt-4">
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add a note (e.g. extra shot, no sugar)"
                    rows={2}
                    className="w-full p-3 border rounded-md focus:ring-2 focus:ring-secondary focus:outline-none transition-shadow resize-none"
                    aria-label="Order notes"
                />
            </div>
            <button
              onClick={handlePlaceOrder}
              disabled={!customerName.trim() || cartItems.length === 0 || isOrdering}
              className="mt-4 w-full bg-primary text-white py-3 rounded-md font-bold hover:bg-primary-dark transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed transform hover:scale-105"
            >
              {isOrdering ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};