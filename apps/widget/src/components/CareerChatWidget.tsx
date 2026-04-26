import { useState, useCallback, useEffect, useRef, type FC } from 'react';
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const client = new CareerAgentClient(apiBaseUrl);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, state]);

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
  const showPrompts = state === 'idle' && messages.length <= 1;

  return (
    <div
      className={`ca-font-body ca-bg-glow flex flex-col ${
        variant === 'embedded' ? 'h-full' : 'h-[680px]'
      } rounded-2xl border border-zinc-800/60 shadow-2xl shadow-black/40`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800/60 px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <h2 className="ca-font-display text-sm font-semibold text-zinc-100">
            Career Agent
          </h2>
          <span className="flex items-center gap-1.5 text-[11px] text-zinc-500">
            <span className="ca-animate-pulse inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Online
          </span>
        </div>
        <button
          onClick={() =>
            setState(state === 'contactFormOpen' ? 'idle' : 'contactFormOpen')
          }
          className="ca-font-body rounded-lg border border-amber-500/25 bg-amber-500/5 px-3 py-1.5 text-xs font-medium text-amber-400 transition-colors hover:border-amber-500/40 hover:bg-amber-500/10"
        >
          Contact Davi
        </button>
      </div>

      {/* Messages / Contact Form */}
      <div className="ca-scrollbar flex-1 overflow-y-auto px-4 py-4">
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
              <div className="ca-animate-fade-up mb-3 flex items-end gap-2.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-zinc-950">
                  DA
                </div>
                <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-zinc-800/50 bg-zinc-900 px-4 py-3">
                  <span className="ca-dot-1 h-1.5 w-1.5 rounded-full bg-amber-500/70" />
                  <span className="ca-dot-2 h-1.5 w-1.5 rounded-full bg-amber-500/70" />
                  <span className="ca-dot-3 h-1.5 w-1.5 rounded-full bg-amber-500/70" />
                </div>
              </div>
            )}
            {showPrompts && (
              <div className="ca-animate-fade-up mt-5 flex flex-wrap gap-2">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSend(prompt)}
                    className="ca-font-body rounded-xl border border-zinc-800/60 bg-zinc-900/50 px-3.5 py-2 text-xs text-zinc-400 transition-all hover:border-amber-500/30 hover:bg-amber-500/5 hover:text-zinc-200"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      {state !== 'contactFormOpen' && (
        <ChatInput onSend={handleSend} disabled={isLoading} />
      )}
    </div>
  );
};
