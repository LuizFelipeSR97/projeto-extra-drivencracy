import db from '../db/db.js';
import {ObjectId} from "bson";

async function getResult(req, res){

    const id = ObjectId(req.params.id)
    let array=[];

    try {

        const pollExists = await db.collection("polls").findOne({_id: id})

        if (!pollExists){
            res.sendStatus(404)
            return
        }

        let pollChoices = await db.collection("choices").find({pollId: id}).toArray()

        // Obter numero de votos pra poll escolhida

        for (let i=0; i<pollChoices.length; i++){
            let votes = await db.collection("votes").find({choiceId: pollChoices[i]._id}).toArray()
            array.push(await votes.length)
        }

        let countResults = await pollChoices.map(ch => {
            return {choiceId: ch._id, votes: 0}
        })

        countResults.map((opt, i) => {
            opt.votes=array[i]
        })

        // Pegar so o com mais votos:

        countResults.sort((a,b) => {
            return (
                (a.votes>b.votes) ? (-1) : (false)            
            )})
        
        let winnerOption = countResults[0]
        let optionChosen = pollChoices.filter(ch => {
            return (ch._id===winnerOption.choiceId)
        })[0].title

        let answer = {
            _id: pollExists._id,
            title: pollExists.title,
            expireAt: pollExists.expireAt,
            result:
                {
                    title: optionChosen,
                    votes: winnerOption.votes
                }
        }

        res.send(answer)

    } catch(err) {
        res.status(500).send(err.message)
    }

}

export {getResult}