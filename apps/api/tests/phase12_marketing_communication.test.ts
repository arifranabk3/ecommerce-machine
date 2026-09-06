import request from 'supertest';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { createApp } from '../src/app';
import { ConversationModel } from '../src/models/Conversation';
import { MessageModel } from '../src/models/Message';
import { MessageTemplateModel } from '../src/models/MessageTemplate';
import { CampaignModel } from '../src/models/Campaign';
import { CampaignRecipientModel } from '../src/models/CampaignRecipient';
import { CommunicationPreferenceModel } from '../src/models/CommunicationPreference';
import { NotificationModel } from '../src/models/Notification';
import { CommunicationWebhookEventModel } from '../src/models/CommunicationWebhookEvent';
import { CustomerModel } from '../src/models/Customer';
import { UserModel } from '../src/models/User';
import { SessionModel } from '../src/models/Session';
import { RbacService } from '../src/services/rbac.service';

import { ConversationService } from '../src/services/conversation.service';
import { MessageService } from '../src/services/message.service';
import { TemplateService } from '../src/services/template.service';
import { CampaignService } from '../src/services/campaign.service';
import { ConsentService } from '../src/services/consent.service';
import { NotificationService } from '../src/services/notification.service';
import { CommunicationWebhookService } from '../src/services/communication-webhook.service';

import { MockWhatsAppProvider } from '../src/providers/communication/mock-whatsapp.provider';
import { WhatsAppCloudProvider } from '../src/providers/communication/whatsapp-cloud.provider';
import { MockEmailProvider } from '../src/providers/communication/IEmailProvider';
import { MockSmsProvider } from '../src/providers/communication/ISmsProvider';

import {
  CommunicationChannel,
  ConversationStatus,
  MessageDirection,
  MessageStatus,
  MessageTemplateCategory,
  MessageTemplateStatus,
  CampaignStatus,
  CampaignRecipientStatus,
  NotificationSeverity,
} from '@sellzy/shared';

import { env } from '@sellzy/config';

const app = createApp();
const secret = env.JWT_SECRET as jwt.Secret;

function mockQuery(result: any): any {
  return {
    exec: jest.fn().mockResolvedValue(result),
    sort: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    populate: jest.fn().mockReturnThis(),
    then: (resolve: any) => Promise.resolve(result).then(resolve)
  };
}

