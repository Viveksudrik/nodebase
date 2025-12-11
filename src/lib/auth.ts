import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "@/lib/db";

// Trim any accidental quotes in the base URL to avoid invalid URL errors
const baseURL =
	(process.env.BETTER_AUTH_URL ??
		process.env.NEXT_PUBLIC_APP_URL ??
		process.env.AUTH_URL ??
		"http://localhost:3000").replace(/^['"]|['"]$/g, "");

export const auth = betterAuth({
	baseURL,
	database: prismaAdapter(db, {
		provider: "postgresql",
	}),
	emailAndPassword: {
		enabled: true,
		autoSignIn: true,
	},
});


