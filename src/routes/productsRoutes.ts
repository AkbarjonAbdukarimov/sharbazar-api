import { Router } from "express";
import DataParser from "../utils/dataParser/Parser";
import multer from "multer";
import MediaManager from "../utils/MediaManager";
import BadRequestError from "../Errors/BadRequestError";
import NotFoundError from "../Errors/NotFoundError";
import 'express-async-errors'
const productRoute = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
productRoute.get("/", async (req, res) => {
  res.send(DataParser.readProducts());
});

productRoute.post("/image/:id", upload.single("image"), async (req, res) => {
  
  if (!req.file) throw new BadRequestError("Image is required");
  const product = DataParser.findById(req.params.id);

  const r = await MediaManager.uploadFile(req.file, product.code);
  
  res.send(r);
});

productRoute.delete("/image/:id", async (req, res) => {
  const product = DataParser.findById(req.params.id);
  if (!product) throw new NotFoundError("Product Not Found");
  const r = await MediaManager.deletefiles(product.code);
  res.send(r && "Deleted Image Successfully");
});

productRoute.get("/:id", async (req, res) => {
  res.send(DataParser.findById(req.params.id));
});

export default productRoute;
