import Router from 'express';
import { getClients, NewClient, EditClientId, DeleteClientId } from '../controllers/clientsController.js';
import { authorizeToken, authorizeRoles } from '../middlewares/authMiddleware.js';


const router = Router();

router.get('/clients', authorizeToken , authorizeRoles('admin'), getClients);
router.post('/clients', authorizeToken, authorizeRoles('admin'),NewClient);
router.put('/clients/:id', authorizeToken, authorizeRoles('admin'),EditClientId);
router.delete('/clients/:id', authorizeToken,authorizeRoles('admin'), DeleteClientId);
