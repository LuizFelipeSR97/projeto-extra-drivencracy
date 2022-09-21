import axios from "axios";
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import {MongoClient} from 'mongodb';
import joi from 'joi';
import bcrypt from 'bcrypt';
import {v4 as uuid} from 'uuid';

dotenv.config();

const server = express();
server.use(cors());
server.use(express.json());

const mongoClient = new MongoClient(process.env.MONGO_URI);

server.listen(process.env.PORT, ()=>{
    console.log(`Server running on port ${5000}`)
})