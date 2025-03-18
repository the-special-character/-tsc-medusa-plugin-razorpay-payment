import { container, MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { FAQ_MODULE } from "../../../../modules/faq";
import FaqModuleService from "../../../../modules/faq/service";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
	try {
		const faqModuleService: FaqModuleService = container.resolve(FAQ_MODULE);

		const faq = await faqModuleService.retrieveFaq(req.params.id, {
			relations: ["category"],
		});

		res.status(200).json(faq);
	} catch (error) {
		res
			.status(500)
			.json({ error: "Failed to retrieve faq.", message: error.message });
	}
}
