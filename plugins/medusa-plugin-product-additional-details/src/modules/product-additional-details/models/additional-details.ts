import { model } from "@medusajs/framework/utils";

const AdditionalDetails = model.define("additional_details", {
	id: model.id().primaryKey(),
	additional_description: model.text().nullable(),
	additional_details_title: model.text().nullable(),
	additional_details_content: model.text().nullable(),
	grid_view: model.boolean().default(false),
});

export default AdditionalDetails;
