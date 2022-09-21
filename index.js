import axios from "axios";
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import {Db, MongoClient} from 'mongodb';
import joi from 'joi';
import dayjs from 'dayjs';
import bcrypt from 'bcrypt';
import {v4 as uuid} from 'uuid';
import {ObjectId} from "bson";

dotenv.config();

const server = express();
server.use(cors());
server.use(express.json());

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;
mongoClient.connect().then(() => {
    db = mongoClient.db("drivencracy")
});

// Schemas

const pollSchema = joi.object({
    title: joi.string().min(1).required(),
    expireAt: joi.string().min(0).required()
});

const choiceSchema = joi.object({
    title: joi.string().min(1).required(),
    pollId: joi.string().required()
})

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

    if (pollToSubmit.expireAt===""){

        let date = dayjs(Date.now()).add(30,"day").format("YYYY-MM-DD HH:mm");
        pollToSubmit={...pollToSubmit, expireAt: date}
    }

    try {

        db.collection("polls").insertOne(pollToSubmit);
        res.status(201).send(pollToSubmit);

    } catch(err) {

        res.status(500).send(err.message)

    }
})

// Rota Choice

server.post("/choice", async (req,res) => {

    let choiceToSubmit = req.body

    const validation = choiceSchema.validate(choiceToSubmit, {abortEarly: false})

    if (validation.error){

        const errors = validation.error.details.map(error=>error.message)
        res.status(422).send(errors)
        return

    }

    try {

        const pollExists = await db.collection("polls").findOne({"_id": ObjectId(choiceToSubmit.pollId)})

        if (!pollExists){
            res.sendStatus(404)
            return
        }

        const choiceExists = await db.collection("choices").findOne({
            $and: [
                {"title": choiceToSubmit.title},
                {"pollId": choiceToSubmit.pollId}
            ]
        })

        if (choiceExists){
            res.sendStatus(409)
            return
        }

        let date = pollExists.expireAt
        date = dayjs(date)
        let now= dayjs(Date.now())

        if (date<now){
            res.sendStatus(403);
            return
        }

        db.collection("choices").insertOne(choiceToSubmit)

        res.status(201).send(choiceToSubmit)

    } catch(err) {

        res.status(500).send(err.message)

    }

})

server.get("/poll/:id/choice", async (req,res) => {

    const id = req.params.id

    try {

        const pollExists = await db.collection("choices").findOne({pollId: id})

        if (!pollExists){
            res.sendStatus(404)
            return
        }

        const choicesByPoll = await db.collection("choices").find({pollId: id}).toArray()

        res.send(choicesByPoll)

    } catch(err) {
        res.status(500).send(err.message)
    }
})

// Rota vote

server.post("/choice/:id/vote", async (req,res) => {

    const id = req.params.id;

    try {

        const choiceExists = await db.collection("choices").findOne({"_id": ObjectId(id)})

        if (!choiceExists){
            res.sendStatus(404)
            return
        }

        const pollId = choiceExists.pollId;

        const pollVoted = await db.collection("polls").findOne({_id: ObjectId(pollId)});

        let expirationTime = pollVoted.expireAt;
        expirationTime = dayjs(expirationTime);
        let now = dayjs(Date.now());

        if (now>expirationTime){
            res.sendStatus(403);
            return
        }

        db.collection("votes").insertOne({createdAt: dayjs(Date.now()).format("YYYY-MM-DD HH:mm"), choiceId: id})

        res.sendStatus(201)

    } catch(err) {
        res.status(500).send(err.message)
    }

})


server.listen(process.env.PORT, ()=>{

    console.log(`Server running on port ${5000}`)

})