import React, { useState } from 'react';
import { Role } from '../types';
import { UserIcon } from './icons/UserIcon';
import { AdminIcon } from './icons/AdminIcon';
import { useClickOutside } from '../hooks/useClickOutside';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

interface HeaderProps {
  role: Role;
  setRole: (role: Role) => void;
  isMobile: boolean;
}

export const Header: React.FC<HeaderProps> = ({ role, setRole, isMobile }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useClickOutside(() => setIsDropdownOpen(false));

  const handleRoleChange = (newRole: Role) => {
    setRole(newRole);
    setIsDropdownOpen(false);
  };
  
  return (
    <header className="bg-primary/95 backdrop-blur-sm shadow-lg sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <h1 className="text-3xl font-bold text-white font-serif tracking-wide">CafeOrder</h1>
          </div>
          
          {isMobile ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(prev => !prev)}
                className="flex items-center space-x-1 p-2 rounded-full bg-primary-dark text-white hover:bg-accent/80 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-dark focus:ring-white"
                aria-haspopup="true"
                aria-expanded={isDropdownOpen}
              >
                {role === Role.Customer ? <UserIcon className="w-5 h-5"/> : <AdminIcon className="w-5 h-5"/>}
                <span className="font-semibold text-sm capitalize">{role.toLowerCase()}</span>
                <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-48 origin-top-right bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5 focus:outline-none animate-scale-in"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="menu-button"
                >
                  <button
                    onClick={() => handleRoleChange(Role.Customer)}
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 flex items-center disabled:opacity-50 disabled:bg-gray-100"
                    role="menuitem"
                    disabled={role === Role.Customer}
                  >
                    <UserIcon className="w-5 h-5 mr-3 text-gray-500"/>
                    <span>Customer View</span>
                  </button>
                  <button
                    onClick={() => handleRoleChange(Role.Admin)}
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 flex items-center disabled:opacity-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    role="menuitem"
                    disabled={true}
                    title="Admin view is not available on mobile devices."
                  >
                    <AdminIcon className="w-5 h-5 mr-3 text-gray-500"/>
                    <span>Admin View</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
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
          )}
        </div>
      </div>
    </header>
  );
};