"use client";
import { EntityContainer, EntityHeader, EntityItem, EntitySearch } from "@/components/entity-components";
import { useCreateWorkflow, useSuspenseWorkflows, useDeleteWorkflow } from "../hooks/use-workflows";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { useRouter } from "next/navigation";
import { useWorkflowParams } from "../hooks/use-workflows-params";
import { useEntitySearch } from "@/hooks/use-entity-search";
import { EntityPagination } from "@/components/entity-components";
import { LoadingView } from "@/components/entity-components";
import { ErrorView } from "@/components/entity-components";
import { EmptyView } from "@/components/entity-components";
import { EntityList } from "@/components/entity-components";
import type { Workflow } from "@prisma/client";
import { WorkflowIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns"; 

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
        <EntityList
            items={workflows.data.items}
            getKey={(workflow) => workflow.id}
            renderItem={(workflow) => <WorkflowItem data={workflow} />}
            emptyView={<WorkflowEmpty />}
        />
    );
}


export const WorkflowsHeader = ({ disabled }: { disabled?: boolean }) => {

    const createWorkflow = useCreateWorkflow();
    const { modal, handleError } = useUpgradeModal();

    const handleCreate = () => {
        createWorkflow.mutate(undefined, {
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

export const WorkflowLoading = () => {
    return (
        <LoadingView message="Loading workflows..." />
    )
}
export const WorkflowError = () => {
    return (
        <ErrorView message="Error loading workflows..." />
    )
}

export const WorkflowEmpty = () => {
    const router = useRouter();
    const createWorkflow = useCreateWorkflow();
    const { modal, handleError } = useUpgradeModal();
    const handleCreate = () => {
        createWorkflow.mutate(undefined, {
            onError: (error) => {
                handleError(error);
            },
            onSuccess: (data) => {
                router.push(`/workflows/${data.id}`)
            }
        });
    }
    return <>
        {modal}
        <EmptyView
            onNew={handleCreate}
            message="No workflows found" />
    </>
};

export const WorkflowItem = ({
    data,
 }: {
    data: Workflow
 }) => {
    const deleteWorkflow = useDeleteWorkflow();

    const handleDelete = () => {
        deleteWorkflow.mutate({ id: data.id });
    }
     return(
        <EntityItem 
          href={`/workflows/${data.id}`}
          title={data.name}
          subtitle={
            <>
            Updated {formatDistanceToNow(data.updatedAt, { addSuffix: true })}{" "}
            &bull; Created {formatDistanceToNow(data.createdAt, { addSuffix: true })}{" "}
            </>
          }
          image={
            <div className="size-8 flex-item-center justify -center">
                <WorkflowIcon className="size-5 text-muted-foreground"/>
            </div>
          }
          onRemove={handleDelete}
          isRemoving={deleteWorkflow.isPending}
        />
     )
 }

