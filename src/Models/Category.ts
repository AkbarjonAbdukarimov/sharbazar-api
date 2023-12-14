import { Model, Schema, model, Document } from "mongoose";
import IProductMedia from "../Interface/IProducMedia";
import ILAng from "../Interface/ILang";

interface category {
  name: ILAng;
  icon?: IProductMedia;
  products?: [string];
}
interface CategoryDoc extends Document {
  name: ILAng;
  icon: IProductMedia;
  products: [string];
}
interface CategoryModel extends Model<CategoryDoc> {
  build(attrs: category): CategoryDoc;
}
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
const categorySchema = new Schema({
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

categorySchema.statics.build = (attrs: category): CategoryDoc => {
  return new Category(attrs);
};
const Category = model<CategoryDoc, CategoryModel>("Category", categorySchema);
export default Category;
