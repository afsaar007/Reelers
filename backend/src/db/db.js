import mongoose from "mongoose"

function connectDB(){
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("MongoDB Connected")
    })
    .catch((err)=>{
        console.log("MongoDB Connection error:", err.message);
        process.exit(1);
    
    })};

export default connectDB;