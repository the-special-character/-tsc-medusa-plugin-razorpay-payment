import WishlistModuleService from "./service";
import { Module } from "@medusajs/framework/utils";

export const WISHLIST_MODULE = "wishlistModuleService";
// export const WISHLIST_MODULE = "WishlistModuleService";

export default Module(WISHLIST_MODULE, {
	service: WishlistModuleService,
});
