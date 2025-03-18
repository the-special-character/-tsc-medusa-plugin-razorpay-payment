import { MedusaService } from "@medusajs/framework/utils";
import AdditionalDetails from "./models/additional-details";

class ProductAdditionalDetailsModuleService extends MedusaService({
	AdditionalDetails,
}) {}

export default ProductAdditionalDetailsModuleService;
