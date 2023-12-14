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
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const dotenv_1 = __importDefault(require("dotenv"));
const Parser_1 = __importDefault(require("./utils/dataParser/Parser"));
dotenv_1.default.config();
const port = process.env.PORT;
const mongo = process.env.MONGOL;
function Start() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            Parser_1.default.getCategories();
            yield mongoose_1.default.connect(mongo);
            console.log("Database connected");
            app_1.default.listen(port, () => {
                console.log(`listening on port ${port}`);
            });
            // Handle worker thread exit
        }
        catch (error) {
            console.log(error);
        }
    });
}
Start();
