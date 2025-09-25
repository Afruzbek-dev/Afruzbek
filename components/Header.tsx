
import React from 'react';
import { Role } from '../types';
import { UserIcon } from './icons/UserIcon';
import { AdminIcon } from './icons/AdminIcon';

interface HeaderProps {
  role: Role;
  setRole: (role: Role) => void;
}

export const Header: React.FC<HeaderProps> = ({ role, setRole }) => {
  return (
    <header className="bg-primary/95 backdrop-blur-sm shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <h1 className="text-3xl font-bold text-white font-serif">CafeOrder</h1>
          </div>
          <div className="flex items-center space-x-2 bg-white/20 p-1 rounded-full">
            <button
              onClick={() => setRole(Role.Customer)}
              className={`p-2 rounded-full transition-colors duration-300 ease-in-out ${role === Role.Customer ? 'bg-accent text-white' : 'text-gray-300 hover:bg-white/30'}`}
              aria-label="Customer View"
            >
              <UserIcon className="w-6 h-6" />
            </button>
            <button
              onClick={() => setRole(Role.Admin)}
              className={`p-2 rounded-full transition-colors duration-300 ease-in-out ${role === Role.Admin ? 'bg-accent text-white' : 'text-gray-300 hover:bg-white/30'}`}
              aria-label="Admin View"
            >
              <AdminIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
