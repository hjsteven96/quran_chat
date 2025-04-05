import React, { useEffect, useRef, useState } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { Message } from "@/lib/types";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

// 세션 ID 생성 (사용자가 페이지를 처음 방문할 때 생성)
let sessionId = "";

const ChatWindow: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content:
                "Hello! Ask me anything about the Quran. I'm here to help with your questions.",
        },
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // 세션 ID 초기화
    useEffect(() => {
        if (typeof window !== "undefined") {
            // 로컬 스토리지에서 세션 ID 가져오기
            sessionId = localStorage.getItem("chat_session_id") || "";

            // 세션 ID가 없으면 새로 생성
            if (!sessionId) {
                sessionId = uuidv4();
                localStorage.setItem("chat_session_id", sessionId);
            }
        }
    }, []);

    // Scroll to bottom when new messages are added
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // 채팅 메시지 로깅 함수
    const logChatMessage = async (userMessage: string, aiResponse: string) => {
        try {
            if (!sessionId) return;

            // 사용자 정보 (익명)
            const userAgent =
                typeof window !== "undefined"
                    ? window.navigator.userAgent
                    : "unknown";

            await addDoc(collection(db, "chat_logs"), {
                sessionId,
                timestamp: serverTimestamp(),
                userMessage,
                aiResponse,
                userAgent,
                // 추가 정보를 수집할 수 있습니다 (필요에 따라)
                language: navigator.language || "unknown",
                screenWidth: window.innerWidth || 0,
                screenHeight: window.innerHeight || 0,
            });

            console.log("채팅 로그가 저장되었습니다.");
        } catch (error) {
            console.error("채팅 로그 저장 중 오류 발생:", error);
        }
    };

    const handleSendMessage = async (content: string) => {
        // Add user message
        const userMessage: Message = { role: "user", content };
        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);

        try {
            // API call
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    messages: [...messages, userMessage],
                }),
            });

            if (!response.ok) {
                throw new Error("API response error");
            }

            const data = await response.json();

            // Add response message
            setMessages((prev) => [...prev, data.message]);

            // 채팅 로그 저장
            logChatMessage(content, data.message.content);
        } catch (error) {
            console.error("Message sending error:", error);
            // Add error message
            const errorMessage =
                "Sorry, an error occurred while processing your request. Please try again.";
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: errorMessage,
                },
            ]);

            // 오류 메시지도 로깅
            logChatMessage(content, errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden border border-emerald-200">
            <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 text-white p-3 md:p-5 text-center sticky top-0 z-10">
                <h1 className="text-xl md:text-2xl font-bold">
                    Mufko Chat (beta)
                </h1>
                <p className="text-xs md:text-sm mt-1 opacity-90">
                    Ask about the wisdom and teachings of the Quran
                </p>
                <div className="absolute top-2 md:top-4 right-2 md:right-4 opacity-70">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 md:h-6 md:w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                    </svg>
                </div>
            </div>

            <div
                className="flex-1 overflow-y-auto p-3 md:p-5 bg-gradient-to-b from-gray-50 to-white"
                style={{ paddingBottom: "70px" }}
            >
                {messages.map((message, index) => (
                    <ChatMessage key={index} message={message} />
                ))}

                {/* Loading animation */}
                {isLoading && (
                    <div className="flex justify-start mb-5 fade-in">
                        <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white mr-2 mt-1">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                />
                            </svg>
                        </div>
                        <div className="bg-white text-gray-800 rounded-lg rounded-tl-none border border-emerald-100 p-4 max-w-[80%] shadow-sm">
                            <div className="flex space-x-2">
                                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce"></div>
                                <div
                                    className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce"
                                    style={{ animationDelay: "0.2s" }}
                                ></div>
                                <div
                                    className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce"
                                    style={{ animationDelay: "0.4s" }}
                                ></div>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            <div className="sticky bottom-0 left-0 right-0 z-10 bg-gray-50">
                <ChatInput
                    onSendMessage={handleSendMessage}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
};

export default ChatWindow;
