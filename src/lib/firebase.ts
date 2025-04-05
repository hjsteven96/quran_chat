// Firebase SDK에서 필요한 함수들을 가져옵니다.
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported, Analytics } from "firebase/analytics";

// Firebase 설정 정보
const firebaseConfig = {
    apiKey: "AIzaSyChkMA73tHvoGbcOXz9u9sIIgzTQhJCe24",
    authDomain: "mufkochat.firebaseapp.com",
    projectId: "mufkochat",
    storageBucket: "mufkochat.firebasestorage.app",
    messagingSenderId: "429911481029",
    appId: "1:429911481029:web:223220dc5a7a64c85e2eac",
    measurementId: "G-WDHTHJYPV8",
};

// Firebase 앱을 초기화합니다.
const app = initializeApp(firebaseConfig);

// analytics는 브라우저 환경에서만 초기화합니다
let analytics: Promise<Analytics | null> | null = null;
if (typeof window !== "undefined") {
    // 브라우저 환경에서만 analytics 초기화
    analytics = isSupported().then((yes) => (yes ? getAnalytics(app) : null));
}

// 초기화된 Firebase 앱과 analytics를 내보냅니다. 필요에 따라 다른 Firebase 서비스 (auth, firestore 등)도 여기서 초기화하고 내보낼 수 있습니다.
export { app, analytics };
