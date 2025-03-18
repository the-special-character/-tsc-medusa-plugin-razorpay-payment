import { authenticate } from "@medusajs/framework";
export const authMiddleware = (req, res, next) => {
	console.log("auth middleware");
	authenticate("customer", ["bearer", "api-key", "session"], {
		allowUnauthenticated: false,
		allowUnregistered: false,
	})(req, res, next);
};
