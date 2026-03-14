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

        const formData = {
            formId: body.formId,
            formTitle: body.formTitle,
            responseId: body.responseId,
            timestamp: body.timestamp,
            respondentEmail: body.respondentEmail,
            responses: body.responses,
            raw: body,
        };
        //Trigger an inggest Job
        await  sendWorkflowExecution({
            workflowId,
            initialData: formData,
        });

        return NextResponse.json({ success: true });

    }catch(error){
        console.error("Google form webhook error", error);
        return NextResponse.json({
            success: false,
            error: "Failed to process google form submission",
        }, {status: 500})
    }
}