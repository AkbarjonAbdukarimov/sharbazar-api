"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
require("express-async-errors");
const multer_1 = __importDefault(require("multer"));
const BadRequestError_1 = __importDefault(require("../Errors/BadRequestError"));
const Parser_1 = __importDefault(require("../utils/dataParser/Parser"));
const path = __importStar(require("path"));
const Category_1 = __importDefault(require("../Models/Category"));
const destination = path.join(process.cwd(), "data");
const fileType = [
    "application/vnd.ms-excel",
    "application/vnd.ms-excel.sheet.macroEnabled.12",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];
const storage = multer_1.default.diskStorage({
    destination,
    filename: function (req, file, cb) {
        const splited = file.originalname.split(".");
        if (!fileType.find((f) => f === file.mimetype)) {
            throw new BadRequestError_1.default("Please Upload File in XLSX format");
        }
        cb(null, "data." + splited[splited.length - 1]);
    },
});
const upload = (0, multer_1.default)({
    storage: storage,
});
const dbRoutes = (0, express_1.Router)();
dbRoutes.post("/", upload.single("file"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        throw new BadRequestError_1.default("Please Upload Excel File to Update Database");
    }
    const { lang } = req.body;
    if (!lang) {
        throw new BadRequestError_1.default("Please Select File Language");
    }
    Parser_1.default.makeJson();
    const existingCats = yield Category_1.default.find();
    const jsonCats = Parser_1.default.getCategories();
    let temp = [];
    if (existingCats.length === 0) {
        jsonCats.forEach((c) => {
            const item = { name: {} };
            item.name[lang] = c;
            temp.push(item);
        });
        const insetred = yield Category_1.default.insertMany(temp);
        res.send(insetred);
        return;
    }
    jsonCats.forEach((c) => {
        const isNew = existingCats.find((C) => {
            if (C.name[lang] && C.name[lang] === c) {
                return C;
            }
        });
        if (!isNew) {
            const item = { name: {} };
            item.name[lang] = c;
            temp.push(item);
        }
    });
    const insetred = yield Category_1.default.insertMany(temp);
    res.send(insetred);
    return;
}));
exports.default = dbRoutes;
