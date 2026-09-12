import { Router } from 'express';
import { ThemeConfigurationModel } from '../models/ThemeConfiguration';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// GET active/resolved storefront config (public)
// This is called by Next.js to render the storefront
router.get('/resolve', async (req, res) => {
  try {
    const { tenantId, preview } = req.query;
    if (!tenantId) {
      return res.status(400).json({ error: 'tenantId is required' });
    }

    // Find the published theme for this tenant
    let config = await ThemeConfigurationModel.findOne({ tenantId, isPublished: true });

    // If preview mode, return draft data instead of published data
    if (config && preview === 'true') {
       return res.json({
         themeId: config.themeId,
         data: config.draftData,
         isPublished: config.isPublished
       });
    }

    if (config) {
      return res.json({
        themeId: config.themeId,
        data: config.publishedData,
        isPublished: config.isPublished
      });
    }

    res.status(404).json({ error: 'No active theme found for tenant' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET all theme configurations for a tenant (Admin)
router.get('/themes', authenticateToken, async (req, res) => {
  try {
    // Assuming requireAuth sets req.tenantId
    const tenantId = (req as any).tenantId; 
    const configs = await ThemeConfigurationModel.find({ tenantId });
    res.json(configs);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET specific theme configuration (Admin)
router.get('/themes/:themeId', authenticateToken, async (req, res) => {
  try {
    const tenantId = (req as any).tenantId; 
    const { themeId } = req.params;
    let config = await ThemeConfigurationModel.findOne({ tenantId, themeId });
    if (!config) {
      // Create a default empty one if it doesn't exist
      config = new ThemeConfigurationModel({
        tenantId,
        themeId,
        isPublished: false,
      });
      await config.save();
    }
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT save draft data (Admin)
router.put('/themes/:themeId/draft', authenticateToken, async (req, res) => {
  try {
    const tenantId = (req as any).tenantId; 
    const { themeId } = req.params;
    const { draftData } = req.body;

    let config = await ThemeConfigurationModel.findOne({ tenantId, themeId });
    if (!config) {
      config = new ThemeConfigurationModel({ tenantId, themeId });
    }
    config.draftData = draftData;
    await config.save();

    res.json(config);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST publish theme (Admin)
router.post('/themes/:themeId/publish', authenticateToken, async (req, res) => {
  try {
    const tenantId = (req as any).tenantId; 
    const { themeId } = req.params;

    // First, unpublish all other themes for this tenant
    await ThemeConfigurationModel.updateMany(
      { tenantId, themeId: { $ne: themeId } },
      { $set: { isPublished: false } }
    );

    let config = await ThemeConfigurationModel.findOne({ tenantId, themeId });
    if (!config) {
      return res.status(404).json({ error: 'Theme configuration not found' });
    }

    // Promote draft to published
    config.publishedData = config.draftData;
    config.isPublished = true;
    await config.save();

    res.json(config);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
