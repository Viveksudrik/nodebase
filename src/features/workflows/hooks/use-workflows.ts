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

/**
 * Hook to delete a workflow
 */
export const useDeleteWorkflow = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    return useMutation(
         trpc.workflows.remove.mutationOptions({
            onSuccess: ( data ) => {
                toast.success(`Workflow "${data.name}" deleted successfully`);
                queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions
                ({}));
            queryClient.invalidateQueries(
                trpc.workflows.getOne.queryFilter({ id: data.id }),
            )
        },
    })
    )
};

/**
 * Hook to get a single workflow
 */
export const useWorkflow = (id: string) => {
    const trpc = useTRPC();
    return useSuspenseQuery(trpc.workflows.getOne.queryOptions({ id }));
};

/**
 * Hook to update a workflow name
 */
export const useUpdateWorkflowName = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    return useMutation({
        ...trpc.workflows.updateName.mutationOptions(),
        onSuccess: (data) => {
            toast.success(`Workflow ${data.name} updated successfully`);
            queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({})
            );
            queryClient.invalidateQueries(
                trpc.workflows.getOne.queryFilter({ id: data.id }),
            );
        },
        onError: (error) => {
            toast.error(`Failed to update workflow ${error.message}`);
        },
    });
};
