import { Module } from "@medusajs/framework/utils";
import ProductVariantImagesModuleService from "./service";

export const PRODUCT_VARIANT_IMAGES_MODULE = "variantImagesModuleService";

export default Module(PRODUCT_VARIANT_IMAGES_MODULE, {
	service: ProductVariantImagesModuleService,
});
