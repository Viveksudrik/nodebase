import { Polar } from "@polar-sh/sdk";

export const polarClient = new Polar({
    accessToken: process.env.POLAR_ACCESS_TOKEN,
    server: "sandbox", //TODO: Change to production
})

const originalCreate = polarClient.customers.create.bind(polarClient.customers);

polarClient.customers.create = async (args: any, options?: any) => {
    console.log("Polar create called with:", JSON.stringify(args, null, 2));

    // Check if we need to wrap the arguments
    if (args && !args.customerCreate && args.email) {
        console.log("Wrapping args in customerCreate");
        return originalCreate({
            customerCreate: {
                ...args,
                metadata: {
                    ...args.metadata,
                }
            }
        }, options);
    }

    return originalCreate(args, options);
};