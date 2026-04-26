import { CareerChatWidget } from '@career-agent/widget';

export function App() {
  return (
    <div className="mx-auto max-w-3xl p-8">
      <h1 className="mb-2 text-2xl font-bold text-gray-900">Career Agent Demo</h1>
      <p className="mb-6 text-sm text-gray-500">
        Ask questions about Davi Araki&apos;s career, projects, and skills.
      </p>
      <div className="h-[680px]">
        <CareerChatWidget
          apiBaseUrl="http://localhost:4111"
          initialMessage="Hi! I'm Davi's Career Agent. Ask me about his experience, projects, or skills!"
        />
      </div>
    </div>
  );
}
