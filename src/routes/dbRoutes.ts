import { Router, json } from "express";
import "express-async-errors";
import multer from "multer";
import BadRequestError from "../Errors/BadRequestError";
import DataParser from "../utils/dataParser/Parser";
import * as path from "path";
import Category from "../Models/Category";
const destination = path.join(process.cwd(), "data");
const storage = multer.diskStorage({
  destination,
  filename: function (req, file, cb) {
    const splited = file.originalname.split(".");
    cb(null, "data." + splited[splited.length - 1]);
  },
});
const upload = multer({ storage: storage });
const dbRoutes = Router();
const fileType = [
  "application/vnd.ms-excel",
  "application/vnd.ms-excel.sheet.macroEnabled.12",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];
dbRoutes.post("/", upload.single("file"), async (req, res) => {
  if (!req.file) {
    throw new BadRequestError("Please Upload Excel File to Update Database");
  }
  if (!fileType.find((f) => f === req.file!.mimetype)) {
    throw new BadRequestError("Please Upload File in XLSX format");
  }
  const result = await DataParser.makeJson();
  const jsonCats = [...DataParser.getCategories()].map(i=>{return {name:i}});
  const cats = await Category.find();
  
 try {
  
  const Cats=await Category.insertMany([...cats,...jsonCats,])
  res.send({dbCategories:Cats});
 } catch (error:any) {
  if(error.code&&error.code===11000){
    res.send({dbCategories:[]});
  }
  else { throw error}
 }
 
  //res.send(jsonCats)
});

export default dbRoutes;
