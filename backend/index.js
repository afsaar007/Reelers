// api/index.js
import serverless from "serverless-http";

dotenv.config();

import connectDB from "../src/db/db.js";
import app from "../src/app.js";

// Connect to DB when cold start (keeps connection across warm invocations when possible)
let dbConnected = false;
async function ensureDB() {
  if (!dbConnected) {
    await connectDB();
    dbConnected = true;
  }
}

const handler = async (req, res) => {
  await ensureDB();
  return app(req, res);
};

export default serverless(handler);
