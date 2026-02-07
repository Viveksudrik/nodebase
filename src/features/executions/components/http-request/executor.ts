import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky";

type HttpRequestData = {
    endpoint: string;
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    body: Record<string, unknown>;
}

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
    data,
    nodeId,
    context,
    step
}) => {
    //TODO: publish "loading" state for http request
    if (!data.endpoint || !data.method) {
        throw new NonRetriableError("HTTP Request node: No endpoint configured");
    }

    const result = await step.run("http-request", async () => {
        const endpoint = data.endpoint!;
        const method = data.method || "GET";

        const options: KyOptions = {method};

        if(["POST", "PUT", "PATCH"].includes(method)) {
            options.json = data.body;
        }

        const response = await ky(endpoint, options);
        const responseData = await response.json().catch(() => response.text());
        
        return {
            ...context,
            httpResponse: {
                status: response.status,
                statusText: response.statusText,
                data: responseData,
            }
        };
    });

    //TODO: publish "success" state for http request

    return result;
};