import BrandModule, { BRAND_MODULE } from "../modules/brand";
import ProductModule from "@medusajs/medusa/product";
import { defineLink, DefineLinkExport } from "@medusajs/framework/utils";

let link: DefineLinkExport | null = null;

link = defineLink(
  {
    linkable: ProductModule.linkable.product,
    isList: true,
  },
  BrandModule.linkable.brand
);

export default link;
