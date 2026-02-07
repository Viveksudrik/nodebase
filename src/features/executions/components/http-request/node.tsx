"use client";

import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { GlobeIcon } from "lucide-react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "@/features/executions/components/base-execution-node";
import { HttpRequestDialog, HttpRequestFormValues } from "./dialog";


type HttpRequestNodeData = {
    endpoint?: string;
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: string;
};

type HttpRequestNodeProps = Node<HttpRequestNodeData>;

export const HttpRequestNode = memo((props: NodeProps<Node<HttpRequestNodeData>>) => {
    const [dialogOpen, setDialogOpen] = useState(false);

    const { setNodes } = useReactFlow();

    const nodeStatus = "initial";

    const handleSubmit = (values: HttpRequestFormValues) => {
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
    const description = nodeData?.endpoint
        ? `${nodeData.method} ${nodeData.endpoint}`
        : "Not Configured";

    return (
        <>
            <HttpRequestDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onSubmit={handleSubmit}
                defaultValues={nodeData}

            />
            <BaseExecutionNode
                {...props}
                id={props.id}
                icon={GlobeIcon}
                name="HTTP Request"
                description={description}
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
            />
        </>
    )

});

HttpRequestNode.displayName = "HttpRequestNode";
