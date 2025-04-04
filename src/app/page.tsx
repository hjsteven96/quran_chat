'use client';

import React, { useEffect, useState } from 'react';
import ChatWindow from './components/ChatWindow';

export default function Home() {
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // 모바일 키보드 감지 (iOS, Android)
  useEffect(() => {
    const handleResize = () => {
      // 화면 높이가 원래 높이의 2/3 이하로 줄어들면 키보드가 올라왔다고 가정
      const isKeyboardVisible = window.innerHeight < window.outerHeight * 0.66;
      setKeyboardVisible(isKeyboardVisible);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <main className={`flex min-h-screen flex-col items-center justify-between p-2 md:p-8 bg-gradient-to-b from-emerald-50 to-white ${
      keyboardVisible ? 'pb-0' : ''
    }`}>
      <div className={`w-full max-w-4xl ${
        keyboardVisible ? 'h-screen' : 'h-[98vh] md:h-[90vh]'
      } drop-shadow-xl`}>
        <ChatWindow />
      </div>
    </main>
  );
}