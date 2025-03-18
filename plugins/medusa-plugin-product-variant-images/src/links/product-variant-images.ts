import { defineLink, DefineLinkExport } from "@medusajs/framework/utils";
import ProductModule from "@medusajs/medusa/product";
import ProductVariantImagesModule from "../modules/product-variant-images";

let link: DefineLinkExport | null = null;

link = defineLink(ProductModule.linkable.productVariant, {
  linkable: ProductVariantImagesModule.linkable.variantImages,
  deleteCascade: true,
});

export default link;
