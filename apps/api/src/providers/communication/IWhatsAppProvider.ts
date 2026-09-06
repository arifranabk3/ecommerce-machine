export interface ISendWhatsAppParams {
  to: string;
  body?: string;
  templateName?: string;
  templateLanguage?: string;
  components?: any[];
  mediaUrl?: string;
}

export interface IWhatsAppResponse {
  success: boolean;
  providerMessageId: string;
  status: string;
  error?: string;
}

export interface IWhatsAppProvider {
  sendText(to: string, text: string): Promise<IWhatsAppResponse>;
  sendTemplate(to: string, templateName: string, language: string, components?: any[]): Promise<IWhatsAppResponse>;
  sendMedia(to: string, mediaUrl: string, caption?: string): Promise<IWhatsAppResponse>;
  verifyWebhook(headers: Record<string, string>, rawBody: string | Buffer): Promise<{ isValid: boolean; eventId?: string }>;
}
