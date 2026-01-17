import type { inferInput } from "@trpc/tanstack-react-query";
import { prefetch, trpc } from "@/trpc/server";

/**
 * Prefetch workflows
 */
export const prefetchWorkflows = (params: Parameters<typeof trpc.workflows.getMany.queryOptions>[0]) => {
    prefetch(trpc.workflows.getMany.queryOptions(params));
};

/**
 * Prefetch a single workflows
 */

export const prefetchWorkflow = (id: string) => {
    return prefetch(trpc.workflows.getOne.queryOptions({ id }));
};