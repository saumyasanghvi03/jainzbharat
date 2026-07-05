import { Resend } from 'resend';
import {
  welcomeEmailHtml,
  declarationConfirmationHtml,
  certificateEmailHtml,
  eventRegistrationHtml,
  volunteerConfirmationHtml,
} from './templates';

const resend = new Resend(process.env.RESEND_API_KEY ?? 're_mock');

const FROM = 'JainZBharat <noreply@jainzbharat.org>';

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(options: SendEmailOptions): Promise<{ success: boolean; error?: string }> {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_mock_key') {
    return { success: false, error: 'Resend not configured' };
  }

  try {
    await resend.emails.send({
      from: FROM,
      to: [options.to],
      subject: options.subject,
      html: options.html,
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function sendWelcomeEmail(to: string, displayName: string, jainzId: string): Promise<{ success: boolean; error?: string }> {
  return sendEmail({
    to,
    subject: `Welcome to JainZBharat, ${displayName}`,
    html: welcomeEmailHtml({ displayName, jainzId }),
  });
}

export async function sendDeclarationConfirmation(to: string, displayName: string, jainzId: string, version: string): Promise<{ success: boolean; error?: string }> {
  return sendEmail({
    to,
    subject: 'Declaration Signed — JainZBharat',
    html: declarationConfirmationHtml({ displayName, jainzId, version }),
  });
}

export async function sendCertificateEmail(to: string, displayName: string, certificateTitle: string, verificationUrl: string): Promise<{ success: boolean; error?: string }> {
  return sendEmail({
    to,
    subject: `Your Certificate: ${certificateTitle}`,
    html: certificateEmailHtml({ displayName, certificateTitle, verificationUrl }),
  });
}

export async function sendEventRegistration(to: string, displayName: string, eventTitle: string, eventDate: string): Promise<{ success: boolean; error?: string }> {
  return sendEmail({
    to,
    subject: `Registered: ${eventTitle}`,
    html: eventRegistrationHtml({ displayName, eventTitle, eventDate }),
  });
}

export async function sendVolunteerConfirmation(to: string, displayName: string, hours: number, description: string): Promise<{ success: boolean; error?: string }> {
  return sendEmail({
    to,
    subject: 'Volunteer Hours Confirmed',
    html: volunteerConfirmationHtml({ displayName, hours, description }),
  });
}
