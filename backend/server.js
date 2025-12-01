/// start
import dotenv from "dotenv";
dotenv.config();
import express from "express"
import connectDB from "./src/db/db.js";
import app from "./src/app.js";
import path from "path"; ///deploy

connectDB();

const _dirname = path.resolve();

app.use(express.static(path.join(_dirname,"/frontend/dist")));

 app.use((req,res) =>{
  res.sendFile(path.resolve(_dirname,"frontend", "dist", "index.html"));
 })


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  /// callback
  console.log(`Server is running on port ${PORT}`);
});


