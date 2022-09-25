import {pollSchema, choiceSchema} from '../schemas/postSchemas.js'

async function validacaoCreatePoll(req, res, next){
    
    const validation = pollSchema.validate(req.body, {abortEarly: false});

    if (validation.error) {

        const errors = validation.error.details.map(det => det.message);
        res.status(422).send(errors);
        return

    }

    next();

}

async function validacaoCreateChoice(req, res, next){
    
    const validation = choiceSchema.validate(req.body, {abortEarly: false});

    if (validation.error) {

        const errors = validation.error.details.map(det => det.message);
        res.status(422).send(errors);
        return

    }

    next();

}

export {validacaoCreatePoll, validacaoCreateChoice}