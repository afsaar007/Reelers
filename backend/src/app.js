// create server 
import express from "express"
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js"
import foodRoutes from './routes/food.routes.js'
import cors from 'cors';
import foodPartnerRoutes from './routes/food-partner.routes.js'

const app = express();
app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}));

app.use(express.json());
app.use(cookieParser());


app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/food-partner', foodPartnerRoutes);



// // 404 fallback last middaleware
// app.use((req, res) => {
//   res.status(404).json({ message: "Route not found" });
// });


export default app;
