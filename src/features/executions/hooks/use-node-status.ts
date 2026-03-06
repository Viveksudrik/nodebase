import type{ Realtime } from "@inngest/realtime";
import {useInngestSubscription } from "@inngest/realtime/hooks";
import { useEffect, useState } from "react";
import type { NodeStatus } from "@/components/react-flow/node-status-indicator";


interface UseNodeStatusOptions {
    nodeId : string;
    channel: string;
    topic: string;
    refreshToken: () => Promise<Realtime.Subscribe.Token>;
}

/**
 * Subscribes to realtime messages and derives the latest status for a specific node.
 *
 * Filters incoming subscription messages by topic, channel, and nodeId, then updates and returns the most recently reported `NodeStatus` for that node.
 *
 * @param nodeId - The ID of the node whose status should be tracked
 * @param channel - The realtime channel to filter messages by
 * @param topic - The subscription topic to filter messages by
 * @param refreshToken - Callback that provides a fresh realtime subscription token
 * @returns The most recently observed `NodeStatus` for the specified node (initial if no messages)
 */
export function useNodeStatus({
    nodeId,
    channel,
    topic,
    refreshToken,
}: UseNodeStatusOptions) {
    const [status, setStatus] = useState<NodeStatus>("initial");

    const { data } = useInngestSubscription({
        refreshToken,
        enabled: true,
});

useEffect(() => {
    if(!data?.length) {
        return;
    }
    //Find latest meassage for this Node
    const latestMessage = data
        .filter((msg) =>
            msg.kind === "data"&&
            msg.topic === topic &&
            msg.channel === channel&&
            msg.data.nodeId === nodeId
        )
        .sort((a,b) => {
            if(a.kind === "data" && b.kind === "data") {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
            return 0;
        })[0];

        if(latestMessage?.kind === "data"){
            setStatus(latestMessage.data.status as NodeStatus);
        }
    },[data, nodeId, channel, topic]);

    return status;
}