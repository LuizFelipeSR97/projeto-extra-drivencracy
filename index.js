import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import getPolls from './routes/getPollRoute.js';
import postPoll from './routes/postPollRoute.js';
import getChoices from './routes/getChoiceRoute.js';
import postChoice from './routes/postChoiceRoute.js';
import postVote from './routes/postVoteRoute.js';
import getResult from './routes/getResultRoute.js';

// Configuracoes

dotenv.config();

const server = express();
server.use(cors());
server.use(express.json());

server.use(getPolls);
server.use(postPoll);
server.use(getChoices);
server.use(postChoice);
server.use(postVote);
server.use(getResult);

server.listen(process.env.PORT, ()=>{

    console.log(`Server running on port ${process.env.PORT}`)

})