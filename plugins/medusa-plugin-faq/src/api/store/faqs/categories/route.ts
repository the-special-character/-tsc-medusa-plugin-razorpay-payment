import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
	try {
		const { q } = req.query;
		const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

		const { data } = await query.graph({
			entity: "faq_category",
			fields: ["*", "faqs.*"],
			filters: {
				faqs: {
					...(q ? { type: q as any } : {}),
				},
			},
		});

		res.status(200).json({ data });
	} catch (error) {
		res
			.status(500)
			.json({ error: "Failed to list faqs category.", message: error.message });
	}
}
