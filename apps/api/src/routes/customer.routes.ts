import { Router } from 'express';
import { CustomerController } from '../controllers/customer.controller';
import { authenticateToken, requirePermission } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

// Static / Specific Sub-routes
router.get('/duplicates', requirePermission('customers.view'), CustomerController.detectDuplicates);
router.post('/merge', requirePermission('customers.merge'), CustomerController.mergeCustomers);

// Segments Static Routes
router.get('/segments/all', requirePermission('customers.segments.view'), CustomerController.listSegments);
router.post('/segments', requirePermission('customers.segments.manage'), CustomerController.createSegment);
router.get('/segments/:id/evaluate', requirePermission('customers.segments.view'), CustomerController.evaluateSegment);

// Customer Base & Parameterized Routes
router.get('/', requirePermission('customers.view'), CustomerController.listCustomers);
router.post('/', requirePermission('customers.create'), CustomerController.createCustomer);
router.get('/:id', requirePermission('customers.view'), CustomerController.getCustomer);
router.patch('/:id', requirePermission('customers.update'), CustomerController.updateCustomer);
router.post('/:id/archive', requirePermission('customers.archive'), CustomerController.archiveCustomer);

// Orders & Activity
router.get('/:id/orders', requirePermission('customers.view'), CustomerController.getCustomerOrders);
router.get('/:id/activity', requirePermission('customers.view'), CustomerController.getCustomerActivity);

// Addresses
router.get('/:id/addresses', requirePermission('customers.addresses'), CustomerController.listAddresses);
router.post('/:id/addresses', requirePermission('customers.addresses'), CustomerController.addAddress);
router.delete('/:id/addresses/:addressId', requirePermission('customers.addresses'), CustomerController.removeAddress);

// Notes
router.get('/:id/notes', requirePermission('customers.notes'), CustomerController.listNotes);
router.post('/:id/notes', requirePermission('customers.notes'), CustomerController.addNote);

// Tags
router.post('/:id/tags', requirePermission('customers.tags'), CustomerController.addTag);
router.delete('/:id/tags/:tag', requirePermission('customers.tags'), CustomerController.removeTag);

// Marketing Consent
router.post('/:id/consent', requirePermission('customers.consent'), CustomerController.updateConsent);

export default router;
