"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productsRoutes_1 = __importDefault(require("./routes/productsRoutes"));
require("express-async-errors");
const cors_1 = __importDefault(require("cors"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const BaseError_1 = __importDefault(require("./Errors/BaseError"));
const dbRoutes_1 = __importDefault(require("./routes/dbRoutes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({ origin: "*" }));
app.use("/api/products", productsRoutes_1.default);
app.use("/api/categories", categoryRoutes_1.default);
app.use('/api/updatedb', dbRoutes_1.default);
//@ts-ignore
app.use((err, req, res, next) => {
    console.log(err, err instanceof BaseError_1.default);
    console.log("---------------------");
    console.log(req.hostname);
    if (err instanceof BaseError_1.default) {
        console.log("Base Error instance");
        res.status(err.statusCode).send({ errors: err.formatError() });
        return;
    }
    res.status(500).send({ errors: [{ message: err.message }] });
});
exports.default = app;
