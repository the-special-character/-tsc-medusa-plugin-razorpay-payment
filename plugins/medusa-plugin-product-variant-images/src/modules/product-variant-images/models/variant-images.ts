import { model } from "@medusajs/framework/utils";

const VariantImages = model.define("variant_images", {
	id: model.id().primaryKey(),
	thumbnail: model.text().nullable(),
	images: model.array().nullable(),
});

export default VariantImages;
