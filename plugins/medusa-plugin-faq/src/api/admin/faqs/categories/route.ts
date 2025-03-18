import { container, MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { FAQ_MODULE } from "../../../../modules/faq";
import FaqModuleService from "../../../../modules/faq/service";
import { FAQ_CATEGORY } from "../type";
import { generateHandleFromTitle } from "../helper";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
	try {
		const faqModuleService: FaqModuleService = container.resolve(FAQ_MODULE);

		const [faqCategories, count] =
			await faqModuleService.listAndCountFaqCategories(
				{},
				{ relations: ["faqs"] }
			);

		res.status(200).json({ faqCategories, count });
	} catch (error) {
		res
			.status(500)
			.json({ error: "Failed to list faqs category.", message: error.message });
	}
}

export async function POST(
	req: MedusaRequest<FAQ_CATEGORY>,
	res: MedusaResponse
) {
	try {
		const faqModuleService: FaqModuleService = container.resolve(FAQ_MODULE);

		const handle = generateHandleFromTitle(req.body.title);

		const faqCategory = await faqModuleService.createFaqCategories({
			...req.body,
			handle,
		});

		res.status(200).json({ faqCategory });
	} catch (error) {
		res
			.status(500)
			.json({ error: "Error creating faq category:", message: error.message });
	}
}
