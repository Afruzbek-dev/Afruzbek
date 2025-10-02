import React from 'react';
import { CartItem } from '../../types';
import { Cart } from '../../components/Cart';

interface MobilePaymentViewProps {
  cartItems: CartItem[];
  onUpdateQuantity: (itemId: number, quantity: number) => void;
  onPlaceOrder: (customerName: string, notes: string) => void;
}

export const MobilePaymentView: React.FC<MobilePaymentViewProps> = (props) => {
  return (
    <div className="p-4">
      {/* Re-using the Cart component which is already responsive. */}
      <Cart {...props} />
    </div>
  );
};
