export type FAQ_CATEGORY = {
	title: string;
	description: string;
	metadata: Record<string, any>;
};

export type FAQ_UPDATE_CATEGORY = {
	title?: string;
	description?: string;
	metadata?: Record<string, any>;
};

export type FAQ_TYPE = {
	title: string;
	content: string;
	type: string;
	by_admin: boolean;
	display_status: "published" | "draft";
	email: string;
	customer_name: string;
	metadata: Record<string, any>;
	category?: FAQ_CATEGORY;
};

export type FAQ_UPDATE_TYPE = {
	title?: string;
	content?: string;
	type?: string;
	by_admin?: boolean;
	display_status?: "published" | "draft";
	email?: string;
	customer_name?: string;
	metadata?: Record<string, any>;
	category?: FAQ_UPDATE_CATEGORY;
};
