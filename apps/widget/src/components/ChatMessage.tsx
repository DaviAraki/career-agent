import type { FC } from 'react';
import type { Message } from '../types/chat.js';

type ChatMessageProps = {
  message: Message;
  index?: number;
};

/**
 * Renders simple **bold** text within a message string.
 * Splits on double-asterisk markers and wraps matched segments in <strong>.
 */
function renderContent(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-zinc-100">
        {part}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

export const ChatMessage: FC<ChatMessageProps> = ({ message, index = 0 }) => {
  const isUser = message.role === 'user';

  return (
    <div
      className={`ca-animate-fade-up mb-4 flex ${
        isUser ? 'justify-end' : 'items-end gap-2.5'
      }`}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {!isUser && (
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-zinc-950">
          DA
        </div>
      )}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? 'border border-amber-500/20 bg-amber-500/10 text-zinc-100 rounded-br-md'
            : 'border border-zinc-800/50 bg-zinc-900 text-zinc-300 rounded-bl-md'
        }`}
      >
        {renderContent(message.content)}
      </div>
    </div>
  );
};
