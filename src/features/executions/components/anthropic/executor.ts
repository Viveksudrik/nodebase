import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import { createAnthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import handlebars from "handlebars";
import { anthropicChannel } from "@/inngest/channels/anthropic";

handlebars.registerHelper("json", (context) => {
    const jsonString = JSON.stringify(context, null, 2);
    const safeString = new handlebars.SafeString(jsonString);
    return safeString;
});

type AnthropicNodeData = {
    variableName: string;
    systemPrompt?: string;
    userPrompt: string;
}

export const anthropicExecutor: NodeExecutor<AnthropicNodeData> = async ({
    data,
    nodeId,
    context,
    step,
    publish,
}) => {
    await 
        publish(anthropicChannel().status({
            nodeId,
            status: "loading",
        }),
    );
    
    if (!data.variableName) {
        await publish(anthropicChannel().status({
            nodeId,
            status: "error",
        }),
        );
        throw new NonRetriableError("Variable name is required");
    }

    if (!data.userPrompt) {
        await publish(anthropicChannel().status({
            nodeId,
            status: "error",
        }),
        );
        throw new NonRetriableError("User prompt is required");
    }

   const systemPrompt = data.systemPrompt
    ? handlebars.compile(data.systemPrompt)(context) : "You are a helpful assistant.";
    const userPrompt = data.userPrompt
    ? handlebars.compile(data.userPrompt)(context) : "";

    const credentialValue = process.env.ANTHROPIC_API_KEY!;

    const anthropic = createAnthropic({
        apiKey: credentialValue,
    });

    try {
        const { text } = await step.ai.wrap(
            "anthropic-generate-text",
            generateText,
            { 
                model: anthropic("claude-3-5-sonnet-latest"),
                system: systemPrompt,
                prompt: userPrompt,
                experimental_telemetry: {
                    isEnabled: true,
                    recordInputs: true,
                    recordOutputs: true,
                } ,
            },
        );
            
        await publish(anthropicChannel().status({
            nodeId,
            status: "success",
        }),
        );

        return {
            ...context,
            [data.variableName]: {
                text,
        },
    }
    }catch (error) {
        await publish(anthropicChannel().status({
            nodeId,
            status: "error",
        }),
        );
        throw error;
    }
};
