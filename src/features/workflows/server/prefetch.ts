import type { inferInput } from "@trpc/tanstack-react-query";
import { prefetch, trpc } from "@/trpc/server";

/**
 * Prefetch workflows
 */
export const prefetchWorkflows = () => {
    prefetch(trpc.workflows.getMany.queryOptions());
};