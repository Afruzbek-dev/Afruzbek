import React, { useState, useEffect } from 'react';
import { MenuItem, Category } from '../types';
import { Modal } from './Modal';
import { EditIcon } from './icons/EditIcon';
import { TrashIcon } from './icons/TrashIcon';
import { PlusIcon } from './icons/PlusIcon';


interface AdminMenuManagerProps {
  menuItems: MenuItem[];
  onAdd: (item: Omit<MenuItem, 'id'>) => void;
  onUpdate: (item: MenuItem) => void;
  onDelete: (id: number) => void;
}

const EMPTY_ITEM_STATE = { name: '', category: Category.Coffee, price: 0, imageUrl: 'https://picsum.photos/400/300' };

export const AdminMenuManager: React.FC<AdminMenuManagerProps> = ({ menuItems, onAdd, onUpdate, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Omit<MenuItem, 'id'> | MenuItem | null>(null);

  const openAddModal = () => {
    setEditingItem(EMPTY_ITEM_STATE);
    setIsModalOpen(true);
  };
  
  const openEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingItem(null);
    setIsModalOpen(false);
  };

  const handleSave = () => {
    if (editingItem) {
        if ('id' in editingItem) {
            onUpdate(editingItem as MenuItem);
        } else {
            onAdd(editingItem as Omit<MenuItem, 'id'>);
        }
        closeModal();
    }
  };
  
  const isFormValid = editingItem && editingItem.name && editingItem.price > 0 && editingItem.imageUrl;

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl animate-fadeIn">
      <div className="flex justify-between items-center border-b-2 border-secondary pb-2 mb-4">
        <h2 className="text-2xl font-bold font-serif text-primary">Menu Management</h2>
        <button onClick={openAddModal} className="flex items-center bg-accent text-white py-2 px-4 rounded-md font-bold hover:bg-accent-dark transition-colors">
            <PlusIcon className="w-5 h-5 mr-2"/>
            Add New Item
        </button>
      </div>

      <div className="space-y-2">
        <div className="grid grid-cols-12 gap-4 font-bold text-sm text-gray-500 uppercase p-2">
            <span className="col-span-2">Image</span>
            <span className="col-span-4">Name</span>
            <span className="col-span-2">Category</span>
            <span className="col-span-2">Price</span>
            <span className="col-span-2 text-right">Actions</span>
        </div>
        {menuItems.map(item => (
          <div key={item.id} className="grid grid-cols-12 gap-4 items-center p-2 border-b hover:bg-gray-50">
            <div className="col-span-2">
                <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-md"/>
            </div>
            <div className="col-span-4 font-semibold text-primary-dark">{item.name}</div>
            <div className="col-span-2 text-gray-600">{item.category}</div>
            <div className="col-span-2 text-gray-600 font-mono">${item.price.toFixed(2)}</div>
            <div className="col-span-2 flex justify-end space-x-3">
                <button onClick={() => openEditModal(item)} className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-100 transition-colors">
                    <EditIcon className="w-5 h-5"/>
                </button>
                <button onClick={() => onDelete(item.id)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition-colors">
                    <TrashIcon className="w-5 h-5"/>
                </button>
            </div>
          </div>
        ))}
      </div>
       <Modal isOpen={isModalOpen} onClose={closeModal} title={editingItem && 'id' in editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}>
         {editingItem && (
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input type="text" value={editingItem.name} onChange={e => setEditingItem({ ...editingItem, name: e.target.value })} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-secondary focus:border-secondary" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select value={editingItem.category} onChange={e => setEditingItem({ ...editingItem, category: e.target.value as Category })} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-secondary focus:border-secondary">
                        <option value={Category.Coffee}>Coffee</option>
                        <option value={Category.Dessert}>Dessert</option>
                    </select>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Price</label>
                    <input type="number" step="0.01" value={editingItem.price} onChange={e => setEditingItem({ ...editingItem, price: parseFloat(e.target.value) || 0 })} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-secondary focus:border-secondary" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Image URL</label>
                    <input type="text" value={editingItem.imageUrl} onChange={e => setEditingItem({ ...editingItem, imageUrl: e.target.value })} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-secondary focus:border-secondary" />
                </div>
                <div className="flex justify-end pt-4 space-x-2">
                    <button onClick={closeModal} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                    <button onClick={handleSave} disabled={!isFormValid} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:bg-gray-400">Save Changes</button>
                </div>
            </div>
         )}
      </Modal>
    </div>
  );
};