import ProductSeoModuleService from "./service";
import { Module } from "@medusajs/framework/utils";

export const PRODUCT_SEO_MODULE = "productSeoModuleService";

export default Module(PRODUCT_SEO_MODULE, {
	service: ProductSeoModuleService,
});
