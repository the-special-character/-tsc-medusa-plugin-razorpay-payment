import { model } from "@medusajs/framework/utils";

const CategoryDetails = model.define("category_details", {
	id: model.id().primaryKey(),
	thumbnail: model.text().nullable(),
	media: model.array().nullable(),
	product_aspect_ratio: model.text().nullable(),
	product_bg_color: model.text().nullable(),
});

export default CategoryDetails;
