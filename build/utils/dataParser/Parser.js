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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const XLSX = __importStar(require("xlsx"));
const fs = __importStar(require("fs"));
const columnMapping = __importStar(require("./columns.json"));
const path = __importStar(require("path"));
const NotFoundError_1 = __importDefault(require("../../Errors/NotFoundError"));
const BadRequestError_1 = __importDefault(require("../../Errors/BadRequestError"));
class DataParser {
    static makeJson() {
        return new Promise((resolve, reject) => {
            const root = process.cwd();
            try {
                console.log("Reading xlsx file");
                let workbook = XLSX.readFile(path.join(root, 'data', 'data.xlsx'));
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                // Convert the sheet to JSON with custom column names
                const jsonData = XLSX.utils
                    .sheet_to_json(sheet, { header: 2, raw: false })
                    //@ts-ignore
                    .map((row) => {
                    const newRow = {};
                    for (const key in row) {
                        //@ts-ignore
                        if (columnMapping[key]) {
                            //@ts-ignore
                            newRow[columnMapping[key]] = row[key];
                        }
                    }
                    return newRow;
                });
                // Save the JSON data to a file
                const jsonOutput = JSON.stringify(jsonData, null, 2);
                fs.writeFileSync(path.join(root, "data", "data.json"), jsonOutput);
                console.log(`Created JSON file at ${process.cwd()}/data/data.json`);
                resolve(true);
            }
            catch (error) {
                console.log(error.message);
                reject(error);
            }
        });
    }
    static getCategories() {
        const categories = new Set();
        const prs = this.readProducts();
        prs.forEach(p => p.category && categories.add(p.category.toUpperCase()));
        return categories;
    }
    static readProducts() {
        try {
            const products = fs.readFileSync(path.join(process.cwd(), "data", "data.json"), { encoding: "utf8" });
            return JSON.parse(products);
        }
        catch (error) {
            throw new NotFoundError_1.default("Products Not Found");
        }
    }
    static findById(code) {
        try {
            const products = DataParser.readProducts();
            let product;
            for (let i = 0; i < products.length; i++) {
                const p = products[i];
                if (p.code === code) {
                    product = p;
                    break;
                }
            }
            //@ts-ignore
            return product;
        }
        catch (error) {
            throw new NotFoundError_1.default("Products Not Found");
        }
    }
    static categoryProducts(products) {
        try {
            const prs = [];
            const all = DataParser.readProducts();
            products.forEach((P) => {
                all.forEach((p) => {
                    if (P === p.code) {
                        prs.push(p);
                    }
                });
            });
            return prs;
        }
        catch (error) {
            throw new BadRequestError_1.default(error.message || "something went wrong");
        }
    }
}
exports.default = DataParser;
