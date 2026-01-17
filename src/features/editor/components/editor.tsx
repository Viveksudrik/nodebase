"use client"

import { LoadingView, ErrorView } from "@/components/entity-components";
import { useWorkflow } from "@/features/workflows/hooks/use-workflows";

export const EditorLoading = () => {
    return <LoadingView message="Loading editor..." />
};

export const EditorError = () => {
    return <ErrorView message="Failed to load editor" />;
};

export const Editor = ({ workflowId }: { workflowId: string }) => {
    const { data: workflow } = useWorkflow(workflowId);
    return (
        <p>
            {JSON.stringify(workflow, null, 2)}
        </p>
    );
};