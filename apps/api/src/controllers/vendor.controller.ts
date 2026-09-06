import { Request, Response } from 'express';
import { VendorService } from '../services/vendor.service';
import { createVendorSchema, updateVendorSchema, createVendorProductSchema, createVendorNoteSchema } from '@sellzy/validation';

export class VendorController {
  static async createVendor(req: Request, res: Response) {
    try {
      const tenantId = (req as any).tenantId;
      const userId = (req as any).user?.id || 'system';
      const validatedInput = createVendorSchema.parse(req.body);

      const vendor = await VendorService.createVendor(tenantId, validatedInput, userId);
      return res.status(201).json({ success: true, data: vendor });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message || err });
    }
  }

  static async getVendors(req: Request, res: Response) {
    try {
      const tenantId = (req as any).tenantId;
      const result = await VendorService.getVendors(tenantId, req.query);
      return res.status(200).json({ success: true, ...result });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  static async getVendorById(req: Request, res: Response) {
    try {
      const tenantId = (req as any).tenantId;
      const { id } = req.params;
      const vendorData = await VendorService.getVendorById(tenantId, id);

      if (!vendorData) {
        return res.status(404).json({ success: false, error: 'Vendor not found' });
      }

      return res.status(200).json({ success: true, data: vendorData });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  static async updateVendor(req: Request, res: Response) {
    try {
      const tenantId = (req as any).tenantId;
      const userId = (req as any).user?.id || 'system';
      const { id } = req.params;
      const validatedInput = updateVendorSchema.parse(req.body);

      const vendor = await VendorService.updateVendor(tenantId, id, validatedInput, userId);
      if (!vendor) {
        return res.status(404).json({ success: false, error: 'Vendor not found' });
      }

      return res.status(200).json({ success: true, data: vendor });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message || err });
    }
  }

  static async archiveVendor(req: Request, res: Response) {
    try {
      const tenantId = (req as any).tenantId;
      const userId = (req as any).user?.id || 'system';
      const { id } = req.params;

      const vendor = await VendorService.archiveVendor(tenantId, id, userId);
      if (!vendor) {
        return res.status(404).json({ success: false, error: 'Vendor not found' });
      }

      return res.status(200).json({ success: true, data: vendor });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  static async upsertVendorProduct(req: Request, res: Response) {
    try {
      const tenantId = (req as any).tenantId;
      const validatedInput = createVendorProductSchema.parse(req.body);

      const vp = await VendorService.upsertVendorProduct(tenantId, validatedInput);
      return res.status(200).json({ success: true, data: vp });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message || err });
    }
  }

  static async removeVendorProduct(req: Request, res: Response) {
    try {
      const tenantId = (req as any).tenantId;
      const { vendorProductId } = req.params;

      await VendorService.removeVendorProduct(tenantId, vendorProductId);
      return res.status(200).json({ success: true, message: 'Vendor product removed' });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  static async addNote(req: Request, res: Response) {
    try {
      const tenantId = (req as any).tenantId;
      const userId = (req as any).user?.id || 'system';
      const userName = (req as any).user?.name || 'Staff User';
      const { id } = req.params;
      const { content } = createVendorNoteSchema.parse(req.body);

      const note = await VendorService.addNote(tenantId, id, userId, userName, content);
      return res.status(201).json({ success: true, data: note });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message || err });
    }
  }
}
