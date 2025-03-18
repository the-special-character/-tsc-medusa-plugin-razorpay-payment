import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { WISHLIST_MODULE } from "../../../../../modules/wishlist";
import { WishlistItemTypes } from "../../../../../modules/wishlist/models/wishlist-item";
import WishlistModuleService from "../../../../../modules/wishlist/service";

// export async function DELETE(
// 	req: MedusaRequest<WishlistItemTypes>,
// 	res: MedusaResponse
// ) {
// 	const { itemId } = req.params;

// 	const wishlistService: WishlistModuleService =
// 		req.scope.resolve(WISHLIST_MODULE);

// 	const wishlistItemCreated = await wishlistService.deleteWishlistItems(itemId);
// 	return res.status(200).json({ wishlist: wishlistItemCreated });
// }
