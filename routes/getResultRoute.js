import express from 'express';
import { getResult } from '../controllers/resultControllers.js';

const router = express.Router();
router.get('/poll/:id/result', getResult);

export default router;