import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky";
import handlebars from "handlebars";
import { httpRequestChannel } from "@/inngest/channels/http-request";

handlebars.registerHelper("json", (context) => {
    const jsonString = JSON.stringify(context, null, 2);
    const safeString = new handlebars.SafeString(jsonString);
    return safeString;
});

type HttpRequestData = {
    variableName: string;
    endpoint: string;
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    body?: string;
}

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
    data,
    nodeId,
    context,
    step,
    publish,
}) => {
    await publish(httpRequestChannel().status({
        nodeId,
        status: "loading",
    }),
    );
    if (!data.endpoint || !data.method) {
        throw new NonRetriableError("HTTP Request node: No endpoint configured");
    }

    if (!data.endpoint) {
        await publish(httpRequestChannel().status({
            nodeId,
            status: "error",
        }),
        );
    }

    if (!data.variableName) {
        await publish(httpRequestChannel().status({
            nodeId,
            status: "error",
        }),
        );
        throw new NonRetriableError("HTTP Request node: Variable name not configured");
    }
    if (!data.method) {
        await publish(httpRequestChannel().status({
            nodeId,
            status: "error",
        }),
        );
        throw new NonRetriableError("HTTP Request node: Method not configured");
    }

    try {
    const result = await step.run("http-request", async () => {
        const endpoint = handlebars.compile(data.endpoint)(context);
        const method = data.method;

        const options: KyOptions = { method };

        if (["POST", "PUT", "PATCH"].includes(method)) {
            const resolved = handlebars.compile(data.body || "{}")(context);
            console.log("BODY: ", resolved);
            JSON.parse(resolved);
            options.body = resolved;
            options.headers = {
                "Content-Type": "application/json",
            };
        }

        const response = await ky(endpoint, options);
        let responseData;
        try {
            responseData = await response.clone().json();
        } catch {
            responseData = await response.text();
        }

        const responsePayload = {
            httpResponse: {
                status: response.status,
                statusText: response.statusText,
                data: responseData,
            },
        };

        if (data.variableName) {
            return {
                ...context,
                [data.variableName]: responsePayload,
            };
        }

        //Fallback to direct httpResponse for backward compatibility
        return {
            ...context,
            httpResponse: responsePayload,
        };
    });

    await publish(httpRequestChannel().status({
        nodeId,
        status: "success",
    }),
    );

    return result;
    } catch (error) {
        await publish(httpRequestChannel().status({
            nodeId, 
            status: "error",
        }),
        );
        throw error;
    }
};