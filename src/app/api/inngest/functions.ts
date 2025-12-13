import { inngest } from "@/inngest/client";
import { db as prisma } from "@/lib/db";

export const helloWorld = inngest.createFunction(
    { id: "hello-world" },
    { event: "test/hello.world" },
    async ({ event, step }) => {
        //fetching the video
        await step.sleep("fetching", "5s");
        //transcribing the video
        await step.sleep("transcribing", "5s");
        //sending transcription to AI
        await step.sleep("sending-to-ai", "5s");

        await step.run("create-workflow",()=>{
            return prisma.workflow.create({
                data: {
                    name: "workflow-from-inngest",
                },
            })
        })
    },
); 
