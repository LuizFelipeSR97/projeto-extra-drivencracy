import express from 'express';
import { getChoices, postChoice } from '../controllers/choiceControllers.js';
import {validacaoCreateChoice} from '../middlewares/validation.js';

const router = express.Router();
router.get('/poll/:id/choice', getChoices);
router.post('/choice', validacaoCreateChoice, postChoice);

export default router;