import express from 'express';
import { getPolls, postPoll } from '../controllers/pollControllers.js'
import {validacaoCreatePoll} from '../middlewares/validation.js';

const router = express.Router();
router.get('/poll', getPolls);
router.post('/poll', validacaoCreatePoll, postPoll);

export default router;