import express from "express"
import cors from "cors"
import dotenv from "dotenv"
dotenv.config()
import mongo from "./utils/db.js"
import router from "./routes/roomRoutes.js"
const app = express();

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
    res.json({
        message: "QuickDrop server is running"
    });
});

app.use("/api/rooms", router);

app.get("/hi", (req, res) => {
    try {
        return res.json(
            {
                "Message": "Hello Server",
                "Status": "ok"
            }
        )
    } catch (error) {
        return error
    }
})

const PORT = process.env.PORT || 5000;

const runServer = async () => {
    await mongo()
    app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });  
}

runServer()