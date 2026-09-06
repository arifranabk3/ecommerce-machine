export interface ISendEmailParams {
  to: string;
  subject: string;
  body: string;
  html?: string;
}

export interface IEmailResponse {
  success: boolean;
  providerMessageId: string;
  status: string;
  error?: string;
}

export interface IEmailProvider {
  sendEmail(params: ISendEmailParams): Promise<IEmailResponse>;
}

export class MockEmailProvider implements IEmailProvider {
  async sendEmail(params: ISendEmailParams): Promise<IEmailResponse> {
    return {
      success: true,
      providerMessageId: `msg_email_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      status: 'SENT'
    };
  }
}
