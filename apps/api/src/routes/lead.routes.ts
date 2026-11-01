import { Router } from 'express';
import { LeadController } from '../controllers/lead.controller';
import { authenticateToken, requirePermission } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

// Stage 1: Lead Collection, Verification, Overview & Lists
router.get('/overview', requirePermission('customers.view'), LeadController.getLeadOverview);
router.post('/collect', requirePermission('customers.view'), LeadController.collectLeads);
router.get('/', requirePermission('customers.view'), LeadController.getLeads);
router.get('/export-csv', requirePermission('customers.view'), LeadController.exportCountryLeadsCsv);
router.post('/import-csv', requirePermission('customers.create'), LeadController.importLeadsCsv);

// Country-Based Collection Engine & Provider Endpoints
router.get('/countries', requirePermission('customers.view'), LeadController.getSupportedCountries);
router.post('/jobs/start', requirePermission('customers.create'), LeadController.startCountryCollectionJob);
router.get('/jobs/recent', requirePermission('customers.view'), LeadController.getRecentCollectionJobs);
router.get('/jobs/:jobId', requirePermission('customers.view'), LeadController.getCollectionJobStatus);
router.post('/jobs/:jobId/cancel', requirePermission('customers.create'), LeadController.cancelCollectionJob);
router.post('/jobs/:jobId/retry', requirePermission('customers.create'), LeadController.retryCollectionJob);

// Domain Email Grabber
router.post('/grab', requirePermission('customers.create'), LeadController.grabEmails);

// Batch Email Verification
router.post('/verify-batch', requirePermission('customers.view'), LeadController.verifyBatch);

// Excel / CSV Parsing & Lead Grabber Matching Engine
router.post('/imports/parse', requirePermission('customers.create'), LeadController.parseSpreadsheetUpload);
router.post('/imports/match', requirePermission('customers.view'), LeadController.matchImportedDataset);
router.post('/imports/export-report', requirePermission('customers.view'), LeadController.exportMatchingReportCsv);

// Saved Lead Lists
router.post('/lists', requirePermission('customers.create'), LeadController.createList);
router.get('/lists', requirePermission('customers.view'), LeadController.getLists);
router.patch('/lists/:id', requirePermission('customers.create'), LeadController.updateList);
router.post('/lists/:id/members', requirePermission('customers.create'), LeadController.manageListMembers);
router.delete('/lists/:id', requirePermission('customers.create'), LeadController.deleteList);

// Suppression Management
router.post('/suppress', requirePermission('customers.consent'), LeadController.addSuppression);

// Stage 2: Create Campaign Draft & Approval Gate
router.post('/campaigns/draft', requirePermission('messages.send'), LeadController.createCampaignFromLeads);
router.post('/campaigns/:id/approve', requirePermission('messages.send'), LeadController.approveCampaign);

export default router;
