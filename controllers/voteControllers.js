import db from '../db/db.js';
import dayjs from 'dayjs';
import {ObjectId} from "bson";
import { STATUS_CODE } from '../enums/statusCode.js';

async function postVote(req, res){

    const id = ObjectId(req.params.id);

    try {

        const choiceExists = await db.collection("choices").findOne({"_id": id})

        if (!choiceExists){
            res.sendStatus(STATUS_CODE.NOT_FOUND)
            return
        }

        const pollId = choiceExists.pollId;

        const pollVoted = await db.collection("polls").findOne({_id: pollId});

        let expirationTime = pollVoted.expireAt;
        expirationTime = dayjs(expirationTime);
        let now = dayjs(Date.now());

        if (now>expirationTime){
            res.sendStatus(STATUS_CODE.FORBIDDEN);
            return
        }

        db.collection("votes").insertOne({createdAt: dayjs(Date.now()).format("YYYY-MM-DD HH:mm"), choiceId: id})

        res.sendStatus(STATUS_CODE.CREATED)

    } catch(err) {
        res.status(STATUS_CODE.SERVER_ERROR).send(err.message)
    }
    

}

export {postVote}