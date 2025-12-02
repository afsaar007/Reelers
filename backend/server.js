/// start
import dotenv from "dotenv";
dotenv.config();
import express from "express"
import connectDB from "./src/db/db.js";
import app from "./src/app.js";


connectDB();

let isConnected = false
async function connectToMongoDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    isConnected = true;
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

app.use((re,res,next)=>{
  if(!isConnected) {
    connectToMongoDB();
  }
  next();
})

app.use("/",(req,res)=>{
  res.send("hellow bro")
})
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   /// callback
//   console.log(`Server is running on port ${PORT}`);
// });

export default app
