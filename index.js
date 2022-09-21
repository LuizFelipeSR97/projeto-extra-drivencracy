import axios from "axios";
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import {Db, MongoClient} from 'mongodb';
import joi from 'joi';
import bcrypt from 'bcrypt';
import {v4 as uuid} from 'uuid';

dotenv.config();

const server = express();
server.use(cors());
server.use(express.json());

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;
mongoClient.connect().then(() => {
    db = mongoClient.db("drivencracy")
});

// Rota poll

server.get("/poll", async (req,res) => {

    try {

        const polls = await db.collection("polls").find().toArray();
        res.send(polls);

    } catch (err) {

        res.status(500).send(err.message)

    }
})

server.post("/poll", async (req,res) => {

    const pollToSubmit = req.body;

    if (pollToSubmit.title===""){
        res.sendStatus(422)
    }
    if (pollToSubmit.expireAt===""){
        // Pegar a data de hoje e acrescentar 30 dias
        // Fazer pollToSubmit===[...pollToSubmit, expireAt: "ESSA NOVA DATA"]
    }

    try {

        db.collection("polls").insertOne(pollToSubmit);
        res.status(201).send(pollToSubmit);

    } catch(err) {

        res.status(500).send(err.message)

    }
})

// Rota Choice

server.get("/poll/:id/choice", async (req,res) => {

    try {

    } catch(err) {
        res.status(500).send(err.message)
    }
})

server.listen(process.env.PORT, ()=>{

    console.log(`Server running on port ${5000}`)

})