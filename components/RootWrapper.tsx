'use client';

import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

export default function RootWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <TopBar />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
