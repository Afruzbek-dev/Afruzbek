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
    <header className="bg-primary/95 backdrop-blur-sm shadow-lg sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <h1 className="text-3xl font-bold text-white font-serif tracking-wide">CafeOrder</h1>
          </div>
          <div className="relative flex items-center bg-primary-dark p-1 rounded-full">
             <span
                className={`absolute top-1 transition-all duration-300 ease-in-out bg-accent rounded-full h-10 w-32 ${
                  role === Role.Customer ? 'left-1' : 'left-32'
                }`}
                aria-hidden="true"
             />
             <button
                onClick={() => setRole(Role.Customer)}
                className="relative z-10 flex items-center justify-center w-32 px-4 py-2 text-sm font-bold text-white rounded-full transition-colors"
                aria-pressed={role === Role.Customer}
              >
                <UserIcon className="w-5 h-5 mr-2"/>
                <span>Customer</span>
            </button>
            <button
                onClick={() => setRole(Role.Admin)}
                className="relative z-10 flex items-center justify-center w-32 px-4 py-2 text-sm font-bold text-white rounded-full transition-colors"
                aria-pressed={role === Role.Admin}
            >
                <AdminIcon className="w-5 h-5 mr-2"/>
                <span>Admin</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};