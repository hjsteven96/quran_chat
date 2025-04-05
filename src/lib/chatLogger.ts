import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

// 세션 ID 생성 (사용자가 페이지를 처음 방문할 때 생성)
let sessionId = "";
if (typeof window !== "undefined") {
    // 로컬 스토리지에서 세션 ID 가져오기
    sessionId = localStorage.getItem("chat_session_id") || "";

    // 세션 ID가 없으면 새로 생성
    if (!sessionId) {
        sessionId = uuidv4();
        localStorage.setItem("chat_session_id", sessionId);
    }
}

// 채팅 메시지 로깅 함수
export async function logChatMessage(userMessage: string, aiResponse: string) {
    try {
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
}
