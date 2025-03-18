import { defineLink, DefineLinkExport } from "@medusajs/framework/utils";
import ProductModule from "@medusajs/medusa/product";
import ProductAdditionalDetailsModule from "../modules/product-additional-details";

let link: DefineLinkExport | null = null;

link = defineLink(ProductModule.linkable.product, {
  linkable: ProductAdditionalDetailsModule.linkable.additionalDetails,
  deleteCascade: true,
});

export default link;
