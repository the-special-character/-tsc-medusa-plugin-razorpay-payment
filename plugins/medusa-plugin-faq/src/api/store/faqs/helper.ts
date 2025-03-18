export function generateHandleFromTitle(title) {
	if (!title || typeof title !== "string") {
		throw new Error("Invalid title provided");
	}

	// Convert title to lowercase
	const lowerCaseTitle = title.toLowerCase();

	// Replace spaces and special characters with hyphens
	const handle = lowerCaseTitle
		.replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric characters with hyphen
		.replace(/^-+|-+$/g, ""); // Remove leading or trailing hyphens

	return handle;
}
