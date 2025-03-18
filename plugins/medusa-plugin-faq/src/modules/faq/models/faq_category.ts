import { model } from "@medusajs/framework/utils";
import Faq from "./faq";

const FaqCategory = model.define("faq_category", {
	id: model.id().primaryKey(),
	title: model.text(),
	description: model.text().nullable(),
	metadata: model.json().nullable(),
	handle: model.text().unique(),
	faqs: model.hasMany(() => Faq, {
		mappedBy: "category",
	}),
});

export default FaqCategory;
