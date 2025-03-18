import ProductAdditionalDetailsModuleService from "./service";
import { Module } from "@medusajs/framework/utils";

export const PRODUCT_ADDITIONAL_DETAILS_MODULE =
	"productAdditionalDetailsModuleService";

export default Module(PRODUCT_ADDITIONAL_DETAILS_MODULE, {
	service: ProductAdditionalDetailsModuleService,
});
