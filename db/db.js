import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();
let db;

const mongoClient = new MongoClient(process.env.MONGO_URI);

try {
    await mongoClient.connect();
} catch(err) {
    console.log(err)
}

db = mongoClient.db("drivencracy")

export default db;