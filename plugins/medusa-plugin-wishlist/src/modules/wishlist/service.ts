import { MedusaService } from "@medusajs/framework/utils";
import Wishlist from "./models/wishlist-details";
import WishlistItem from "./models/wishlist-item";

class WishlistModuleService extends MedusaService({
	Wishlist,
	WishlistItem,
}) {}

export default WishlistModuleService;
