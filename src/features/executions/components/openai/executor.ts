 import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import handlebars from "handlebars";
import { openaiChannel } from "@/inngest/channels/openai";

handlebars.registerHelper("json", (context) => {
    const jsonString = JSON.stringify(context, null, 2);
    const safeString = new handlebars.SafeString(jsonString);
    return safeString;
});

type OpenAINodeData = {
    variableName: string;
    systemPrompt?: string;
    userPrompt: string;
}

export const openaiExecutor: NodeExecutor<OpenAINodeData> = async ({
    data,
    nodeId,
    context,
    step,
    publish,
}) => {
    await 
        publish(openaiChannel().status({
            nodeId,
            status: "loading",
        }),
    );
    
    if (!data.variableName) {
        await publish(openaiChannel().status({
            nodeId,
            status: "error",
        }),
        );
        throw new NonRetriableError("Variable name is required");
    }

    if (!data.userPrompt) {
        await publish(openaiChannel().status({
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

    const credentialValue = process.env.OPENAI_API_KEY!;

    const openai = createOpenAI({
        apiKey: credentialValue,
    });

    try {
        const { text } = await step.ai.wrap(
            "openai-generate-text",
            generateText,
            { 
                model: openai("gpt-4o"),
                system: systemPrompt,
                prompt: userPrompt,
                experimental_telemetry: {
                    isEnabled: true,
                    recordInputs: true,
                    recordOutputs: true,
                } ,
            },
        );
            
        await publish(openaiChannel().status({
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
        await publish(openaiChannel().status({
            nodeId,
            status: "error",
        }),
        );
        throw error;
    }
};
