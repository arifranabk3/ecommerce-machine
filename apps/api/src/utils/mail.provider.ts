import { logger } from '../utils/logger';

export interface IMailProvider {
  sendEmail(to: string, subject: string, bodyHtml: string): Promise<void>;
}

export class DevMailProvider implements IMailProvider {
  async sendEmail(to: string, subject: string, bodyHtml: string): Promise<void> {
    logger.info({ to, subject, bodySnippet: bodyHtml.substring(0, 100) }, '[DevMailProvider] Security Email Dispatched safely in dev environment');
  }
}

export const mailProvider: IMailProvider = new DevMailProvider();
