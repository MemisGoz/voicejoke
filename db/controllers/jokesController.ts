import { jokes } from "../db.ts";
import { ObjectId } from "npm:mongodb@6.12.0";



async function addMood(req: Request): Promise<Response> {
    try {
        const body = await req.json();
        const result = await jokes.insertOne({ mood: body.input });
        return new Response(JSON.stringify({ id: result.insertedId }), {
            status: 201,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
    }
}

async function getMoods(): Promise<Response> {
    try {
        const allMoods = await jokes.find().toArray();
        return new Response(JSON.stringify(allMoods),{
            headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}


export {addMood, getMoods}