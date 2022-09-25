import db from '../db/db.js';
import dayjs from 'dayjs';
import {ObjectId} from "bson";

async function postVote(req, res){

    const id = ObjectId(req.params.id);

    try {

        const choiceExists = await db.collection("choices").findOne({"_id": id})

        if (!choiceExists){
            res.sendStatus(404)
            return
        }

        const pollId = choiceExists.pollId;

        const pollVoted = await db.collection("polls").findOne({_id: pollId});

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
    

}

export {postVote}