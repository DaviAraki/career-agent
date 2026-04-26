import { Resend } from 'resend';

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

type SendEmailParams = {
  name: string;
  email: string;
  company?: string;
  role?: string;
  message: string;
  conversationSummary?: string;
};

export async function sendContactEmail(params: SendEmailParams): Promise<{ success: boolean; message: string }> {
  const resendApiKey = process.env.RESEND_API_KEY;
  const emailFrom = process.env.EMAIL_FROM;
  const contactEmail = process.env.CONTACT_EMAIL;

  if (!resendApiKey || !emailFrom || !contactEmail) {
    return { success: false, message: 'Email service is not configured.' };
  }

  const resend = new Resend(resendApiKey);

  const htmlBody = `
    <h2>Recruiter message from Career Agent</h2>
    <p><strong>Name:</strong> ${escapeHtml(params.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(params.email)}</p>
    <p><strong>Company:</strong> ${escapeHtml(params.company ?? 'N/A')}</p>
    <p><strong>Role:</strong> ${escapeHtml(params.role ?? 'N/A')}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(params.message)}</p>
    ${params.conversationSummary ? `<p><strong>Conversation Summary:</strong></p><p>${escapeHtml(params.conversationSummary)}</p>` : ''}
  `;

  try {
    await resend.emails.send({
      from: emailFrom,
      to: contactEmail,
      subject: 'Recruiter message from Career Agent',
      html: htmlBody,
    });

    return { success: true, message: 'Message sent successfully.' };
  } catch {
    return { success: false, message: 'Failed to send message. Please try again later.' };
  }
}
