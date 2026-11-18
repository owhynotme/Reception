'use client';

import { LogOut } from 'lucide-react';

export default function TopBar() {
  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-lg font-medium text-gray-900">Welcome, Demo Receptionist</span>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="px-3 py-1 bg-gray-100 border border-gray-200 rounded-full text-sm text-gray-700">
          reception@healthspace.demo
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <LogOut size={18} />
          <span className="text-sm font-medium">Sign out</span>
        </button>
      </div>
    </header>
  );
}
