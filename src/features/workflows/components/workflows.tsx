"use client";
import { EntityContainer, EntityHeader, EntitySearch } from "@/components/entity-components";
import { useCreateWorkflow, useSuspenseWorkflows } from "../hooks/use-workflows";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { useRouter } from "next/navigation";
import { useWorkflowParams } from "../hooks/use-workflows-params";
import { useEntitySearch } from "@/hooks/use-entity-search";
import { EntityPagination } from "@/components/entity-components";


export const WorkflowsSearch = () => {

    const [params, setParams] = useWorkflowParams();
    const { search, onSearchChange } = useEntitySearch({
        params,
        setParams,
    });
    return (
        <EntitySearch
            value={search}
            onChange={onSearchChange}
            placeholder="Search workflows"
        />
    );
}

export const WorkflowsList = () => {
    const workflows = useSuspenseWorkflows();
    return (
        <p>
            {JSON.stringify(workflows.data, null, 2)}

        </p>
    );
};

export const WorkflowsHeader = ({ disabled }: { disabled?: boolean }) => {

    const createWorkflow = useCreateWorkflow();
    const router = useRouter();
    const { modal, handleError } = useUpgradeModal();

    const handleCreate = () => {
        createWorkflow.mutate(undefined, {
            onSuccess: () => {
                router.push(`/workflows/${createWorkflow.data?.id}`);
            },
            onError: (error) => {
                handleError(error);
            },
        });
    }
    return (
        <>
            {modal}
            <EntityHeader
                title="Workflows"
                description="Create and manage your workflows"
                onNew={handleCreate}
                newButtonLabel="New Workflow"
                disabled={disabled}
                isCreating={createWorkflow.isPending}
            />
        </>
    );
};

export const WorkflowsPagination = () => {
    const workflows = useSuspenseWorkflows();
    const [params, setParams] = useWorkflowParams();
    return (
        <EntityPagination
            disabled={workflows.isFetching}
            page={workflows.data.page} 
            totalPages={workflows.data.totalPages}
            onPageChange={(page) => setParams({
                ...params,
                page, 
            })}
        />
    ); 
} 

export const WorkflowContainer = ({ children }: {
    children: React.ReactNode;
}) => {
    return (
        <EntityContainer
            header={<WorkflowsHeader />}
            search={<WorkflowsSearch />}
            pagination={<WorkflowsPagination />}
        >
            {children}
        </EntityContainer>
    );
}