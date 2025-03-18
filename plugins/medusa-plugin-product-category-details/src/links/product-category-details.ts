import { defineLink, DefineLinkExport } from "@medusajs/framework/utils";
import ProductModule from "@medusajs/medusa/product";
import productCategoryDetailsModule from "../modules/product-category-details";

let link: DefineLinkExport | null = null;

link = defineLink(ProductModule.linkable.productCategory, {
  linkable: productCategoryDetailsModule.linkable.categoryDetails,
  deleteCascade: true,
});

export default link;
