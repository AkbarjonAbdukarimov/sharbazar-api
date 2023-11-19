import { Router } from "express";
import DataParser from "../utils/dataParser/Parser";
import multer from "multer";
import MediaManager from "../utils/MediaManager";
import BadRequestError from "../Errors/BadRequestError";
import NotFoundError from "../Errors/NotFoundError";
import Category from "../Models/Category";

const categoryRoute = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
categoryRoute.get("/", async (req, res) => {
  const categories = await Category.find();
  const names= DataParser.getCategories()
  res.send(categories );
});

categoryRoute.post("/new", upload.single("image"), async (req, res) => {
  if (!req.file) throw new BadRequestError("Image is required");
  const { name, products } = req.body;
  const category = Category.build({ name, products });
  const r = await MediaManager.uploadFile(req.file, category.id);
  category.icon = { ...r };
  await category.save();
  res.send(category);
});

categoryRoute.delete("/:id", async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) throw new NotFoundError("Category Not Found");
  const r = await MediaManager.deletefiles(
    category.icon.name,
    category.icon.fileId
  );
  res.send(category);
});

categoryRoute.put("/:id", upload.single("image"), async (req, res) => {
  const { name, newPr, oldPr } = req.body;
  let icon;

  const c = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name,
      $pullAll: { products: oldPr },
    },
    { new: true }
  );
  if (!c) throw new NotFoundError("Category Not Dound");
  if (req.file) {
    c.icon = await MediaManager.uploadFile(req.file, c.id);
  }
  let temp = new Set<string>([...c.products, ...newPr]);
  //@ts-ignore
  c.products = [...temp];
  await c.save();

  const products = DataParser.categoryProducts(c.products);
  res.send(c);
});

categoryRoute.get("/:id", async (req, res) => {
  const c = await Category.findById(req.params.id);
  if (!c) throw new NotFoundError("Category Not Dound");

  const products = DataParser.categoryProducts(c.products);
  res.send({ ...c.toObject(), products });
});

export default categoryRoute;
