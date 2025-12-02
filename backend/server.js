// src/server.js
import dotenv from "dotenv";
dotenv.config();

import connectDB from "./db/db.js";
import app from "./app.js";

const PORT = process.env.PORT || 3000;

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start:", err);
});
