import db from '../db/db.js'
import dayjs from 'dayjs'

async function getPolls(req, res){

    try {
    
        const polls = await db.collection("polls").find().toArray();
        res.send(polls);
    
    } catch (err) {
    
        res.status(500).send(err.message)
    
    }
}

async function postPoll(req,res){

    let pollToSubmit = req.body;

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

}

export {getPolls, postPoll};