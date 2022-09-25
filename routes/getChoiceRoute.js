import express from 'express';
import { getChoices } from '../controllers/choiceControllers.js';

const router = express.Router();
router.get('/poll/:id/choice', getChoices);

export default router;