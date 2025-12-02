/// start
import dotenv from "dotenv";
dotenv.config();
import express from "express"
import connectDB from "./src/db/db.js";
import app from "./src/app.js";


connectDB();


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  /// callback
  console.log(`Server is running on port ${PORT}`);
});


