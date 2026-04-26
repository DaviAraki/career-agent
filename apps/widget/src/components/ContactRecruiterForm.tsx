import { useState, type FC, type FormEvent } from 'react';

type ContactRecruiterFormProps = {
  onSubmit: (data: {
    name: string;
    email: string;
    company?: string;
    role?: string;
    message: string;
  }) => void;
  onCancel: () => void;
  isLoading: boolean;
};

const inputClass =
  'ca-font-body w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 transition-colors focus:border-amber-500/40 focus:outline-none focus:ring-2 focus:ring-amber-500/20';

export const ContactRecruiterForm: FC<ContactRecruiterFormProps> = ({
  onSubmit,
  onCancel,
  isLoading,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      email,
      company: company || undefined,
      role: role || undefined,
      message,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-2">
      <h3 className="ca-font-display text-sm font-semibold text-zinc-100">
        Send a message to Davi
      </h3>

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name *"
        required
        minLength={2}
        maxLength={100}
        className={inputClass}
      />

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email *"
        required
        className={inputClass}
      />

      <input
        type="text"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        placeholder="Company (optional)"
        maxLength={100}
        className={inputClass}
      />

      <input
        type="text"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        placeholder="Role (optional)"
        maxLength={100}
        className={inputClass}
      />

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Your message * (min 10 characters)"
        required
        minLength={10}
        maxLength={2000}
        rows={3}
        className={`${inputClass} resize-none`}
      />

      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="ca-font-body flex-1 rounded-xl border border-zinc-800 px-4 py-2.5 text-sm font-medium text-zinc-400 transition-colors hover:border-zinc-700 hover:text-zinc-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="ca-font-body flex-1 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-medium text-zinc-950 transition-colors hover:bg-amber-400 disabled:opacity-40"
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </form>
  );
};
