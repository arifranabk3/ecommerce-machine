import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { LocationService } from '../services/location.service';
import { createLocationSchema, updateLocationSchema } from '@sellzy/validation';

export class LocationController {
  static async listLocations(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.user!.tenantId;
      const includeArchived = req.query.includeArchived === 'true';
      const locations = await LocationService.getLocations(tenantId, includeArchived);
      return res.json({ success: true, data: locations });
    } catch (err) {
      next(err);
    }
  }

  static async getLocationDetail(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.user!.tenantId;
      const locationId = req.params.id;
      const location = await LocationService.getLocationById(tenantId, locationId);
      return res.json({ success: true, data: location });
    } catch (err) {
      next(err);
    }
  }

  static async createLocation(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.user!.tenantId;
      const actorUserId = req.user!.userId;
      const input = createLocationSchema.parse(req.body);
      const location = await LocationService.createLocation(tenantId, input, actorUserId);
      return res.status(201).json({ success: true, data: location });
    } catch (err) {
      next(err);
    }
  }

  static async updateLocation(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.user!.tenantId;
      const locationId = req.params.id;
      const actorUserId = req.user!.userId;
      const input = updateLocationSchema.parse(req.body);
      const location = await LocationService.updateLocation(tenantId, locationId, input, actorUserId);
      return res.json({ success: true, data: location });
    } catch (err) {
      next(err);
    }
  }

  static async archiveLocation(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.user!.tenantId;
      const locationId = req.params.id;
      const actorUserId = req.user!.userId;
      const location = await LocationService.archiveLocation(tenantId, locationId, actorUserId);
      return res.json({ success: true, data: location });
    } catch (err) {
      next(err);
    }
  }
}
