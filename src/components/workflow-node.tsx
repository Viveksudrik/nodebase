"use client";

import { NodeToolbar, Position } from "@xyflow/react";
import { SettingsIcon, TrashIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface WorkflowNodeProps {
    children?: ReactNode;
    onDelete?: () => void;
    onSettings?: () => void;
    name?: string;
    description?: string;
};

export const WorkflowNode = ({
    children,
    onDelete,
    onSettings,
    name,
    description,
}: WorkflowNodeProps) => {
    return (
        <>
            <NodeToolbar position={Position.Top}>
                {onSettings && (
                    <Button variant="ghost" size="icon" onClick={onSettings}>
                        <SettingsIcon className="size-4" />
                    </Button>
                )}
                {onDelete && (
                    <Button variant="ghost" size="icon" onClick={onDelete}>
                        <TrashIcon className="size-4" />
                    </Button>
                )}
            </NodeToolbar>
            {children}
            {name && (
                <NodeToolbar
                    position={Position.Bottom}
                    isVisible
                    className="max-w-[200px] text-center"

                >
                    <p className="text-sm font-medium">{name}</p>
                    {description && (
                        <p className="text-muted-foreground truncate text-sm">
                            {description}
                        </p>
                    )}
                </NodeToolbar>
            )}
        </>
    );
};