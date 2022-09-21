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

//Funcao para formatar data

function formatDate(DD,MM,YYYY,HH,mm){

    if (DD<10){
        DD="0"+DD}

    if (MM<10){
        MM="0"+MM}

    if (HH<10){
        HH="0"+HH}

    if (mm<10){
        mm="0"+mm}
        
    return (`${YYYY}-${MM}-${DD} ${HH}:${mm}`)
}

// Schemas

const pollSchema = joi.object({
    title: joi.string(),
    expireAt: joi.string().min(0)
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

    let pollToSubmit = req.body;
    const validation = pollSchema.validate(pollToSubmit, {abortEarly: false});

    if (validation.error) {

        const errors = validation.error.details.map(det => det.message);
        res.status(422).send(errors);
        return

    }

    if (pollToSubmit.title===""){

        res.sendStatus(422);
        return

    }

    if (pollToSubmit.expireAt===""){

        let date = new Date();
        date.setDate(date.getDate() + 30)

        const newDate = formatDate(date.getDate(), date.getMonth()+1, date.getFullYear(), date.getHours(), date.getMinutes())

        pollToSubmit = {...pollToSubmit, expireAt: newDate}
        res.status(201).send(pollToSubmit)
        return
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