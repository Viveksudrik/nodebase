"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { CopyIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const StripeTriggerDialog = ({ open, onOpenChange }: Props) => {
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
    const webhookUrl = `${baseUrl}/api/webhooks/stripe?workflowId=${workflowId}`;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Stripe Trigger</DialogTitle>
                    <DialogDescription>
                        Configure this webhook URL in your Stripe Dashboard to
                        trigger workflows on Stripe events.
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
                            <li>Open your Stripe Dashboard</li>
                            <li>Go to Developers → Webhooks</li>
                            <li>Click on "Add endpoint"</li>
                            <li>Paste the webhook URL above</li>
                            <li>Select the events you want to trigger on</li>
                            <li>Save and copy the webhook secret</li>
                        </ol>
                    </div>
                    <div className="rounded-lg bg-muted p-4 space-y-3">
                        <h4 className="font-medium text-sm">
                            Stripe Webhook Secret:
                        </h4>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {}}
                        >
                            <CopyIcon className="size-4 mr-2" />
                            Copy Webhook Secret
                         </Button>
                        <p className="text-xs text-muted-foreground">
                            This Secret includes your Webhook url and
                            handles from submissions
                        </p>
                        <div className="rounded-lg bg-muted p-4 space-y-3">
                            <h4 className="font-medium text-sm">
                                Available Variables
                            </h4>

                            <ul className="text-sm text-muted-foreground space-y-1 list decimal list-inside">
                                <li>
                                    <code className="bg-background px-1 py-0.5 rounded">
                                        {"{{stripe.amount}}"}

                                    </code>
                                    - Payment Amount
                                </li>
                                <li>
                                    <code className="bg-background px-1 py-0.5 rounded">
                                        {"{{stripe.currency}}"}

                                    </code>
                                    - Payment Currency
                                </li>
                                <li> 
                                    <code className="bg-background px-1 py-0.5 rounded">
                                        {"{{stripe.customerId}}"}

                                    </code>{" "}
                                    - Customer ID 
                                </li>
                                <li>
                                    <code className="bg-background px-1 py-0.5 rounded">
                                        {"{{json stripe}}"}

                                    </code>{" "}
                                    - Full Stripe Event
                                </li>
                                <li>
                                    <code className="bg-background px-1 py-0.5 rounded">    
                                        {"{{stripe.eventType}}"}
                                    </code>{" "}
                                    - Event Type(e.g., payment_intent.succeeded)
                                </li>
                            </ul>
                            
                        </div>

                    </div>

                </div>
            </DialogContent>
        </Dialog>
    );
};

