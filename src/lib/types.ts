export type Role = 'user' | 'assistant';

export interface Message {
  role: Role;
  content: string;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
} 