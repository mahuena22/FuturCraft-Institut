"use client";

/**
 * WhatsApp Business API Integration Service
 * 
 * Requires WhatsApp Business API credentials:
 * - WHATSAPP_PHONE_NUMBER_ID (from Meta Developer Console)
 * - WHATSAPP_ACCESS_TOKEN (from Meta Developer Console)
 * - WHATSAPP_VERIFY_TOKEN (for webhook verification)
 * 
 * Configure in .env.local:
 * NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER_ID=xxx
 * WHATSAPP_ACCESS_TOKEN=xxx
 * WHATSAPP_VERIFY_TOKEN=xxx
 */

const WHATSAPP_API_VERSION = "v18.0";
const WHATSAPP_API_BASE = `https://graph.facebook.com/${WHATSAPP_API_VERSION}`;

const PHONE_NUMBER_ID = process.env.NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER_ID || "";
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN || "";

interface WhatsAppMessage {
  to: string;
  type: "text" | "template" | "image" | "document" | "location" | "contacts";
  text?: { body: string };
  template?: {
    name: string;
    language: { code: string };
    components?: Array<{
      type: "header" | "body" | "footer" | "button";
      parameters?: Array<{
        type: "text" | "currency" | "date_time" | "image" | "document" | "video";
        text?: string;
        image?: { link: string };
        document?: { link: string; filename: string };
      }>;
    }>;
  };
  image?: { link: string; caption?: string };
  document?: { link: string; filename: string };
  location?: { latitude: number; longitude: number; name?: string; address?: string };
}

interface WhatsAppApiResponse {
  messaging_product: "whatsapp";
  contacts: Array<{ input: string; wa_id: string }>;
  messages: Array<{ id: string }>;
}

interface WhatsAppError {
  error: {
    message: string;
    type: string;
    code: number;
    error_subcode?: number;
    fbtrace_id: string;
  };
}

function isConfigured(): boolean {
  return Boolean(PHONE_NUMBER_ID && ACCESS_TOKEN);
}

export async function sendTextMessage(to: string, body: string): Promise<WhatsAppApiResponse | null> {
  if (!isConfigured()) {
    console.warn("WhatsApp Business API not configured. Skipping message send.");
    return null;
  }

  const message = {
    to,
    type: "text" as const,
    text: { body },
  };

  return sendMessage(message);
}

export async function sendTemplateMessage(
  to: string,
  templateName: string,
  languageCode: string = "fr",
  components?: NonNullable<WhatsAppMessage["template"]>["components"]
): Promise<WhatsAppApiResponse | null> {
  if (!isConfigured()) {
    console.warn("WhatsApp Business API not configured. Skipping message send.");
    return null;
  }

  const message = {
    to,
    type: "template" as const,
    template: {
      name: templateName,
      language: { code: languageCode },
      components,
    },
  };

  return sendMessage(message);
}

export async function sendImageMessage(
  to: string,
  imageUrl: string,
  caption?: string
): Promise<WhatsAppApiResponse | null> {
  if (!isConfigured()) {
    console.warn("WhatsApp Business API not configured. Skipping message send.");
    return null;
  }

  const message = {
    to,
    type: "image" as const,
    image: { link: imageUrl, caption },
  };

  return sendMessage(message);
}

export async function sendDocumentMessage(
  to: string,
  documentUrl: string,
  filename: string
): Promise<WhatsAppApiResponse | null> {
  if (!isConfigured()) {
    console.warn("WhatsApp Business API not configured. Skipping message send.");
    return null;
  }

  const message = {
    to,
    type: "document" as const,
    document: { link: documentUrl, filename },
  };

  return sendMessage(message);
}

async function sendMessage(message: WhatsAppMessage): Promise<WhatsAppApiResponse | null> {
  try {
    const response = await fetch(
      `${WHATSAPP_API_BASE}/${PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      const error = data as { error: { message: string; code: number } };
      console.error("WhatsApp API Error:", error.error);
      throw new Error(`WhatsApp API Error: ${error.error.message} (code: ${error.error.code})`);
    }

    return data as WhatsAppApiResponse;
  } catch (error) {
    console.error("Failed to send WhatsApp message:", error);
    return null;
  }
}

export function openWhatsAppChat(
  phoneNumber: string = "22943327832",
  message?: string
): void {
  const url = new URL(`https://wa.me/${phoneNumber}`);
  if (message) {
    url.searchParams.set("text", message);
  }
  window.open(url.toString(), "_blank", "noopener,noreferrer");
}

export const whatsappTemplates = {
  orientation: (formationTitle?: string) =>
    `Bonjour, je souhaite des informations sur ${formationTitle || "les formations"} FuturCraft.`,
  inscription: (formationTitle?: string) =>
    `Bonjour, je souhaite m'inscrire à la formation ${formationTitle || "FuturCraft"}.`,
  info: (detail?: string) =>
    `Bonjour, j'ai besoin d'informations sur ${detail || "vos formations"}.`,
  support: (issue?: string) =>
    `Bonjour, j'ai besoin d'aide pour ${issue || "un problème technique"}.`,
};

export function verifyWebhook(
  mode: string,
  token: string,
  challenge: string,
  verifyToken: string
): string | null {
  if (mode === "subscribe" && token === verifyToken) {
    return challenge;
  }
  return null;
}

export interface IncomingMessage {
  from: string;
  id: string;
  timestamp: string;
  type: "text" | "image" | "document" | "location" | "contacts" | "button" | "interactive";
  text?: { body: string };
  image?: { mime_type: string; sha256: string; id: string; caption?: string };
  document?: { mime_type: string; sha256: string; id: string; filename?: string };
  location?: { latitude: number; longitude: number; name?: string; address?: string };
  button?: { payload: string; text: string };
  interactive?: {
    type: "button_reply" | "list_reply";
    button_reply?: { id: string; title: string };
    list_reply?: { id: string; title: string; description?: string };
  };
}

export function parseIncomingMessage(payload: unknown): Array<IncomingMessage> {
  return [];
}