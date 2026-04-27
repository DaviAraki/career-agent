import type { FC } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Message } from '../types/chat.js';

type ChatMessageProps = {
  message: Message;
  index?: number;
};

export const ChatMessage: FC<ChatMessageProps> = ({ message, index = 0 }) => {
  const isUser = message.role === 'user';

  return (
    <div
      className={`ca-animate-fade-up mb-5 flex ${isUser ? 'justify-end' : 'items-start gap-3'}`}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-amber-500/20 bg-zinc-950 text-[10px] font-bold text-amber-500 shadow-sm">
          DA
        </div>
      )}
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-lg ${
          isUser
            ? 'border border-amber-500/20 bg-amber-500/10 text-zinc-100 rounded-tr-none'
            : 'border border-zinc-800/50 bg-zinc-900/80 text-zinc-300 backdrop-blur-sm rounded-tl-none'
        }`}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
            strong: ({ children }) => <strong className="font-bold text-zinc-100">{children}</strong>,
            ul: ({ children }) => <ul className="mb-2 list-disc pl-5 last:mb-0 space-y-1">{children}</ul>,
            ol: ({ children }) => <ol className="mb-2 list-decimal pl-5 last:mb-0 space-y-1">{children}</ol>,
            li: ({ children }) => <li className="marker:text-amber-500/60">{children}</li>,
            code: ({ children }) => (
              <code className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-[13px] text-amber-400">
                {children}
              </code>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-2 border-amber-500/30 pl-4 italic text-zinc-400 my-2">
                {children}
              </blockquote>
            ),
            a: ({ children, href }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-500 underline decoration-amber-500/30 underline-offset-4 transition-colors hover:text-amber-400"
              >
                {children}
              </a>
            ),
          }}
        >
          {message.content}
        </ReactMarkdown>
      </div>
    </div>
  );
};
