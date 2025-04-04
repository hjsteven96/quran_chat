'use client';

import React from 'react';
import ChatWindow from './components/ChatWindow';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-8 bg-gradient-to-b from-emerald-50 to-white">
      <div className="w-full max-w-4xl h-[90vh] drop-shadow-xl">
        <ChatWindow />
      </div>
    </main>
  );
}