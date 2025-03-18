import { MedusaService } from "@medusajs/framework/utils";
import SeoDetails from "./models/seo-details";
import SeoSocial from "./models/seo-social";

class ProductSeoModuleService extends MedusaService({
	SeoDetails,
	SeoSocial,
}) {}

export default ProductSeoModuleService;
