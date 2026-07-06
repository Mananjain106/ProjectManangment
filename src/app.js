import express from "express";
import cors from "cors";


const app = express();

//   basic config       //
app.use(express.json({limit: '16kb'}));
app.use(express.urlencoded({limit: '16kb'}));

//  cors config        //
app.use(cors({
    origin: process.env.CORS_ORIGIN?.split(',') || "http://localhost:3000",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}))

// import routes //

import healthCheckRoutes from "./routes/healthcheck.routes.js";

app.get('/api/v1/healthcheck', healthCheckRoutes);



app.get('/', (req, res) => {
  res.send('Hello World!')
})

export default app;