import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { Message } from '@/lib/types';

interface ChatMessageProps {
  message: Message;
}

// 코드 컴포넌트를 위한 타입 정의
interface CodeProps {
  node?: any;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3 md:mb-5`}>
      {!isUser && (
        <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white mr-1 md:mr-2 mt-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
      )}
      <div
        className={`max-w-[85%] md:max-w-[80%] rounded-lg p-2 md:p-4 shadow-sm text-sm md:text-base ${
          isUser 
            ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-tr-none' 
            : 'bg-white text-gray-800 rounded-tl-none border border-emerald-100'
        }`}
      >
        {isUser ? (
          // 사용자 메시지는 일반 텍스트로 표시
          <div>
            {message.content.split('\n').map((text, i) => (
              <p key={i} className={text.trim() === '' ? 'h-2' : ''}>
                {text}
              </p>
            ))}
          </div>
        ) : (
          // AI 응답은 마크다운으로 렌더링
          <div className="markdown-content">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw, rehypeSanitize]}
              components={{
                h1: ({node, ...props}) => <h1 className="text-xl font-bold my-3" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-lg font-bold my-2" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-md font-bold my-2" {...props} />,
                p: ({node, ...props}) => <p className="my-2" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc pl-5 my-2" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal pl-5 my-2" {...props} />,
                li: ({node, ...props}) => <li className="my-1" {...props} />,
                a: ({node, ...props}) => <a className="text-emerald-600 underline" target="_blank" rel="noopener noreferrer" {...props} />,
                blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-emerald-300 pl-3 italic my-2" {...props} />,
                code: ({node, inline, className, children, ...props}: CodeProps) => {
                  const match = /language-(\w+)/.exec(className || '');
                  return inline ? (
                    <code className="bg-gray-100 px-1 rounded" {...props}>
                      {children}
                    </code>
                  ) : (
                    <pre className="bg-gray-100 p-2 rounded my-2 overflow-x-auto">
                      <code className={match ? `language-${match[1]}` : ''} {...props}>
                        {children}
                      </code>
                    </pre>
                  );
                },
                table: ({node, ...props}) => <table className="border-collapse border border-gray-300 my-2" {...props} />,
                th: ({node, ...props}) => <th className="border border-gray-300 px-2 py-1 bg-gray-100" {...props} />,
                td: ({node, ...props}) => <td className="border border-gray-300 px-2 py-1" {...props} />,
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
      </div>
      {isUser && (
        <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 ml-1 md:ml-2 mt-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default ChatMessage; 