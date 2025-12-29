/**
 * Hook fetch all workflows using suspense
 */
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useWorkflowParams } from "../hooks/use-workflows-params";

import { toast } from "sonner";
export const useSuspenseWorkflows = () => {
    const trpc = useTRPC();
    const [params] = useWorkflowParams();
    return useSuspenseQuery(trpc.workflows.getMany.queryOptions(params));

};
/** 
 * Hook to create a new workflow
 */

export const useCreateWorkflow = () => {
    const trpc = useTRPC();
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        ...trpc.workflows.create.mutationOptions(),
        onSuccess: (data) => {
            toast.success(`Workflow ${data.name} created successfully`);
            router.push(`/workflows/${data.id}`);
            queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}));
        },
        onError: (error) => {
            toast.error(`Failed to create workflow ${error.message}`);
        },
    });
};