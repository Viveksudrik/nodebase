import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky";

type HttpRequestData = {
    variableName?: string;
    endpoint?: string;
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    body?: string;
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

    if(!data.variableName) {
        throw new NonRetriableError("Variable name not configured");
    }

    const result = await step.run("http-request", async () => {
        const endpoint = data.endpoint!;
        const method = data.method || "GET";

        const options: KyOptions = {method};

        if(["POST", "PUT", "PATCH"].includes(method)) {
            options.body = JSON.stringify(data.body);
            options.headers = {
                "Content-Type": "application/json",
            };
        }

        const response = await ky(endpoint, options);
        const responseData = await response.json().catch(() => response.text());
        
        const responsePayload = {
            httpResponse: {
                status: response.status,
                statusText: response.statusText,
                data: responseData,
            },
        };

        if(data.variableName){
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

    //TODO: publish "success" state for http request

    return result;
};