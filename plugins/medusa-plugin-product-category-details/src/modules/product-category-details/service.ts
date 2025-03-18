import { MedusaService } from "@medusajs/framework/utils";
import CategoryDetails from "./models/category-details";

class ProductCategoryDetailsModuleService extends MedusaService({
	CategoryDetails,
}) {}

export default ProductCategoryDetailsModuleService;
