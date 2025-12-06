/// start
dotenv.config();
import dotenv from "dotenv";
import connectDB from "./src/db/db.js";
import app from "./src/app.js";


connectDB();

const port = process.env.PORT

app.listen(port, () => {
  /// callback
  console.log(`Server is running on port ${port}`);
});


