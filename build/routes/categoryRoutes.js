"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Parser_1 = __importDefault(require("../utils/dataParser/Parser"));
const multer_1 = __importDefault(require("multer"));
const MediaManager_1 = __importDefault(require("../utils/MediaManager"));
const BadRequestError_1 = __importDefault(require("../Errors/BadRequestError"));
const NotFoundError_1 = __importDefault(require("../Errors/NotFoundError"));
const Category_1 = __importDefault(require("../Models/Category"));
const categoryRoute = (0, express_1.Router)();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
categoryRoute.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield Category_1.default.find();
    const names = Parser_1.default.getCategories();
    res.send(categories);
}));
categoryRoute.post("/new", upload.single("image"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file)
        throw new BadRequestError_1.default("Image is required");
    const { name, products } = req.body;
    const category = Category_1.default.build({ name, products });
    const r = yield MediaManager_1.default.uploadFile(req.file, category.id);
    category.icon = Object.assign({}, r);
    yield category.save();
    res.send(category);
}));
categoryRoute.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield Category_1.default.findByIdAndDelete(req.params.id);
    if (!category)
        throw new NotFoundError_1.default("Category Not Found");
    const r = yield MediaManager_1.default.deletefiles(category.icon.name, category.icon.fileId);
    res.send(category);
}));
categoryRoute.put("/:id", upload.single("image"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, newPr, oldPr } = req.body;
    let icon;
    const c = yield Category_1.default.findByIdAndUpdate(req.params.id, {
        name,
        $pullAll: { products: oldPr },
    }, { new: true });
    if (!c)
        throw new NotFoundError_1.default("Category Not Dound");
    if (req.file) {
        c.icon = yield MediaManager_1.default.uploadFile(req.file, c.id);
    }
    let temp = new Set([...c.products, ...newPr]);
    //@ts-ignore
    c.products = [...temp];
    yield c.save();
    const products = Parser_1.default.categoryProducts(c.products);
    res.send(c);
}));
categoryRoute.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const c = yield Category_1.default.findById(req.params.id);
    if (!c)
        throw new NotFoundError_1.default("Category Not Dound");
    const products = Parser_1.default.categoryProducts(c.products);
    res.send(Object.assign(Object.assign({}, c.toObject()), { products }));
}));
exports.default = categoryRoute;
