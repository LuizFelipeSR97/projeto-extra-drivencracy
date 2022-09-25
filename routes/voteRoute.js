import express from 'express';
import { postVote } from '../controllers/voteControllers.js';

const router = express.Router();
router.post('/choice/:id/vote', postVote);

export default router;