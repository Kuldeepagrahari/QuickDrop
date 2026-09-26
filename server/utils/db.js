import mongoose from "mongoose";

const mongo = () => {
    try {
        mongoose.connect(process.env.MONGO_URI)
        console.log("Mongo Connected Successfully")
    } catch (error) {
        console.log("Mongo Error" + error)
    }
}

export default mongo;