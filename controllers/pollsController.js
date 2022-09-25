import db from '../db/db.js';
import {pollSchema} from '../schemas/postSchemas.js';
    
    async function getPolls(req, res) {

        console.log('teste')
    
        try {
    
            const polls = await db.collection("polls").find().toArray();
            res.send(polls);
    
        } catch (err) {
    
            res.status(500).send(err.message)
    
        }
    }

    async function createPoll(req, res) {

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

            const pollSubmited = db.collection("polls").insertOne(pollToSubmit);
            res.status(201).send(pollSubmited);

        } catch(err) {

            res.status(500).send(err.message)

        }
    }

    export {getPolls, createPoll};