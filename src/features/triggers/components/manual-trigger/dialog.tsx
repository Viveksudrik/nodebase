"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface Props{
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const ManualTriggerDialog = ({open, onOpenChange}: Props) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Manual Trigger</DialogTitle>
                    <DialogDescription>
                        Configuration settings for manual trigger node.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <p className="text-sm text-muted-foreground">
                        used to trigger the workflow manually, no configuration needed.
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
};