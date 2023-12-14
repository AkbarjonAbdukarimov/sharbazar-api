import mongoose from "mongoose";
import app from "./app";
import dotenv from "dotenv";
import DataParser from "./utils/dataParser/Parser";
dotenv.config();
const port = process.env.PORT!;
const mongo = process.env.MONGOL!;

async function Start() {
  try {
    // console.log(DataParser.getCategories());
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
