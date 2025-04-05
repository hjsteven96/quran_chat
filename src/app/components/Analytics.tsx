"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { analytics } from "@/lib/firebase";
import { logEvent, Analytics as FirebaseAnalytics } from "firebase/analytics";

export default function Analytics() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (pathname && analytics) {
            analytics.then((analyticsInstance: FirebaseAnalytics | null) => {
                if (analyticsInstance) {
                    // 페이지 조회 이벤트 기록
                    logEvent(analyticsInstance, "page_view", {
                        page_path: pathname,
                        page_location: window.location.href,
                        page_title: document.title,
                    });
                }
            });
        }
    }, [pathname, searchParams]);

    return null; // UI를 렌더링하지 않음
}
