import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { PRODUCT_CATEGORY_DETAILS_TYPE } from "../../type";
import { Link } from "@medusajs/framework/modules-sdk";
import ProductCategoryDetailsModuleService from "../../../../../modules/product-category-details/service";
import { PRODUCT_CATEGORY_DETAILS_MODULE } from "../../../../../modules/product-category-details";
import { uploadFilesWorkflow } from "@medusajs/medusa/core-flows";
import { FileDTO } from "@medusajs/framework/types";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
	const id = req.params?.category_id;

	try {
		const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

		if (id) {
			const {
				data: [category],
			} = await query.graph({
				entity: "product_category",
				filters: {
					id,
				},
				fields: ["*", "category_details.*"],
			});

			return res.json({
				category,
			});
		}
		return res.status(404).json({ error: `no category found with id ${id}` });
	} catch (error) {
		res.status(500).json({
			error,
			message: "internal server error",
		});
	}
}

export async function POST(
	req: MedusaRequest<PRODUCT_CATEGORY_DETAILS_TYPE>,
	res: MedusaResponse
) {
	const id = req.params?.category_id;

	// Access the uploaded files
	const files_input = req.files as {
		thumbnail?: Express.Multer.File[];
		media?: Express.Multer.File[];
	};

	console.log(
		"creating category_details with category_id",
		id,
		"with data",
		req.body,
		"and files",
		files_input
	);

	try {
		const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

		const remoteLink: Link = req.scope.resolve(ContainerRegistrationKeys.LINK);

		const productCategoryDetailsService: ProductCategoryDetailsModuleService =
			req.scope.resolve(PRODUCT_CATEGORY_DETAILS_MODULE);

		if (id) {
			const {
				data: [category],
			} = await query.graph({
				entity: "product_category",
				filters: {
					id,
				},
				fields: ["*", "category_details.*"],
			});

			if (!category)
				return res.status(404).json({ error: "no category found with id", id });

			console.dir(category?.category_details, { depth: null });
			console.log(category?.category_details ? true : false);

			let thumbnail_upload_result: FileDTO | null = null;
			let media_upload_result: FileDTO[] | null = null;

			if (files_input.thumbnail) {
				const { result } = await uploadFilesWorkflow(req.scope).run({
					input: {
						files: files_input?.thumbnail.map((f) => ({
							filename: f.originalname,
							mimeType: f.mimetype,
							content: f.buffer.toString("binary"),
							access: "public",
						})),
					},
				});
				if (result) {
					console.log({ result });

					thumbnail_upload_result = result[0];
				}
			}
			if (files_input.media) {
				const { result } = await uploadFilesWorkflow(req.scope).run({
					input: {
						files: files_input?.media.map((f) => ({
							filename: f.originalname,
							mimeType: f.mimetype,
							content: f.buffer.toString("binary"),
							access: "public",
						})),
					},
				});
				if (result) {
					console.log({ result });

					media_upload_result = result;
				}
			}

			console.log({ thumbnail_upload_result, media_upload_result });

			if (!category?.category_details?.id) {
				console.log("creating new category_details for category", category.id);

				const category_details =
					await productCategoryDetailsService.createCategoryDetails({
						// ...(req.body?.product_aspect_ratio
						// 	? { product_aspect_ratio: req.body?.product_aspect_ratio }
						// 	: {}),
						product_aspect_ratio: req.body?.product_aspect_ratio,
						product_bg_color: req.body?.product_bg_color,
						// ...(req.body?.product_bg_color
						// 	? { product_bg_color: req.body?.product_bg_color }
						// 	: {}),
						...(thumbnail_upload_result?.url
							? { thumbnail: thumbnail_upload_result?.url }
							: { thumbnail: req.body?.old_thumbnail ?? null }),
						...(media_upload_result && media_upload_result?.length > 0
							? {
									media: [
										...(req?.body?.old_media ? req?.body?.old_media : []),
										...media_upload_result?.map((item) => item?.url),
									],
								}
							: { media: req?.body?.old_media ?? null }),
					});

				console.log(category_details);
				if (category_details?.id) {
					console.log(
						"creating link between",
						category.id,
						"and",
						category_details.id
					);

					await remoteLink.create({
						[Modules.PRODUCT]: {
							product_category_id: category?.id,
						},
						[PRODUCT_CATEGORY_DETAILS_MODULE]: {
							category_details_id: category_details?.id,
						},
					});
				}
			} else {
				console.log(
					"updating category details with id",
					category?.category_details?.id,
					"with data",
					{
						id: category?.category_details?.id,
						product_aspect_ratio: req.body?.product_aspect_ratio,
						product_bg_color: req.body?.product_bg_color,
						...(thumbnail_upload_result?.url
							? { thumbnail: thumbnail_upload_result?.url }
							: { thumbnail: req.body?.old_thumbnail ?? null }),
						...(media_upload_result && media_upload_result?.length > 0
							? {
									media: [
										...(req?.body?.old_media ? req?.body?.old_media : []),
										...media_upload_result?.map((item) => item?.url),
									],
								}
							: { media: req?.body?.old_media ?? null }),
					}
				);

				const category_details =
					await productCategoryDetailsService.updateCategoryDetails({
						id: category?.category_details?.id,
						product_aspect_ratio: req.body?.product_aspect_ratio,
						product_bg_color: req.body?.product_bg_color,
						...(thumbnail_upload_result?.url
							? { thumbnail: thumbnail_upload_result?.url }
							: { thumbnail: req.body?.old_thumbnail ?? null }),
						...(media_upload_result && media_upload_result?.length > 0
							? {
									media: [
										...(req?.body?.old_media ? req?.body?.old_media : []),
										...media_upload_result?.map((item) => item?.url),
									],
								}
							: { media: req?.body?.old_media ?? null }),
					});

				console.log("category details updated with", category_details);
			}

			const {
				data: [updated_category],
			} = await query.graph({
				entity: "product_category",
				filters: {
					id,
				},
				fields: ["*", "category_details.*"],
			});

			return res.json({
				category: updated_category,
			});
		}
		return res.status(404).json({ error: `no category found with id ${id}` });
	} catch (error) {
		res.status(500).json({
			error,
			message: "internal server error",
		});
	}
}
