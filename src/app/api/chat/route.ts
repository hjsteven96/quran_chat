import { NextRequest, NextResponse } from 'next/server';
import { getGeminiResponse } from '@/lib/gemini';
import { Message } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    
    // Gemini API로 응답 받기
    const response = await getGeminiResponse(messages);
    
    // 새 메시지 생성
    const newMessage: Message = {
      role: 'assistant',
      content: response
    };
    
    return NextResponse.json({ message: newMessage });
  } catch (error) {
    console.error('API 오류:', error);
    return NextResponse.json(
      { error: '응답을 처리하는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 