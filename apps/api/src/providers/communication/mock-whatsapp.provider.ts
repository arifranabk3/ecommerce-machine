import crypto from 'crypto';
import { IWhatsAppProvider, IWhatsAppResponse } from './IWhatsAppProvider';

export class MockWhatsAppProvider implements IWhatsAppProvider {
  private secretKey: string;

  constructor(secretKey: string = 'mock_whatsapp_secret') {
    this.secretKey = secretKey;
  }

  async sendText(to: string, text: string): Promise<IWhatsAppResponse> {
    if (!text || text.trim() === '') {
      return {
        success: false,
        providerMessageId: '',
        status: 'FAILED',
        error: 'Message text cannot be empty'
      };
    }
    const providerMessageId = `wamid.mock.${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    return {
      success: true,
      providerMessageId,
      status: 'SENT'
    };
  }

  async sendTemplate(to: string, templateName: string, language: string, components?: any[]): Promise<IWhatsAppResponse> {
    const providerMessageId = `wamid.mock.tmpl.${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    return {
      success: true,
      providerMessageId,
      status: 'SENT'
    };
  }

  async sendMedia(to: string, mediaUrl: string, caption?: string): Promise<IWhatsAppResponse> {
    const providerMessageId = `wamid.mock.media.${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    return {
      success: true,
      providerMessageId,
      status: 'SENT'
    };
  }

  async verifyWebhook(headers: Record<string, string>, rawBody: string | Buffer): Promise<{ isValid: boolean; eventId?: string }> {
    const sigHeader = headers['x-hub-signature-256'] || headers['x-whatsapp-signature'];
    if (!sigHeader) {
      return { isValid: false };
    }

    const expectedSig = 'sha256=' + crypto.createHmac('sha256', this.secretKey).update(rawBody).digest('hex');
    const isValid = sigHeader === expectedSig;
    return { isValid, eventId: `evt_wa_${Date.now()}` };
  }

  generateTestSignature(payload: any): string {
    const raw = typeof payload === 'string' ? payload : JSON.stringify(payload);
    return 'sha256=' + crypto.createHmac('sha256', this.secretKey).update(raw).digest('hex');
  }
}
