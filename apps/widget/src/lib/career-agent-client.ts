type ChatResponse = {
  answer: string;
  conversationId: string;
};

type ContactResponse = {
  success: boolean;
  message: string;
};

type ContactRequest = {
  name: string;
  email: string;
  company?: string;
  role?: string;
  message: string;
};

export class CareerAgentClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  async chat(message: string): Promise<ChatResponse> {
    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error((error as { error?: string }).error ?? 'Request failed');
    }

    return response.json() as Promise<ChatResponse>;
  }

  async contact(data: ContactRequest): Promise<ContactResponse> {
    const response = await fetch(`${this.baseUrl}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error((error as { error?: string }).error ?? 'Request failed');
    }

    return response.json() as Promise<ContactResponse>;
  }
}
