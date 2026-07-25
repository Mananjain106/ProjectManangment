import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

//   basic config       //
app.use(express.json({limit: '16kb'}));
app.use(express.urlencoded({limit: '16kb'}));

app.use(cookieParser())





//  cors config        //
app.use(cors({
    origin: process.env.CORS_ORIGIN?.split(',') || "http://localhost:3000",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}))

// import routes //

import healthCheckRoutes from "./routes/healthcheck.routes.js";
import authRoutes from "./routes/auth.routes.js";
import projectRouter from "./routes/project.routes.js";

//  routes config      //
app.use("/api/v1/healthcheck", healthCheckRoutes);
app.use("/api/v1/auth", authRoutes); 
app.use("/api/v1/projects", projectRouter);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

export default app;