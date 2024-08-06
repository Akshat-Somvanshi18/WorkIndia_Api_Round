import express from 'express';
import bodyParser from 'body-parser';
import mysql from 'mysql2';
import userRoute from "./routes/userRoute.js";
import adminRoute from "./routes/adminRoute.js";
import dotenv from "dotenv";


const app = express();
app.use(bodyParser.json());

app.use("/api",userRoute);
app.use("/api/shorts",adminRoute);

dotenv.config();
const PORT = process.env.PORT || 2000 ;
const PASSWORD = process.env.PASSWORD;
const DATABASE = process.env.DATABASE;
const USER = process.env.USER;

export const db = mysql.createConnection({
    host: "localhost",
    user: USER,
    password : PASSWORD,
    database : DATABASE
});

db.connect((error)=>{
    if(error)
        console.log(error);
    else
        console.log("database connected successfully");
})

const port = process.env.PORT;
app.listen(PORT,(error)=>{
    if(error)
        console.log(error);
    else
        console.log(`server running on port ${PORT}`);
})


export default db;




