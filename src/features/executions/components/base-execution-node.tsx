"use client";

import { type NodeProps, Position } from "@xyflow/react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import { memo, type ReactNode, useCallback } from "react";
import { BaseHandle } from "@/components/react-flow/base-handle";
import { BaseNode, BaseNodeContent } from "@/components/react-flow/base-node";
import { WorkflowNode } from "@/components/workflow-node";
import { useReactFlow } from "@xyflow/react";
import { type NodeStatus, NodeStatusIndicator } from "@/components/react-flow/node-status-indicator";


export interface BaseExecutionNodeProps extends NodeProps {
    icon: LucideIcon | string;
    name: string;
    description?: string;
    children?: ReactNode;

    status?: NodeStatus;
    onSettings?: () => void;
    onDoubleClick?: () => void;
}

export const BaseExecutionNode = memo(
    ({
        id,
        icon: Icon,
        name,
        status = "initial",
        description,
        children,
        onSettings,
        onDoubleClick,
    }: BaseExecutionNodeProps) => {
        //TODO: Add delete functionality
         const {setNodes, setEdges} = useReactFlow();
                const handleDelete = () => { 
                    setNodes((currentNodes) =>{
                        const updatedNodes = currentNodes.filter((node) => node.id !== id);
                        return updatedNodes;
                    })
                    setEdges((currentEdges) =>{
                        const updatedEdges = currentEdges.filter((edge) => edge.source !== id && edge.target !== id);
                        return updatedEdges;
                    })
                };
        return (
            <WorkflowNode
                name={name}
                description={description}
                onDelete={handleDelete}
                onSettings={onSettings}

            >
                {/*TODO: wrap within NodeStatusIndicator*/}
                <NodeStatusIndicator
                 status={status}
                 variant="border"
                 >
                <BaseNode status={status} onDoubleClick={onDoubleClick}>
                    <BaseNodeContent>
                        {typeof Icon === "string" ? (
                            <Image src={Icon} alt={name} width={16} height={16} />
                        ) : (
                            <Icon className="size-4 text-muted-foreground" />
                        )}
                        {children}

                        <BaseHandle
                            id="target-1"
                            type="target"
                            position={Position.Left}
                        />
                        <BaseHandle
                            id="source-1"
                            type="source"
                            position={Position.Right}
                        />
                    </BaseNodeContent>
                </BaseNode>
                </NodeStatusIndicator>
            </WorkflowNode>
        )
    },
);

BaseExecutionNode.displayName = "BaseExecutionNode";

