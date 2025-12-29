import type { inferInput } from "@trpc/tanstack-react-query";
import { prefetch, trpc } from "@/trpc/server";

/**
 * Prefetch workflows
 */
export const prefetchWorkflows = (params: Parameters<typeof trpc.workflows.getMany.queryOptions>[0]) => {
    prefetch(trpc.workflows.getMany.queryOptions(params));
};