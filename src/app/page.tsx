"use client";
import { requireAuth } from "@/lib/auth-utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { LogoutButton } from "./logout";
import { toast } from "sonner";
const Page = () => {

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data } = useQuery(trpc.getWorkflows.queryOptions());

  const testAi = useMutation(trpc.testAi.mutationOptions({
      onSuccess: () => {
      toast.success("AI Job queued");
      }
  }));

  const create = useMutation(trpc.createWorkflow.mutationOptions({
    onSuccess: () => {
      toast.success("Job queued");

    }
  }));
  return (
    <div className="min-h-screen flex items-center 
     justify-center">
      protected server component
      <div>
        {JSON.stringify(data)}
      </div>
      <Button disabled={testAi.isPending} onClick={() => testAi.mutate()}>
        Test AI 
      </Button>
      <Button disabled={create.isPending} onClick={() => create.mutate()}>
        Create Workflow
      </Button>
      <LogoutButton />
    </div>
  );
};

export default Page;
