import { model } from "@medusajs/framework/utils";
import WishlistItem, { WishlistItemTypes } from "./wishlist-item";

const WishlistDetail = model.define("wishlist", {
	id: model.id().primaryKey(),
	customer_id: model.text().nullable(),
	region_id: model.text().nullable(),
	items: model.hasMany(() => WishlistItem, {
		mappedBy: "wishlist_id",
	}),
	// product_id: model.text(),
	// customer_id: model.text().nullable(),
	// region_id: model.text().nullable(),
});

export type WishlistDetailTypes = {
	id?: string;
	items: WishlistItemTypes[];
	// product_id: string;
	customer_id: string;
	region_id: string;
};

export default WishlistDetail;
