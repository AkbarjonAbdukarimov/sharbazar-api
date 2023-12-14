import { Router } from "express";
import "express-async-errors";
import multer from "multer";
import BadRequestError from "../Errors/BadRequestError";
import DataParser from "../utils/dataParser/Parser";
import * as path from "path";
import Category from "../Models/Category";
import ILAng from "../Interface/ILang";
import IProductMedia from "../Interface/IProducMedia";
const destination = path.join(process.cwd(), "data");
const fileType = [
  "application/vnd.ms-excel",
  "application/vnd.ms-excel.sheet.macroEnabled.12",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];
const storage = multer.diskStorage({
  destination,
  filename: function (req, file, cb) {
    const splited = file.originalname.split(".");
    if (!fileType.find((f) => f === file.mimetype)) {
      throw new BadRequestError("Please Upload File in XLSX format");
    }
    cb(null, "data." + splited[splited.length - 1]);
  },
});
const upload = multer({
  storage: storage,
});
const dbRoutes = Router();

dbRoutes.post("/", upload.single("file"), async (req, res) => {
  if (!req.file) {
    throw new BadRequestError("Please Upload Excel File to Update Database");
  }
  const { lang } = req.body;
  if (!lang) {
    throw new BadRequestError("Please Select File Language");
  }
  DataParser.makeJson();

  const existingCats = await Category.find();

  const jsonCats = DataParser.getCategories();

  let temp: { name: ILAng; icon?: IProductMedia }[] = [];

  if (existingCats.length === 0) {
    jsonCats.forEach((value, key) => {
      const item = { name: {}, products: value };
      item.name[lang] = key;
      temp.push(item);
    });

    const insetred = await Category.insertMany(temp);

    res.send(insetred);
    return;
  }

  jsonCats.forEach((value, key) => {
    const isNew = existingCats.find((C) => {
      if (C.name[lang] && C.name[lang] === key) {
        return C;
      }
    });
    if (!isNew) {
      const item = { name: {}, products: value };
      item.name[lang] = key;
      temp.push(item);
    }
  });

  const insetred = await Category.insertMany(temp);
  res.send(insetred);

  return;
});

export default dbRoutes;
