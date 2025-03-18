import { model } from "@medusajs/framework/utils";
import SeoSocial, { SeoSocialTypes } from "./seo-social";

const SeoDetails = model.define("seo_details", {
	id: model.id().primaryKey(),
	metaTitle: model.text().nullable(),
	metaDescription: model.text().nullable(),
	metaImage: model.text().nullable(),
	metaSocial: model.hasMany(() => SeoSocial, {
		mappedBy: "seoDetails",
	}),
	keywords: model.text().nullable(),
	metaRobots: model.text().nullable(),
	structuredData: model.json().nullable(),
	feedData: model.json().nullable(),
	metaViewport: model.text().nullable(),
	canonicalURL: model.text().nullable(),
});

export type SeoDetailsTypes = {
	id?: string;
	metaTitle: string | null;
	metaDescription: string | null;
	metaImage: string | null;
	metaSocial: SeoSocialTypes[];
	keywords: string | null;
	metaRobots: string | null;
	structuredData: Record<string, any> | null;
	feedData: Record<string, any> | null;
	metaViewport: string | null;
	canonicalURL: string | null;
};

export default SeoDetails;
