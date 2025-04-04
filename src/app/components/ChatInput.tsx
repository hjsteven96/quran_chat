import React, { useState } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center border-t border-gray-200 p-2 md:p-4 bg-gray-50">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask about the Quran..."
        className="flex-1 border border-gray-300 rounded-l-lg py-2 md:py-3 px-3 md:px-4 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading || !input.trim()}
        className={`bg-gradient-to-r from-emerald-600 to-emerald-500 text-white py-2 md:py-3 px-4 md:px-6 rounded-r-lg transition-all duration-200 text-sm md:text-base ${
          isLoading || !input.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:from-emerald-700 hover:to-emerald-600 hover:shadow-md'
        }`}
      >
        {isLoading ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="hidden md:inline">Sending</span>
          </span>
        ) : (
          <span className="flex items-center">
            <span className="hidden md:inline">Send</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-0 md:ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </span>
        )}
      </button>
    </form>
  );
};

export default ChatInput; 