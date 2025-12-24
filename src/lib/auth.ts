import { checkout, polar, portal } from '@polar-sh/better-auth'
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "@/lib/db";
import { polarClient } from "@/lib/polar";

// Trim any accidental quotes in the base URL to avoid invalid URL errors
const baseURL =
	(process.env.BETTER_AUTH_URL ??
		process.env.NEXT_PUBLIC_APP_URL ??
		process.env.AUTH_URL ??
		"http://localhost:3000").replace(/^["']|["']$/g, "");

export const auth = betterAuth({
	baseURL,
	database: prismaAdapter(db, {
		provider: "postgresql",
	}),
	emailAndPassword: {
		enabled: true,
		autoSignIn: true,
	},
	plugins: [
		polar({
			client: polarClient,
			createCustomerOnSignUp: true,
			use: [
				checkout({
					products: [
						{
							productId: "d050fbf2-b5c4-46a2-a6ff-b9bf7390b33a",
							slug: "Nodebase-Pro",
						}
					],
					successUrl: process.env.POLAR_SUCCESS_URL,
					authenticatedUsersOnly: true,
				}),
				portal(),
			],
		})
	],
});
