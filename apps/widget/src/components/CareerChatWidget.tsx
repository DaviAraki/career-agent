import { useState, useCallback, useEffect, useRef, type FC } from 'react';
import { CareerAgentClient } from '../lib/career-agent-client.js';
import { ChatMessage } from './ChatMessage.js';
import { ChatInput } from './ChatInput.js';
import { ContactRecruiterForm } from './ContactRecruiterForm.js';
import type { ChatState, Message, CareerChatWidgetProps } from '../types/chat.js';

const SUGGESTED_PROMPTS = [
  { icon: '\u{1F4BB}', text: 'What frontend experience does Davi have?' },
  { icon: '\u{1F916}', text: 'What AI projects has Davi built?' },
  { icon: '\u{1F3AF}', text: "What roles would fit Davi's background?" },
  { icon: '\u{1F4CB}', text: "Summarize Davi's experience for a recruiter." },
  { icon: '\u{2709}\uFE0F', text: 'How can I contact Davi?' },
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
      } rounded-2xl border border-zinc-800/60 shadow-2xl shadow-black/40 overflow-hidden`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800/60 px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div>
            <h2 className="ca-font-display text-sm font-semibold text-zinc-100 leading-none">
              Career Agent
            </h2>
            <span className="flex items-center gap-1.5 text-[10px] text-zinc-500 mt-0.5">
              <span className="ca-animate-pulse inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
              AI-powered
            </span>
          </div>
        </div>
        <button
          onClick={() =>
            setState(state === 'contactFormOpen' ? 'idle' : 'contactFormOpen')
          }
          className="ca-font-body rounded-lg border border-amber-500/25 bg-amber-500/5 px-3 py-1.5 text-xs font-medium text-amber-400 transition-all hover:border-amber-500/40 hover:bg-amber-500/10 hover:shadow-sm hover:shadow-amber-500/10"
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
            {messages.map((msg, i) => (
              <ChatMessage key={msg.id} message={msg} index={i} />
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
              <div className="ca-animate-fade-up mt-4 flex flex-col gap-1.5">
                <span className="px-1 mb-1 text-[10px] uppercase tracking-widest text-zinc-600 font-medium">
                  Try asking
                </span>
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt.text}
                    onClick={() => handleSend(prompt.text)}
                    className="ca-font-body group flex items-center gap-2.5 rounded-xl border border-zinc-800/60 bg-zinc-900/40 px-3.5 py-2.5 text-left text-[13px] text-zinc-400 transition-all hover:border-amber-500/25 hover:bg-amber-500/5 hover:text-zinc-200"
                  >
                    <span className="text-sm opacity-60 group-hover:opacity-100 transition-opacity">
                      {prompt.icon}
                    </span>
                    {prompt.text}
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
