import { container, MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { FAQ_MODULE } from "../../../../modules/faq";
import FaqModuleService from "../../../../modules/faq/service";
import { FAQ_UPDATE_TYPE } from "../type";
import { generateHandleFromTitle } from "../helper";

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

export async function PUT(
	req: MedusaRequest<FAQ_UPDATE_TYPE>,
	res: MedusaResponse
) {
	try {
		const faqModuleService: FaqModuleService = container.resolve(FAQ_MODULE);
		const { category, ...body } = req.body;

		let categoryId: string | null = null;

		if (category) {
			const handle = generateHandleFromTitle(category.title);
			const [existingCategory] = await faqModuleService.listFaqCategories(
				{ handle },
				{}
			);

			if (existingCategory) {
				categoryId = existingCategory.id;
			} else {
				const newCategory = await faqModuleService.createFaqCategories({
					...category,
					handle,
				});
				categoryId = newCategory.id;
			}
		}

		const updatedFaq = await faqModuleService.updateFaqs({
			id: req.params.id,
			...body,
			category_id: categoryId,
		});

		return res.status(200).json({ updatedFaq });
	} catch (error) {
		return res.status(500).json({
			error: "Failed to update FAQ.",
			message: error.message,
		});
	}
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
	try {
		const faqModuleService: FaqModuleService = container.resolve(FAQ_MODULE);

		const faq = await faqModuleService.deleteFaqs(req.params.id);

		res.status(200).json({ faq, message: "FAQ deleted successfully" });
	} catch (error) {
		res
			.status(500)
			.json({ error: "Failed to delete faq.", message: error.message });
	}
}
