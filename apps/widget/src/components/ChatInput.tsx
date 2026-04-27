import { useState, type FC, type FormEvent } from 'react';

type ChatInputProps = {
  onSend: (message: string) => void;
  disabled: boolean;
};

export const ChatInput: FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setInput('');
  };

  return (
    <div className="border-t border-zinc-800/60">
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 p-3"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about Davi's career..."
          disabled={disabled}
          className="ca-font-body flex-1 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 transition-all focus:border-amber-500/40 focus:outline-none focus:ring-2 focus:ring-amber-500/15 disabled:opacity-40"
        />
        <button
          type="submit"
          disabled={disabled || !input.trim()}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-zinc-950 transition-all hover:bg-amber-400 hover:shadow-md hover:shadow-amber-500/20 active:scale-95 disabled:opacity-30 disabled:hover:shadow-none"
          aria-label="Send message"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M2 8L14 2L8 14L7 9L2 8Z" fill="currentColor" />
          </svg>
        </button>
      </form>
      <div className="px-4 pb-2.5 pt-0">
        <span className="text-[10px] text-zinc-600">
          Powered by Mastra AI · Responses may vary
        </span>
      </div>
    </div>
  );
};
