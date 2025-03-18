import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { WISHLIST_MODULE } from "../../../../../modules/wishlist";
import WishlistService from "../../../../../modules/wishlist/service";
import { WishlistDetailTypes } from "../../../../../modules/wishlist/models/wishlist-details";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { WishlistItemTypes } from "../../../../../modules/wishlist/models/wishlist-item";
import { Link } from "@medusajs/framework/modules-sdk";

// export async function POST(
// 	req: MedusaRequest<WishlistItemTypes>,
// 	res: MedusaResponse
// ) {
// 	const { id } = req.params;
// 	const { variant_id } = req.body;
// 	console.log({ variant_id, id });
// 	const wishlistService: WishlistService = req.scope.resolve(WISHLIST_MODULE);
// 	// const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

// 	const wishlistItemCreated = await wishlistService.createWishlistItems({
// 		variant_id,
// 		wishlist_id: id,
// 	});
// 	const remoteLink: Link = req.scope.resolve(
// 		ContainerRegistrationKeys.LINK
// 	);
// 	const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
// 	const { data } = await query.graph({
// 		entity: "product_variant",
// 		fields: ["*", "product.*"],
// 		filters: {
// 			id: variant_id,
// 		},
// 	});

// 	console.log({ variant: data[0] });

// 	if (variant_id && data[0]) {
// 		await remoteLink.create({
// 			[Modules.PRODUCT]: {
// 				product_id: data[0].product_id,
// 			},
// 			wishlistModuleService: {
// 				wishlist_item_id: wishlistItemCreated.id,
// 			},
// 		});
// 	}
// 	return res.status(200).json({ wishlist: wishlistItemCreated });
// }
