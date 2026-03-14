"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { CopyIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { generateGoogleFormScript } from "./utils";
import { useEffect, useState } from "react";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const GoogleFormTriggerDialog = ({ open, onOpenChange }: Props) => {
    const [workflowId, setWorkflowId] = useState<string>("null");

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // URL format is typically /dashboard/workflows/[id]/...
            const pathParts = window.location.pathname.split('/');
            const workflowsIndex = pathParts.indexOf('workflows');
            if (workflowsIndex !== -1 && pathParts.length > workflowsIndex + 1) {
                setWorkflowId(pathParts[workflowsIndex + 1]);
            }
        }
    }, []);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(webhookUrl);
            toast.success("Webhook URL copied to clipboard");
        } catch (e) {
            toast.error("Failed to copy webhook URL to clipboard");
        }
    }

    //Construct Webhook URL
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
    const webhookUrl = `${baseUrl}/api/webhooks/google-form?workflowId=${workflowId}`;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Google Form Trigger</DialogTitle>
                    <DialogDescription>
                        Configuration settings for google form trigger node.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="webhook-url">
                            Webhook URL
                        </Label>
                        <div className="flex gap-2">
                            <Input
                                id="webhook-url"
                                value={webhookUrl}
                                readOnly
                                className="font-mono text-sm"
                            />
                            <Button
                                type="button"
                                size="icon"
                                variant="outline"
                                onClick={copyToClipboard}>
                                <CopyIcon className="size-4" />
                            </Button>
                        </div>
                    </div>
                    <div className="rounded-lg bg-muted p-4 space-y-2">
                        <h4 className="font-medium text-sm">Setup Instructions</h4>
                        <ol className="text-sm text-muted-foreground space-y-1 list decimal list-inside">
                            <li>Open your Google Form</li>
                            <li>Click the three dots menu → Script editor</li>
                            <li>Copy paste the script below</li>
                            <li>Replace the webhook URL with the one above</li>
                            <li>Save and click "Triggers" → Add Trigger</li>
                            <li>"Choose: From form → On the form Submit → Save"</li>
                        </ol>
                    </div>
                    <div className="rounded-lg bg-muted p-4 space-y-3">
                        <h4 className="font-medium text-sm">
                            Google AppsScript:
                        </h4>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={async () => {
                                const script = generateGoogleFormScript(webhookUrl);
                                try{
                                    await navigator.clipboard.writeText(script);
                                    toast.success("Script copied to clipboard")
                                }catch{
                                    toast.error("Failed to copy script to clipboard")
                                }

                          }}
                        >
                            <CopyIcon className="size-4 mr-2" />
                            Copy Google Apps Script
                        </Button>
                        <p className="text-xs text-muted-foreground">
                            This Script includes your Webhook url and
                            handles from submissions
                        </p>
                        <div className="rounded-lg bg-muted p-4 space-y-3">
                            <h4 className="font-medium text-sm">
                                Available Variables
                            </h4>

                            <ul className="text-sm text-muted-foreground space-y-1 list decimal list-inside">
                                <li>
                                    <code className="bg-background px-1 py-0.5 rounded">
                                        {"{{googleForm.respondentEmail}}"}

                                    </code>
                                    - Respondent Email
                                </li>
                                <li>
                                    <code className="bg-background px-1 py-0.5 rounded">
                                        {"{{googleForm.respondentEmail}}"}

                                    </code>
                                    - Specific answer
                                </li>
                                <li>
                                    <code className="bg-background px-1 py-0.5 rounded">
                                        {"{{googleForm.respondentEmail}}"}

                                    </code>{" "}
                                    - All response as JSON
                                </li>
                            </ul>
                            
                        </div>

                    </div>

                </div>
            </DialogContent>
        </Dialog>
    );
};

