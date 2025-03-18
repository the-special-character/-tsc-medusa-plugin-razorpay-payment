import { model } from "@medusajs/framework/utils";
import FaqCategory from "./faq_category";

const Faq = model.define("faq", {
	id: model.id().primaryKey(),
	title: model.text(),
	content: model.text().nullable(),
	type: model.text().nullable(),
	by_admin: model.boolean().default(false),
	display_status: model.enum(["published", "draft"]).default("draft"),
	email: model.text(),
	customer_name: model.text().nullable(),
	metadata: model.json().nullable(),
	category: model
		.belongsTo(() => FaqCategory, {
			mappedBy: "faqs",
		})
		.nullable(),
});

export default Faq;
