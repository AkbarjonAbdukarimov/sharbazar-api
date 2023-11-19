import * as XLSX from "xlsx";
import * as fs from "fs";
import * as columnMapping from "./columns.json";

import * as path from "path";
import IProduct from "../../Interface/IProduct";
import NotFoundError from "../../Errors/NotFoundError";
import BadRequestError from "../../Errors/BadRequestError";
export default class DataParser {
  static makeJson(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const root=process.cwd()
      try {
        console.log("Reading xlsx file");
        let workbook:XLSX.WorkBook=XLSX.readFile(path.join(root,'data','data.xlsx'));
         

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Convert the sheet to JSON with custom column names
        const jsonData = XLSX.utils
          .sheet_to_json(sheet, { header: 2, raw: false })
          //@ts-ignore
          .map((row: object) => {
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
        fs.writeFileSync(path.join(root,"data","data.json"), jsonOutput);
        console.log(`Created JSON file at ${process.cwd()}/data/data.json`);
        resolve(true);
      } catch (error) {
        console.log(error.message)
        reject(error);
      }
    });
  }
  static getCategories(): Set<string> {
    const categories = new Set<string>();
    const prs = this.readProducts();
    prs.forEach(p=>p.category&&categories.add(p.category.toUpperCase()))
    return categories;
  }
  static readProducts(): IProduct[] {
    try {
      const products = fs.readFileSync(
        path.join(process.cwd(), "data", "data.json"),
        { encoding: "utf8" }
      );
      return JSON.parse(products) as IProduct[];
    } catch (error) {
      throw new NotFoundError("Products Not Found");
    }
  }
  static findById(code: string): IProduct {
    try {
      const products = DataParser.readProducts();
      let product: IProduct;
      for (let i = 0; i < products.length; i++) {
        const p = products[i];
        if (p.code === code) {
          product = p;
          break;
        }
      }
      //@ts-ignore
      return product;
    } catch (error) {
      throw new NotFoundError("Products Not Found");
    }
  }
  static categoryProducts(products: string[]): IProduct[] {
    try {
      const prs: IProduct[] = [];
      const all = DataParser.readProducts();
      products.forEach((P) => {
        all.forEach((p) => {
          if (P === p.code) {
            prs.push(p);
          }
        });
      });
      return prs;
    } catch (error: any) {
      throw new BadRequestError(error.message || "something went wrong");
    }
  }
}
