import { container, MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { FAQ_MODULE } from "../../../modules/faq";
import FaqModuleService from "../../../modules/faq/service";
import { FAQ_TYPE } from "./type";
import { title } from "process";
import { generateHandleFromTitle } from "./helper";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
	try {
		const faqModuleService: FaqModuleService = container.resolve(FAQ_MODULE);

		const [faqs, count] = await faqModuleService.listAndCountFaqs(
			{},
			{ relations: ["category"] }
		);

		res.status(200).json({ faqs, count });
	} catch (error) {
		console.error("Error listing faqs:", error);
		res
			.status(500)
			.json({ error: "Failed to list faqs.", message: error.message });
	}
}

export async function POST(req: MedusaRequest<FAQ_TYPE>, res: MedusaResponse) {
	try {
		const { category, ...body } = req.body;
		const faqModuleService: FaqModuleService = container.resolve(FAQ_MODULE);
		let handle: string | null = null;

		if (category) {
			handle = generateHandleFromTitle(category?.title);

			// Fetch existing categories
			const [existingCategory, ...rest] =
				await faqModuleService.listFaqCategories(
					{
						handle,
					},
					{}
				);

			if (existingCategory) {
				console.log("Category already exists");

				const faq = await faqModuleService.createFaqs({
					...body,
					category_id: existingCategory.id,
				});

				res.json({ faq }).status(200);
				return;
			}
		}

		console.log("Category does not exist, creating new one");

		const faq = await faqModuleService.createFaqs({
			...req.body,
			...(category && handle
				? {
						category: {
							title: category.title,
							handle,
						},
					}
				: {}),
		});

		res.status(200).json({ faq });
		return;
	} catch (error) {
		res
			.status(500)
			.json({ error: "Failed to create FAQ.", message: error.message });
	}
}
