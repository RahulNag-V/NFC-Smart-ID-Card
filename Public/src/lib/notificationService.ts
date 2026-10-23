/**
 * Multi-Channel Direct Notification Service
 * Dispatches Email, WhatsApp, and SMS notifications directly in the background
 * without redirecting or navigating the user away from the site.
 */

export interface ContactNotePayload {
  name: string;
  email: string;
  message: string;
  timestamp?: string;
  formattedDate?: string;
  recipientName?: string;
  recipientEmail?: string;
  recipientPhone?: string;
  sourceUrl?: string;
}

export interface DispatchResult {
  email: boolean;
  whatsapp: boolean;
  sms: boolean;
  webhook: boolean;
  summary: string[];
}

const RECIPIENT_EMAIL = 'rahulnagv.dev@gmail.com';
const RECIPIENT_PHONE = '919844616699'; // Rahul Nag V (+91 98446 16699)

/**
 * 1. Direct Email Dispatch (Zero Redirect via FormSubmit AJAX)
 */
async function sendDirectEmail(payload: ContactNotePayload): Promise<boolean> {
  try {
    const formattedBody = {
      name: payload.name,
      email: payload.email,
      message: payload.message,
      _subject: `New Digital ID Note from ${payload.name}`,
      _template: 'table',
      _captcha: 'false',
    };

    const res = await fetch(`https://formsubmit.co/ajax/${RECIPIENT_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(formattedBody),
    });

    return res.ok;
  } catch (err) {
    console.warn('Direct Email dispatch attempt:', err);
    return false;
  }
}

/**
 * 2. Direct WhatsApp Dispatch (via CallMeBot API or Webhook - Zero Redirect)
 */
async function sendWhatsAppAlert(payload: ContactNotePayload): Promise<boolean> {
  const callMeBotKey = import.meta.env.VITE_CALLMEBOT_API_KEY;

  if (callMeBotKey) {
    try {
      const waText = `*New Note Received!*\n\n*From:* ${payload.name}\n*Email:* ${payload.email}\n*Message:* ${payload.message}\n*Time:* ${payload.formattedDate || new Date().toLocaleString()}`;
      const url = `https://api.callmebot.com/whatsapp.php?phone=+${RECIPIENT_PHONE}&text=${encodeURIComponent(waText)}&apikey=${callMeBotKey}`;

      await fetch(url, {
        method: 'GET',
        mode: 'no-cors', // Avoid CORS block on third party gateway
      });
      return true;
    } catch (err) {
      console.warn('CallMeBot WhatsApp dispatch attempt:', err);
    }
  }

  return false;
}

/**
 * 3. Direct SMS Dispatch (via Fast2SMS or Webhook - Zero Redirect)
 */
async function sendSMSAlert(payload: ContactNotePayload): Promise<boolean> {
  const fast2smsKey = import.meta.env.VITE_FAST2SMS_API_KEY;

  if (fast2smsKey) {
    try {
      const smsText = `New Note from ${payload.name} (${payload.email}): ${payload.message.slice(0, 100)}`;
      const url = `https://www.fast2sms.com/dev/bulkV2?authorization=${fast2smsKey}&route=q&message=${encodeURIComponent(smsText)}&language=english&flash=0&numbers=9844616699`;

      await fetch(url, {
        method: 'GET',
        mode: 'no-cors',
      });
      return true;
    } catch (err) {
      console.warn('Fast2SMS dispatch attempt:', err);
    }
  }

  return false;
}

/**
 * 4. Universal Webhook Dispatch (Make.com, Zapier, Pipedream, or custom server)
 * Can dispatch WhatsApp, SMS, and Email all at once.
 */
async function sendWebhookAlert(payload: ContactNotePayload): Promise<boolean> {
  const webhookUrl = import.meta.env.VITE_NOTIFICATION_WEBHOOK_URL;

  if (!webhookUrl) return false;

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch (err) {
    console.warn('Webhook dispatch attempt:', err);
    return false;
  }
}

/**
 * Unified Multi-Channel Dispatcher
 * Dispatches across all configured channels in parallel without redirecting
 */
export async function dispatchMultiChannelNote(data: {
  name: string;
  email: string;
  message: string;
}): Promise<DispatchResult> {
  const payload: ContactNotePayload = {
    name: data.name.trim(),
    email: data.email.trim(),
    message: data.message.trim(),
    timestamp: new Date().toISOString(),
    formattedDate: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    recipientName: 'Rahul Nag V',
    recipientEmail: RECIPIENT_EMAIL,
    recipientPhone: '+91 98446 16699',
    sourceUrl: typeof window !== 'undefined' ? window.location.href : '',
  };

  const [emailRes, waRes, smsRes, webhookRes] = await Promise.allSettled([
    sendDirectEmail(payload),
    sendWhatsAppAlert(payload),
    sendSMSAlert(payload),
    sendWebhookAlert(payload),
  ]);

  const email = emailRes.status === 'fulfilled' && emailRes.value;
  const whatsapp = waRes.status === 'fulfilled' && waRes.value;
  const sms = smsRes.status === 'fulfilled' && smsRes.value;
  const webhook = webhookRes.status === 'fulfilled' && webhookRes.value;

  const summary: string[] = [];
  if (email || webhook) summary.push('Email');
  if (whatsapp || webhook) summary.push('WhatsApp');
  if (sms || webhook) summary.push('SMS');

  return {
    email,
    whatsapp,
    sms,
    webhook,
    summary,
  };
}
