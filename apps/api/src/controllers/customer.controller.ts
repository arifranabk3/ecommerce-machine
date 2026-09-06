import { Request, Response, NextFunction } from 'express';
import { CustomerService } from '../services/customer.service';
import { CustomerSegmentService } from '../services/customer-segment.service';
import {
  createCustomerSchema,
  updateCustomerSchema,
  createAddressSchema,
  updateAddressSchema,
  createCustomerNoteSchema,
  addCustomerTagSchema,
  updateConsentSchema,
  mergeCustomersSchema,
  createSegmentSchema,
} from '@sellzy/validation';

export class CustomerController {
  static async createCustomer(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = createCustomerSchema.parse(req.body);
      const tenantId = (req as any).tenantId;
      const userId = (req as any).user?.userId;

      const customer = await CustomerService.createCustomer(tenantId, {
        ...validated,
        createdBy: userId,
      } as any);

      res.status(201).json({ success: true, data: customer });
    } catch (err) {
      next(err);
    }
  }

  static async listCustomers(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = (req as any).tenantId;
      const { search, status, lifecycleStage, source, tag, minSpent, maxSpent, page, limit } = req.query;

      const result = await CustomerService.listCustomers(tenantId, {
        search: search as string,
        status: status as string,
        lifecycleStage: lifecycleStage as string,
        source: source as string,
        tag: tag as string,
        minSpent: minSpent ? parseInt(minSpent as string, 10) : undefined,
        maxSpent: maxSpent ? parseInt(maxSpent as string, 10) : undefined,
        page: page ? parseInt(page as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 20,
      });

      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getCustomer(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = (req as any).tenantId;
      const customer = await CustomerService.getCustomerById(tenantId, req.params.id);
      res.json({ success: true, data: customer });
    } catch (err) {
      next(err);
    }
  }

  static async updateCustomer(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = updateCustomerSchema.parse(req.body);
      const tenantId = (req as any).tenantId;
      const userId = (req as any).user?.userId;

      const customer = await CustomerService.updateCustomer(tenantId, req.params.id, {
        ...validated,
        updatedBy: userId,
      } as any);

      res.json({ success: true, data: customer });
    } catch (err) {
      next(err);
    }
  }

  static async archiveCustomer(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = (req as any).tenantId;
      const userId = (req as any).user?.userId;

      const customer = await CustomerService.archiveCustomer(tenantId, req.params.id, userId);
      res.json({ success: true, data: customer });
    } catch (err) {
      next(err);
    }
  }

  static async detectDuplicates(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = (req as any).tenantId;
      const { email, phone, displayName } = req.query;

      const duplicates = await CustomerService.detectDuplicates(
        tenantId,
        email as string,
        phone as string,
        displayName as string
      );

      res.json({ success: true, data: duplicates });
    } catch (err) {
      next(err);
    }
  }

  static async mergeCustomers(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = mergeCustomersSchema.parse(req.body);
      const tenantId = (req as any).tenantId;
      const userId = (req as any).user?.userId;

      const mergedPrimary = await CustomerService.mergeCustomers(
        tenantId,
        validated.primaryCustomerId,
        validated.secondaryCustomerId,
        validated.reason,
        userId
      );

      res.json({ success: true, data: mergedPrimary });
    } catch (err) {
      next(err);
    }
  }

  static async getCustomerOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = (req as any).tenantId;
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;

      const result = await CustomerService.getCustomerOrders(tenantId, req.params.id, page, limit);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getCustomerActivity(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = (req as any).tenantId;
      const activity = await CustomerService.getCustomerActivity(tenantId, req.params.id);
      res.json({ success: true, data: activity });
    } catch (err) {
      next(err);
    }
  }

  // Address Controllers
  static async listAddresses(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = (req as any).tenantId;
      const addresses = await CustomerService.listAddresses(tenantId, req.params.id);
      res.json({ success: true, data: addresses });
    } catch (err) {
      next(err);
    }
  }

  static async addAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = createAddressSchema.parse(req.body);
      const tenantId = (req as any).tenantId;
      const address = await CustomerService.addAddress(tenantId, req.params.id, validated);
      res.status(201).json({ success: true, data: address });
    } catch (err) {
      next(err);
    }
  }

  static async removeAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = (req as any).tenantId;
      const result = await CustomerService.removeAddress(tenantId, req.params.id, req.params.addressId);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  // Notes Controllers
  static async listNotes(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = (req as any).tenantId;
      const notes = await CustomerService.listNotes(tenantId, req.params.id);
      res.json({ success: true, data: notes });
    } catch (err) {
      next(err);
    }
  }

  static async addNote(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = createCustomerNoteSchema.parse(req.body);
      const tenantId = (req as any).tenantId;
      const userId = (req as any).user?.userId;

      const note = await CustomerService.addNote(tenantId, req.params.id, userId, validated.content);
      res.status(201).json({ success: true, data: note });
    } catch (err) {
      next(err);
    }
  }

  // Tag Controllers
  static async addTag(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = addCustomerTagSchema.parse(req.body);
      const tenantId = (req as any).tenantId;
      const userId = (req as any).user?.userId;

      const customer = await CustomerService.addTag(tenantId, req.params.id, validated.tag, userId);
      res.json({ success: true, data: customer });
    } catch (err) {
      next(err);
    }
  }

  static async removeTag(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = (req as any).tenantId;
      const userId = (req as any).user?.userId;

      const customer = await CustomerService.removeTag(tenantId, req.params.id, req.params.tag, userId);
      res.json({ success: true, data: customer });
    } catch (err) {
      next(err);
    }
  }

  // Consent Controller
  static async updateConsent(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = updateConsentSchema.parse(req.body);
      const tenantId = (req as any).tenantId;
      const userId = (req as any).user?.userId;

      const customer = await CustomerService.updateConsent(
        tenantId,
        req.params.id,
        validated.marketingConsent,
        validated.marketingConsentSource,
        userId
      );
      res.json({ success: true, data: customer });
    } catch (err) {
      next(err);
    }
  }

  // Segment Controllers
  static async listSegments(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = (req as any).tenantId;
      const segments = await CustomerSegmentService.listSegments(tenantId);
      res.json({ success: true, data: segments });
    } catch (err) {
      next(err);
    }
  }

  static async createSegment(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = createSegmentSchema.parse(req.body);
      const tenantId = (req as any).tenantId;
      const userId = (req as any).user?.userId;

      const segment = await CustomerSegmentService.createSegment(tenantId, {
        ...validated,
        createdBy: userId,
      } as any);

      res.status(201).json({ success: true, data: segment });
    } catch (err) {
      next(err);
    }
  }

  static async evaluateSegment(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = (req as any).tenantId;
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;

      const result = await CustomerSegmentService.evaluateSegment(tenantId, req.params.id, page, limit);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
}
