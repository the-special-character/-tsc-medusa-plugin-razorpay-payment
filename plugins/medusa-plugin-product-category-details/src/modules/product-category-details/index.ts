import CategoryDetailsModuleService from "./service";
import { Module } from "@medusajs/framework/utils";

export const PRODUCT_CATEGORY_DETAILS_MODULE = "categoryDetailsModuleService";

export default Module(PRODUCT_CATEGORY_DETAILS_MODULE, {
	service: CategoryDetailsModuleService,
});
