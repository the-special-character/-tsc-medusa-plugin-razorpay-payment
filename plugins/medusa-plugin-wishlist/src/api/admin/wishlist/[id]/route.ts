import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { WISHLIST_MODULE } from "../../../../modules/wishlist";
import WishlistService from "../../../../modules/wishlist/service";
import { WishlistDetailTypes } from "../../../../modules/wishlist/models/wishlist-details";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { WishlistItemTypes } from "../../../../modules/wishlist/models/wishlist-item";

// export async function POST(
// 	req: MedusaRequest<WishlistItemTypes>,
// 	res: MedusaResponse
// ) {
// 	const { id } = req.params;
// 	const { product_id } = req.body;
// 	console.log({ product_id, id });
// 	const wishlistService: WishlistService = req.scope.resolve(WISHLIST_MODULE);
// 	// const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

// const wishlistItemCreated = await wishlistService.createWishlistItems({
// 	product_id,
// 	wishlist_id: id,
// });
// 	return res.status(200).json({ wishlist: wishlistItemCreated });
// }

export async function GET(req: MedusaRequest, res: MedusaResponse) {
	const { id } = req.params;
	// const wishlistService: WishlistService = req.scope.resolve(WISHLIST_MODULE);
	console.log({ id });

	const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
	const { data } = await query.graph({
		entity: "wishlists",
		fields: ["*", "items.*"],
		filters: {
			id,
		},
	});
	// if (data.length === 0) {
	// 	return res.send({ message: "no wishlist found" });
	// }
	res.send({ wishlist: data });
}
// export async function PUT(
// 	req: MedusaRequest<WishlistDetailTypes>,
// 	res: MedusaResponse
// ) {
// 	const { id } = req.params;
// 	const { customer_id, region_id } = req.body;
// 	const wishlistService: WishlistService = req.scope.resolve(WISHLIST_MODULE);
// 	const updatedWishlist = await wishlistService.updateWishlists({
// 		id,
// 		customer_id,
// 		region_id,
// 	});
// 	console.log({ updatedWishlist });

// 	res.send({ wishlist: updatedWishlist });
// }
