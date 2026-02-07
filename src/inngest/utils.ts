import toposort from "toposort";
import type { Node, Connection } from "@xyflow/react";

export const topologicalSort = (
    nodes: Node[],
    edges: Connection[]
): Node[] => {
    if (edges.length === 0) {
        return nodes;
    }

    //Create edges array for toposort
    const graphEdges: [string, string][] = edges.map((conn) =>
        [conn.source, conn.target]
    );

    //Add nodes with no connections as self-edges to ensure they're included
    const connectedNodes = new Set<string>();
    for (const conn of edges) {
        connectedNodes.add(conn.source);
        connectedNodes.add(conn.target);
    }

    for (const node of nodes) {
        if (!connectedNodes.has(node.id)) {
            graphEdges.push([node.id, node.id]);
        }
    }
    //Perform topological sort
    let sortedNodeIds: string[] = [];

    try {
        sortedNodeIds = toposort(graphEdges);
        //Remove duplicates(from self-edges)
        sortedNodeIds = [...new Set(sortedNodeIds)];
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