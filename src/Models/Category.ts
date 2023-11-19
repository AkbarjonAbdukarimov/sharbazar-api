import { Model, Schema, model, Document } from "mongoose";
import IProductMedia from "../Interface/IProducMedia";

interface category {
  name: string;
  icon?: IProductMedia;
  products?: [string];
}
interface CategoryDoc extends Document {
  name: string;
  icon: IProductMedia;
  products: [string];
}
interface CategoryModel extends Model<CategoryDoc> {
  build(attrs: category): CategoryDoc;
}
const iconSchema = new Schema(
  {
    name: {
      type:String,
      unique:true
    },
    fileId: String,
  },
  { id: false, _id: false }
);
const categorySchema = new Schema(
  {
    name: String,
    icon: iconSchema,
    products: [String],
  }
  
);

categorySchema.statics.build = (attrs: category): CategoryDoc => {
  return new Category(attrs);
};
const Category = model<CategoryDoc, CategoryModel>("Category", categorySchema);
export default Category;
