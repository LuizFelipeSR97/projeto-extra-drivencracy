import db from '../db/db.js';
import dayjs from 'dayjs';
import {ObjectId} from "bson";

async function getChoices(req, res){

    const id = ObjectId(req.params.id)

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

}

async function postChoice(req,res){

    let choiceToSubmit = req.body;

    try {

        const pollExists = await db.collection("polls").findOne({"_id": ObjectId(choiceToSubmit.pollId)})

        if (!pollExists){
            res.sendStatus(404)
            return
        }

        const choiceExists = await db.collection("choices").findOne({
            $and: [
                {"title": choiceToSubmit.title},
                {"pollId": ObjectId(choiceToSubmit.pollId)}
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

        choiceToSubmit={...choiceToSubmit, pollId: ObjectId(choiceToSubmit.pollId)}

        db.collection("choices").insertOne(choiceToSubmit)

        res.status(201).send(choiceToSubmit)

    } catch(err) {

        res.status(500).send(err.message)

    }

}

export {getChoices, postChoice}