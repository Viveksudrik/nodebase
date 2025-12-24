import { requireAuth } from "@/lib/auth-utils";
import { prefetchWorkflows } from "@/features/workflows/server/prefetch";
import { HydrateClient } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";
import { WorkflowsList } from "@/features/workflows/components/workflows";
import { Suspense } from "react";
import { WorkflowContainer } from "@/features/workflows/components/workflows";
const Page = async()=>{
    await requireAuth();

    prefetchWorkflows();

    return(
        <WorkflowContainer>
        <HydrateClient>
            <ErrorBoundary fallback={<p>Error</p>}>
                <Suspense fallback={<p>Loading...</p>}>
                    <WorkflowsList />
                </Suspense>
            </ErrorBoundary>
        </HydrateClient>
        </WorkflowContainer>
    );
};

export default Page;