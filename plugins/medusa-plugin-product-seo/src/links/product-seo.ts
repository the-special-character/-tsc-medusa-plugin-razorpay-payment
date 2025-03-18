import { defineLink, DefineLinkExport } from "@medusajs/framework/utils";
import ProductModule from "@medusajs/medusa/product";
import ProductSeoModule from "../modules/product-seo";

let link: DefineLinkExport | null = null;

link = defineLink(ProductModule.linkable.product, {
  linkable: ProductSeoModule.linkable.seoDetails,
  deleteCascade: true,
});

export default link;
