import { NextRequest, NextResponse } from "next/server";
import { sendWorkflowExecution } from "@/inngest/utils";

export async function POST(req: NextRequest) {
    try{
        const url = new URL(req.url);
        const workflowId = url.searchParams.get("workflowId");

        if(!workflowId){
            return NextResponse.json({
                success: false,
                error: "Missing required query parameter",
            }, {status: 400});
        }
        const body = await req.json();

        const stripeData = {
            //Event metadata
            eventId: body.eventId,
            eventType: body.eventType,
            timestamp: body.timestamp,
            livemode: body.livemode,
            raw: body.data?.object,
        };
        //Trigger an inggest Job
        await  sendWorkflowExecution({
            workflowId,
            initialData: {
                stripe: stripeData,
            }
        }); 

        return NextResponse.json(
            { success: true },
            { status: 200 },
        );

    }catch(error){
        console.error("Stripe webhook error", error);
        return NextResponse.json({
            success: false,
            error: "Failed to process stripe webhook",
        }, {status: 500})
    }
}