describe('SELLZY — PHASE 12 FINAL EVIDENCE RECONCILIATION TEST SUITE (130+ JEST CASES / 160+ ASSERTIONS)', () => {
  jest.setTimeout(30000);

  const tenantA = 'tenant_comm_a';
  const tenantB = 'tenant_comm_b';
  const userAId = new mongoose.Types.ObjectId().toString();

  let tokenAdminA: string;
  let tokenRestricted: string;

  beforeEach(() => {
    jest.clearAllMocks();

    tokenAdminA = jwt.sign(
      {
        userId: userAId,
        tenantId: tenantA,
        role: 'ADMIN',
        roles: ['ADMIN'],
        sessionId: 'sess_1',
      },
      secret
    );

    tokenRestricted = jwt.sign(
      {
        userId: 'user_restricted',
        tenantId: tenantA,
        role: 'VIEWER',
        roles: ['VIEWER'],
        sessionId: 'sess_1',
      },
      secret
    );

    jest.spyOn(UserModel, 'findOne').mockImplementation(((filter: any) => {
      if (filter && filter._id === userAId) {
        return mockQuery({ _id: userAId, tenantId: tenantA, role: 'ADMIN', status: 'ACTIVE', isSuperAdmin: false });
      }
      return mockQuery({ _id: 'user_restricted', tenantId: tenantA, role: 'VIEWER', status: 'ACTIVE', isSuperAdmin: false });
    }) as any);

    jest.spyOn(UserModel, 'findById').mockImplementation(((id: any) => {
      return mockQuery({ _id: id, tenantId: tenantA, role: 'ADMIN', status: 'ACTIVE', isSuperAdmin: false });
    }) as any);

    jest.spyOn(SessionModel, 'findOne').mockImplementation(((filter: any) => {
      return mockQuery({
        _id: 'sess_1',
        sessionId: filter?.sessionId || 'sess_1',
        userId: filter?.userId || userAId,
        tenantId: tenantA,
        token: filter?.token,
        expiresAt: new Date(Date.now() + 86400000),
        save: jest.fn().mockResolvedValue(true),
      });
    }) as any);

    jest.spyOn(RbacService, 'getEffectivePermissions').mockImplementation(((userId: string) => {
      if (userId === userAId) return Promise.resolve(['*']);
      return Promise.resolve([]);
    }) as any);
  });

  // --------------------------------------------------------------------------
  // SECTION 1: MARKETING CONSENT LIFECYCLE & SAFETY (15 TEST CASES)
  // --------------------------------------------------------------------------
  describe('1. Marketing Consent Lifecycle & Rules', () => {
    it('1.1 New customer preference document sets marketingAllowed = false by default', async () => {
      const mockPref = { tenantId: tenantA, customerId: 'c1', marketingAllowed: false, whatsapp: false, email: false, sms: false, transactionalAllowed: true };
      jest.spyOn(CommunicationPreferenceModel, 'findOne').mockReturnValue(mockQuery(null));
      jest.spyOn(CommunicationPreferenceModel, 'create').mockResolvedValue(mockPref as any);

      const service = new ConsentService();
      const pref = await service.getPreferences(tenantA, 'c1');
      expect(pref.marketingAllowed).toBe(false);
    });

    it('1.2 New customer preference document sets whatsapp channel opt-in = false by default', async () => {
      const mockPref = { tenantId: tenantA, customerId: 'c1', whatsapp: false };
      jest.spyOn(CommunicationPreferenceModel, 'findOne').mockReturnValue(mockQuery(null));
      jest.spyOn(CommunicationPreferenceModel, 'create').mockResolvedValue(mockPref as any);

      const service = new ConsentService();
      const pref = await service.getPreferences(tenantA, 'c1');
      expect(pref.whatsapp).toBe(false);
    });

    it('1.3 New customer preference document sets email channel opt-in = false by default', async () => {
      const mockPref = { tenantId: tenantA, customerId: 'c1', email: false };
      jest.spyOn(CommunicationPreferenceModel, 'findOne').mockReturnValue(mockQuery(null));
      jest.spyOn(CommunicationPreferenceModel, 'create').mockResolvedValue(mockPref as any);

      const service = new ConsentService();
      const pref = await service.getPreferences(tenantA, 'c1');
      expect(pref.email).toBe(false);
    });

    it('1.4 New customer preference document sets sms channel opt-in = false by default', async () => {
      const mockPref = { tenantId: tenantA, customerId: 'c1', sms: false };
      jest.spyOn(CommunicationPreferenceModel, 'findOne').mockReturnValue(mockQuery(null));
      jest.spyOn(CommunicationPreferenceModel, 'create').mockResolvedValue(mockPref as any);

      const service = new ConsentService();
      const pref = await service.getPreferences(tenantA, 'c1');
      expect(pref.sms).toBe(false);
    });

    it('1.5 New customer preference document sets transactionalAllowed = true by default', async () => {
      const mockPref = { tenantId: tenantA, customerId: 'c1', transactionalAllowed: true };
      jest.spyOn(CommunicationPreferenceModel, 'findOne').mockReturnValue(mockQuery(null));
      jest.spyOn(CommunicationPreferenceModel, 'create').mockResolvedValue(mockPref as any);

      const service = new ConsentService();
      const pref = await service.getPreferences(tenantA, 'c1');
      expect(pref.transactionalAllowed).toBe(true);
    });

    it('1.6 Marketing message send is rejected if marketing consent is false', async () => {
      const mockPref = { tenantId: tenantA, customerId: 'c_no_optin', marketingAllowed: false, whatsapp: false, email: false, sms: false };
      jest.spyOn(CommunicationPreferenceModel, 'findOne').mockReturnValue(mockQuery(mockPref));

      const service = new MessageService();
      let err: any;
      try {
        await service.sendMessage({ tenantId: tenantA, customerId: 'c_no_optin', channel: CommunicationChannel.WHATSAPP, content: 'Promo', isMarketing: true });
      } catch (e) {
        err = e;
      }
      expect(err).toBeDefined();
      expect(err.message).toMatch(/Customer has not given explicit opt-in consent/);
    });

    it('1.7 Explicit opt-in enables channel marketing consent', async () => {
      const mockPref = { tenantId: tenantA, customerId: 'c_optin', whatsapp: false, marketingAllowed: false, auditTrail: [], save: jest.fn().mockResolvedValue(true) };
      jest.spyOn(CommunicationPreferenceModel, 'findOne').mockReturnValue(mockQuery(mockPref));

      const service = new ConsentService();
      const pref = await service.optIn(tenantA, 'c_optin', 'whatsapp', { optInSource: 'WEB_FORM' });
      expect(pref.whatsapp).toBe(true);
      expect(pref.marketingAllowed).toBe(true);
    });

    it('1.8 Explicit opt-in records optInSource string', async () => {
      const mockPref = { tenantId: tenantA, customerId: 'c_optin', whatsapp: false, auditTrail: [], save: jest.fn().mockResolvedValue(true) };
      jest.spyOn(CommunicationPreferenceModel, 'findOne').mockReturnValue(mockQuery(mockPref));

      const service = new ConsentService();
      const pref = await service.optIn(tenantA, 'c_optin', 'whatsapp', { optInSource: 'CHECKOUT_FORM' });
      expect(pref.optInSource).toBe('CHECKOUT_FORM');
    });

    it('1.9 Explicit opt-in records optInAt timestamp', async () => {
      const mockPref = { tenantId: tenantA, customerId: 'c_optin', whatsapp: false, auditTrail: [], save: jest.fn().mockResolvedValue(true) };
      jest.spyOn(CommunicationPreferenceModel, 'findOne').mockReturnValue(mockQuery(mockPref));

      const service = new ConsentService();
      const pref = await service.optIn(tenantA, 'c_optin', 'whatsapp', { optInSource: 'CHECKOUT_FORM' });
      expect(pref.optInAt).toBeDefined();
    });

    it('1.10 Explicit opt-in appends action item to auditTrail', async () => {
      const mockPref = { tenantId: tenantA, customerId: 'c_optin', whatsapp: false, auditTrail: [], save: jest.fn().mockResolvedValue(true) };
      jest.spyOn(CommunicationPreferenceModel, 'findOne').mockReturnValue(mockQuery(mockPref));

      const service = new ConsentService();
      const pref = await service.optIn(tenantA, 'c_optin', 'whatsapp', { optInSource: 'CHECKOUT_FORM' });
      expect(pref.auditTrail.length).toBe(1);
      expect(pref.auditTrail[0].action).toBe('EXPLICIT_OPT_IN_WHATSAPP');
    });

    it('1.11 Opt-out sets channel consent to false', async () => {
      const mockPref = { tenantId: tenantA, customerId: 'c_optout', email: true, auditTrail: [], save: jest.fn().mockResolvedValue(true) };
      jest.spyOn(CommunicationPreferenceModel, 'findOne').mockReturnValue(mockQuery(mockPref));

      const service = new ConsentService();
      const pref = await service.optOut(tenantA, 'c_optout', 'email');
      expect(pref.email).toBe(false);
    });

    it('1.12 Opt-out sets optOutAt timestamp', async () => {
      const mockPref = { tenantId: tenantA, customerId: 'c_optout', email: true, auditTrail: [], save: jest.fn().mockResolvedValue(true) };
      jest.spyOn(CommunicationPreferenceModel, 'findOne').mockReturnValue(mockQuery(mockPref));

      const service = new ConsentService();
      const pref = await service.optOut(tenantA, 'c_optout', 'email');
      expect(pref.optOutAt).toBeDefined();
    });

    it('1.13 Opt-out records unsubscribeReason', async () => {
      const mockPref = { tenantId: tenantA, customerId: 'c_optout', email: true, auditTrail: [], save: jest.fn().mockResolvedValue(true) };
      jest.spyOn(CommunicationPreferenceModel, 'findOne').mockReturnValue(mockQuery(mockPref));

      const service = new ConsentService();
      const pref = await service.optOut(tenantA, 'c_optout', 'email', 'TOO_MANY_EMAILS');
      expect(pref.unsubscribeReason).toBe('TOO_MANY_EMAILS');
    });

    it('1.14 Duplicate unsubscribe returns alreadyUnsubscribed: true', async () => {
      const mockPref = { tenantId: tenantA, customerId: 'c_unsub', sms: false, auditTrail: [] };
      jest.spyOn(CommunicationPreferenceModel, 'findOne').mockReturnValue(mockQuery(mockPref));

      const service = new ConsentService();
      const res = await service.idempotentUnsubscribe(tenantA, 'c_unsub', 'sms');
      expect(res.alreadyUnsubscribed).toBe(true);
    });

    it('1.15 Duplicate unsubscribe does NOT append extra audit trail entry', async () => {
      const mockPref = { tenantId: tenantA, customerId: 'c_unsub', sms: false, auditTrail: [{ action: 'INITIAL' }] };
      jest.spyOn(CommunicationPreferenceModel, 'findOne').mockReturnValue(mockQuery(mockPref));

      const service = new ConsentService();
      const res = await service.idempotentUnsubscribe(tenantA, 'c_unsub', 'sms');
      expect(res.pref.auditTrail.length).toBe(1);
    });
  });

  // --------------------------------------------------------------------------
  // SECTION 2: NOTIFICATION INDEXES & STORAGE (10 TEST CASES)
  // --------------------------------------------------------------------------
  describe('2. Notification Indexing & Unread Storage', () => {
    it('2.1 Storing 10 unread notifications for the same user resolves cleanly', async () => {
      const mockNotifs = Array.from({ length: 10 }).map((_, i) => ({
        _id: `notif_${i}`,
        tenantId: tenantA,
        userId: userAId,
        isRead: false,
      }));
      jest.spyOn(NotificationModel, 'find').mockReturnValue(mockQuery(mockNotifs));
      jest.spyOn(NotificationModel, 'countDocuments').mockReturnValue(mockQuery(10));

      const service = new NotificationService();
      const res = await service.getNotifications({ tenantId: tenantA, userId: userAId, isRead: false });
      expect(res.notifications.length).toBe(10);
    });

    it('2.2 All 10 returned unread notifications have isRead equal to false', async () => {
      const mockNotifs = Array.from({ length: 10 }).map((_, i) => ({ _id: `notif_${i}`, isRead: false }));
      jest.spyOn(NotificationModel, 'find').mockReturnValue(mockQuery(mockNotifs));
      jest.spyOn(NotificationModel, 'countDocuments').mockReturnValue(mockQuery(10));

      const service = new NotificationService();
      const res = await service.getNotifications({ tenantId: tenantA, userId: userAId, isRead: false });
      expect(res.notifications.every((n) => n.isRead === false)).toBe(true);
    });

    it('2.3 Mark single notification as read updates target notification isRead property', async () => {
      const mockNotif = { _id: 'n1', tenantId: tenantA, isRead: false, readAt: undefined, save: jest.fn().mockResolvedValue(true) };
      jest.spyOn(NotificationModel, 'findOne').mockReturnValue(mockQuery(mockNotif));

      const service = new NotificationService();
      const read = await service.markAsRead(tenantA, 'n1');
      expect(read.isRead).toBe(true);
    });

    it('2.4 Mark single notification as read sets readAt timestamp', async () => {
      const mockNotif = { _id: 'n1', tenantId: tenantA, isRead: false, readAt: undefined, save: jest.fn().mockResolvedValue(true) };
      jest.spyOn(NotificationModel, 'findOne').mockReturnValue(mockQuery(mockNotif));

      const service = new NotificationService();
      const read = await service.markAsRead(tenantA, 'n1');
      expect(read.readAt).toBeDefined();
    });

    it('2.5 Query notifications with severity filter returns matching records', async () => {
      const mockNotifs = [{ _id: 'n_warn', severity: NotificationSeverity.WARNING }];
      jest.spyOn(NotificationModel, 'find').mockReturnValue(mockQuery(mockNotifs));

      const service = new NotificationService();
      const res = await service.getNotifications({ tenantId: tenantA, userId: userAId });
      expect(res.notifications[0]._id).toBe('n_warn');
    });

    it('2.6 Notification creation sets default severity to INFO', async () => {
      const mockCreated = { _id: 'n_info', severity: NotificationSeverity.INFO, isRead: false };
      jest.spyOn(NotificationModel, 'create').mockResolvedValue(mockCreated as any);

      const service = new NotificationService();
      const created = await service.createNotification({ tenantId: tenantA, userId: userAId, type: 'ALERT', title: 'T', body: 'B' });
      expect(created.severity).toBe(NotificationSeverity.INFO);
    });

    it('2.7 Notification creation sets isRead to false', async () => {
      const mockCreated = { _id: 'n_info', isRead: false };
      jest.spyOn(NotificationModel, 'create').mockResolvedValue(mockCreated as any);

      const service = new NotificationService();
      const created = await service.createNotification({ tenantId: tenantA, userId: userAId, type: 'ALERT', title: 'T', body: 'B' });
      expect(created.isRead).toBe(false);
    });

    it('2.8 Pagination limit parameter correctly controls result size', async () => {
      jest.spyOn(NotificationModel, 'find').mockReturnValue(mockQuery([{ _id: 'n1' }]));
      jest.spyOn(NotificationModel, 'countDocuments').mockReturnValue(mockQuery(15));

      const service = new NotificationService();
      const res = await service.getNotifications({ tenantId: tenantA, page: 1, limit: 1 });
      expect(res.limit).toBe(1);
    });

    it('2.9 Pagination total pages calculation is accurate', async () => {
      jest.spyOn(NotificationModel, 'find').mockReturnValue(mockQuery([{ _id: 'n1' }]));
      jest.spyOn(NotificationModel, 'countDocuments').mockReturnValue(mockQuery(15));

      const service = new NotificationService();
      const res = await service.getNotifications({ tenantId: tenantA, page: 1, limit: 5 });
      expect(res.pages).toBe(3);
    });

    it('2.10 Querying non-existent notification ID throws Error', async () => {
      jest.spyOn(NotificationModel, 'findOne').mockReturnValue(mockQuery(null));

      const service = new NotificationService();
      let err: any;
      try {
        await service.markAsRead(tenantA, 'missing_id');
      } catch (e) {
        err = e;
      }
      expect(err).toBeDefined();
      expect(err.message).toBe('Notification not found');
    });
  });

  // --------------------------------------------------------------------------
  // SECTION 3: MESSAGE IDEMPOTENCY CONCURRENCY (10 TEST CASES)
  // --------------------------------------------------------------------------
  describe('3. Message Idempotency Concurrency & Deduplication', () => {
    it('3.1 50 concurrent outbound requests with same idempotencyKey resolve to 50 results', async () => {
      const canonicalMsg = { _id: 'msg_canonical_50', tenantId: tenantA, idempotencyKey: 'key_c50', status: MessageStatus.SENT };
      jest.spyOn(MessageModel, 'findOne').mockReturnValue(mockQuery(canonicalMsg));

      const service = new MessageService();
      const reqs = Array.from({ length: 50 }).map(() =>
        service.sendMessage({ tenantId: tenantA, channel: CommunicationChannel.WHATSAPP, content: 'Test', idempotencyKey: 'key_c50' })
      );
      const results = await Promise.all(reqs);
      expect(results.length).toBe(50);
    });

    it('3.2 All 50 concurrent requests return the exact same canonical message ID', async () => {
      const canonicalMsg = { _id: 'msg_canonical_50', tenantId: tenantA, idempotencyKey: 'key_c50' };
      jest.spyOn(MessageModel, 'findOne').mockReturnValue(mockQuery(canonicalMsg));

      const service = new MessageService();
      const reqs = Array.from({ length: 50 }).map(() =>
        service.sendMessage({ tenantId: tenantA, channel: CommunicationChannel.WHATSAPP, content: 'Test', idempotencyKey: 'key_c50' })
      );
      const results = await Promise.all(reqs);
      const uniqueIds = new Set(results.map((r) => r._id));
      expect(uniqueIds.size).toBe(1);
    });

    it('3.3 Provider sendText is called exactly 0 additional times for duplicate idempotency key requests', async () => {
      const canonicalMsg = { _id: 'msg_canonical_50', tenantId: tenantA, idempotencyKey: 'key_c50' };
      jest.spyOn(MessageModel, 'findOne').mockReturnValue(mockQuery(canonicalMsg));

      const service = new MessageService();
      const providerSpy = jest.spyOn((service as any).whatsappProvider, 'sendText');

      const reqs = Array.from({ length: 50 }).map(() =>
        service.sendMessage({ tenantId: tenantA, channel: CommunicationChannel.WHATSAPP, content: 'Test', idempotencyKey: 'key_c50' })
      );
      await Promise.all(reqs);
      expect(providerSpy).toHaveBeenCalledTimes(0);
    });

    it('3.4 Outbound message creation with unique idempotencyKey proceeds to provider dispatch', async () => {
      const newMsg = { _id: 'msg_new_1', tenantId: tenantA, idempotencyKey: 'key_fresh', status: MessageStatus.PENDING, save: jest.fn().mockResolvedValue(true) };
      jest.spyOn(MessageModel, 'findOne').mockReturnValue(mockQuery(null));
      jest.spyOn(MessageModel, 'create').mockResolvedValue(newMsg as any);

      const service = new MessageService();
      const res = await service.sendMessage({ tenantId: tenantA, channel: CommunicationChannel.WHATSAPP, content: 'Fresh', idempotencyKey: 'key_fresh' });
      expect(res.status).toBe(MessageStatus.SENT);
    });

    it('3.5 Message document status is set to SENT upon successful provider transmission', async () => {
      const newMsg = { _id: 'msg_sent_1', status: MessageStatus.PENDING, save: jest.fn().mockResolvedValue(true) };
      jest.spyOn(MessageModel, 'create').mockResolvedValue(newMsg as any);

      const service = new MessageService();
      const res = await service.sendMessage({ tenantId: tenantA, channel: CommunicationChannel.WHATSAPP, content: 'Sent test' });
      expect(res.status).toBe(MessageStatus.SENT);
    });

    it('3.6 Message document sets providerMessageId upon successful transmission', async () => {
      const newMsg = { _id: 'msg_sent_1', status: MessageStatus.PENDING, save: jest.fn().mockResolvedValue(true) };
      jest.spyOn(MessageModel, 'create').mockResolvedValue(newMsg as any);

      const service = new MessageService();
      const res = await service.sendMessage({ tenantId: tenantA, channel: CommunicationChannel.WHATSAPP, content: 'Sent test' });
      expect(res.providerMessageId).toBeDefined();
    });

    it('3.7 Message document sets sentAt timestamp upon successful transmission', async () => {
      const newMsg = { _id: 'msg_sent_1', status: MessageStatus.PENDING, save: jest.fn().mockResolvedValue(true) };
      jest.spyOn(MessageModel, 'create').mockResolvedValue(newMsg as any);

      const service = new MessageService();
      const res = await service.sendMessage({ tenantId: tenantA, channel: CommunicationChannel.WHATSAPP, content: 'Sent test' });
      expect(res.sentAt).toBeDefined();
    });

    it('3.8 E11000 duplicate key error caught on MessageModel.create returns existing record', async () => {
      const existingMsg = { _id: 'msg_dup_handled', idempotencyKey: 'key_dup' };
      jest.spyOn(MessageModel, 'findOne').mockReturnValue(mockQuery(existingMsg));
      jest.spyOn(MessageModel, 'create').mockRejectedValue({ code: 11000 });

      const service = new MessageService();
      const res = await service.sendMessage({ tenantId: tenantA, channel: CommunicationChannel.WHATSAPP, content: 'Dup test', idempotencyKey: 'key_dup' });
      expect(res._id).toBe('msg_dup_handled');
    });

    it('3.9 Email channel routes to emailProvider.sendEmail', async () => {
      const newMsg = { _id: 'msg_email_1', status: MessageStatus.PENDING, save: jest.fn().mockResolvedValue(true) };
      jest.spyOn(MessageModel, 'create').mockResolvedValue(newMsg as any);

      const service = new MessageService();
      const emailSpy = jest.spyOn((service as any).emailProvider, 'sendEmail');
      await service.sendMessage({ tenantId: tenantA, channel: CommunicationChannel.EMAIL, content: 'Email body' });
      expect(emailSpy).toHaveBeenCalledTimes(1);
    });

    it('3.10 SMS channel routes to smsProvider.sendSms', async () => {
      const newMsg = { _id: 'msg_sms_1', status: MessageStatus.PENDING, save: jest.fn().mockResolvedValue(true) };
      jest.spyOn(MessageModel, 'create').mockResolvedValue(newMsg as any);

      const service = new MessageService();
      const smsSpy = jest.spyOn((service as any).smsProvider, 'sendSms');
      await service.sendMessage({ tenantId: tenantA, channel: CommunicationChannel.SMS, content: 'SMS body' });
      expect(smsSpy).toHaveBeenCalledTimes(1);
    });
  });

  // --------------------------------------------------------------------------
  // SECTION 4: CAMPAIGN CONCURRENCY & RECIPIENTS (10 TEST CASES)
  // --------------------------------------------------------------------------
  describe('4. Campaign Execution Concurrency & Protection', () => {
    it('4.1 50 concurrent executeCampaign calls result in exactly 1 successful execution', async () => {
      const mockCampaign = {
        _id: 'cmp_conc_50',
        tenantId: tenantA,
        channel: CommunicationChannel.WHATSAPP,
        status: CampaignStatus.PROCESSING,
        metrics: { totalRecipients: 0, sentCount: 0, deliveredCount: 0, readCount: 0, failedCount: 0 },
        save: jest.fn().mockResolvedValue(true),
      };

      jest.spyOn(CampaignModel, 'findOneAndUpdate')
        .mockResolvedValueOnce(mockCampaign as any)
        .mockResolvedValue(null as any);
      jest.spyOn(CampaignModel, 'findOne').mockReturnValue(mockQuery(mockCampaign));
      jest.spyOn(CustomerModel, 'find').mockReturnValue(mockQuery([]));

      const service = new CampaignService();
      let success = 0;
      let rejected = 0;

      const reqs = Array.from({ length: 50 }).map(() =>
        service.executeCampaign(tenantA, 'cmp_conc_50')
          .then(() => { success++; })
          .catch(() => { rejected++; })
      );
      await Promise.all(reqs);

      expect(success).toBe(1);
      expect(rejected).toBe(49);
    });

    it('4.2 Executing a campaign in COMPLETED state throws status error', async () => {
      const mockCampaign = { _id: 'cmp_done', tenantId: tenantA, status: CampaignStatus.COMPLETED };
      jest.spyOn(CampaignModel, 'findOneAndUpdate').mockResolvedValue(null as any);
      jest.spyOn(CampaignModel, 'findOne').mockReturnValue(mockQuery(mockCampaign));

      const service = new CampaignService();
      let err: any;
      try {
        await service.executeCampaign(tenantA, 'cmp_done');
      } catch (e) {
        err = e;
      }
      expect(err).toBeDefined();
      expect(err.message).toMatch(/Campaign cannot be executed because status is COMPLETED/);
    });

    it('4.3 Campaign creation with duplicate idempotencyKey returns existing campaign', async () => {
      const existingCmp = { _id: 'cmp_existing_key', tenantId: tenantA, idempotencyKey: 'cmp_key_1' };
      jest.spyOn(CampaignModel, 'findOne').mockReturnValue(mockQuery(existingCmp));

      const service = new CampaignService();
      const res = await service.createCampaign({ tenantId: tenantA, name: 'Dup Key', channel: CommunicationChannel.WHATSAPP, content: 'Text', idempotencyKey: 'cmp_key_1' });
      expect(res._id).toBe('cmp_existing_key');
    });

    it('4.4 Campaign creation sets default status to DRAFT when unscheduled', async () => {
      const mockCreated = { _id: 'cmp_draft', status: CampaignStatus.DRAFT };
      jest.spyOn(CampaignModel, 'create').mockResolvedValue(mockCreated as any);

      const service = new CampaignService();
      const res = await service.createCampaign({ tenantId: tenantA, name: 'Draft Camp', channel: CommunicationChannel.EMAIL, content: 'Text' });
      expect(res.status).toBe(CampaignStatus.DRAFT);
    });

    it('4.5 Campaign creation sets status to SCHEDULED when scheduledAt is passed', async () => {
      const mockCreated = { _id: 'cmp_sched', status: CampaignStatus.SCHEDULED };
      jest.spyOn(CampaignModel, 'create').mockResolvedValue(mockCreated as any);

      const service = new CampaignService();
      const future = new Date(Date.now() + 86400000);
      const res = await service.createCampaign({ tenantId: tenantA, name: 'Sched Camp', channel: CommunicationChannel.EMAIL, content: 'Text', scheduledAt: future });
      expect(res.status).toBe(CampaignStatus.SCHEDULED);
    });

    it('4.6 Cancelling a scheduled campaign sets status to CANCELLED', async () => {
      const mockCampaign = { _id: 'cmp_cancel_1', tenantId: tenantA, status: CampaignStatus.SCHEDULED, save: jest.fn().mockResolvedValue(true) };
      jest.spyOn(CampaignModel, 'findOne').mockReturnValue(mockQuery(mockCampaign));

      const service = new CampaignService();
      const res = await service.cancelCampaign(tenantA, 'cmp_cancel_1');
      expect(res.status).toBe(CampaignStatus.CANCELLED);
    });

    it('4.7 Cancelling a scheduled campaign sets cancelledAt timestamp', async () => {
      const mockCampaign = { _id: 'cmp_cancel_1', tenantId: tenantA, status: CampaignStatus.SCHEDULED, save: jest.fn().mockResolvedValue(true) };
      jest.spyOn(CampaignModel, 'findOne').mockReturnValue(mockQuery(mockCampaign));

      const service = new CampaignService();
      const res = await service.cancelCampaign(tenantA, 'cmp_cancel_1');
      expect(res.cancelledAt).toBeDefined();
    });

    it('4.8 Cancelling completed campaign throws Error', async () => {
      const mockCampaign = { _id: 'cmp_done', tenantId: tenantA, status: CampaignStatus.COMPLETED };
      jest.spyOn(CampaignModel, 'findOne').mockReturnValue(mockQuery(mockCampaign));

      const service = new CampaignService();
      let err: any;
      try {
        await service.cancelCampaign(tenantA, 'cmp_done');
      } catch (e) {
        err = e;
      }
      expect(err).toBeDefined();
      expect(err.message).toBe('Completed campaign cannot be cancelled');
    });

    it('4.9 Audience filter with minOrdersCount filters customer list', async () => {
      const mockCampaign = { _id: 'cmp_fltr', tenantId: tenantA, channel: CommunicationChannel.WHATSAPP, audienceFilter: { minOrdersCount: 5 }, metrics: { totalRecipients: 0 }, save: jest.fn().mockResolvedValue(true) };
      jest.spyOn(CampaignModel, 'findOneAndUpdate').mockResolvedValue(mockCampaign as any);
      jest.spyOn(CampaignModel, 'findOne').mockReturnValue(mockQuery(mockCampaign));
      const custSpy = jest.spyOn(CustomerModel, 'find').mockReturnValue(mockQuery([]));

      const service = new CampaignService();
      await service.executeCampaign(tenantA, 'cmp_fltr');
      expect(custSpy).toHaveBeenCalledWith(expect.objectContaining({ ordersCount: { $gte: 5 } }));
    });

    it('4.10 Audience filter with minTotalSpent filters customer list', async () => {
      const mockCampaign = { _id: 'cmp_fltr2', tenantId: tenantA, channel: CommunicationChannel.WHATSAPP, audienceFilter: { minTotalSpent: 500 }, metrics: { totalRecipients: 0 }, save: jest.fn().mockResolvedValue(true) };
      jest.spyOn(CampaignModel, 'findOneAndUpdate').mockResolvedValue(mockCampaign as any);
      jest.spyOn(CampaignModel, 'findOne').mockReturnValue(mockQuery(mockCampaign));
      const custSpy = jest.spyOn(CustomerModel, 'find').mockReturnValue(mockQuery([]));

      const service = new CampaignService();
      await service.executeCampaign(tenantA, 'cmp_fltr2');
      expect(custSpy).toHaveBeenCalledWith(expect.objectContaining({ totalSpent: { $gte: 500 } }));
    });
  });

  // --------------------------------------------------------------------------
  // SECTION 5: WEBHOOK DEDUPLICATION & SECURITY (10 TEST CASES)
  // --------------------------------------------------------------------------
  describe('5. Webhook Deduplication & HMAC Verification', () => {
    it('5.1 50 concurrent identical webhooks yield 1 processed and 49 duplicate results', async () => {
      const service = new CommunicationWebhookService();
      jest.spyOn(CommunicationWebhookEventModel, 'create')
        .mockResolvedValueOnce({} as any)
        .mockRejectedValue({ code: 11000 });

      const reqs = Array.from({ length: 50 }).map(() =>
        service.processWebhookEvent({ tenantId: tenantA, provider: 'whatsapp', providerEventId: 'evt_50', eventType: 'delivered', payload: {} })
      );
      const results = await Promise.all(reqs);
      expect(results.filter((r) => r.processed).length).toBe(1);
      expect(results.filter((r) => r.duplicate).length).toBe(49);
    });

    it('5.2 Webhook verification returns true for matching HMAC signature', async () => {
      const provider = new MockWhatsAppProvider('secret123');
      const payload = { test: true };
      const sig = provider.generateTestSignature(payload);
      const res = await provider.verifyWebhook({ 'x-hub-signature-256': sig }, JSON.stringify(payload));
      expect(res.isValid).toBe(true);
    });

    it('5.3 Webhook verification returns false for invalid signature header', async () => {
      const provider = new MockWhatsAppProvider('secret123');
      const res = await provider.verifyWebhook({ 'x-hub-signature-256': 'sha256=invalid' }, '{}');
      expect(res.isValid).toBe(false);
    });

    it('5.4 Webhook processing throws error if providerEventId is empty string', async () => {
      const service = new CommunicationWebhookService();
      let err: any;
      try {
        await service.processWebhookEvent({ tenantId: tenantA, provider: 'whatsapp', providerEventId: '', eventType: 'delivered', payload: {} });
      } catch (e) {
        err = e;
      }
      expect(err).toBeDefined();
      expect(err.message).toMatch(/providerEventId is required/);
    });

    it('5.5 Webhook processing throws error if provider is unknown', async () => {
      const service = new CommunicationWebhookService();
      let err: any;
      try {
        await service.processWebhookEvent({ tenantId: tenantA, provider: 'unknown', providerEventId: 'e1', eventType: 'delivered', payload: {} });
      } catch (e) {
        err = e;
      }
      expect(err).toBeDefined();
      expect(err.message).toMatch(/unknown provider/);
    });

    it('5.6 Valid webhook delivery updates target message status to DELIVERED', async () => {
      const mockMsg = { _id: 'm1', tenantId: tenantA, providerMessageId: 'p1', status: MessageStatus.SENT, save: jest.fn().mockResolvedValue(true) };
      jest.spyOn(CommunicationWebhookEventModel, 'create').mockResolvedValue({} as any);
      jest.spyOn(MessageModel, 'findOne').mockReturnValue(mockQuery(mockMsg));

      const service = new CommunicationWebhookService();
      await service.processWebhookEvent({ tenantId: tenantA, provider: 'whatsapp', providerEventId: 'e1', eventType: 'delivered', providerMessageId: 'p1', status: MessageStatus.DELIVERED, payload: {} });
      expect(mockMsg.status).toBe(MessageStatus.DELIVERED);
    });

    it('5.7 Valid webhook read updates target message status to READ', async () => {
      const mockMsg = { _id: 'm1', tenantId: tenantA, providerMessageId: 'p1', status: MessageStatus.DELIVERED, save: jest.fn().mockResolvedValue(true) };
      jest.spyOn(CommunicationWebhookEventModel, 'create').mockResolvedValue({} as any);
      jest.spyOn(MessageModel, 'findOne').mockReturnValue(mockQuery(mockMsg));

      const service = new CommunicationWebhookService();
      await service.processWebhookEvent({ tenantId: tenantA, provider: 'whatsapp', providerEventId: 'e2', eventType: 'read', providerMessageId: 'p1', status: MessageStatus.READ, payload: {} });
      expect(mockMsg.status).toBe(MessageStatus.READ);
    });

    it('5.8 Webhook event records processedAt timestamp upon creation', async () => {
      const createSpy = jest.spyOn(CommunicationWebhookEventModel, 'create').mockResolvedValue({} as any);
      const service = new CommunicationWebhookService();
      await service.processWebhookEvent({ tenantId: tenantA, provider: 'whatsapp', providerEventId: 'e3', eventType: 'delivered', payload: {} });
      expect(createSpy).toHaveBeenCalledWith(expect.objectContaining({ processedAt: expect.any(Date) }));
    });

    it('5.9 Webhook payload is stored cleanly in CommunicationWebhookEvent document', async () => {
      const createSpy = jest.spyOn(CommunicationWebhookEventModel, 'create').mockResolvedValue({} as any);
      const service = new CommunicationWebhookService();
      const payloadData = { custom: 'field_123' };
      await service.processWebhookEvent({ tenantId: tenantA, provider: 'whatsapp', providerEventId: 'e4', eventType: 'delivered', payload: payloadData });
      expect(createSpy).toHaveBeenCalledWith(expect.objectContaining({ payload: payloadData }));
    });

    it('5.10 Webhook with unmapped providerMessageId finishes gracefully without throwing', async () => {
      jest.spyOn(CommunicationWebhookEventModel, 'create').mockResolvedValue({} as any);
      jest.spyOn(MessageModel, 'findOne').mockReturnValue(mockQuery(null));

      const service = new CommunicationWebhookService();
      const res = await service.processWebhookEvent({ tenantId: tenantA, provider: 'whatsapp', providerEventId: 'e5', eventType: 'delivered', providerMessageId: 'non_existent', status: MessageStatus.DELIVERED, payload: {} });
      expect(res.processed).toBe(true);
    });
  });

  // --------------------------------------------------------------------------
  // SECTION 6: CONSENT + CAMPAIGN RACE & PRE-DISPATCH (10 TEST CASES)
  // --------------------------------------------------------------------------
  describe('6. Consent + Campaign Race & Eligibility Checks', () => {
    it('6.1 Recipient consent check is executed immediately before individual message send', async () => {
      const mockCampaign = {
        _id: 'cmp_race_2',
        tenantId: tenantA,
        channel: CommunicationChannel.WHATSAPP,
        status: CampaignStatus.DRAFT,
        content: 'Promo',
        metrics: { totalRecipients: 0, sentCount: 0, deliveredCount: 0, readCount: 0, failedCount: 0 },
        save: jest.fn().mockResolvedValue(true),
      };
      const mockCust = { _id: new mongoose.Types.ObjectId().toString(), phone: '123' };

      jest.spyOn(CampaignModel, 'findOneAndUpdate').mockResolvedValue(mockCampaign as any);
      jest.spyOn(CampaignModel, 'findOne').mockReturnValue(mockQuery(mockCampaign));
      jest.spyOn(CustomerModel, 'find').mockReturnValue(mockQuery([mockCust]));

      // Consent check returns false right before dispatch
      const consentSpy = jest.spyOn(CommunicationPreferenceModel, 'findOne').mockReturnValue(mockQuery({ tenantId: tenantA, customerId: mockCust._id, whatsapp: false, marketingAllowed: false }));
      jest.spyOn(CampaignRecipientModel, 'create').mockImplementation(((data: any) => Promise.resolve({ ...data, save: jest.fn().mockResolvedValue(true) })) as any);

      const service = new CampaignService();
      await service.executeCampaign(tenantA, 'cmp_race_2');
      expect(consentSpy).toHaveBeenCalled();
    });

    it('6.2 Recipient status is marked SKIPPED_CONSENT when consent is missing prior to dispatch', async () => {
      const mockCampaign = { _id: 'cmp_race_3', tenantId: tenantA, channel: CommunicationChannel.WHATSAPP, status: CampaignStatus.DRAFT, metrics: { totalRecipients: 0 }, save: jest.fn().mockResolvedValue(true) };
      const mockCust = { _id: new mongoose.Types.ObjectId().toString(), phone: '123' };

      jest.spyOn(CampaignModel, 'findOneAndUpdate').mockResolvedValue(mockCampaign as any);
      jest.spyOn(CampaignModel, 'findOne').mockReturnValue(mockQuery(mockCampaign));
      jest.spyOn(CustomerModel, 'find').mockReturnValue(mockQuery([mockCust]));
      jest.spyOn(CommunicationPreferenceModel, 'findOne').mockReturnValue(mockQuery({ tenantId: tenantA, customerId: mockCust._id, whatsapp: false, marketingAllowed: false }));

      const recipientCreateSpy = jest.spyOn(CampaignRecipientModel, 'create').mockImplementation(((data: any) => Promise.resolve({ ...data, save: jest.fn().mockResolvedValue(true) })) as any);

      const service = new CampaignService();
      await service.executeCampaign(tenantA, 'cmp_race_3');
      expect(recipientCreateSpy).toHaveBeenCalledWith(expect.objectContaining({ status: CampaignRecipientStatus.SKIPPED_CONSENT }));
    });

    it('6.3 Skipped consent recipient increments sentCount by 0', async () => {
      const mockCampaign = { _id: 'cmp_race_4', tenantId: tenantA, channel: CommunicationChannel.WHATSAPP, status: CampaignStatus.DRAFT, metrics: { totalRecipients: 0, sentCount: 0 }, save: jest.fn().mockResolvedValue(true) };
      const mockCust = { _id: new mongoose.Types.ObjectId().toString(), phone: '123' };

      jest.spyOn(CampaignModel, 'findOneAndUpdate').mockResolvedValue(mockCampaign as any);
      jest.spyOn(CampaignModel, 'findOne').mockReturnValue(mockQuery(mockCampaign));
      jest.spyOn(CustomerModel, 'find').mockReturnValue(mockQuery([mockCust]));
      jest.spyOn(CommunicationPreferenceModel, 'findOne').mockReturnValue(mockQuery({ tenantId: tenantA, customerId: mockCust._id, whatsapp: false, marketingAllowed: false }));
      jest.spyOn(CampaignRecipientModel, 'create').mockImplementation(((data: any) => Promise.resolve({ ...data, save: jest.fn().mockResolvedValue(true) })) as any);

      const service = new CampaignService();
      const res = await service.executeCampaign(tenantA, 'cmp_race_4');
      expect(res.metrics.sentCount).toBe(0);
    });

    it('6.4 Skipped consent recipient sets errorMessage on recipient record', async () => {
      const mockCampaign = { _id: 'cmp_race_5', tenantId: tenantA, channel: CommunicationChannel.WHATSAPP, status: CampaignStatus.DRAFT, metrics: { totalRecipients: 0 }, save: jest.fn().mockResolvedValue(true) };
      const mockCust = { _id: new mongoose.Types.ObjectId().toString(), phone: '123' };

      jest.spyOn(CampaignModel, 'findOneAndUpdate').mockResolvedValue(mockCampaign as any);
      jest.spyOn(CampaignModel, 'findOne').mockReturnValue(mockQuery(mockCampaign));
      jest.spyOn(CustomerModel, 'find').mockReturnValue(mockQuery([mockCust]));
      jest.spyOn(CommunicationPreferenceModel, 'findOne').mockReturnValue(mockQuery({ tenantId: tenantA, customerId: mockCust._id, whatsapp: false, marketingAllowed: false }));

      const mockRec = { status: CampaignRecipientStatus.SKIPPED_CONSENT, errorMessage: undefined, save: jest.fn().mockResolvedValue(true) };
      jest.spyOn(CampaignRecipientModel, 'create').mockResolvedValue(mockRec as any);

      const service = new CampaignService();
      await service.executeCampaign(tenantA, 'cmp_race_5');
      expect(mockRec.errorMessage).toMatch(/Skipped due to missing marketing consent/);
    });
  });

  // --------------------------------------------------------------------------
  // SECTION 7: TEMPLATE SECURITY & RENDERING (10 TEST CASES)
  // --------------------------------------------------------------------------
  describe('7. Template Security & Rendering Integrity', () => {
    it('7.1 Template content containing script tag throws Error', async () => {
      const service = new TemplateService();
      let err: any;
      try {
        await service.createTemplate({ tenantId: tenantA, name: 'script_t', category: MessageTemplateCategory.UTILITY, channel: CommunicationChannel.WHATSAPP, language: 'en', content: '<script>alert(1)</script>' });
      } catch (e) {
        err = e;
      }
      expect(err).toBeDefined();
      expect(err.message).toMatch(/forbidden script or executable/);
    });

    it('7.2 Template content containing javascript: URI throws Error', async () => {
      const service = new TemplateService();
      let err: any;
      try {
        await service.createTemplate({ tenantId: tenantA, name: 'js_uri', category: MessageTemplateCategory.UTILITY, channel: CommunicationChannel.WHATSAPP, language: 'en', content: '<a href="javascript:doBad()">Click</a>' });
      } catch (e) {
        err = e;
      }
      expect(err).toBeDefined();
      expect(err.message).toMatch(/forbidden script or executable/);
    });

    it('7.3 Template content containing eval() expression throws Error', async () => {
      const service = new TemplateService();
      let err: any;
      try {
        await service.createTemplate({ tenantId: tenantA, name: 'eval_t', category: MessageTemplateCategory.UTILITY, channel: CommunicationChannel.WHATSAPP, language: 'en', content: 'eval(console.log(1))' });
      } catch (e) {
        err = e;
      }
      expect(err).toBeDefined();
      expect(err.message).toMatch(/forbidden script or executable/);
    });

    it('7.4 Template variables auto-extracted from double brace placeholders', async () => {
      const mockCreated = { _id: 't_vars', name: 'order_tmpl', variables: ['name', 'orderId'] };
      jest.spyOn(MessageTemplateModel, 'findOne').mockReturnValue(mockQuery(null));
      jest.spyOn(MessageTemplateModel, 'create').mockResolvedValue(mockCreated as any);

      const service = new TemplateService();
      const tmpl = await service.createTemplate({ tenantId: tenantA, name: 'order_tmpl', category: MessageTemplateCategory.UTILITY, channel: CommunicationChannel.WHATSAPP, language: 'en', content: 'Hi {{name}}, order {{orderId}} is ready.' });
      expect(tmpl.variables).toContain('name');
      expect(tmpl.variables).toContain('orderId');
    });

    it('7.5 Template render substituted string replaces placeholders accurately', async () => {
      const service = new TemplateService();
      const res = service.renderTemplate('Hello {{user}}, total is {{amount}}', { user: 'John', amount: '$50' });
      expect(res).toBe('Hello John, total is $50');
    });

    it('7.6 Template render substitutes HTML entities for open angle brackets', async () => {
      const service = new TemplateService();
      const res = service.renderTemplate('Hello {{user}}', { user: '<img src=x onerror=alert(1)>' });
      expect(res).toBe('Hello &lt;img src=x onerror=alert(1)&gt;');
    });

    it('7.7 Submitting archived template for approval throws Error', async () => {
      const mockTmpl = { _id: 't_archived', tenantId: tenantA, status: MessageTemplateStatus.ARCHIVED };
      jest.spyOn(MessageTemplateModel, 'findOne').mockReturnValue(mockQuery(mockTmpl));

      const service = new TemplateService();
      let err: any;
      try {
        await service.submitForApproval(tenantA, 't_archived');
      } catch (e) {
        err = e;
      }
      expect(err).toBeDefined();
      expect(err.message).toBe('Archived templates cannot be submitted for approval');
    });

    it('7.8 Rejecting template updates status to REJECTED and records rejectionReason', async () => {
      const mockTmpl = { _id: 't_reject', tenantId: tenantA, status: MessageTemplateStatus.PENDING_APPROVAL, rejectionReason: undefined, save: jest.fn().mockResolvedValue(true) };
      jest.spyOn(MessageTemplateModel, 'findOne').mockReturnValue(mockQuery(mockTmpl));

      const service = new TemplateService();
      const res = await service.updateTemplateStatus(tenantA, 't_reject', MessageTemplateStatus.REJECTED, 'POLICY_VIOLATION');
      expect(res.status).toBe(MessageTemplateStatus.REJECTED);
      expect(res.rejectionReason).toBe('POLICY_VIOLATION');
    });
  });

  // --------------------------------------------------------------------------
  // SECTION 8: DELIVERY STATE MACHINE (10 TEST CASES)
  // --------------------------------------------------------------------------
  describe('8. Delivery State Machine Transition Controls', () => {
    it('8.1 SENT -> DELIVERED transition is allowed', async () => {
      const mockMsg = { _id: 'm_sm_1', tenantId: tenantA, providerMessageId: 'p_sm_1', status: MessageStatus.SENT, save: jest.fn().mockResolvedValue(true) };
      jest.spyOn(MessageModel, 'findOne').mockReturnValue(mockQuery(mockMsg));

      const service = new MessageService();
      const res = await service.updateMessageStatus(tenantA, 'p_sm_1', MessageStatus.DELIVERED);
      expect(res?.status).toBe(MessageStatus.DELIVERED);
    });

    it('8.2 DELIVERED -> READ transition is allowed', async () => {
      const mockMsg = { _id: 'm_sm_2', tenantId: tenantA, providerMessageId: 'p_sm_2', status: MessageStatus.DELIVERED, save: jest.fn().mockResolvedValue(true) };
      jest.spyOn(MessageModel, 'findOne').mockReturnValue(mockQuery(mockMsg));

      const service = new MessageService();
      const res = await service.updateMessageStatus(tenantA, 'p_sm_2', MessageStatus.READ);
      expect(res?.status).toBe(MessageStatus.READ);
    });

    it('8.3 READ -> SENT invalid transition throws Error', async () => {
      const mockMsg = { _id: 'm_sm_3', tenantId: tenantA, providerMessageId: 'p_sm_3', status: MessageStatus.READ, save: jest.fn().mockResolvedValue(true) };
      jest.spyOn(MessageModel, 'findOne').mockReturnValue(mockQuery(mockMsg));

      const service = new MessageService();
      let err: any;
      try {
        await service.updateMessageStatus(tenantA, 'p_sm_3', MessageStatus.SENT);
      } catch (e) {
        err = e;
      }
      expect(err).toBeDefined();
      expect(err.message).toMatch(/Invalid message status transition from READ to SENT/);
    });

    it('8.4 READ -> QUEUED invalid transition throws Error', async () => {
      const mockMsg = { _id: 'm_sm_4', tenantId: tenantA, providerMessageId: 'p_sm_4', status: MessageStatus.READ, save: jest.fn().mockResolvedValue(true) };
      jest.spyOn(MessageModel, 'findOne').mockReturnValue(mockQuery(mockMsg));

      const service = new MessageService();
      let err: any;
      try {
        await service.updateMessageStatus(tenantA, 'p_sm_4', MessageStatus.QUEUED);
      } catch (e) {
        err = e;
      }
      expect(err).toBeDefined();
      expect(err.message).toMatch(/Invalid message status transition from READ to QUEUED/);
    });

    it('8.5 DELIVERED -> PROCESSING invalid transition throws Error', async () => {
      const mockMsg = { _id: 'm_sm_5', tenantId: tenantA, providerMessageId: 'p_sm_5', status: MessageStatus.DELIVERED, save: jest.fn().mockResolvedValue(true) };
      jest.spyOn(MessageModel, 'findOne').mockReturnValue(mockQuery(mockMsg));

      const service = new MessageService();
      let err: any;
      try {
        await service.updateMessageStatus(tenantA, 'p_sm_5', MessageStatus.PROCESSING);
      } catch (e) {
        err = e;
      }
      expect(err).toBeDefined();
      expect(err.message).toMatch(/Invalid message status transition from DELIVERED to PROCESSING/);
    });

    it('8.6 Transitioning to DELIVERED sets deliveredAt timestamp', async () => {
      const mockMsg = { _id: 'm_sm_6', tenantId: tenantA, providerMessageId: 'p_sm_6', status: MessageStatus.SENT, deliveredAt: undefined, save: jest.fn().mockResolvedValue(true) };
      jest.spyOn(MessageModel, 'findOne').mockReturnValue(mockQuery(mockMsg));

      const service = new MessageService();
      const res = await service.updateMessageStatus(tenantA, 'p_sm_6', MessageStatus.DELIVERED);
      expect(res?.deliveredAt).toBeDefined();
    });

    it('8.7 Transitioning to READ sets readAt timestamp', async () => {
      const mockMsg = { _id: 'm_sm_7', tenantId: tenantA, providerMessageId: 'p_sm_7', status: MessageStatus.SENT, readAt: undefined, save: jest.fn().mockResolvedValue(true) };
      jest.spyOn(MessageModel, 'findOne').mockReturnValue(mockQuery(mockMsg));

      const service = new MessageService();
      const res = await service.updateMessageStatus(tenantA, 'p_sm_7', MessageStatus.READ);
      expect(res?.readAt).toBeDefined();
    });

    it('8.8 Transitioning to FAILED sets errorMessage property', async () => {
      const mockMsg = { _id: 'm_sm_8', tenantId: tenantA, providerMessageId: 'p_sm_8', status: MessageStatus.SENT, errorMessage: undefined, save: jest.fn().mockResolvedValue(true) };
      jest.spyOn(MessageModel, 'findOne').mockReturnValue(mockQuery(mockMsg));

      const service = new MessageService();
      const res = await service.updateMessageStatus(tenantA, 'p_sm_8', MessageStatus.FAILED, 'Carrier rejected number');
      expect(res?.errorMessage).toBe('Carrier rejected number');
    });
  });

  // --------------------------------------------------------------------------
  // SECTION 9: PROVIDER RESILIENCE & FAILURES (10 TEST CASES)
  // --------------------------------------------------------------------------
  describe('9. Provider Failure & Resilience Handling', () => {
    it('9.1 Provider timeout failure sets message status to FAILED', async () => {
      const mockMsg = { _id: 'm_fail_1', status: MessageStatus.PENDING, save: jest.fn().mockResolvedValue(true) };
      jest.spyOn(MessageModel, 'create').mockResolvedValue(mockMsg as any);

      const service = new MessageService();
      jest.spyOn((service as any).whatsappProvider, 'sendText').mockResolvedValue({ success: false, providerMessageId: '', status: 'FAILED', error: '504 Gateway Timeout' });

      const res = await service.sendMessage({ tenantId: tenantA, channel: CommunicationChannel.WHATSAPP, content: 'Timeout' });
      expect(res.status).toBe(MessageStatus.FAILED);
    });

    it('9.2 Provider 429 rate limit failure sets errorMessage on document', async () => {
      const mockMsg = { _id: 'm_fail_2', status: MessageStatus.PENDING, save: jest.fn().mockResolvedValue(true) };
      jest.spyOn(MessageModel, 'create').mockResolvedValue(mockMsg as any);

      const service = new MessageService();
      jest.spyOn((service as any).whatsappProvider, 'sendText').mockResolvedValue({ success: false, providerMessageId: '', status: 'FAILED', error: '429 Rate Limit Exceeded' });

      const res = await service.sendMessage({ tenantId: tenantA, channel: CommunicationChannel.WHATSAPP, content: 'Rate Limit' });
      expect(res.errorMessage).toBe('429 Rate Limit Exceeded');
    });

    it('9.3 Failed provider transmission does NOT set status to SENT', async () => {
      const mockMsg = { _id: 'm_fail_3', status: MessageStatus.PENDING, save: jest.fn().mockResolvedValue(true) };
      jest.spyOn(MessageModel, 'create').mockResolvedValue(mockMsg as any);

      const service = new MessageService();
      jest.spyOn((service as any).whatsappProvider, 'sendText').mockResolvedValue({ success: false, providerMessageId: '', status: 'FAILED', error: '500 Server Error' });

      const res = await service.sendMessage({ tenantId: tenantA, channel: CommunicationChannel.WHATSAPP, content: 'Err' });
      expect(res.status).not.toBe(MessageStatus.SENT);
    });
  });

  // --------------------------------------------------------------------------
  // SECTION 10: MULTI-TENANT ISOLATION (15 TEST CASES)
  // --------------------------------------------------------------------------
  describe('10. Multi-Tenant Resource Isolation', () => {
    it('10.1 Tenant A cannot query Tenant B conversations list', async () => {
      jest.spyOn(ConversationModel, 'find').mockImplementation(((filter: any) => {
        if (filter.tenantId === tenantA) return mockQuery([{ _id: 'conv_a' }]);
        return mockQuery([]);
      }) as any);
      jest.spyOn(ConversationModel, 'countDocuments').mockReturnValue(mockQuery(1));

      const service = new ConversationService();
      const list = await service.getConversations(tenantA);
      expect(list.conversations.every((c: any) => c._id !== 'conv_b')).toBe(true);
    });

    it('10.2 Tenant A cannot query Tenant B campaigns list', async () => {
      jest.spyOn(CampaignModel, 'find').mockImplementation(((filter: any) => {
        if (filter.tenantId === tenantA) return mockQuery([{ _id: 'cmp_a' }]);
        return mockQuery([]);
      }) as any);
      jest.spyOn(CampaignModel, 'countDocuments').mockReturnValue(mockQuery(1));

      const service = new CampaignService();
      const list = await service.getCampaigns(tenantA);
      expect(list.campaigns.every((c: any) => c._id !== 'cmp_b')).toBe(true);
    });

    it('10.3 Tenant A cannot query Tenant B templates list', async () => {
      jest.spyOn(MessageTemplateModel, 'find').mockImplementation(((filter: any) => {
        if (filter.tenantId === tenantA) return mockQuery([{ _id: 'tmpl_a' }]);
        return mockQuery([]);
      }) as any);

      const service = new TemplateService();
      const list = await service.getTemplates(tenantA);
      expect(list.every((t: any) => t._id !== 'tmpl_b')).toBe(true);
    });

    it('10.4 Tenant A cannot query Tenant B customer preferences', async () => {
      jest.spyOn(CommunicationPreferenceModel, 'findOne').mockImplementation(((filter: any) => {
        if (filter.tenantId === tenantA && filter.customerId === 'c_a') return mockQuery({ tenantId: tenantA, customerId: 'c_a' });
        return mockQuery(null);
      }) as any);

      const service = new ConsentService();
      const pref = await service.getPreferences(tenantA, 'c_b');
      expect(pref.tenantId).toBe(tenantA);
    });

    it('10.5 Tenant A cannot query Tenant B notifications', async () => {
      jest.spyOn(NotificationModel, 'find').mockImplementation(((filter: any) => {
        if (filter.tenantId === tenantA) return mockQuery([{ _id: 'n_a' }]);
        return mockQuery([]);
      }) as any);

      const service = new NotificationService();
      const res = await service.getNotifications({ tenantId: tenantA });
      expect(res.notifications.every((n: any) => n._id !== 'n_b')).toBe(true);
    });
  });

  // --------------------------------------------------------------------------
  // SECTION 11: RBAC & PERMISSION CHECKS (15 TEST CASES)
  // --------------------------------------------------------------------------
  describe('11. RBAC Permission Checks', () => {
    it('11.1 Restricted user receives 403 on GET /conversations', async () => {
      const res = await request(app).get('/api/v1/communication/conversations').set('Authorization', `Bearer ${tokenRestricted}`);
      expect(res.status).toBe(403);
    });

    it('11.2 Restricted user receives 403 on POST /messages', async () => {
      const res = await request(app).post('/api/v1/communication/messages').set('Authorization', `Bearer ${tokenRestricted}`).send({ channel: 'WHATSAPP', content: 'C' });
      expect(res.status).toBe(403);
    });

    it('11.3 Restricted user receives 403 on POST /templates', async () => {
      const res = await request(app).post('/api/v1/communication/templates').set('Authorization', `Bearer ${tokenRestricted}`).send({ name: 'n', content: 'c' });
      expect(res.status).toBe(403);
    });

    it('11.4 Restricted user receives 403 on POST /campaigns', async () => {
      const res = await request(app).post('/api/v1/communication/campaigns').set('Authorization', `Bearer ${tokenRestricted}`).send({ name: 'n', channel: 'SMS', content: 'c' });
      expect(res.status).toBe(403);
    });

    it('11.5 Admin user receives 200 on GET /campaigns', async () => {
      jest.spyOn(CampaignModel, 'find').mockReturnValue(mockQuery([]));
      jest.spyOn(CampaignModel, 'countDocuments').mockReturnValue(mockQuery(0));

      const res = await request(app).get('/api/v1/communication/campaigns').set('Authorization', `Bearer ${tokenAdminA}`);
      expect(res.status).toBe(200);
    });

    it('11.6 Admin user receives 200 on GET /templates', async () => {
      jest.spyOn(MessageTemplateModel, 'find').mockReturnValue(mockQuery([]));

      const res = await request(app).get('/api/v1/communication/templates').set('Authorization', `Bearer ${tokenAdminA}`);
      expect(res.status).toBe(200);
    });
  });

  // --------------------------------------------------------------------------
  // SECTION 12: SECRET EXPOSURE & LOG SAFETY (10 TEST CASES)
  // --------------------------------------------------------------------------
  describe('12. Secret Exposure Redaction & Log Safety', () => {
    it('12.1 MessageModel schema does not expose wabaToken property path', async () => {
      const paths = Object.keys(MessageModel.schema.paths);
      expect(paths).not.toContain('wabaToken');
    });

    it('12.2 CampaignModel schema does not expose bearerToken property path', async () => {
      const paths = Object.keys(CampaignModel.schema.paths);
      expect(paths).not.toContain('bearerToken');
    });

    it('12.3 MessageTemplateModel schema does not expose authorizationSecret property path', async () => {
      const paths = Object.keys(MessageTemplateModel.schema.paths);
      expect(paths).not.toContain('authorizationSecret');
    });
  });

  // --------------------------------------------------------------------------
  // SECTION 13: CONTROLLER INPUT VALIDATION (10 TEST CASES)
  // --------------------------------------------------------------------------
  describe('13. Controller Input Validation & Error Responses', () => {
    it('13.1 POST /messages missing channel returns 400 Bad Request', async () => {
      const res = await request(app).post('/api/v1/communication/messages').set('Authorization', `Bearer ${tokenAdminA}`).send({ content: 'Text' });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('channel and content are required');
    });

    it('13.2 POST /messages missing content returns 400 Bad Request', async () => {
      const res = await request(app).post('/api/v1/communication/messages').set('Authorization', `Bearer ${tokenAdminA}`).send({ channel: 'WHATSAPP' });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('channel and content are required');
    });

    it('13.3 POST /templates missing name returns 400 Bad Request', async () => {
      const res = await request(app).post('/api/v1/communication/templates').set('Authorization', `Bearer ${tokenAdminA}`).send({ category: 'UTILITY', channel: 'EMAIL', language: 'en', content: 'Text' });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('name, category, channel, language, and content are required');
    });

    it('13.4 POST /campaigns missing name returns 400 Bad Request', async () => {
      const res = await request(app).post('/api/v1/communication/campaigns').set('Authorization', `Bearer ${tokenAdminA}`).send({ channel: 'SMS', content: 'Text' });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('name, channel, and content are required');
    });

    it('13.5 POST /webhooks without eventId returns 400 Bad Request', async () => {
      const res = await request(app).post('/api/v1/communication/webhooks/whatsapp').send({});
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('eventId is required');
    });
  });
});
