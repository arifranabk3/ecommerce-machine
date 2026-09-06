export interface ISendSmsParams {
  to: string;
  body: string;
}

export interface ISmsResponse {
  success: boolean;
  providerMessageId: string;
  status: string;
  error?: string;
}

export interface ISmsProvider {
  sendSms(params: ISendSmsParams): Promise<ISmsResponse>;
}

export class MockSmsProvider implements ISmsProvider {
  async sendSms(params: ISendSmsParams): Promise<ISmsResponse> {
    return {
      success: true,
      providerMessageId: `msg_sms_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      status: 'SENT'
    };
  }
}
