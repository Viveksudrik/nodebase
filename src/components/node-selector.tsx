"use client"

import { createId } from "@paralleldrive/cuid2";
import { useReactFlow } from "@xyflow/react";
import {
    GlobeIcon,
    MousePointerIcon,
} from "lucide-react";
import { useCallback } from "react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { NodeType } from "@prisma/client";

export interface NodeTypeOption {
    type: NodeType;
    label: string;
    description: string;
    icon: React.ComponentType<{ className?: string }> | string;
}

const triggerNodes: NodeTypeOption[] = [
    {
        type: NodeType.MANUAL_TRIGGER,
        label: "Trigger Manually",
        description: "Trigger the workflow manually",
        icon: MousePointerIcon,
    }
];
const initialTriggerNode: NodeTypeOption[] = [
    {
        type: NodeType.INITIAL,
        label: "Initial Trigger",
        description: "Initial trigger node",
        icon: MousePointerIcon,
    }
];
const executionNodes: NodeTypeOption[] = [
    {
        type: NodeType.HTTP_REQUEST,
        label: "HTTP Request",
        description: "Trigger the workflow via HTTP request",
        icon: GlobeIcon,
    },
];

interface NodeSelectorProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
}

/**
 * Renders a right-side sheet that lets the user insert predefined workflow nodes into the React Flow canvas.
 *
 * The sheet displays trigger and execution node options. Selecting an option:
 * - adds a new node with a generated id, label, description, and a position computed near the viewport center;
 * - prevents adding a second manual trigger by showing an error toast if one already exists;
 * - replaces the entire node set when an `INITIAL` trigger already exists, otherwise appends the new node;
 * - closes the sheet after selection.
 *
 * @param open - Whether the sheet is open
 * @param onOpenChange - Callback invoked when the sheet open state should change
 * @param children - Trigger element(s) used to open the sheet
 * @returns The NodeSelector React element
 */
export function NodeSelector({
    open,
    onOpenChange,
    children
}: NodeSelectorProps) {
    const { setNodes, getNodes, addNodes, screenToFlowPosition } = useReactFlow();

    const handleNodeSelect = useCallback((selection: NodeTypeOption) => {
        //checking if to add a manual trigger when one already exists
        if (selection.type === NodeType.MANUAL_TRIGGER) {
            const nodes = getNodes();
            const hasManualTrigger = nodes.some((node) => node.type === NodeType.MANUAL_TRIGGER);
            if (hasManualTrigger) {
                toast.error("Manual trigger node already exists");
                return;
            }
        }
        setNodes((nodes) => {
            const hasInitialTrigger = nodes.some(
                (node) => node.type === NodeType.INITIAL
            );
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const flowPosition = screenToFlowPosition({
                x: centerX + (Math.random() - 0.5) * 200,
                y: centerY + (Math.random() - 0.5) * 200
            }
            );
            const newNode = {
                id: createId(),
                type: selection.type,
                position: flowPosition,
                data: {
                    label: selection.label,
                    description: selection.description,
                },
            };
            if (hasInitialTrigger) {
                return [newNode];
            }
            return [...nodes, newNode];
        });
        onOpenChange(false);

    }, [
        setNodes,
        getNodes,
        addNodes,
        screenToFlowPosition,
        createId,
        onOpenChange,
    ]);

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>What Triggers This Workflow?</SheetTitle>
                    <SheetDescription>
                        Trigger is a step that starts the workflow
                    </SheetDescription>
                </SheetHeader>
                <div>
                    {triggerNodes.map((nodeType) => {
                        const Icon = nodeType.icon;
                        return (
                            <div
                                key={nodeType.type}
                                onClick={() => handleNodeSelect(nodeType)}
                                className="w-full justify-start h-auto py-5 px-4 rounded-lg cursor-pointer border border-transparent hover:border-border hover:bg-muted transition-colors"
                            >
                                <div className="flex items-center gap-6 w-full overflow-hidden">
                                    {typeof Icon === "string" ? (
                                        <img src={Icon} alt={nodeType.label} className="size-5 object-contain rounded-sm" />
                                    ) : (
                                        <Icon className="size-5" />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-medium truncate">{nodeType.label}</h4>
                                        <p className="text-xs text-muted-foreground truncate">{nodeType.description}</p>
                                    </div>
                                </div>
                            </div>

                        );
                    })}
                </div>
                <Separator />
                <div>
                    {executionNodes.map((nodeType) => {
                        const Icon = nodeType.icon;
                        return (
                            <div
                                key={nodeType.type}
                                onClick={() => handleNodeSelect(nodeType)}
                                className="w-full justify-start h-auto py-5 px-4 rounded-lg cursor-pointer border border-transparent hover:border-border hover:bg-muted transition-colors"
                            >
                                <div className="flex items-center gap-6 w-full overflow-hidden">
                                    {typeof Icon === "string" ? (
                                        <img src={Icon} alt={nodeType.label} className="size-5 object-contain rounded-sm" />
                                    ) : (
                                        <Icon className="size-5" />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-medium truncate">{nodeType.label}</h4>
                                        <p className="text-xs text-muted-foreground truncate">{nodeType.description}</p>
                                    </div>
                                </div>
                            </div>

                        );
                    })}
                </div>
            </SheetContent>
        </Sheet>
    );
}
