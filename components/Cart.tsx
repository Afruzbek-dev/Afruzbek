
import React from 'react';
import { CartItem } from '../types';

interface CartProps {
  cartItems: CartItem[];
  onUpdateQuantity: (itemId: number, quantity: number) => void;
  onPlaceOrder: (customerName: string) => void;
}

export const Cart: React.FC<CartProps> = ({ cartItems, onUpdateQuantity, onPlaceOrder }) => {
  const [customerName, setCustomerName] = React.useState('');
  const [isOrdering, setIsOrdering] = React.useState(false);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePlaceOrder = () => {
    if (customerName.trim() && cartItems.length > 0) {
      setIsOrdering(true);
      onPlaceOrder(customerName);
      setTimeout(() => {
        setCustomerName('');
        setIsOrdering(false);
      }, 1000);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl sticky top-24">
      <h2 className="text-2xl font-bold font-serif text-primary border-b-2 border-secondary pb-2 mb-4">Your Order</h2>
      {cartItems.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
            {cartItems.map(item => (
              <div key={item.id} className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value))}
                    className="w-16 p-1 border rounded-md text-center"
                  />
                   <button onClick={() => onUpdateQuantity(item.id, 0)} className="text-red-500 hover:text-red-700">
                    &times;
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 border-t pt-4">
            <div className="flex justify-between items-center text-xl font-bold">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="mt-4">
                <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-secondary focus:outline-none"
                />
            </div>
            <button
              onClick={handlePlaceOrder}
              disabled={!customerName.trim() || cartItems.length === 0 || isOrdering}
              className="mt-4 w-full bg-primary text-white py-3 rounded-md font-bold hover:bg-primary/90 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isOrdering ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};
