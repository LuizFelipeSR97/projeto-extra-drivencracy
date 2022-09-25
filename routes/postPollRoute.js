import express from 'express';
import { postPoll } from '../controllers/pollControllers.js';
import {validacaoCreatePoll} from '../middlewares/validation.js';

const router = express.Router();
router.post('/poll', validacaoCreatePoll, postPoll);

export default router;