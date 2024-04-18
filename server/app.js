import express from "express";
import dotenv from "dotenv";
import {connectTOMONGO} from "./database/database.js";
import errorMiddleWare from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import cors from "cors";


dotenv.config({path:"./.env"});
// connecting to DB
connectTOMONGO();

const app = express();


const corsOptions = {
    origin:['http://localhost:4000','http://localhost:3000'],
    credentials:true,            
    methods:['GET','POST','PATCH','PUT'],
    optionSuccessStatus:200
}
app.use(cors(corsOptions));



app.use(express.json());
app.use(cookieParser());
app.use(
    express.urlencoded({
    extended: true, 
})
);


import ServiceProvider from "./routes/service-provider-routes.js";
import user from "./routes/user-routes.js";

app.use("/api/v1/sp",ServiceProvider);
app.use("/api/v1/user",user);




export default app;

app.use(errorMiddleWare);