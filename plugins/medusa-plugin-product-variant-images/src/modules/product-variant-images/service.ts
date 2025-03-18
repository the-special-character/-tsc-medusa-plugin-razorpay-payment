import { MedusaService } from "@medusajs/framework/utils";
import VariantImages from "./models/variant-images";

class ProductVariantImagesModuleService extends MedusaService({
	VariantImages,
}) {}

export default ProductVariantImagesModuleService;
