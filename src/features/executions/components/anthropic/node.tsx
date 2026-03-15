"use client";

import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "@/features/executions/components/base-execution-node";
import { AnthropicNodeDialog, AnthropicNodeFormValues } from "./dialog";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { anthropicChannel } from "@/inngest/channels/anthropic";
import { fetchAnthropicRealTimeToken } from "./actions";
import { ANTHROPIC_CHANNEL_NAME } from "@/inngest/channels/anthropic";

type AnthropicNodeData = {
    variableName?: string;
    systemPrompt?: string; 
    userPrompt?: string;
};

type AnthropicNodeProps = Node<AnthropicNodeData>;

export const AnthropicNode = memo((props: NodeProps<Node<AnthropicNodeData>>) => {
    const [dialogOpen, setDialogOpen] = useState(false);

    const { setNodes } = useReactFlow();

    const nodeStatus = useNodeStatus({
        nodeId: props.id,
        channel: ANTHROPIC_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchAnthropicRealTimeToken,
    });

    const handleSubmit = (values: AnthropicNodeFormValues) => {
        setNodes((nodes) => nodes.map((node) => {
            if (node.id === props.id) {
                return {
                    ...node,
                    data: {
                        ...node.data,
                        ...values,
                    },
                };
            }
            return node;
        }));
    };

    const handleOpenSettings = () => {
        setDialogOpen(true);
    };
    const nodeData = props.data;
    const description = nodeData?.userPrompt
        ? `claude-3-5-sonnet-latest : ${nodeData.userPrompt.slice(0, 50)}...`
        : "Not Configured";

    return (
        <>
            <AnthropicNodeDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onSubmit={handleSubmit}
                defaultValues={nodeData}

            />
            <BaseExecutionNode
                {...props}
                id={props.id}
                icon="/logos/anthropic.svg"
                name="Anthropic"
                description={description}
                status={nodeStatus}
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
            />
        </>
    )

});

AnthropicNode.displayName = "AnthropicNode";
