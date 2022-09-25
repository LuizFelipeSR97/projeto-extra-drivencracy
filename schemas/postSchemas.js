import joi from "joi";

const pollSchema = joi.object({
    title: joi.string().min(1).required(),
    expireAt: joi.string().min(0).required()
});

const choiceSchema = joi.object({
    title: joi.string().min(1).required(),
    pollId: joi.string().required()
})

export {pollSchema, choiceSchema};