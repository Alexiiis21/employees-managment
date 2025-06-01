"use client";

import React, { useState } from 'react';
import { Plus, Search, User, LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddClick: () => void;
}

export function Navbar({ searchTerm, onSearchChange, onAddClick }: NavbarProps) {
  const handleLogout = () => {
    // Eliminar token de localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Eliminar cookies - múltiples métodos para asegurar compatibilidad
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; samesite=lax';
    document.cookie = 'token=; path=/; max-age=-99999';
    document.cookie = 'auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; samesite=lax';
    
    // Redirección forzada
    window.location.href = '/sign-in';
  };
  
  return (
    <header className="bg-white shadow rounded-lg mb-6">
      {/* Desktop Navbar */}
      <div className="hidden md:flex max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Employee Management</h1>
        <div className="flex items-center space-x-4">
          <div className="relative flex items-center">
            <Search className="absolute left-3 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={onSearchChange}
              className="pl-9"
            />
          </div>
          <Button onClick={onAddClick}>
            <Plus className="h-4 w-4 mr-2" /> Add Employee
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <User />                
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Mobile Navbar */}
      <div className="md:hidden flex justify-between items-center p-4">
        <h1 className="text-xl font-bold text-gray-900">Employee Management</h1>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={onAddClick}>
            <Plus className="h-4 w-4" />
          </Button>
          
          {/* Avatar con Dropdown - Igual que en Desktop */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <User />                
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Mobile Search Bar (Always Visible) */}
      <div className="md:hidden px-4 pb-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={onSearchChange}
            className="pl-9 w-full"
          />
        </div>
      </div>
    </header>
  );
}