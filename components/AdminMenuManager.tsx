
import React, { useState } from 'react';
import { MenuItem, Category } from '../types';

interface AdminMenuManagerProps {
  menuItems: MenuItem[];
  onAdd: (item: Omit<MenuItem, 'id'>) => void;
  onUpdate: (item: MenuItem) => void;
  onDelete: (id: number) => void;
}

export const AdminMenuManager: React.FC<AdminMenuManagerProps> = ({ menuItems, onAdd, onUpdate, onDelete }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const [newItem, setNewItem] = useState({ name: '', category: Category.Coffee, price: 0, imageUrl: '' });
  
  const handleAdd = () => {
    if (newItem.name && newItem.price > 0 && newItem.imageUrl) {
        onAdd(newItem);
        setNewItem({ name: '', category: Category.Coffee, price: 0, imageUrl: 'https://picsum.photos/400/300' });
        setIsAdding(false);
    }
  };

  const handleUpdate = () => {
    if (editingItem) {
        onUpdate(editingItem);
        setEditingItem(null);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold font-serif text-primary border-b-2 border-secondary pb-2 mb-4">Menu Management</h2>
      <button onClick={() => setIsAdding(!isAdding)} className="mb-4 bg-accent text-white py-2 px-4 rounded-md font-bold hover:bg-orange-600 transition-colors">
        {isAdding ? 'Cancel' : 'Add New Item'}
      </button>

      {isAdding && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 border rounded-lg">
          <input type="text" placeholder="Name" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} className="p-2 border rounded" />
          <select value={newItem.category} onChange={e => setNewItem({ ...newItem, category: e.target.value as Category })} className="p-2 border rounded">
            <option value={Category.Coffee}>Coffee</option>
            <option value={Category.Dessert}>Dessert</option>
          </select>
          <input type="number" placeholder="Price" value={newItem.price} onChange={e => setNewItem({ ...newItem, price: parseFloat(e.target.value) })} className="p-2 border rounded" />
          <input type="text" placeholder="Image URL" value={newItem.imageUrl} onChange={e => setNewItem({ ...newItem, imageUrl: e.target.value })} className="p-2 border rounded" />
          <button onClick={handleAdd} className="col-span-1 md:col-span-2 bg-primary text-white py-2 rounded-md font-bold hover:bg-primary/90">Add Item</button>
        </div>
      )}

      <div className="space-y-2">
        {menuItems.map(item => (
          <div key={item.id} className="flex items-center justify-between p-2 border rounded-md">
            {editingItem?.id === item.id ? (
                 <>
                    <input type="text" value={editingItem.name} onChange={e => setEditingItem({ ...editingItem, name: e.target.value })} className="p-1 border rounded w-1/3"/>
                    <input type="number" value={editingItem.price} onChange={e => setEditingItem({ ...editingItem, price: parseFloat(e.target.value) })} className="p-1 border rounded w-1/4"/>
                    <div className="space-x-2">
                        <button onClick={handleUpdate} className="text-green-500 hover:text-green-700">Save</button>
                        <button onClick={() => setEditingItem(null)} className="text-gray-500 hover:text-gray-700">Cancel</button>
                    </div>
                 </>
            ) : (
                <>
                    <div>
                        <span className="font-semibold">{item.name}</span> - <span className="text-gray-600">${item.price.toFixed(2)}</span>
                    </div>
                    <div className="space-x-2">
                        <button onClick={() => setEditingItem(item)} className="text-blue-500 hover:text-blue-700">Edit</button>
                        <button onClick={() => onDelete(item.id)} className="text-red-500 hover:text-red-700">Delete</button>
                    </div>
                </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
