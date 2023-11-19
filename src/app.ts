import express from "express";
import productRoute from "./routes/productsRoutes";
import "express-async-errors";
import cors from "cors";
import categoryRoute from "./routes/categoryRoutes";
import BaseError from "./Errors/BaseError";
import dbRoutes from "./routes/dbRoutes";
const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

app.use("/api/products", productRoute);
app.use("/api/categories", categoryRoute);
app.use('/api/updatedb',dbRoutes)
//@ts-ignore
app.use((err, req, res, next) => {
  console.log(err, err instanceof BaseError);
  console.log("---------------------");
  console.log(req.hostname);
  if (err instanceof BaseError) {
    console.log("Base Error instance");
    res.status(err.statusCode).send({ errors: err.formatError() });
    return;
  }
  res.status(500).send({ errors: [{message:err.message}] });
});
export default app;
