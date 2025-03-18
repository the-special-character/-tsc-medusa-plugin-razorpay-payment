import { MedusaRequest, MedusaResponse } from "@medusajs/framework";

import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
	const { customerId } = req.params;
	console.log({ customerId });

	// if (!customerId) {
	// 	return res.status(400).send({ message: "customer id is required" });
	// }
	const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
	const { data: wishlist } = await query.graph({
		entity: "wishlists",
		filters: {
			customer_id: customerId as unknown as undefined,
		},
		fields: ["*", "items.*"],
	});
	const { data } = await query.graph({
		entity: "products",
		fields: ["*", "wishlist_item.*", "variants.*"],
		filters: {
			variants: {
				id: wishlist?.flatMap((x) =>
					x?.items?.map((p) => p?.variant_id)
				) as string[],
			},
		},
	});
	const { data: variants } = await query.graph({
		entity: "variants",
		fields: ["*", "product.*"],
		filters: {
			// variants: {
			id: wishlist?.flatMap((x) =>
				x?.items?.map((p) => p?.variant_id)
			) as string[],
			// },
		},
	});
	console.log({ data });

	res.status(200).json({ wishlist, products: data, variants });
}
