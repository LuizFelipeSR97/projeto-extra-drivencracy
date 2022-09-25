import express from 'express';
import { postChoice } from '../controllers/choiceControllers.js';
import {validacaoCreateChoice} from '../middlewares/validation.js';

const router = express.Router();
router.post('/choice', validacaoCreateChoice, postChoice);

export default router;