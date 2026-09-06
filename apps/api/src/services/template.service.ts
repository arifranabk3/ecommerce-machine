import { MessageTemplateModel } from '../models/MessageTemplate';
import { CommunicationChannel, MessageTemplateCategory, MessageTemplateStatus } from '@sellzy/shared';

export class TemplateService {
  async createTemplate(params: {
    tenantId: string;
    name: string;
    category: MessageTemplateCategory;
    channel: CommunicationChannel;
    language: string;
    subject?: string;
    content: string;
    variables?: string[];
    header?: string;
    footer?: string;
    buttons?: any[];
  }) {
    // 1. Template content security validation
    if (/<script/i.test(params.content) || /javascript:/i.test(params.content) || /eval\(/i.test(params.content)) {
      throw new Error('Template content contains forbidden script or executable expressions');
    }

    if (params.content.length > 4096) {
      throw new Error('Template content exceeds maximum allowed size of 4096 characters');
    }

    // Check uniqueness for tenant + name + language
    const existing = await MessageTemplateModel.findOne({
      tenantId: params.tenantId,
      name: params.name.toLowerCase().trim(),
      language: params.language.toLowerCase().trim(),
    });

    if (existing) {
      throw new Error(`Template with name '${params.name}' and language '${params.language}' already exists`);
    }

    // Extract variables if not explicitly provided
    let vars = params.variables || [];
    if (!params.variables) {
      const matches = params.content.match(/\{\{([a-zA-Z0-9_]+)\}\}/g);
      if (matches) {
        vars = Array.from(new Set(matches.map((m) => m.replace(/\{\{|\}\}/g, ''))));
      }
    }

    const template = await MessageTemplateModel.create({
      tenantId: params.tenantId,
      name: params.name.toLowerCase().trim(),
      category: params.category,
      channel: params.channel,
      language: params.language.toLowerCase().trim(),
      status: MessageTemplateStatus.DRAFT,
      subject: params.subject || undefined,
      content: params.content,
      variables: vars,
      header: params.header || undefined,
      footer: params.footer || undefined,
      buttons: params.buttons || [],
    });

    return template;
  }

  async submitForApproval(tenantId: string, templateId: string) {
    const template = await MessageTemplateModel.findOne({ _id: templateId, tenantId });
    if (!template) {
      throw new Error('Template not found');
    }

    if (template.status === MessageTemplateStatus.ARCHIVED) {
      throw new Error('Archived templates cannot be submitted for approval');
    }

    template.status = MessageTemplateStatus.PENDING_APPROVAL;
    await template.save();
    return template;
  }

  async updateTemplateStatus(tenantId: string, templateId: string, status: MessageTemplateStatus, rejectionReason?: string) {
    const template = await MessageTemplateModel.findOne({ _id: templateId, tenantId });
    if (!template) {
      throw new Error('Template not found');
    }

    template.status = status;
    if (rejectionReason) {
      template.rejectionReason = rejectionReason;
    }
    await template.save();
    return template;
  }

  async getTemplates(tenantId: string, filters?: { channel?: CommunicationChannel; category?: MessageTemplateCategory; status?: MessageTemplateStatus; language?: string }) {
    const query: any = { tenantId };
    if (filters?.channel) query.channel = filters.channel;
    if (filters?.category) query.category = filters.category;
    if (filters?.status) query.status = filters.status;
    if (filters?.language) query.language = filters.language;

    return MessageTemplateModel.find(query).sort({ createdAt: -1 });
  }

  async getTemplateById(tenantId: string, templateId: string) {
    return MessageTemplateModel.findOne({ _id: templateId, tenantId });
  }

  renderTemplate(templateContent: string, variables: Record<string, string>): string {
    let result = templateContent;
    Object.entries(variables).forEach(([key, val]) => {
      // Sanitize variable values to prevent injection
      const safeVal = String(val || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      result = result.replace(regex, safeVal);
    });
    return result;
  }
}
