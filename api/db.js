import mongoose from "mongoose";

async function ConnectDB(){
    try {
        const conn=await mongoose.connect(process.env.MONGODB_CONNECTION_URL)
        console.log(`MongoDB Connected at ${conn.connection.host}`)
    } catch (error) {
        console.log(`Error in MongoDB Connection:${error}`)
    }
}
export default ConnectDB;