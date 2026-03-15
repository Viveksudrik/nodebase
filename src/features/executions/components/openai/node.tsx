"use client";

import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "@/features/executions/components/base-execution-node";
import { OpenAINodeDialog, OpenAINodeFormValues } from "./dialog";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { openaiChannel } from "@/inngest/channels/openai";
import { fetchOpenAIRealTimeToken } from "./actions";
import { OPENAI_CHANNEL_NAME } from "@/inngest/channels/openai";

type OpenAINodeData = {
    variableName?: string;
    systemPrompt?: string; 
    userPrompt?: string;
};

type OpenAINodeProps = Node<OpenAINodeData>;

export const OpenAINode = memo((props: NodeProps<Node<OpenAINodeData>>) => {
    const [dialogOpen, setDialogOpen] = useState(false);

    const { setNodes } = useReactFlow();

    const nodeStatus = useNodeStatus({
        nodeId: props.id,
        channel: OPENAI_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchOpenAIRealTimeToken,
    });

    const handleSubmit = (values: OpenAINodeFormValues) => {
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
        ? `gpt-4o : ${nodeData.userPrompt.slice(0, 50)}...`
        : "Not Configured";

    return (
        <>
            <OpenAINodeDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onSubmit={handleSubmit}
                defaultValues={nodeData}

            />
            <BaseExecutionNode
                {...props}
                id={props.id}
                icon="/logos/openai.svg"
                name="OpenAI"
                description={description}
                status={nodeStatus}
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
            />
        </>
    )

});

OpenAINode.displayName = "OpenAINode";
