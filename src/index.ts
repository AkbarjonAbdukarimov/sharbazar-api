import mongoose from "mongoose";
import app from "./app";
import dotenv from "dotenv";
dotenv.config();
const port = process.env.PORT!;
const mongo = process.env.MONGO!;

async function Start() {
  try {
    await mongoose.connect(mongo);
    console.log("Database connected");
    app.listen(port, () => {
      console.log(`listening on port ${port}`);
    });
    // Handle worker thread exit
  } catch (error) {
    console.log(error);
  }
}
Start();
