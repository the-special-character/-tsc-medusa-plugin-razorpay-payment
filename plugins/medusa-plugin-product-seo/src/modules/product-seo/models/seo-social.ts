import { model } from "@medusajs/framework/utils";
import SeoDetails, { SeoDetailsTypes } from "./seo-details";

const SeoSocial = model.define("seo_social", {
	id: model.id().primaryKey(),
	title: model.text().nullable(),
	description: model.text().nullable(),
	image: model.text().nullable(),
	socialNetwork: model.enum(["Facebook", "Twitter", "Instagram"]),
	seoDetails: model.belongsTo(() => SeoDetails, {
		mappedBy: "metaSocial",
	}),
});

export type SeoSocialTypes = {
	id?: string;
	title: string | null;
	description: string | null;
	image?: string | null;
	socialNetwork: "Facebook" | "Twitter" | "Instagram";
	seo_details_id?: SeoDetailsTypes["id"];
};

export default SeoSocial;
