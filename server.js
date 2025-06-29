import app from "./app.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });
mongoose.connect(process.env.DB).then(() => console.log("Connected To The Datebase"));

const port = process.env.PORT;

app.listen(port, "127.0.0.1", () => console.log(`app running on port ${port}`));
