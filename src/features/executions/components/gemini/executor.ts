import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import handlebars from "handlebars";
import { geminiChannel } from "@/inngest/channels/gemini";


handlebars.registerHelper("json", (context) => {
    const jsonString = JSON.stringify(context, null, 2);
    const safeString = new handlebars.SafeString(jsonString);
    return safeString;
});

type GeminiNodeData = {
    variableName: string;
    systemPrompt?: string;
    userPrompt: string;
}

export const geminiExecutor: NodeExecutor<GeminiNodeData> = async ({
    data,
    nodeId,
    context,
    step,
    publish,
}) => {
    await 
        publish(geminiChannel().status({
            nodeId,
            status: "loading",
        }),
    );
    
    if (!data.variableName) {
        await publish(geminiChannel().status({
            nodeId,
            status: "error",
        }),
        );
        throw new NonRetriableError("Variable name is required");
    }

    if (!data.userPrompt) {
        await publish(geminiChannel().status({
            nodeId,
            status: "error",
        }),
        );
        throw new NonRetriableError("User prompt is required");
    }
    //TODO:Throw if credentials are missing

   const systemPrompt = data.systemPrompt
    ? handlebars.compile(data.systemPrompt)(context) : "You are a helpful assistant.";
    const userPrompt = data.userPrompt
    ? handlebars.compile(data.userPrompt)(context) : "";

    //TODO: Fetch credentials that user selected

    const credentialValue = process.env.GOOGLE_GENERATIVE_AI_API_KEY!;

    const google = createGoogleGenerativeAI({
        apiKey: credentialValue,
    });

    try {
        const { text } = await step.ai.wrap(
            "gemini-generate-text",
            generateText,
            { 
                model: google("gemini-2.5-flash"),
                system: systemPrompt,
                prompt: userPrompt,
                experimental_telemetry: {
                    isEnabled: true,
                    recordInputs: true,
                    recordOutputs: true,
                } ,
            },
        );
        const test = text;
            
        await publish(geminiChannel().status({
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
        await publish(geminiChannel().status({
            nodeId,
            status: "error",
        }),
        );
        throw error;
    }
    

   
};