export type ChatState =
  | 'idle'
  | 'loading'
  | 'streaming'
  | 'error'
  | 'contactFormOpen'
  | 'contactSuccess'
  | 'contactError';

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export type CareerChatWidgetProps = {
  apiBaseUrl: string;
  initialMessage?: string;
  variant?: 'embedded' | 'floating';
};
