import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import {getPolls, postPoll} from './routes/pollsRoute.js';
import {getChoices, postChoice} from './routes/choicesRoute.js';
import postVote from './routes/voteRoute.js';
import getResult from './routes/resultRoute.js';

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