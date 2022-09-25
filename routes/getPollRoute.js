import express from 'express';
import { getPolls } from '../controllers/pollControllers.js';

const router = express.Router();
router.get('/poll', getPolls);

export default router;