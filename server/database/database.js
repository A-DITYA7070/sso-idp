import mongoose from "mongoose";

export const connectTOMONGO = () =>
mongoose.connect(process.env.DB_URI,{})
.then((conn)=>{
    console.log(`Database connected to ${conn.connection.host}`);
})
.catch((err)=>{
    console.log(`Error connecting to DB ${err}`);
});
