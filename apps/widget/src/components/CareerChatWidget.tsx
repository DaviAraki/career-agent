import { useState, useCallback, type FC } from 'react';
import { CareerAgentClient } from '../lib/career-agent-client.js';
import { ChatMessage } from './ChatMessage.js';
import { ChatInput } from './ChatInput.js';
import { ContactRecruiterForm } from './ContactRecruiterForm.js';
import type { ChatState, Message, CareerChatWidgetProps } from '../types/chat.js';

const SUGGESTED_PROMPTS = [
  'What kind of frontend experience does Davi have?',
  'What AI projects has Davi built?',
  'What roles would fit Davi’s background?',
  'Summarize Davi’s experience for a recruiter.',
  'How can I contact Davi?',
];

export const CareerChatWidget: FC<CareerChatWidgetProps> = ({
  apiBaseUrl,
  initialMessage = "Hi! I'm Davi's Career Agent. Ask me about his experience, projects, or skills!",
  variant = 'embedded',
}) => {
  const [state, setState] = useState<ChatState>('idle');
  const [messages, setMessages] = useState<Message[]>([
    { id: 'welcome', role: 'assistant', content: initialMessage },
  ]);

  const client = new CareerAgentClient(apiBaseUrl);

  const handleSend = useCallback(
    async (text: string) => {
      const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: text };
      setMessages((prev) => [...prev, userMsg]);
      setState('loading');

      try {
        const response = await client.chat(text);
        const assistantMsg: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: response.answer,
        };
        setMessages((prev) => [...prev, assistantMsg]);
        setState('idle');
      } catch {
        const errorMsg: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: 'Sorry, something went wrong. Please try again.',
        };
        setMessages((prev) => [...prev, errorMsg]);
        setState('error');
      }
    },
    [client],
  );

  const handleContactSubmit = useCallback(
    async (data: {
      name: string;
      email: string;
      company?: string;
      role?: string;
      message: string;
    }) => {
      setState('loading');
      try {
        const result = await client.contact(data);
        if (result.success) {
          setState('contactSuccess');
          setMessages((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              role: 'assistant',
              content: 'Your message has been sent to Davi. Thank you!',
            },
          ]);
        } else {
          setState('contactError');
          setMessages((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              role: 'assistant',
              content: result.message,
            },
          ]);
        }
      } catch {
        setState('contactError');
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: 'Failed to send your message. Please try again later.',
          },
        ]);
      }
    },
    [client],
  );

  const isLoading = state === 'loading' || state === 'streaming';

  return (
    <div
      className={`flex flex-col bg-white ${variant === 'embedded' ? 'h-full' : 'h-[680px]'} rounded-2xl border border-gray-200 shadow-sm`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <h2 className="text-sm font-semibold text-gray-900">Career Agent</h2>
        <button
          onClick={() => setState(state === 'contactFormOpen' ? 'idle' : 'contactFormOpen')}
          className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
        >
          Contact Davi
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {state === 'contactFormOpen' ? (
          <ContactRecruiterForm
            onSubmit={handleContactSubmit}
            onCancel={() => setState('idle')}
            isLoading={isLoading}
          />
        ) : (
          <>
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {isLoading && (
              <div className="mb-3 flex justify-start">
                <div className="rounded-2xl rounded-bl-sm bg-gray-100 px-4 py-2.5 text-sm text-gray-500">
                  Thinking...
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Suggested prompts */}
      {state === 'idle' && messages.length <= 1 && (
        <div className="flex flex-wrap gap-2 border-t border-gray-100 px-4 py-2">
          {SUGGESTED_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSend(prompt)}
              className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-600 hover:bg-gray-50"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      {state !== 'contactFormOpen' && (
        <ChatInput onSend={handleSend} disabled={isLoading} />
      )}
    </div>
  );
};
