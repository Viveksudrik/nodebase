"use client";

import type { Node, NodeProps } from "@xyflow/react";
import { GlobeIcon } from "lucide-react";
import { memo } from "react";
import { BaseExecutionNode } from "@/features/executions/components/base-execution-node";

type HttpRequestNodeData = {
    endpoint: string;
    method: "GET" | "POST" | "PUT" | "DELETE";
    body: string;
    [key: string]: unknown;
};

type HttpRequestNodeProps = Node<HttpRequestNodeData>;

export const HttpRequestNode = memo((props: NodeProps) => {
    const nodeData = props.data as HttpRequestNodeData;
    const description = nodeData?.endpoint
        ? `${nodeData.method} ${nodeData.endpoint}`
        : "Not Configured";

    return (
        <>
            <BaseExecutionNode
                {...props}
                id={props.id}
                icon={GlobeIcon}
                name="HTTP Request"
                description={description}
                onSettings={() => { }}
                onDoubleClick={() => { }}
            />
        </>
    )

});

HttpRequestNode.displayName = "HttpRequestNode";
