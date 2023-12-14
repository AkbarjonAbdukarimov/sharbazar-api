"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// const iconSchema = new Schema(
//   {
//     name: String,
//     fileId: String,
//   },
//   { id: false, _id: false }
// );
// const langSchema = new Schema(
//   {
//     uz: {
//       type: String,
//     },
//     ru: {
//       type: String,
//     },
//     kp: {
//       type: String,
//     },
//     en: {
//       type: String,
//     },
//   },
//   { id: false, _id: false }
// );
const categorySchema = new mongoose_1.Schema({
    name: {
        uz: {
            type: String,
        },
        ru: {
            type: String,
        },
        kp: {
            type: String,
        },
        en: {
            type: String,
        },
    },
    icon: {
        name: String,
        fileId: String,
    },
    products: [String],
});
categorySchema.statics.build = (attrs) => {
    return new Category(attrs);
};
const Category = (0, mongoose_1.model)("Category", categorySchema);
exports.default = Category;
