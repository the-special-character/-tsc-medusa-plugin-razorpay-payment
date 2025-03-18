import { MedusaService } from "@medusajs/framework/utils";
import Faq from "./models/faq";
import FaqCategory from "./models/faq_category";

class FaqModuleService extends MedusaService({
	Faq,
	FaqCategory,
}) {}

export default FaqModuleService;
