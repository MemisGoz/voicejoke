import { MongoClient } from "mongodb";

const MONGODB_URI = Deno.env.get("MONGODB_URI");
const DB_NAME = Deno.env.get("DB_NAME");

if (!MONGODB_URI) {
    console.log("MONGO_URI IS NOT SET");
    Deno.exit(1);
}


const client = new MongoClient(MONGODB_URI);

try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Connected to mongoDB")
} catch (error) {
    console.log("Error connecting to MongoDB", error);
    Deno.exit(1)
}

const db = client.db(DB_NAME);
const jokes = db.collection("voice_input");

export {db, jokes};