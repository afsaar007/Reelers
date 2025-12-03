// create server 
import express from "express"
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js"
import foodRoutes from './routes/food.routes.js'
import cors from 'cors';
import foodPartnerRoutes from './routes/food-partner.routes.js'

const app = express();
app.use(cors({
  origin:["http://localhost:5173", "reelers-9.onrender.com"],
  
}));


app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin (like curl, mobile apps)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','Range','Accept'],
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
