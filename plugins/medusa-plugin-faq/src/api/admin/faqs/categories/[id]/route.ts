import { container, MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { FAQ_MODULE } from "../../../../../modules/faq";
import FaqModuleService from "../../../../../modules/faq/service";

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
	try {
		const faqModuleService: FaqModuleService = container.resolve(FAQ_MODULE);

		const category = await faqModuleService.deleteFaqCategories(req.params.id);

		res.status(200).json(category);
	} catch (error) {
		console.error("Error deleting category:", error);
		res
			.status(500)
			.json({ error: "Failed to delete category.", message: error.message });
	}
}
