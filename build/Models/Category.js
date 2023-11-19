"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const iconSchema = new mongoose_1.Schema({
    name: {
        type: String,
        unique: true
    },
    fileId: String,
}, { id: false, _id: false });
const categorySchema = new mongoose_1.Schema({
    name: String,
    icon: iconSchema,
    products: [String],
});
categorySchema.statics.build = (attrs) => {
    return new Category(attrs);
};
const Category = (0, mongoose_1.model)("Category", categorySchema);
exports.default = Category;
