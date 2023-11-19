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
require("express-async-errors");
const productRoute = (0, express_1.Router)();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
productRoute.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(Parser_1.default.readProducts());
}));
productRoute.post("/image/:id", upload.single("image"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file)
        throw new BadRequestError_1.default("Image is required");
    const product = Parser_1.default.findById(req.params.id);
    const r = yield MediaManager_1.default.uploadFile(req.file, product.code);
    res.send(r);
}));
productRoute.delete("/image/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const product = Parser_1.default.findById(req.params.id);
    if (!product)
        throw new NotFoundError_1.default("Product Not Found");
    const r = yield MediaManager_1.default.deletefiles(product.code);
    res.send(r && "Deleted Image Successfully");
}));
productRoute.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(Parser_1.default.findById(req.params.id));
}));
exports.default = productRoute;
