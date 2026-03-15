import toposort from "toposort";
import type { Node, Connection } from "@xyflow/react";
import { inngest } from "./client";

export const topologicalSort = (
    nodes: Node[],
    edges: Connection[]
): Node[] => {
    if (nodes.length === 0) {
        return [];
    }
    if (edges.length === 0) {
        return nodes;
    }

    //Create edges array for toposort
    const graphEdges: [string, string][] = edges.map((conn) =>
        [conn.source, conn.target]
    );

    //Perform topological sort
    const nodeIds = nodes.map((n) => n.id);
    let sortedNodeIds: string[] = [];

    try {
        sortedNodeIds = toposort.array(nodeIds, graphEdges);
    } catch (e) {
        if (e instanceof Error && e.message.includes("Cyclic")) {
            throw new Error("Workflow contains a cycle");
        }
        throw e;
    }
    //Map sorted IDs back to node objects
    const nodeMap = new Map(nodes.map((n) => [n.id, n]));
    return sortedNodeIds.map((id) => nodeMap.get(id)!).filter(Boolean);
};

export const sendWorkflowExecution = async (data: {
    workflowId: string;
    [key: string]: any;
})=>{
    return inngest.send({
        name: "workflows/execute.workflow",
        data,
    });
}