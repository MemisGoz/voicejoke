import { addMood, getMoods } from "../controllers/jokesController.ts";


// CORS Headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "https://voicejoke.vercel.app",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname;

  // Handle CORS Preflight Requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method === "GET" && path === "/") {
    return new Response("Hello, World!", { headers: corsHeaders });
  } else if (req.method === "POST" && path === "/api/mood") {
    const response = await addMood(req);
    return new Response(response.body, { headers: corsHeaders });
  } else if (req.method === "GET" && path === "/api/mood") {
    const response = await getMoods();
    return new Response(response.body, { headers: corsHeaders });
  }

  // Handle other paths
  return new Response("Not Found", { status: 404, headers: corsHeaders });
}

